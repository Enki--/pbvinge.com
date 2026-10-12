#!/usr/bin/env python3
import os
import re
import json
import yaml
from pathlib import Path

def parse_frontmatter(content):
    """Extract frontmatter from markdown content"""
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        raise ValueError("Could not find frontmatter in index.md")
    return match.group(1)

def parse_books_array(frontmatter):
    """Parse the books array from frontmatter using YAML"""
    try:
        # Parse the YAML frontmatter
        data = yaml.safe_load(frontmatter)
        if 'books' in data:
            return data['books']
        else:
            raise ValueError("No 'books' key found in frontmatter")
    except yaml.YAMLError as e:
        print(f"Error parsing YAML: {e}")
        return []

def create_safe_filename(title):
    """Create a safe filename from book title"""
    # Remove special characters and replace spaces with hyphens
    safe_title = re.sub(r'[^a-zA-Z0-9\s]', '', title)
    safe_title = re.sub(r'\s+', '-', safe_title)
    return safe_title.lower()

def convert_status(date_completed):
    """Convert dateCompleted to status"""
    if date_completed.lower() in ['complete', 'completed']:
        return 'complete'
    elif date_completed.lower() in ['tbr', 'to be read']:
        return 'to read'
    elif date_completed.lower() in ['tbd', 'to be determined']:
        return 'to read'
    else:
        return 'to read'

def main():
    # Read the current index.md file
    index_path = Path('src/content/futureReads/index.md')
    if not index_path.exists():
        print(f"Error: {index_path} not found")
        return
    
    with open(index_path, 'r', encoding='utf-8') as f:
        index_content = f.read()
    
    try:
        # Parse the frontmatter
        frontmatter = parse_frontmatter(index_content)
        
        # Parse the books array
        books = parse_books_array(frontmatter)
        
        print(f"Found {len(books)} books to migrate")
        
        # Create individual files for each book in the books directory
        books_dir = Path('src/content/books')
        books_dir.mkdir(exist_ok=True)
        
        for book in books:
            # Create a safe filename
            safe_title = create_safe_filename(book['title'])
            filename = f"{safe_title}.md"
            filepath = books_dir / filename
            
            # Skip if file already exists (don't overwrite existing book reviews)
            if filepath.exists():
                print(f"Skipping existing file: {filename}")
                continue
            
            # Determine status
            status = convert_status(book.get('dateCompleted', 'TBR'))
            
            # Create the frontmatter
            frontmatter_lines = [
                '---',
                f'title: "{book["title"]}"',
                f'author: {json.dumps(book["author"])}',
                f'class: "{book["class"]}"',
                f'status: "{status}"',
                f'cover: "{book["coverImage"]}"',
                f'tags: {json.dumps(book.get("tags", []))}',
                f'isPublished: true'
            ]
            
            if book.get('slug'):
                frontmatter_lines.append(f'slug: "{book["slug"]}"')
            
            # Add created date for completed books
            if status == 'complete':
                frontmatter_lines.append('created: 2024-01-01')  # Default date, can be updated later
            
            frontmatter_lines.append('---')
            frontmatter_lines.append('')
            frontmatter_lines.append(f'# {book["title"]}')
            frontmatter_lines.append('')
            frontmatter_lines.append(f'**Author:** {", ".join(book["author"])}')
            frontmatter_lines.append(f'**Class:** {book["class"]}')
            frontmatter_lines.append(f'**Status:** {status}')
            frontmatter_lines.append('')
            
            if status == 'complete' and book.get('slug'):
                frontmatter_lines.append(f'This book has been completed and has a full review available at [/books/{book["slug"]}](/books/{book["slug"]}).')
            else:
                frontmatter_lines.append('This book is on my reading list.')
            
            # Write the file
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write('\n'.join(frontmatter_lines))
            
            print(f"Created: {filename} (status: {status})")
        
        print(f"\nMigration complete! Created {len(books)} individual book files.")
        print("You can now delete the old index.md file and add new books as individual .md files.")
        print("\nNext steps:")
        print("1. Update existing book files to have proper status fields")
        print("2. Update the books.astro page to only show completed books")
        print("3. Update the future-reading.astro page to show all books")
        
    except Exception as e:
        print(f"Error during migration: {e}")

if __name__ == "__main__":
    main() 