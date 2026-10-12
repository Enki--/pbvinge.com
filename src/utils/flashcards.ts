/** Flashcards quote the published study note, rather than adding new book claims. */
import { contributorCredit, contributorNames, type BookMetadata } from './citations';
export interface FlashcardBook {
  id: string;
  body?: string;
  data: BookMetadata & { cover?: string };
}
export interface NoteIdea {
  text: string;
  section: string;
  /** Exact Markdown source unit for reproducible provenance checks. */
  source: string;
}
export interface NoteFlashcard {
  title: string;
  author: string;
  credit: string;
  img: string;
  sourceHref: string;
  ideas: NoteIdea[];
}

export function noteText(source: string): string {
  return source
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/(?:\*\*|__|`|\uFFFC)/g, '')
    .replace(/(^|\s)[*_]([^*_]+)[*_](?=\s|[.,:;!?]|$)/g, '$1$2')
    .replace(/^\s*(?:[-*+•]|\d+[.)])\s+/, '')
    .replace(/\s+/g, ' ').trim();
}

function sectionPriority(section: string): number {
  if (/online description|author background|bibliographic|bibliography|\bcitation\b|quote bank|notable quotes|key quotes|paper seed|paper hooks|final.paper|reference index|quick.reference|strengths|weaknesses|gaps|works cited|evidence blocks|questions?|prompts?|discussion/i.test(section)) return 0;
  if (/thesis|main issue|main argument|central argument|core claim/i.test(section)) return 6;
  if (/executive summary|60.second brief|one.paragraph overview|top takeaways|key ideas/i.test(section)) return 5;
  if (/main idea|key points|main points|supporting ideas|argument spine|causal|mechanism/i.test(section)) return 4;
  if (/concept|definition|theory|term:/i.test(section)) return 3;
  return 2;
}

/** Extract complete Markdown blocks; do not turn seminar prompts into answers. */
export function extractNoteIdeas(body: string, limit = 2): NoteIdea[] {
  const lines = body.replace(/\r\n?/g, '\n').split('\n');
  const units: Array<NoteIdea & { priority: number; order: number }> = [];
  const headings: Array<{ depth: number; text: string }> = [];
  let label = '';
  let fenced = false;
  const isList = (line: string) => /^\s*(?:[-*+•]|\d+[.)])\s+\S/.test(line);
  const isRule = (line: string) => /^\s*(?:-{3,}|\*{3,}|_{3,}|⸻)\s*$/.test(line);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\s*```|^\s*~~~/.test(line)) { fenced = !fenced; continue; }
    if (fenced || !line.trim()) continue;
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      const depth = heading[1].length;
      while (headings.length && headings[headings.length - 1].depth >= depth) headings.pop();
      headings.push({ depth, text: noteText(heading[2]) });
      label = '';
      continue;
    }
    if (isRule(line)) {
      label = '';
      // Old notes use rules for unheaded study sections after the description.
      if (headings.length && /online description/i.test(headings[headings.length - 1].text)) headings.pop();
      continue;
    }
    const standaloneLabel = /^\s*(?:[-*+]\s+)?\*\*([^*]+):?\*\*\s*$/.exec(line);
    if (standaloneLabel) { label = noteText(standaloneLabel[1]); continue; }
    if (/^\s*[|<]/.test(line)) continue; // Tables and raw markup are not recall answers.
    const contexts = headings.map(item => item.text);
    if (contexts.some(context => sectionPriority(context) === 0) || (label && sectionPriority(label) === 0)) continue;

    const start = index;
    const block = [line];
    // Paragraphs as well as bullet points carry thesis statements. Preserve
    // the exact original block, including indentation and inherited page refs.
    while (index + 1 < lines.length) {
      const next = lines[index + 1];
      if (!next.trim() || /^(#{1,6})\s+/.test(next) || isList(next) || isRule(next) || /^\s*(?:```|~~~|[|<])/.test(next)) break;
      if (isList(line) && !/^\s{2,}\S/.test(next)) break;
      block.push(next);
      index += 1;
    }
    const source = block.join('\n').trim();
    const text = noteText(source).replace(/^>\s*/, '');
    if (text.length < 45 || text.length > 1600 || /not found in|insert |\{\{|\bplaceholder\b/i.test(text)) continue;
    // A question can occur under an otherwise useful chapter heading or label.
    if (/^(?:discussion|open|seminar|course|research)\s+question\b|^question\s*[:\d]|\?\s*(?:\([^)]*\)|\[[^\]]*\])?\s*$/i.test(text)) continue;
    const inlineLabel = /^(?:\*\*)?([^:]{1,70}):/.exec(source.replace(/^\s*(?:[-*+•]|\d+[.)])\s+/, ''))?.[1];
    const inlinePriority = inlineLabel ? sectionPriority(noteText(inlineLabel)) : 2;
    if (inlinePriority === 0) continue;
    const priority = Math.max(...contexts.map(sectionPriority), label ? sectionPriority(label) : 2, inlinePriority);
    const section = headings[headings.length - 1]?.text || label || 'Study notes';
    units.push({ text, section, source, priority, order: start });
  }
  units.sort((a, b) => b.priority - a.priority || a.order - b.order);
  const seen = new Set<string>();
  return units.filter(idea => {
    const key = idea.text.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit).map(({ text, section, source }) => ({ text, section, source }));
}

export function buildNoteFlashcard(book: FlashcardBook): NoteFlashcard | null {
  const ideas = extractNoteIdeas(book.body ?? '');
  if (!ideas.length) return null;
  return {
    title: book.data.title,
    author: contributorNames(book.data).join(', '),
    credit: contributorCredit(book.data),
    img: (book.data.cover || '').replace(/^http:\/\//, 'https://'),
    sourceHref: `/books/${book.id}`,
    ideas,
  };
}
