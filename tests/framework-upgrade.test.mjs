import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import rehypeLegacyHeadingIds from '../scripts/rehype-legacy-heading-ids.mjs';
const require = createRequire(import.meta.url);
const modulePath = name => path.join(process.env.PBV_TEST_BUILD_DIR, 'utils', name + '.js');
const { legacyContentId } = require(modulePath('contentId'));
const { timestampValue } = require(modulePath('dates'));

test('Content Layer IDs preserve legacy nested URLs, index paths and explicit overrides', () => {
  for (const [entry, expected] of [
    ['600/Air Power and Armies.md', '600/air-power-and-armies'],
    ['667/Why War?.md', '667/why-war'],
    ['history/index.md', 'history'],
    ['Course\\Nested Title.mdx', 'course/nested-title'],
  ]) assert.equal(legacyContentId({ entry, data: {} }), expected);
  assert.equal(legacyContentId({ entry: 'old.md', data: { slug: 'kept/nested' } }), 'kept/nested');
  assert.throws(() => legacyContentId({ entry: 'old.md', data: { slug: 42 } }), TypeError);
});

test('recorded timestamp calendar labels are identical in Chicago and UTC', () => {
  const code = `const d=require(${JSON.stringify(modulePath('dates'))});process.stdout.write(d.formatCalendarDate(new Date('2025-12-01T05:49:38Z')));`;
  for (const TZ of ['America/Chicago', 'UTC', 'Asia/Tokyo']) {
    const result = spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env: { ...process.env, TZ } });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, 'December 1, 2025');
  }
  assert.equal(timestampValue(new Date('2025-12-01T05:49:38Z')), timestampValue(new Date('2025-12-01T05:49:38Z')));
});

test('rendered Markdown and TOC retain existing fragments for headings with trailing emphasis spaces', async () => {
  const processor = await createMarkdownProcessor({ rehypePlugins: [rehypeLegacyHeadingIds] });
  const result = await processor.render('### **Chapter 1: **\n\n## Introduction \n\n## A second heading\n');
  assert.deepEqual(result.metadata.headings.map(heading => heading.slug), ['chapter-1', 'introduction', 'a-second-heading']);
  assert.match(result.code, /id="chapter-1"/);
  assert.doesNotMatch(result.code, /id="chapter-1-"/);
  // Explicit IDs are author-owned and must not be normalized by compatibility.
  const tree = { type: 'root', children: [{ type: 'element', tagName: 'h2', properties: { id: 'chosen-' }, children: [{ type: 'text', value: 'Chosen heading' }] }] };
  rehypeLegacyHeadingIds()(tree, { data: {}, history: [] });
  assert.equal(tree.children[0].properties.id, 'chosen-');
});
