import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transpileProject, runTests } from '../scripts/run-tests.mjs';
import { checkJavaScript } from '../scripts/check-source.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const scratch = process.env.PBV_TOOLING_TEST_TMP ?? path.join(projectRoot, '.local');
fs.mkdirSync(scratch, { recursive: true });

function fixture(callback) {
  const directory = fs.mkdtempSync(path.join(scratch, 'tooling-fixture-'));
  try {
    return callback(directory);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function write(directory, relative, text) {
  const filename = path.join(directory, relative);
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, text);
}

test('TypeScript test output preserves relative imports and JSON runtime data', () => fixture(directory => {
  write(directory, 'src/utils/value.ts', 'export const value: number = 12;');
  write(directory, 'src/data/data.json', '{"name":"Example"}');
  write(directory, 'src/utils/read.ts',
    'import {value} from "./value"; import data from "../data/data.json"; export const result = data.name + value;');
  const compiled = transpileProject(directory, path.join(directory, 'compiled'));
  assert.equal(require(path.join(compiled, 'utils/read.js')).result, 'Example12');
}));

test('TypeScript syntax failures reject the regression build', () => fixture(directory => {
  write(directory, 'src/utils/broken.ts', 'export const broken = ;');
  assert.throws(() => transpileProject(directory, path.join(directory, 'compiled')), /Expression expected/);
}));

test('JavaScript source check excludes preserved captured HTML', () => fixture(directory => {
  write(directory, 'package.json', '{"type":"module"}');
  write(directory, 'src/example.js', 'export const value = 1;');
  write(directory, 'public/scripts/example.js', 'const value = 1;');
  write(directory, 'public/archives/example/captured.js', '<!DOCTYPE html><html>captured source</html>');
  assert.equal(checkJavaScript(directory), 0);
}));

test('Node regression runner exposes compiled helpers and removes its temporary output', () => fixture(directory => {
  write(directory, 'src/utils/value.ts', 'export const value: number = 12;');
  write(directory, 'tests/example.test.mjs',
    'import test from "node:test"; import assert from "node:assert/strict"; import {createRequire} from "node:module"; import path from "node:path"; const require=createRequire(import.meta.url); test("compiled helper",()=>assert.equal(require(path.join(process.env.PBV_TEST_BUILD_DIR,"utils/value.js")).value,12));');
  const before = fs.existsSync(path.join(directory, '.local'))
    ? fs.readdirSync(path.join(directory, '.local')) : [];
  const originalParent = process.env.PBV_TEST_BUILD_PARENT;
  process.env.PBV_TEST_BUILD_PARENT = path.join(directory, '.local');
  try {
    assert.equal(runTests(directory), 0);
  } finally {
    if (originalParent === undefined) delete process.env.PBV_TEST_BUILD_PARENT;
    else process.env.PBV_TEST_BUILD_PARENT = originalParent;
  }
  const after = fs.readdirSync(path.join(directory, '.local'));
  assert.deepEqual(after, before);
}));

test('Timeline disclosure has native button semantics and an existing controlled panel', () => {
  assert.ok(process.env.PBV_TEST_BUILD_DIR, 'Use npm test to prepare the CommonJS test output.');
  const EraCard = require(path.join(process.env.PBV_TEST_BUILD_DIR, 'components/EraCard.js')).default;
  const era = {
    id: 'synthetic-era', title: 'Synthetic Era',
    range: { start: '2000-01-01', end: '2001-01-01' },
    summary: 'Synthetic summary', tags: ['Airpower'], events: [],
  };
  const closed = renderToStaticMarkup(React.createElement(EraCard, { era, isOpen: false, onToggle() {} }));
  const open = renderToStaticMarkup(React.createElement(EraCard, { era, isOpen: true, onToggle() {} }));
  assert.match(closed, /<h2[^>]*><button[^>]*type="button"/);
  assert.match(closed, /aria-expanded="false"/);
  const panelId = closed.match(/aria-controls="([^"]+)"/)?.[1];
  assert.ok(panelId);
  assert.ok(closed.includes('id="' + panelId + '" hidden=""'));
  assert.match(open, /aria-expanded="true"/);
  assert.doesNotMatch(open, /hidden=""/);
  assert.doesNotMatch(closed, /tabindex=/i);
  const pair = renderToStaticMarkup(React.createElement(React.Fragment, null,
    React.createElement(EraCard, { era, isOpen: false, onToggle() {} }),
    React.createElement(EraCard, { era, isOpen: false, onToggle() {} })));
  const controls = [...pair.matchAll(/aria-controls="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(controls).size, 2);
});
