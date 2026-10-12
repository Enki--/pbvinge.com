# Books system

All books use `src/content/books/`. On October 12, 2026, four legacy Future Reading
records moved into `books/future-reading/`, preserving their metadata and bodies.
The separate `futureReads` collection is retired.

- `/books`, the homepage and book detail routes include published `complete` notes.
- `/future-reading` includes published `reading`, `to read`, `tbr` and `tbd` entries.
- `isPublished: false` excludes a record from public lists, detail routes, comps
  note links and generated flashcards. Missing status does not publish a note.
- `/flashcards` generates two source excerpts per usable completed note, preferring
  thesis, overview and argument sections. It excludes discussion questions,
  descriptions, quotation banks and placeholders. The source link provides context.

The October 12 checkpoint contains 129 records: 120 completed notes and nine planned
books. Craft of Research had only a reading-list placeholder; its status is now
`to read`. Its other metadata and body were retained. The old manual flashcard JSON
is preserved as reference but is no longer the deck source.

## Add or update a book

Run `python3 add-book.py`, or create an individual Markdown file. The helper
requires an author and a useful Unicode filename, serializes metadata safely,
and confirms before replacing an unchanged existing file. It never runs as part
of a site build. Use `to read` until substantive study notes are ready.

```yaml
---
title: "Book title"
author: ["Given Family"]
status: "to read"
cover: "/assets/placeholder-book.png"
tags: ["📚Book"]
class: "600"
isPublished: true
publish: 2025  # A year, YYYY-MM, or ISO date; retain the recorded edition's precision
---
```

Change status to `complete` when adding the finished note. `created` and `updated`
are optional timestamps; publication dates are calendar values. Missing timestamps
have a stable sort fallback and produce no invented date label.

## Citations

The detail page exports APA 7, MLA 9 and BibTeX. Its preview and rich clipboard
format preserve title italics. Plain-text copy is also available automatically
when the browser does not support rich copy. BibTeX fields are escaped safely.

Names with ambiguous commas, compound surnames or organizational authors can use
explicit metadata. Editors and translators are separate from authors:

```yaml
citation:
  authors:
    - family: "Family"
      given: "Given Middle"
  editors:
    - family: "Editor"
      given: "Given"
  translators:
    - family: "Translator"
      given: "Given"
  edition: "2nd ed."
  apaTitle: "Book title: Subtitle with proper nouns preserved"
```

For an editor-only book, use `author: []` and `citation.editors`. A collective
contributor uses `literal: "Organization name"`. `citation.title` can override
promotional edition text in the display subtitle; `citation.originalYear` records
an original year separately from `publish`, which describes the cited edition.
Do not replace a recorded edition year with an original publication year.

The formatter does not prove which edition was read. Keep its year/ISBN tied to
the source's title and copyright pages. Specific verified corrections and the
limits of this checkpoint are recorded in `docs/STABILIZATION-2026-10-12.txt`.

## Maintenance and verification

`npm test` covers publication/date/citation safeguards, substantive flashcard
extraction, filter reset, chart data/UI behavior and tooling controls.
`npm run test:helpers` runs synthetic Python helper checks only. After a build,
`node scripts/verify-reading-build.mjs` compares completed notes with generated
card sources and planned-list membership. The legacy migration and transcription
commands remain inert; see `docs/retired-workflows/README.md`.
