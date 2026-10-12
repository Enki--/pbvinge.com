import { rehypeHeadingIds } from '@astrojs/markdown-remark';

/** Keep existing Astro 4 heading URLs while using the supported Markdown processor. */
export default function rehypeLegacyHeadingIds() {
  const collectHeadings = rehypeHeadingIds();
  return (tree, file) => {
    const explicitIds = new Set();
    const visitHeadings = (node, action) => {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) action(node);
      for (const child of node.children ?? []) visitHeadings(child, action);
    };
    visitHeadings(tree, node => {
      if (typeof node.properties?.id === 'string') explicitIds.add(node);
    });
    // Reuse the current collector's text extraction and duplicate handling.
    collectHeadings(tree, file);
    visitHeadings(tree, node => {
      if (!explicitIds.has(node) && node.properties.id.endsWith('-')) {
        node.properties.id = node.properties.id.slice(0, -1);
      }
    });
    // Astro's subsequent built-in collector uses these IDs for TOC metadata.
  };
}
