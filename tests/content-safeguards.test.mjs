import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const require = createRequire(import.meta.url);
const modulePath = name => path.join(process.env.PBV_TEST_BUILD_DIR, 'utils', name + '.js');
const dates = require(modulePath('dates'));
const books = require(modulePath('books'));
const { serializeJsonForHtml } = require(modulePath('htmlData'));
const citations = require(modulePath('citations'));

test('only published complete notes enter public note routes and generated study data', () => {
  assert.equal(books.isPublishedBookNote({ status: 'COMPLETE', isPublished: true }), true);
  for (const data of [{ status: 'complete', isPublished: false }, {}, { status: 'reading' }, { status: 'to read' }]) {
    assert.equal(books.isPublishedBookNote(data), false);
  }
  assert.equal(books.isPublishedPlannedBook({ status: 'reading' }), true);
  assert.equal(books.isPublishedPlannedBook({ status: 'to read', isPublished: false }), false);
});

test('missing timestamps have a stable order and unavailable dates are omitted', () => {
  const input = [{ slug: 'z', data: {} }, { slug: 'a', data: {} }, { slug: 'new', data: { created: new Date('2026-10-12') } }];
  assert.deepEqual(input.sort(books.compareBookRecency).map(book => book.slug), ['new', 'a', 'z']);
  assert.equal(dates.formatCalendarDate(), '');
  assert.equal(dates.timestampValue('invalid'), 0);
});

test('publication precision is retained and impossible calendar dates are rejected', () => {
  assert.equal(dates.normalizePublicationDate(1875), '1875');
  assert.equal(dates.formatCalendarDate(1875), '1875');
  assert.equal(dates.formatCalendarDate('1947-01'), 'January 1947');
  assert.equal(dates.formatCalendarDate('1947-01-01'), 'January 1, 1947');
  for (const invalid of [0, 10000, 1875.4, NaN, '2025-02-31', '2025-13', 'invalid', new Date(NaN)]) {
    assert.equal(dates.normalizePublicationDate(invalid), undefined);
  }
});

test('date-only years and labels stay identical in Chicago and Tokyo', () => {
  const code = `const d=require(${JSON.stringify(modulePath('dates'))});process.stdout.write(JSON.stringify([d.publicationYear(new Date('1947-01-01')),d.formatCalendarDate('1947-01-01'),d.formatCalendarDate(1875)]));`;
  for (const TZ of ['America/Chicago', 'Asia/Tokyo']) {
    const result = spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env: { ...process.env, TZ } });
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), ['1947', 'January 1, 1947', '1875']);
  }
});

test('mixed-case closing scripts in metadata remain inert JSON and round trip exactly', () => {
  const metadata = { title: '</ScRiPt><img src=x onerror="alert(1)">', line: 'a\nb\\c', unicode: '李明' };
  const encoded = serializeJsonForHtml(metadata);
  assert.equal(encoded.includes('<'), false);
  assert.deepEqual(JSON.parse(encoded), metadata);
  assert.throws(() => serializeJsonForHtml(undefined), TypeError);
});

const example = {
  title: 'Example Book', author: ['Jane Ann Smith', 'John Doe'], publisher: 'Example Press', publish: 2025,
  citation: { apaTitle: 'Example book', edition: '2nd ed.' },
};

test('APA7 initials, MLA9 inversion and edition are formatted independently', () => {
  assert.equal(citations.generateAPA(example), 'Smith, J. A., & Doe, J. (2025). Example book (2nd ed.). Example Press.');
  assert.equal(citations.generateMLA(example), 'Smith, Jane Ann, and John Doe. Example Book. 2nd ed., Example Press, 2025.');
  assert.equal(citations.citationParts(example, 'apa').find(part => part.italic).text, 'Example book');
  assert.equal(citations.generateMLA({ ...example, author: ['Jane Smith', 'John Doe', 'Alex Brown'] }).startsWith('Smith, Jane, et al.'), true);
});

test('edited and translated books preserve contributor roles and the recorded edition year', () => {
  const edited = { title: 'Example Handbook', author: [], publish: '2024-01-01', publisher: 'Press', citation: {
    apaTitle: 'Example handbook', editors: [{ family: 'Brown', given: 'Alex' }, { family: 'Jones', given: 'Sam' }],
  } };
  assert.equal(citations.generateAPA(edited), 'Brown, A., & Jones, S. (Eds.). (2024). Example handbook. Press.');
  assert.equal(citations.generateMLA(edited), 'Brown, Alex, and Sam Jones, editors. Example Handbook. Press, 2024.');
  assert.match(citations.generateBibTeX(edited), /editor = \{Brown, Alex and Jones, Sam\}/);
  assert.doesNotMatch(citations.generateBibTeX(edited), /author =/);
  const translated = { ...example, author: ['Thucydides'], citation: { translators: [{ family: 'Smith', given: 'Jane' }], originalYear: 1900 } };
  assert.match(citations.generateAPA(translated), /\(2025\).*\(J\. Smith, Trans\.\).*Original work published 1900/);
  assert.match(citations.generateMLA(translated), /Translated by Jane Smith/);
});

test('compound, hyphenated, initial and group names are retained', () => {
  const apa = author => citations.generateAPA({ title: 'On War', author, publish: 1875 });
  assert.equal(apa(['Carl von Clausewitz']), 'von Clausewitz, C. (1875). On war.');
  assert.match(apa(['S.G. Gorshkov']), /^Gorshkov, S\. G\./);
  assert.match(apa(['Lien-Hang T. Nguyen']), /^Nguyen, L\.-H\. T\./);
  assert.match(apa(['West Space Seminar']), /^West Space Seminar/);
  assert.match(citations.generateBibTeX({ ...example, author: ['Walter C. Ladwig III'] }), /author = \{Ladwig, III, Walter C\.\}/);
});

test('empty authors and absent dates produce usable references rather than crashes', () => {
  const anonymous = { title: 'Untitled Study', author: [] };
  assert.equal(citations.generateAPA(anonymous), 'Untitled Study. (n.d.).');
  assert.equal(citations.generateMLA(anonymous), 'Untitled Study.');
  assert.match(citations.generateBibTeX(anonymous), /^@book\{anonymousuntitled,/);
  assert.doesNotMatch(citations.generateBibTeX(anonymous), /author =|year =|pages =/);
});

test('BibTeX escapes delimiters and keeps a safe deterministic citekey', () => {
  const bib = citations.generateBibTeX({ title: 'A {Book} & 100% \\ data', author: ['Míla Jakšić'], publisher: 'A_#Press', publish: 2024 });
  assert.match(bib, /^@book\{jaksic2024a,/);
  assert.ok(bib.includes('title = {A \\{Book\\} \\& 100\\% \\textbackslash{} data}'));
  assert.ok(bib.includes('publisher = {A\\_\\#Press}'));
  assert.ok(!bib.includes(',,') && !bib.includes('undefined'));
});

test('question and exclamation title punctuation is retained without duplicate periods', () => {
  const book = { title: 'Why War?', author: ['Richard Overy'], publish: 2024 };
  assert.equal(citations.generateAPA(book), 'Overy, R. (2024). Why war?');
  assert.equal(citations.generateMLA(book), 'Overy, Richard. Why War? 2024.');
  assert.equal(citations.generateAPA({ ...book, author: [] }), 'Why war? (2024).');
  assert.match(citations.generateAPA({ ...book, citation: { edition: '2nd ed.' } }), /Why war\? \(2nd ed\.\)\.$/);
  assert.equal(citations.generateMLA({ title: 'Look!', author: [] }), 'Look!');
  assert.match(citations.generateBibTeX(example), /edition = \{Second\}/);
});

test('anonymous book edition stays with its title before the APA date', () => {
  assert.equal(citations.generateAPA({ title: 'Untitled Study', author: [], publish: 2025, publisher: 'Press', citation: {edition:'2nd ed.'} }),
    'Untitled Study (2nd ed.). (2025). Press.');
});
