type CitationFormat = 'bibtex' | 'apa' | 'mla';

interface BookData {
  title: string;
  authors: string[];
  year: number;
  publisher?: string;
  isbn?: string;
  citekey?: string;
}

export function generateBibtex(book: BookData): string {
  const citekey = book.citekey || `${book.authors[0].split(' ').pop()?.toLowerCase()}${book.year}${book.title.split(' ')[0].toLowerCase()}`;
  const authors = book.authors.map(author => {
    const parts = author.split(' ');
    const lastName = parts.pop();
    return `${lastName}, ${parts.join(' ')}`;
  }).join(' and ');

  return `@book{${citekey},
  title = {${book.title}},
  author = {${authors}},
  year = {${book.year}}${book.publisher ? `,
  publisher = {${book.publisher}}` : ''}${book.isbn ? `,
  isbn = {${book.isbn}}` : ''}
}`;
}

export function generateAPA(book: BookData): string {
  const authors = book.authors.map(author => {
    const parts = author.split(' ');
    const lastName = parts.pop();
    const initials = parts.map(name => `${name[0]}.`).join(' ');
    return `${lastName}, ${initials}`;
  }).join(', ');

  return `${authors} (${book.year}). ${book.title}${book.publisher ? `. ${book.publisher}` : ''}.`;
}

export function generateMLA(book: BookData): string {
  const mainAuthor = book.authors[0];
  const authorParts = mainAuthor.split(' ');
  const lastName = authorParts.pop();
  const firstName = authorParts.join(' ');

  let citation = `${lastName}, ${firstName}`;
  
  if (book.authors.length > 1) {
    citation += ', et al';
  }

  citation += `. ${book.title}${book.publisher ? `, ${book.publisher}` : ''}, ${book.year}.`;
  return citation;
}

export function generateCitation(book: BookData, format: CitationFormat): string {
  switch (format) {
    case 'bibtex':
      return generateBibtex(book);
    case 'apa':
      return generateAPA(book);
    case 'mla':
      return generateMLA(book);
    default:
      throw new Error('Unsupported citation format');
  }
}