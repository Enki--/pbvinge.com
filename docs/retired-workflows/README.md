# Retired Python workflows

Audio transcription and historical book migration were retired by the user's
decision on October 12, 2026.

The former entry points, `scripts/fastwhisper_cli.py` and
`migrate-unified-books.py`, now stop with a retirement message. They load no model
or migration dependencies and perform no input or output processing.

The original implementations, transcription instructions and four timestamp tests
are preserved byte-for-byte as `.txt` files in [2026-10-12](2026-10-12/).
[The manifest](2026-10-12/manifest.json) records their original paths, sizes and
SHA-256 hashes. These files are historical reference, outside normal Python test
discovery. Their known defects remain documented in
[the original code review](../CODE-REVIEW-2026-10-12.txt).

Book content is maintained as individual Markdown notes in `src/content/books/`,
using Obsidian or a text editor. Existing future-reading entries remain in
`src/content/futureReads/` until the approved consolidation into book notes is
implemented during stabilization. The former single-index migration is obsolete.
This project no longer provides an audio-transcription workflow.

The existing `add-book.py` interactive helper and `scripts/cleanup_md.py` document
maintenance helper are separate from the retired workflows. Their outstanding
review findings remain in the code review.

No Python model dependencies, virtual environment or replacement service is
needed for this retirement. The two tracked Python bytecode caches were removed,
and future Python caches are ignored. The website still uses its existing npm
development and build commands.

Verification on October 12, 2026: all four archived originals match their recorded
hashes and Git's original source bytes. Five smoke calls to the retired entry
points exit with a clear message and leave their input/output fixtures unchanged.
The site builds 150 pages. All 2,487 protected archive files and the original Mac
handoff retain their bytes. Local validation is recorded in
`.local/retired-workflows/validation.json` and `.local/retired-workflows-build.log`.
