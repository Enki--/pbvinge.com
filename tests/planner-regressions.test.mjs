import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);

test('planner import, timeline, interaction and PDF regressions', async t => {
  const compiled = process.env.PBV_TEST_BUILD_DIR;
  assert.ok(compiled, 'Run through npm test or scripts/run-tests.mjs to compile TypeScript helpers.');
  const base = process.env.PBV_TEST_ROOT || process.cwd();
  const testOutput = path.join(compiled, 'planner-artifacts');
  fs.mkdirSync(testOutput, { recursive: true });

  // Expose private editor helpers in a separate temporary module only. Its
  // relative imports resolve to the same helpers compiled by the test runner.
  const editorFilename = path.join(base, 'src/components/RibbonChartPage.tsx');
  const editorSource = fs.readFileSync(editorFilename, 'utf8')
    .replace(/^import\s+["'][^"']+\.css["'];?\s*$/gm, '')
    + '\nexport { createDefaultChart, normalizeChart, shiftFamilyKids, getTimelineCellInfo };';
  const result = ts.transpileModule(editorSource, {
    fileName: editorFilename,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  const diagnostics = (result.diagnostics ?? []).filter(item => item.category === ts.DiagnosticCategory.Error);
  assert.equal(diagnostics.length, 0, ts.formatDiagnostics(diagnostics, {
    getCurrentDirectory: () => base,
    getCanonicalFileName: name => name,
    getNewLine: () => '\n',
  }));
  const editorModule = path.join(compiled, 'components/editor-tests.js');
  fs.writeFileSync(editorModule, result.outputText);

  // Node needs a resolvable file before applying a CSS require hook. This empty
  // temporary placeholder satisfies the copied comparison component's import.
  const cssHook = require.extensions['.css'];
  const cssDirectory = path.join(compiled, 'css');
  fs.mkdirSync(cssDirectory, { recursive: true });
  fs.writeFileSync(path.join(cssDirectory, 'join-spouse-ribbon-chart.css'), '');
  require.extensions['.css'] = () => {};
  const globalKeys = ['window', 'document', 'HTMLElement', 'HTMLInputElement', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'FocusEvent', 'navigator', 'IS_REACT_ACT_ENVIRONMENT', 'FileReader'];
  const globals = new Map(globalKeys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const urlMethods = new Map(['createObjectURL', 'revokeObjectURL'].map(key => [key, Object.getOwnPropertyDescriptor(URL, key)]));
  let dom, root, act;
  t.after(async () => {
    try {
      if (root) await act(() => root.unmount());
    } finally {
      dom?.window.close();
      for (const [key, descriptor] of globals) {
        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
        else delete globalThis[key];
      }
      for (const [key, descriptor] of urlMethods) {
        if (descriptor) Object.defineProperty(URL, key, descriptor);
        else delete URL[key];
      }
      if (cssHook) require.extensions['.css'] = cssHook;
      else delete require.extensions['.css'];
    }
  });
  const editor = require(editorModule);
  const parser = require(path.join(compiled, 'utils/ribbonChartFile.js'));
  const planning = require(path.join(compiled, 'utils/ribbonPlanning.js'));
  const pdf = require(path.join(compiled, 'utils/joinSpousePdf.js'));
  const passed = [];
  const check = (name, fn) => { fn(); passed.push(name); };
  const raw = (name = 'Member') => ({ identity: { name, rank: 'Capt' }, timeline: { eadYear: 2024, startingYear: 2024, promotion: ['IPZ Capt'], developmentalEducation: [] }, vectors: [{ id: 'custom-vector', label: 'Plan A', segments: [{ id: 'block', label: 'Work', startYear: 2024, endYear: 2026, color: 'blue' }] }] });
  const current = editor.createDefaultChart();
  const envelope = (data = current, version = parser.RIBBON_SAVE_SCHEMA_VERSION) => ({ schema: parser.RIBBON_SAVE_SCHEMA, schemaVersion: version, savedAt: '2026-10-12T12:00:00Z', data });
  check('Full current envelope and legitimate raw charts accepted', () => { assert.equal(parser.extractRibbonChartData(envelope()).identity.name, current.identity.name); assert.equal(parser.extractRibbonChartData(raw()).identity.name, 'Member'); assert.equal(parser.extractRibbonChartData(envelope(current, 11)).identity.rank, current.identity.rank); });
  check('Incomplete/wrong/versionless envelopes reject before normalization', () => { for (const item of [{ schema: parser.RIBBON_SAVE_SCHEMA, schemaVersion: 11, data: {} }, envelope(raw(), 11), envelope(current, 999), { schema: parser.RIBBON_SAVE_SCHEMA, data: current }, null]) assert.throws(() => parser.extractRibbonChartData(item)); });
  check('Malformed scalars, rows, colors, dates and duplicate IDs rejected', () => {
    for (const mutate of [d => d.identity.name = 123, d => d.timeline.eadYear = Infinity, d => d.timeline.promotion = [false], d => d.vectors[0].segments[0].color = 'constructor', d => d.vectors[0].segments[0].endYear = 2024, d => d.familyTrackerEnabled = 'yes', d => d.rankHistory = [{ id: 'r', rank: 'Maj', date: '2026-02-30', basis: 'entered' }], d => d.vectors.push(structuredClone(d.vectors[0]))]) { const d = raw(); mutate(d); assert.throws(() => parser.extractRibbonChartData(d)); }
  });
  check('Legacy optional fields are not filled with invented personal DOR', () => { const d = editor.normalizeChart(parser.extractRibbonChartData(raw())); assert.equal(d.identity.dor, ''); assert.equal(d.identity.yearGroup, ''); assert.equal(d.vectors[0].id, 'custom-vector'); assert.equal(d.vectors[0].segments[0].id, 'block'); });
  check('Legacy vector IDs and unknown extension fields survive load/save normalization', () => { const d = raw(); d.vectors[0].id = 'vec-2'; d.extraNotes = { text: 'Preserve this' }; const normalized = editor.normalizeChart(parser.extractRibbonChartData(d)); assert.equal(new Set(normalized.vectors.map(v => v.id)).size, 3); assert.equal(normalized.extraNotes.text, 'Preserve this'); assert.doesNotThrow(() => parser.extractRibbonChartData(envelope(normalized))); });
  check('Family year changes are reversible beyond displayed grade limits', () => { const kids = [{ id: 'kid', enabled: true, label: 'Child', startGrade: 0 }]; assert.equal(editor.shiftFamilyKids(kids, 20)[0].startGrade, 20); assert.deepEqual(editor.shiftFamilyKids(editor.shiftFamilyKids(kids, 20), -20), kids); });
  check('Out-of-window blocks retained without invented display ranges', () => { const d = raw(); d.vectors[0].segments[0].startYear = 2000; d.vectors[0].segments[0].endYear = 2002; const c = parser.parseRibbonComparisonChart(d); assert.deepEqual(c.vectors[0].segments, d.vectors[0].segments); assert.deepEqual(editor.normalizeChart(d).vectors[0].segments, d.vectors[0].segments); assert.equal(planning.intersectCareerRange(2000, 2002, 2024), null); assert.deepEqual(planning.intersectCareerRange(2020, 2025, 2024), { start: 2024, end: 2025 }); assert.match(c.warnings[0], /retained/); });
  check('Drop requires MIME, strict integer and matching active drag', () => { assert.equal(planning.promotionDropSource(['text/plain'], '', null), null); assert.equal(planning.promotionDropSource(['application/x-ribbon-promotion-index'], '', 0), null); assert.equal(planning.promotionDropSource(['application/x-ribbon-promotion-index'], '1', 0), null); assert.equal(planning.promotionDropSource(['application/x-ribbon-promotion-index'], '0', 0), 0); });
  check('Current selector/dated pin-on history does not backfill historical rank or use board labels', () => { assert.equal(planning.rankReferenceForYear({ rank: 'Lt Col', dor: '' }, [], 2020, 2026), null); const h = [{ id: 'lt', rank: '2d Lt', date: '2018-06-01', basis: 'entered' }, { id: 'capt', rank: 'Capt', date: '2022-06-01', basis: 'entered' }, { id: 'maj', rank: 'Maj', date: '2027-09-01', basis: 'estimate' }]; assert.equal(planning.rankReferenceForYear({ rank: 'Capt', dor: '' }, h, 2019, 2026).rank, '2d Lt'); assert.equal(planning.rankReferenceForYear({ rank: 'Capt', dor: '' }, h, 2025, 2026).rank, 'Capt'); assert.match(planning.rankReferenceForYear({ rank: 'Capt', dor: '' }, h, 2027, 2026).basis, /Estimated/); assert.equal(planning.rankReferenceForYear({ rank: 'Lt Col(s)', dor: '' }, [], 2026, 2026), null); assert.equal(planning.dateOnly('30 Feb 2026'), null); });
  check('Annual info has estimates without copied 2026 official dates', () => { const info = editor.getTimelineCellInfo('promotion', 'IPZ Lt Col', 2030); assert.match(info.title, /estimate/); assert.ok(!JSON.stringify(info).includes('Nov 3')); assert.ok(!JSON.stringify(info).includes('2030A')); });
  const unicode = parser.parseRibbonComparisonChart(raw('José François Šárka')); unicode.identity.dor = '2024-01-01';
  check('PDF preserves WinAnsi Latin accents and explicitly rejects unsupported glyphs', () => { const bytes = pdf.buildJoinSpousePdf({ members: [unicode, unicode], startYear: 2024, yearCount: 10, generatedAt: new Date('2026-10-12T12:00:00Z') }); fs.writeFileSync(path.join(testOutput, 'accented-names.pdf'), bytes); assert.ok(Buffer.from(bytes).includes(Buffer.from('/WinAnsiEncoding'))); assert.ok(Buffer.from(bytes).includes(Buffer.from('4a6f73e9204672616ee76f6973208ae1726b61')), 'Encoded PDF name retains José François Šárka'); assert.equal((Buffer.from(bytes).toString('ascii').match(/\/Type \/Page\b/g) ?? []).length, 1); assert.match(Buffer.from(bytes).toString('ascii'), /\/MediaBox \[0 0 792 612\]/); const cjk = structuredClone(unicode); cjk.identity.name = '李明'; assert.throws(() => pdf.buildJoinSpousePdf({ members: [cjk, unicode], startYear: 2024, yearCount: 10 }), /U\+674E/); const unexpected = structuredClone(unicode); unexpected.vectors[0].segments[0].color = 'constructor'; assert.doesNotThrow(() => pdf.buildJoinSpousePdf({ members: [unexpected, unicode], startYear: 2024, yearCount: 10 })); for (const yearCount of [20, 30]) { const paginated = pdf.buildJoinSpousePdf({ members: [unicode, unicode], startYear: 2024, yearCount }); assert.equal((Buffer.from(paginated).toString('ascii').match(/\/Type \/Page\b/g) ?? []).length, yearCount / 10); fs.writeFileSync(path.join(testOutput, `comparison-${yearCount}.pdf`), paginated); } });
  check('Full three-vector export remains one page with both member sections', () => { const member = parser.parseRibbonComparisonChart(envelope()); const bytes = pdf.buildJoinSpousePdf({ members: [member, member], startYear: 2024, yearCount: 10, generatedAt: new Date('2026-10-12T12:00:00Z') }); const text = Buffer.from(bytes).toString('ascii'); assert.equal((text.match(/\/Type \/Page\b/g) ?? []).length, 1); for (const heading of ['MEMBER 1', 'MEMBER 2']) assert.ok(text.includes(Buffer.from(heading).toString('hex')), `PDF includes ${heading}`); for (const label of ['Vec 1', 'Vec 2', 'Vec 3']) assert.equal(text.split(Buffer.from(label).toString('hex')).length - 1, 2, `Both members include ${label}`); fs.writeFileSync(path.join(testOutput, 'full-three-vector.pdf'), bytes); });
  // Set up the DOM before loading react-dom so normal change events are registered.
  dom = new JSDOM('<nav><button id="outside">Outside</button></nav><div id="root"></div>', { url: 'http://localhost/' });
  for (const key of ['window', 'document', 'HTMLElement', 'HTMLInputElement', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'FocusEvent']) globalThis[key] = key === 'window' ? dom.window : dom.window[key];
  Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  class Reader { static pending = []; abort() { this.aborted = true; } readAsText(file) { this.file = file; Reader.pending.push(this); } finish() { this.result = this.file.contents; this.onload?.(); } }
  globalThis.FileReader = Reader;
  const React = require('react'); const { createRoot } = require('react-dom/client');
  const container = document.getElementById('root'); let errors = []; root = createRoot(container, { onUncaughtError: e => errors.push(e.message) });
  act = fn => React.act(async () => fn());
  const button = label => [...container.querySelectorAll('button')].find(x => x.textContent === label);
  const click = node => node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  const choose = (input, file) => { Object.defineProperty(input, 'files', { configurable: true, value: [file] }); input.dispatchEvent(new Event('change', { bubbles: true })); };
  const chartFile = (data, name = 'chart.json') => { const contents = JSON.stringify(data); return { name, size: contents.length, contents }; };
  let confirms = 0; let approve = true; window.confirm = () => { confirms++; return approve; };
  await act(() => root.render(React.createElement(editor.default)));
  await act(() => click(button('Populate Timeline')));
  const beforeUnload = () => { const event = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(event); return event.defaultPrevented; };
  assert.ok(beforeUnload());
  const input = container.querySelector('input[type=file]');
  await act(() => choose(input, chartFile({ schema: parser.RIBBON_SAVE_SCHEMA, schemaVersion: 11, data: {} })));
  await act(() => Reader.pending.at(-1).finish());
  assert.ok(beforeUnload()); assert.equal(confirms, 0); assert.equal(container.querySelector('select[aria-label="Current rank"]').value, 'Lt Col'); passed.push('Invalid load preserves dirty chart and skips replacement confirmation');
  approve = false; await act(() => choose(input, chartFile(raw('Replacement')))); await act(() => Reader.pending.at(-1).finish());
  assert.equal(confirms, 1); assert.ok(beforeUnload()); assert.equal(container.querySelector('input[aria-label="Name"]').value, 'First, Last, Middle'); passed.push('Canceled valid load preserves dirty state and chart');
  approve = true; await act(() => choose(input, chartFile(raw('A'), 'A.json'))); const readerA = Reader.pending.at(-1); await act(() => choose(input, chartFile(raw('B'), 'B.json'))); const readerB = Reader.pending.at(-1); await act(() => readerB.finish()); await act(() => readerA.finish()); assert.equal(container.querySelector('input[aria-label="Name"]').value, 'B'); assert.equal(beforeUnload(), false); passed.push('Editor stale FileReader completion cannot overwrite newer selection');
  const open = button('Open 30 Year View'); open.focus(); await act(() => click(open)); const dialog = container.querySelector('[role=dialog]'); assert.ok(dialog.contains(document.activeElement)); assert.equal(container.querySelector('.ribbon-toolbar').inert, true); assert.equal(document.querySelector('nav').inert, true);
  const focused = [...dialog.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]')]; focused.at(-1).focus(); await act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))); assert.equal(document.activeElement, focused[0]); focused[0].focus(); await act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }))); assert.equal(document.activeElement, focused.at(-1)); await act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))); assert.equal(document.activeElement, open); assert.equal(container.querySelector('.ribbon-toolbar').inert ?? false, false); passed.push('Modal moves/traps/restores focus and isolates site background');
  const dataTransfer = { types: [], values: new Map(), setData(type, value) { this.values.set(type, value); this.types.push(type); }, getData(type) { return this.values.get(type) ?? ''; } };
  const dropTarget = container.querySelector('input[aria-label="Board estimates 2025"]').parentElement;
  const dragEvent = (type, transfer) => { const e = new Event(type, { bubbles: true, cancelable: true }); Object.defineProperty(e, 'dataTransfer', { value: transfer }); return e; };
  await act(() => dropTarget.dispatchEvent(dragEvent('drop', { types: ['text/plain'], getData: () => '' }))); assert.equal(container.querySelector('input[aria-label="Board estimates 2024"]').value, 'IPZ Capt'); passed.push('Unrelated text drop leaves promotion unchanged');
  const handle = container.querySelector('button[aria-label="Move IPZ Capt"]'); await act(() => handle.dispatchEvent(dragEvent('dragstart', dataTransfer))); await act(() => dropTarget.dispatchEvent(dragEvent('drop', dataTransfer))); assert.equal(container.querySelector('input[aria-label="Board estimates 2025"]').value, 'IPZ Capt'); passed.push('Matching internal drag still moves the board milestone');
  const family = raw('Family'); family.familyTrackerEnabled = true; family.familyKids = [{ id: 'child', enabled: true, label: 'Child', startGrade: 0 }];
  await act(() => choose(input, chartFile(family))); await act(() => Reader.pending.at(-1).finish());
  const startSelect = [...container.querySelectorAll('.ribbon-year-control')].find(x => x.querySelector('span')?.textContent === 'Start Year').querySelector('select');
  await act(() => { startSelect.value = '2044'; startSelect.dispatchEvent(new Event('change', { bubbles: true })); });
  assert.ok([...container.querySelectorAll('.ribbon-family-cell')].some(x => x.textContent === 'Child: Grad'));
  await act(() => { startSelect.value = '2024'; startSelect.dispatchEvent(new Event('change', { bubbles: true })); });
  assert.equal(container.querySelector('[aria-label="Kids grades 2024"]').textContent, 'Child: K');
  let savedBlob; URL.createObjectURL = (blob) => { savedBlob = blob; return 'blob:qa'; }; URL.revokeObjectURL = () => {}; dom.window.HTMLAnchorElement.prototype.click = () => {};
  await act(() => click(button('Save'))); const familySave = JSON.parse(await savedBlob.text()); assert.equal(familySave.data.familyKids[0].startGrade, 0); assert.equal(familySave.schemaVersion, 12); assert.doesNotThrow(() => parser.extractRibbonChartData(familySave)); passed.push('Family UI start-year round trip and current-schema save/load preserve anchor');
  { const unmounting = root; root = null; await act(() => unmounting.unmount()); }
  root = createRoot(container, { onUncaughtError: e => errors.push(e.message) }); const Join = require(path.join(compiled, 'components/JoinSpouseRibbonChartPage.js')).default; await act(() => root.render(React.createElement(Join)));
  const memberInput = container.querySelector('input[type=file]'); let resolveA;
  await act(() => choose(memberInput, { name: 'A.json', size: 1, text: () => new Promise(resolve => { resolveA = resolve; }) })); await act(() => choose(memberInput, { name: 'B.json', size: 1, text: () => Promise.resolve(JSON.stringify(raw('Newer B'))) })); await act(() => resolveA(JSON.stringify(raw('Older A')))); assert.equal(container.querySelector('#join-member-1-title').textContent, 'Capt Newer B'); passed.push('Comparison newer upload wins slow file race');
  let resolveC; await act(() => choose(memberInput, { name: 'C.json', size: 1, text: () => new Promise(resolve => { resolveC = resolve; }) })); await act(() => click(button('Remove'))); await act(() => resolveC(JSON.stringify(raw('Removed C')))); assert.equal(container.querySelector('#join-member-1-title').textContent, 'Upload ribbon chart JSON'); passed.push('Removing comparison member invalidates pending upload');
  { const unmounting = root; root = null; await act(() => unmounting.unmount()); } assert.deepEqual(errors, []); passed.push('No React render errors across tested interactions');
  assert.equal(passed.length, 22);
  fs.writeFileSync(path.join(testOutput, 'regression-results.json'), JSON.stringify({ passed, count: passed.length, errors }, null, 2) + '\n');
  t.diagnostic(`${passed.length} sequential planner checks passed.`);
});
