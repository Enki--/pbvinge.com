# Books System Documentation

## Overview

This system manages all books in a unified collection (`src/content/books/`) with status-based filtering:

- **Books page** (`/books`): Shows only completed books with full reviews
- **Future Reading page** (`/future-reading`): Shows all books (completed, reading, to-read)
- **Individual book pages**: Only generated for completed books

## Book Status Options

- `complete`: Book is finished, shows on books page and gets individual page
- `reading`: Currently reading, shows on future reading page only
- `to read`: Plan to read, shows on future reading page only

## Adding New Books

### Option 1: Interactive Script
```bash
python3 add-book.py
```

This will prompt you for:
- Book title
- Author(s)
- Class (optional)
- Status (complete/reading/to read)
- Cover image URL
- Tags

### Option 2: Manual Creation
Create a new `.md` file in `src/content/books/` with this template:

```yaml
---
title: "Book Title"
author: ["Author Name"]
status: "to read"  # or "reading" or "complete"
cover: "https://cover-image-url.com/image.jpg"
tags: ["tag1", "tag2"]
class: "600"  # optional
isPublished: true
created: 2024-01-01  # only for completed books
---
```

## File Structure

```
src/content/books/
├── book-title-1.md
├── book-title-2.md
└── ...
```

## Migration from Old System

The old system used a single `index.md` file with a large frontmatter array. To migrate:

1. Run the migration script:
   ```bash
   python3 migrate-unified-books.py
   ```

2. This will create individual `.md` files for each book in your future reads list

3. Update existing book files to have proper `status` fields

4. Delete the old `src/content/futureReads/index.md` file

## Benefits of New System

1. **Easier to add books**: Just create a new `.md` file
2. **Better organization**: All books in one place
3. **Status-based filtering**: Automatic separation of completed vs future reads
4. **Individual book pages**: Only for completed books
5. **Version control friendly**: Each book is a separate file
6. **Scalable**: No more unwieldy large frontmatter arrays

## Updating Book Status

To change a book's status (e.g., from "to read" to "complete"):

1. Edit the book's `.md` file
2. Change the `status` field in the frontmatter
3. If marking as complete, add a `created` date
4. Add your review content below the frontmatter

## Tags and Categories

- Use `tags` for general topics/themes
- Use `class` for academic course numbers
- Use `category` for broader classifications (optional)

## Cover Images

- Store cover images in `public/assets/` for local files
- Use external URLs for Google Books or other sources
- Recommended size: 200x300px or similar aspect ratio 