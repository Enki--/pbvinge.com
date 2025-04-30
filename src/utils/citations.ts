type CitationFormat = 'bibtex' | 'apa' | 'mla';

interface BookData {
  title: string;
  author: string[];  // Changed from authors to author to match your format
  publish?: string;  // Changed from year to publish
  publisher?: string;
  isbn10?: string;
  isbn13?: string;
}

export function generateBibtex(book: BookData): string {
  const year = book.publish ? new Date(book.publish).getFullYear() : new Date().getFullYear();
  const citekey = `${book.author[0].split(' ').pop()?.toLowerCase()}${year}${book.title.split(' ')[0].toLowerCase()}`;
  const authors = book.author.map(author => {
    const parts = author.split(' ');
    const lastName = parts.pop();
    return `${lastName}, ${parts.join(' ')}`;
  }).join(' and ');

  return `@book{${citekey},
  title = {${book.title}},
  author = {${authors}},
  year = {${year}}${book.publisher ? `,
  publisher = {${book.publisher}}` : ''}${book.isbn13 ? `,
  isbn = {${book.isbn13}}` : book.isbn10 ? `,
  isbn = {${book.isbn10}}` : ''}
}`;
}

export function generateAPA(book: BookData): string {
  const year = book.publish ? new Date(book.publish).getFullYear() : new Date().getFullYear();
  const authors = book.author.map(author => {
    const parts = author.split(' ');
    const lastName = parts.pop();
    const initials = parts.map(name => `${name[0]}.`).join(' ');
    return `${lastName}, ${initials}`;
  }).join(', ');

  return `${authors} (${year}). ${book.title}${book.publisher ? `. ${book.publisher}` : ''}.`;
}

export function generateMLA(book: BookData): string {
  const year = book.publish ? new Date(book.publish).getFullYear() : new Date().getFullYear();
  const mainAuthor = book.author[0];
  const authorParts = mainAuthor.split(' ');
  const lastName = authorParts.pop();
  const firstName = authorParts.join(' ');

  let citation = `${lastName}, ${firstName}`;
  
  if (book.author.length > 1) {
    citation += ', et al';
  }

  citation += `. ${book.title}${book.publisher ? `, ${book.publisher}` : ''}, ${year}.`;
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