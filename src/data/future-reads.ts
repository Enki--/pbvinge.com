interface Book {
  title: string;
  author: string;
  class: string;
  dateCompleted: string;
  coverImage: string;
}

export const futureReads: Book[] = [
  {
    title: "How to Read a Book",
    author: "Motimer J. Adler",
    class: "SAASS Prep",
    dateCompleted: "4/1/2024",
    coverImage: "http://books.google.com/books/content?id=Z5PpkQadm5EC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
  },
  {
    title: "Example Book 2",
    author: "Another Author",
    class: "Philosophy",
    dateCompleted: "TBR",
    coverImage: "https://placehold.co/120x180"
  }
];