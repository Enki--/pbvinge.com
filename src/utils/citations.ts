interface BookMetadata {
  title: string;
  subtitle?: string;
  author: string[];
  publisher?: string;
  publish?: string | Date;
  pages?: number;
  isbn10?: string;
  isbn13?: string;
}

// Helper function to get author names in correct format
function formatAuthors(authors: string[], format: 'bibtex' | 'apa' | 'mla'): string {
  switch (format) {
    case 'bibtex':
      return authors.join(' and ');
    case 'apa':
      if (authors.length === 1) return authors[0];
      if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
      return `${authors.slice(0, -1).join(', ')}, & ${authors[authors.length - 1]}`;
    case 'mla':
      if (authors.length === 1) return authors[0];
      if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
      if (authors.length === 3) return `${authors[0]}, ${authors[1]}, and ${authors[2]}`;
      return `${authors[0]} et al.`;
  }
}

// Helper function to get year from publish date
function getYear(publish?: string | Date): string {
  if (!publish) return '';
  return new Date(publish).getFullYear().toString();
}

// Generate BibTeX citation
export function generateBibTeX(book: BookMetadata): string {
  const year = getYear(book.publish);
  // Create citekey from first author's lastname, year, and first word of title
  const firstAuthor = book.author[0].split(' ').pop() || '';
  const firstWord = book.title.split(' ')[0].toLowerCase();
  const citekey = `${firstAuthor}${year}${firstWord}`;

  return `@book{${citekey},
  title = {${book.title}${book.subtitle ? `: ${book.subtitle}` : ''}},
  author = {${formatAuthors(book.author, 'bibtex')}},
  year = {${year}},
  ${book.publisher ? `publisher = {${book.publisher}},` : ''}
  ${book.isbn13 ? `isbn = {${book.isbn13}},` : ''}
  ${book.pages ? `pages = {${book.pages}}` : ''}
}`;
}

// Generate APA citation
export function generateAPA(book: BookMetadata): string {
  const year = getYear(book.publish);
  const authors = formatAuthors(book.author, 'apa');
  const title = book.subtitle 
    ? `${book.title}: ${book.subtitle}`
    : book.title;

  return `${authors}${year ? ` (${year})` : ''}. ${title}${book.publisher ? `. ${book.publisher}` : ''}.`;
}

// Generate MLA citation
export function generateMLA(book: BookMetadata): string {
  const authors = formatAuthors(book.author, 'mla');
  const title = book.subtitle 
    ? `${book.title}: ${book.subtitle}`
    : book.title;

  return `${authors}. ${title}${book.publisher ? `. ${book.publisher}` : ''}${book.publish ? `, ${getYear(book.publish)}` : ''}.`;
}

// Main function to get citation in requested format
export function getCitation(book: BookMetadata, format: 'bibtex' | 'apa' | 'mla'): string {
  switch (format) {
    case 'bibtex':
      return generateBibTeX(book);
    case 'apa':
      return generateAPA(book);
    case 'mla':
      return generateMLA(book);
    default:
      throw new Error(`Unsupported citation format: ${format}`);
  }
}
