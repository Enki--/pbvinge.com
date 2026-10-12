# pbvinge.com

Personal website built with Astro and Tailwind CSS, hosted on Cloudflare Pages.

## Historical project checklist

These entries record earlier work. The current Obsidian publisher and production
cutover have not been verified on this Mac; see `docs/MAC-SETUP-STATUS.txt`.

- [x] Add all future books I'm going to read (currently on my list)
- [x] Automate adding a book in obsidian, to automatically adding it to pbvinge.com
- [x] Add all the book reports I have made so far
- [x] Automate deploy new book reports to pbvinge.com
- [x] Update obsidian template to meet deployment requirements (frontmatter)
- [x] Combined Obsidian Book Templates into one .md file
- [x] Make sure PDF highling app works and is automate to export to obsidian

## Design Principles

1. **Content First**: All content is managed through Markdown files, making it easily editable and compatible with Obsidian for knowledge management.
2. **Academic Integration**: Built-in citation system supporting multiple formats (BibTeX, APA, MLA) for academic reference.
3. **Minimal & Clean**: Using Tailwind CSS for a clean, responsive design that puts content readability first.

## Content Structure

The site uses Astro's Content Collections to manage structured content:

- `src/content/books/` - Individual book notes with detailed metadata and citations
- Planned reading uses the same `src/content/books/` collection, filtered by status
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
publish: 2025  # Optional year, YYYY-MM, or ISO date for the cited edition
pages: 123  # Optional
isbn10: "1234567890"  # Optional
isbn13: "1234567890123"  # Optional
cover: "URL to cover image"
status: "to read" | "reading" | "complete" | "tbr" | "tbd"  # Optional
isPublished: true  # Optional, defaults to true
dateCompleted: "TBR"  # Optional
coverImage: "URL to cover image"  # Optional (fallback)
created: YYYY-MM-DD HH:MM:SS  # Optional
updated: YYYY-MM-DD HH:MM:SS  # Optional
class: "Class/Category"  # Optional
sequence: "Sequence Info"  # Optional
---
```

### Future Reading List

Future Reading reads published `reading`, `to read`, `tbr` and `tbd` records from
the unified `books` collection through `src/data/future-reads.ts`. Completed notes
are listed on Books. Generated flashcards use substantive excerpts from those
published notes. See [BOOKS_SYSTEM.md](BOOKS_SYSTEM.md) for metadata and citations.

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
  - Tag system
  - Metadata search
  - Citation export (BibTeX/APA/MLA)
- 📖 Future Reading List with:
  - Sortable table view
  - Search functionality
  - Category organization
- 📱 Responsive design

## Development

Local development is available on the Mac mini at
`/Users/shrinkbot/Documents/ChatGPT/pbvinge.com`. See
[`docs/MAC-DEVELOPMENT.txt`](docs/MAC-DEVELOPMENT.txt) for the verified runtime,
installation commands, and restart procedure, and
[`docs/MAC-SETUP-STATUS.txt`](docs/MAC-SETUP-STATUS.txt) for acceptance results.
The npm lockfile and dependency choices are local migration-branch work pending
comparison with the existing Cloudflare Pages configuration.

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   npm ci --ignore-scripts --no-audit --no-fund
   ```

3. Start development server:
   ```bash
   ASTRO_TELEMETRY_DISABLED=1 npm run dev -- --host 127.0.0.1
   ```

## Content Management

- Book notes go in `src/content/books/` as individual .md files
- Planned and completed reading both live in `src/content/books/`, filtered by status and publication flag
- All content supports Obsidian-compatible Markdown formatting

Audio transcription and the old book-list migration were retired on October 12,
2026. Their original code is preserved in
[`docs/retired-workflows/`](docs/retired-workflows/README.md). Their former commands
stop with a retirement message; Python transcription dependencies are no longer
part of setup.

## Styling Conventions

Reusable utility classes live in `src/layouts/Layout.astro` and `src/css/tables.css`.

Shared text + tag classes:
- `pbv-text-strong` for strong text color
- `pbv-text-subtle` for muted text color
- `pbv-tag` for tag/chip styling

Table styles:
- Wrap tables with `.pbv-table-wrapper`
- Use `.pbv-table` on the table element
- Use `.pbv-table-cover` for cover thumbnails
- Use `.pbv-sort-icon` for sortable header icons

## Deployment

The site is automatically deployed to Cloudflare Pages on push to the main branch.

## License

Original website application code, styles, and supporting build/configuration/
maintenance code are licensed under the [MIT License](LICENSE), within the scope
stated in that file. Study notes, quotations, bibliographies and other content
data, scans, images, and third-party archives are excluded from this grant.
Third-party code and media retain their own licenses or public-domain status.

The [About page](https://pbvinge.com/about) describes the academic-use approach
and provides a contact for corrections and takedown requests.
