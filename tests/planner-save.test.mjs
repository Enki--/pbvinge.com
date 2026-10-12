import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);

// Exercise the production component through real React event handlers. Deferred
// browser writes let the test stop at each point where a save can still fail.
test('planner save completion preserves cancellation, failures and newer chart changes', async t => {
  const compiled = process.env.PBV_TEST_BUILD_DIR;
  assert.ok(compiled, 'Run through npm test or scripts/run-tests.mjs.');
  const cssDirectory = path.join(compiled, 'css');
  fs.mkdirSync(cssDirectory, { recursive: true });
  fs.writeFileSync(path.join(cssDirectory, 'ribbon-chart.css'), '');
  const cssHook = require.extensions['.css'];
  require.extensions['.css'] = () => {};
  const globalKeys = ['window', 'document', 'HTMLElement', 'HTMLInputElement', 'Node', 'Event', 'MouseEvent', 'navigator', 'IS_REACT_ACT_ENVIRONMENT', 'FileReader'];
  const globals = new Map(globalKeys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const urlMethods = new Map(['createObjectURL', 'revokeObjectURL'].map(key => [key, Object.getOwnPropertyDescriptor(URL, key)]));
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://pbvinge.test/' });
  for (const key of ['window', 'document', 'HTMLElement', 'HTMLInputElement', 'Node', 'Event', 'MouseEvent']) {
    globalThis[key] = key === 'window' ? dom.window : dom.window[key];
  }
  Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  class Reader {
    static pending = [];
    abort() { this.aborted = true; }
    readAsText(file) { this.file = file; Reader.pending.push(this); }
    finish() { this.result = this.file.contents; this.onload?.(); }
  }
  globalThis.FileReader = Reader;
  const React = require('react');
  const { createRoot } = require('react-dom/client');
  const RibbonChartPage = require(path.join(compiled, 'components/RibbonChartPage.js')).default;
  const { extractRibbonChartData } = require(path.join(compiled, 'utils/ribbonChartFile.js'));
  const container = document.getElementById('root');
  const errors = [];
  let root;
  const act = callback => React.act(async () => callback());
  t.after(async () => {
    try {
      if (root) await act(() => root.unmount());
    } finally {
      dom.window.close();
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
  const button = label => [...container.querySelectorAll('button')].find(node => node.textContent === label);
  const click = node => node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  const nameInput = () => container.querySelector('input[aria-label="Name"]');
  const setName = name => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(nameInput(), name);
    nameInput().dispatchEvent(new Event('input', { bubbles: true }));
  };
  const beforeUnload = () => {
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    return event.defaultPrevented;
  };
  const status = () => container.querySelector('[role="status"]')?.textContent ?? '';
  const deferred = () => {
    let resolve, reject;
    const promise = new Promise((accept, fail) => { resolve = accept; reject = fail; });
    return { promise, resolve, reject };
  };
  const mount = async name => {
    if (root) await act(() => root.unmount());
    root = createRoot(container, { onUncaughtError: error => errors.push(error.message) });
    await act(() => root.render(React.createElement(RibbonChartPage)));
    await act(() => setName(name));
    assert.equal(nameInput().value, name);
    assert.equal(beforeUnload(), true, 'Editing the chart activates unsaved-change protection.');
  };
  const load = async name => {
    const contents = JSON.stringify({
      identity: { name, rank: 'Capt' },
      timeline: { eadYear: 2024, startingYear: 2024, promotion: [], developmentalEducation: [] },
      vectors: [],
    });
    const input = container.querySelector('input[type="file"]');
    await act(() => {
      Object.defineProperty(input, 'files', { configurable: true, value: [{ name: 'chart.json', size: contents.length, contents }] });
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await act(() => Reader.pending.at(-1).finish());
  };
  const passed = [];
  let downloaded;
  URL.createObjectURL = blob => { downloaded = blob; return 'blob:planner-save-test'; };
  URL.revokeObjectURL = () => {};
  dom.window.HTMLAnchorElement.prototype.click = () => {};

  // An anchor request can neither confirm completion nor observe Cancel.
  delete window.showSaveFilePicker;
  await mount('Fallback work');
  await act(() => click(button('Save')));
  assert.equal(beforeUnload(), true);
  assert.match(status(), /Download requested/);
  assert.doesNotMatch(status(), /Saved chart file/);
  const downloadedPayload = JSON.parse(await downloaded.text());
  assert.equal(downloadedPayload.data.identity.name, 'Fallback work');
  assert.doesNotThrow(() => extractRibbonChartData(downloadedPayload));
  let confirmations = 0;
  window.confirm = () => { confirmations++; return false; };
  await load('Replacement');
  assert.equal(confirmations, 1, 'A requested download does not bypass the Load warning.');
  assert.equal(nameInput().value, 'Fallback work');
  assert.equal(beforeUnload(), true);
  passed.push('Fallback download retains dirty state and Load replacement warning');

  await mount('Canceled work');
  window.showSaveFilePicker = async () => { throw new dom.window.DOMException('Canceled', 'AbortError'); };
  await act(() => click(button('Save')));
  assert.equal(nameInput().value, 'Canceled work');
  assert.equal(beforeUnload(), true);
  assert.equal(button('Save').disabled, false);
  assert.match(status(), /Save canceled/);
  assert.doesNotMatch(status(), /Saved chart file/);
  confirmations = 0;
  await load('Canceled replacement');
  assert.equal(confirmations, 1);
  assert.equal(nameInput().value, 'Canceled work');
  passed.push('Canceled picker retains the edited chart and replacement protection');

  for (const stage of ['create', 'write', 'close']) {
    await mount(`Failure at ${stage}`);
    let aborted = 0;
    const writable = {
      async write() { if (stage === 'write') throw new Error('Write failed'); },
      async close() { if (stage === 'close') throw new Error('Close failed'); },
      async abort() { aborted++; },
    };
    window.showSaveFilePicker = async () => ({
      async createWritable() {
        if (stage === 'create') throw new Error('Permission denied');
        return writable;
      },
    });
    await act(() => click(button('Save')));
    assert.equal(beforeUnload(), true, `${stage} failure must retain unsaved-change protection.`);
    assert.equal(nameInput().value, `Failure at ${stage}`);
    assert.equal(button('Save').disabled, false);
    assert.match(status(), /Could not save chart/);
    assert.doesNotMatch(status(), /Saved chart file/);
    assert.equal(aborted, stage === 'create' ? 0 : 1);
    passed.push(`Failed ${stage} preserves dirty state and cleans up the pending stream`);
  }

  await mount('Successful work');
  const write = deferred(), close = deferred();
  let savedPayload, pickerCalls = 0, pickerOptions;
  window.showSaveFilePicker = async options => {
    pickerCalls++;
    pickerOptions = options;
    return { async createWritable() { return {
      async write(blob) { savedPayload = JSON.parse(await blob.text()); await write.promise; },
      async close() { await close.promise; },
      async abort() { assert.fail('A successful write must not abort.'); },
    }; } };
  };
  await act(() => click(button('Save')));
  assert.equal(button('Save').disabled, true);
  assert.equal(beforeUnload(), true, 'A pending write is not saved.');
  assert.equal(savedPayload.data.identity.name, 'Successful work');
  assert.doesNotThrow(() => extractRibbonChartData(savedPayload));
  assert.equal(pickerOptions.suggestedName, 'successful-work-17x-ribbon-chart.json');
  assert.deepEqual(pickerOptions.types[0].accept, { 'application/json': ['.json'] });
  await act(() => click(button('Save')));
  assert.equal(pickerCalls, 1, 'Concurrent Save does not start a second picker.');
  await act(() => write.resolve());
  assert.equal(beforeUnload(), true, 'Finished write still needs a successful close.');
  await act(() => close.resolve());
  assert.equal(beforeUnload(), false);
  assert.equal(button('Save').disabled, false);
  assert.equal(status(), 'Saved chart file.');
  passed.push('Only completed write and close clear dirty state; concurrent Save is blocked');

  await mount('Snapshot before picker');
  const picker = deferred();
  let earlierPayload;
  window.showSaveFilePicker = () => picker.promise;
  await act(() => click(button('Save')));
  assert.equal(button('Save').disabled, true);
  await act(() => setName('Edited while picker open'));
  await act(() => picker.resolve({ async createWritable() { return {
    async write(blob) { earlierPayload = JSON.parse(await blob.text()); },
    async close() {}, async abort() {},
  }; } }));
  assert.equal(earlierPayload.data.identity.name, 'Snapshot before picker');
  assert.equal(nameInput().value, 'Edited while picker open');
  assert.equal(beforeUnload(), true);
  assert.match(status(), /earlier chart version.*newer changes still need saving/);
  window.showSaveFilePicker = async () => ({ async createWritable() { return {
    async write(blob) { earlierPayload = JSON.parse(await blob.text()); },
    async close() {}, async abort() {},
  }; } });
  await act(() => click(button('Save')));
  assert.equal(earlierPayload.data.identity.name, 'Edited while picker open');
  assert.equal(beforeUnload(), false, 'A second completed save covers the newer edits.');
  passed.push('Picker-time edits survive old completion and can then be saved successfully');

  await mount('Old chart snapshot');
  const oldClose = deferred();
  window.showSaveFilePicker = async () => ({ async createWritable() { return {
    async write() {}, async close() { await oldClose.promise; }, async abort() {},
  }; } });
  await act(() => click(button('Save')));
  assert.equal(beforeUnload(), true);
  window.confirm = () => { confirmations++; return true; };
  confirmations = 0;
  await load('Loaded during save');
  assert.equal(confirmations, 1);
  assert.equal(beforeUnload(), false);
  await act(() => setName('Edited loaded chart'));
  assert.equal(beforeUnload(), true);
  await act(() => oldClose.resolve());
  assert.equal(nameInput().value, 'Edited loaded chart');
  assert.equal(beforeUnload(), true, 'An old save cannot clean newer edits after Load.');
  assert.match(status(), /earlier chart version.*newer changes still need saving/);
  passed.push('Load and subsequent edits during close remain protected from old completion');

  await mount('Reset during save');
  const resetClose = deferred();
  window.showSaveFilePicker = async () => ({ async createWritable() { return {
    async write() {}, async close() { await resetClose.promise; }, async abort() {},
  }; } });
  await act(() => click(button('Save')));
  window.confirm = () => true;
  await act(() => click(button('Reset')));
  assert.equal(beforeUnload(), false);
  await act(() => setName('New work after reset'));
  await act(() => resetClose.resolve());
  assert.equal(nameInput().value, 'New work after reset');
  assert.equal(beforeUnload(), true);
  passed.push('Reset and subsequent edits during close cannot be cleaned by old completion');

  await mount('x'.repeat(301));
  let invalidPickerCalls = 0;
  window.showSaveFilePicker = async () => { invalidPickerCalls++; assert.fail('Invalid chart must not open a save picker.'); };
  await act(() => click(button('Save')));
  assert.equal(invalidPickerCalls, 0);
  assert.equal(beforeUnload(), true);
  assert.equal(button('Save').disabled, false);
  assert.match(status(), /identity.name.*300/);
  passed.push('Existing validation rejects the payload before opening a picker');

  assert.deepEqual(errors, []);
  assert.equal(passed.length, 10);
  t.diagnostic(`${passed.length} React save completion scenarios passed.`);
});
