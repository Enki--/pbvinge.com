interface Book {
  title: string;
  author: string;
  rating: number;
  coverImage: string;
  summary: string;
  tags: string[];
}

export function renderStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export const books: Book[] = [
  {
    title: "Example Book 1",
    author: "Author Name",
    rating: 4,
    coverImage: "https://placehold.co/200x300",
    summary: "A placeholder summary for this book. Replace with your actual notes from Obsidian.",
    tags: ["Business", "Psychology"]
  },
  {
    title: "Example Book 2",
    author: "Another Author",
    rating: 5,
    coverImage: "https://placehold.co/200x300",
    summary: "Another placeholder summary. Your book reports from Obsidian will go here.",
    tags: ["Philosophy", "Personal Growth"]
  }
];