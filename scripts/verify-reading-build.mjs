import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

// Run after astro build. This compares generated published-list membership with
// the generated card data, without parsing content frontmatter independently.
const root=process.cwd();
const books=fs.readFileSync(path.join(root,'dist/books/index.html'),'utf8');
const flashcards=fs.readFileSync(path.join(root,'dist/flashcards/index.html'),'utf8');
const future=fs.readFileSync(path.join(root,'dist/future-reading/index.html'),'utf8');
const sourceLinks=new Set([...books.matchAll(/href="(\/books\/[^"?#]+)"/g)].map(match=>match[1]));
const serialized=/<script\b[^>]*\bid="flashcards-data"[^>]*>([\s\S]*?)<\/script>/i.exec(flashcards);
assert(serialized,'Generated flashcard JSON is present');
const cards=JSON.parse(serialized[1]);
assert(Array.isArray(cards)&&cards.length>0,'Generated deck is populated');
const cardLinks=new Set(cards.map(card=>card.sourceHref));
assert.equal(cardLinks.size,cards.length,'Every card has one unique book source');
assert.deepEqual([...cardLinks].sort(),[...sourceLinks].sort(),'Every published book note appears in the generated deck, with no extra source');
for(const card of cards){
  assert(card.ideas.length>=1&&card.ideas.length<=2,'One or two usable note excerpts');
  assert(card.ideas.every(idea=>typeof idea.text==='string'&&idea.text.trim().length>=45),'Usable text, not a placeholder');
  assert(fs.existsSync(path.join(root,'dist',card.sourceHref,'index.html')),'Source note route exists: '+card.sourceHref);
}
assert(/<title>[^<]*Flashcards[^<]*<\/title>/.test(flashcards),'Flashcards has a meaningful page title');
assert(/id="cardBack"[^>]*\bhidden\b[^>]*\binert\b/.test(flashcards),'Initial answer is hidden and inert');
const tbody=/<tbody\b[^>]*\bid="tableBody"[^>]*>([\s\S]*?)<\/tbody>/.exec(future);
assert(tbody,'Future Reading rows are present');
const plannedRows=[...tbody[1].matchAll(/<tr\b[^>]*\bdata-status="([^"]+)"/g)];
assert(plannedRows.length>0,'Future Reading has planned rows');
for(const row of plannedRows)assert(['reading','to read','tbr','tbd'].includes(row[1]),'Planned status is recognized');
console.log(JSON.stringify({passed:true,publishedBookNotes:sourceLinks.size,generatedCards:cards.length,plannedBooks:plannedRows.length}));
