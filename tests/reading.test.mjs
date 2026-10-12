import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const compiled = process.env.PBV_TEST_BUILD_DIR;
if (!compiled) throw new Error('Run through scripts/run-tests.mjs to compile TypeScript helpers.');
const { buildNoteFlashcard, extractNoteIdeas, noteText } = require(path.join(compiled, 'utils/flashcards.js'));
const { flashcardFeedback } = require(path.join(compiled, 'utils/flashcards-client.js'));
const { isPublishedBookNote, isPublishedPlannedBook } = require(path.join(compiled, 'utils/books.js'));
const root = process.env.PBV_TEST_ROOT || process.cwd();
test('published complete notes generate source-backed cards; planned and hidden records stay excluded', () => {
  const book={slug:'course/synthetic',data:{title:'Synthetic Book',author:['Test Author'],status:'complete',isPublished:true},body:'## Main Thesis\n- A useful exact source idea connects strategy, political aims, and available means. (p. 8)\n- A second useful exact idea tests assumptions against evidence and alternatives. (p. 9)\n'};
  const records=[book,{...book,slug:'hidden',data:{...book.data,isPublished:false}},{...book,slug:'planned',data:{...book.data,status:'to read'}}];
  const cards=records.filter(entry=>isPublishedBookNote(entry.data)).map(buildNoteFlashcard);
  assert.equal(cards.length,1);
  assert.equal(cards[0].sourceHref,'/books/course/synthetic');
  assert.equal(cards[0].ideas.length,2);
  for(const idea of cards[0].ideas){assert(book.body.includes(idea.source));assert.equal(idea.text,noteText(idea.source));}
  assert.equal(isPublishedPlannedBook({isPublished:false,status:'reading'}),false);
  for(const status of ['reading','to read','tbr','tbd'])assert(isPublishedPlannedBook({status}));
});

test('card extraction skips description, biography, fenced code and editorial placeholders', () => {
  const body='## Online Description\n- PUBLISHER DESCRIPTION must stay outside the study card source.\n## Author Background\n- AUTHOR BIOGRAPHY must stay outside the study card source.\n## Main Thesis\n- **Useful exact idea:** the note connects political aims with available means. (p. 8)\n- **Second exact idea:** evidence and alternative explanations affect interpretation. (p. 9)\n```\n- PRIVATE CODE should not become a note-based idea on a study card.\n```\n- {{PLACEHOLDER}} This editorial instruction is not usable book evidence.\n';
  const ideas=extractNoteIdeas(body);
  assert.equal(ideas.length,2);
  assert(ideas[0].text.includes('(p. 8)'));
  assert(ideas[1].text.includes('(p. 9)'));
  assert(ideas.every(idea=>!idea.text.includes('DESCRIPTION')&&!idea.text.includes('BIOGRAPHY')&&!idea.text.includes('CODE')&&!idea.text.includes('PLACEHOLDER')));
  assert.equal(buildNoteFlashcard({slug:'empty',body:'# Title\nThis book is on my reading list.',data:{title:'Empty',author:['Synthetic']}}),null);
});

test('flashcard feedback uses real newline separators and normalizes whitespace', () => {
  const body=flashcardFeedback({title:'Quoted "Title"',author:'Synthetic Author',sourceHref:'/books/synthetic',ideas:[{text:'Idea with\n  multiple\tspaces.',section:'Thesis'}]},0,12);
  assert(body.includes('Flashcard front:\nQuoted "Title"\nby Synthetic Author'));
  assert(body.includes('\n\nCurrent ideas:\n- Idea with multiple spaces.\n  From: Thesis'));
  assert(!body.includes('\\n'));
  assert(body.includes('Source note: /books/synthetic\nCard index: 1 of 12'));
});

test('Future Reading restores rows through search, sorting, empty matches and query reset', () => {
  const makeButton=()=>({listener:null,addEventListener(event,fn){if(event==='click')this.listener=fn;},click(){this.listener();}});
  const headers=['title','author'].map(column=>({dataset:{sort:column},attributes:{},button:makeButton(),classList:{toggle(){}},setAttribute(key,value){this.attributes[key]=value;},querySelector(){return this.button;}}));
  const rows=['Gamma','Alpha','Beta','Delta'].map((title,index)=>({dataset:{title,author:'Author '+index,class:'List '+index,status:'to read',search:title.toLowerCase()+' metrics'},hidden:false,children:[{}, {textContent:title},{textContent:'Author '+index},{textContent:'List '+index},{textContent:'To Read'}]}));
  const table={rows:[...rows],querySelectorAll(){return [...this.rows];},appendChild(row){this.rows=this.rows.filter(item=>item!==row);this.rows.push(row);},set innerHTML(value){if(value==='')this.rows=[];}};
  const filter={value:'',listener:null,addEventListener(event,fn){if(event==='input')this.listener=fn;}};
  const count={textContent:''};
  const document={readyState:'complete',getElementById(id){return {filterInput:filter,tableBody:table,filterCount:count}[id];},querySelectorAll(){return headers;}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'public/scripts/future-reading.js'),'utf8'),{document});
  const visible=()=>table.rows.filter(row=>!row.hidden);
  const search=value=>{filter.value=value;filter.listener();};
  search('gamma');assert.equal(visible().length,1);
  headers[1].button.click();search('');assert.equal(visible().length,4);
  search('missing');assert.equal(visible().length,0);
  search('beta');assert.equal(visible().length,1);
  search('');headers[0].button.click();
  assert.deepEqual(visible().map(row=>row.dataset.title),['Alpha','Beta','Delta','Gamma']);
  headers[0].button.click();assert.equal(headers[0].attributes['aria-sort'],'descending');
  assert.deepEqual(visible().map(row=>row.dataset.title),['Gamma','Delta','Beta','Alpha']);
  assert.equal(count.textContent,'4 of 4 books');
});


test('core thesis prose and supporting paragraphs outrank earlier open-question bullets', () => {
  const body='## Open Questions\n- How might a state build influence when the powerful actor ignores its diplomatic signals?\n- Which coalition tactic would work under different regional conditions and political alignments?\n## Author Main Issue / Thesis\n**Thesis:** Small states gain influence through relational conditions, policy divergence, issue salience, and preference cohesion.\n\nThe supporting argument explains why material weakness does not by itself determine influence: attention and coalition opportunities mediate outcomes.\n## Discussion Prompts\n- What evidence would challenge these proposed mechanisms across the selected country cases?\n';
  const ideas=extractNoteIdeas(body);
  assert.equal(ideas.length,2);
  assert(ideas[0].text.startsWith('Thesis: Small states gain influence'));
  assert(ideas[1].text.startsWith('The supporting argument explains'));
  assert(ideas.every(idea=>body.includes(idea.source)&&!idea.text.endsWith('?')));
  assert(ideas.every(idea=>idea.section==='Author Main Issue / Thesis'));
});

test('question prompts and excluded children cannot leak through a later chapter fallback', () => {
  const body='## Open Questions\n### First problem\n- Could this unanswered question masquerade as a useful chapter-level recall idea?\n## Chapter 1\nDiscussion question: How might an analyst apply this argument to an unrelated historical case?\n\n**Main idea:** Strategic outcomes depend on political aims and the means that actors can actually sustain.\n\n**Supporting idea:** Operational choices change as leaders learn from observable costs and adversary responses.\n';
  const ideas=extractNoteIdeas(body);
  assert.equal(ideas.length,2);
  assert(ideas[0].text.startsWith('Main idea:'));
  assert(ideas[1].text.startsWith('Supporting idea:'));
});
