# pbvinge.com

Personal website built with Astro and Tailwind CSS, hosted on Cloudflare Pages.

## Tasks Left to Complete
- [ ] Add all future books I'm going to read (currently on my list)
- [ ] Automate adding a book in obsidian, to automatically adding it to pbvinge.com
- [ ] Add all the book reports I have made so far
- [ ] Automate deploy new book reports to pbvinge.com
- [ ] Update obsidian template to meet deployment requirements (frontmatter)
- [ ] Combined Obsidian Book Templates into one .md file
- [ ] Make sure PDF highling app works and is automate to export to obsidian

## Design Principles

1. **Content First**: All content is managed through Markdown files, making it easily editable and compatible with Obsidian for knowledge management.
2. **Academic Integration**: Built-in citation system supporting multiple formats (BibTeX, APA, MLA) for academic reference.
3. **Minimal & Clean**: Using Tailwind CSS for a clean, responsive design that puts content readability first.

## Content Structure

The site uses Astro's Content Collections to manage structured content:

- `src/content/books/` - Individual book notes with detailed metadata and citations
- `src/content/futureReads/` - Reading list managed through a single Markdown file
- `src/content/documents/` - Historic documents (primary sources) with minimal metadata

### Book Note Format

Book notes use frontmatter for metadata:

```yaml
---
tags: ["📚Book"]
title: "Book Title"
subtitle: "Book Subtitle"  # Optional
author:
  - "Author Name"
category:
  - "Category"  # Optional
publisher: "Publisher Name"  # Optional
publish: YYYY-MM-DD  # Optional, date format
pages: 123  # Optional
isbn10: "1234567890"  # Optional
isbn13: "1234567890123"  # Optional
cover: "URL to cover image"
status: "to read" | "reading" | "complete"  # Optional
created: YYYY-MM-DD HH:MM:SS  # Optional
updated: YYYY-MM-DD HH:MM:SS  # Optional
class: "Class/Category"  # Optional
sequence: "Sequence Info"  # Optional
---
```

### Future Reading List

Future reading list is managed in `src/content/futureReads/index.md` with the following structure:

```yaml
---
books:
  - title: "Book Title"
    author: "Author Name"
    class: "Category"
    dateCompleted: "TBR"
    coverImage: "path/to/cover.jpg"
    tags: ["Tag1", "Tag2"]
---
```

### Historic Documents

Historic documents live in `src/content/documents/` as individual Markdown files. The URL path is derived from the filename, e.g. `battle-of-britain.md` becomes `/historic-documents/battle-of-britain`.

Frontmatter example:

```yaml
---
title: "Document Title"          # Required
subtitle: "Optional subtitle"    # Optional
authors:                          # Optional array
  - "Author or Organization"
origin: "Country/Organization"    # Optional
date: 1943-06-15                  # Optional (YYYY-MM-DD)
tags: ["Historic", "Airpower"]    # Optional
cover: "/assets/documents/cover.png"  # Optional (under /public)
externalUrl: "https://source.example/doc.pdf" # Optional
isPublished: true                 # Defaults to true
---

Markdown body content here...
```

Routes:
- List page: `/historic-documents`
- Detail page: `/historic-documents/<slug>` (slug from filename)

## Project Structure

```
pbvinge.com/
├── src/
│   ├── content/          # Content collections (books, future reads)
│   ├── data/            # Data management and utilities
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route components
│   └── utils/           # Utility functions (citations, etc)
└── public/
    └── assets/          # Images and static files
```

## Features

- 📚 Book Notes with:
  - Cover art display
  - Star ratings
  - Tag system
  - Full text search
  - Citation export (BibTeX/APA/MLA)
- 📖 Future Reading List with:
  - Sortable table view
  - Search functionality
  - Category organization
- 🔍 Content search across all sections
- 📱 Responsive design

## Development

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Content Management

- Book notes go in `src/content/books/` as individual .md files
- Future reading list is managed in `src/content/futureReads/index.md`
- All content supports Obsidian-compatible Markdown formatting

## Deployment

The site is automatically deployed to Cloudflare Pages on push to the main branch.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
