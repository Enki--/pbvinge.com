// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import rehypeLegacyHeadingIds from './scripts/rehype-legacy-heading-ids.mjs';

export default defineConfig({
  site: 'https://pbvinge.com',
  output: 'static',
  // Preserve the established Markdown pipeline and HTML-aware whitespace.
  markdown: { processor: unified({ rehypePlugins: [rehypeLegacyHeadingIds] }) },
  compressHTML: true,
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
