#!/usr/bin/env python3
import os
import re
import json
from pathlib import Path
from datetime import datetime

def create_safe_filename(title):
    """Create a safe filename from book title"""
    # Remove special characters and replace spaces with hyphens
    safe_title = re.sub(r'[^a-zA-Z0-9\s]', '', title)
    safe_title = re.sub(r'\s+', '-', safe_title)
    return safe_title.lower()

def add_book():
    """Interactive script to add a new book"""
    print("=== Add New Book ===\n")
    
    # Get book details
    title = input("Book title: ").strip()
    if not title:
        print("Title is required!")
        return
    
    author_input = input("Author(s) (comma-separated): ").strip()
    authors = [a.strip() for a in author_input.split(',') if a.strip()]
    
    class_name = input("Class (e.g., 600, 601, 690): ").strip()
    
    print("\nStatus options:")
    print("1. complete - Book is finished")
    print("2. reading - Currently reading")
    print("3. to read - Plan to read")
    
    status_choice = input("Status (1-3): ").strip()
    status_map = {
        '1': 'complete',
        '2': 'reading', 
        '3': 'to read'
    }
    status = status_map.get(status_choice, 'to read')
    
    cover_image = input("Cover image URL: ").strip()
    
    tags_input = input("Tags (comma-separated): ").strip()
    tags = [t.strip() for t in tags_input.split(',') if t.strip()]
    
    # Create filename
    safe_title = create_safe_filename(title)
    filename = f"{safe_title}.md"
    filepath = Path('src/content/books') / filename
    
    # Check if file already exists
    if filepath.exists():
        print(f"\nWarning: {filename} already exists!")
        overwrite = input("Overwrite? (y/N): ").strip().lower()
        if overwrite != 'y':
            print("Book not added.")
            return
    
    # Create frontmatter
    frontmatter_lines = [
        '---',
        f'title: "{title}"',
        f'author: {json.dumps(authors)}',
        f'status: "{status}"',
        f'cover: "{cover_image}"',
        f'tags: {json.dumps(tags)}',
        f'isPublished: true'
    ]
    
    if class_name:
        frontmatter_lines.append(f'class: "{class_name}"')
    
    if status == 'complete':
        frontmatter_lines.append(f'created: {datetime.now().strftime("%Y-%m-%d")}')
    
    frontmatter_lines.append('---')
    frontmatter_lines.append('')
    frontmatter_lines.append(f'# {title}')
    frontmatter_lines.append('')
    frontmatter_lines.append(f'**Author:** {", ".join(authors)}')
    if class_name:
        frontmatter_lines.append(f'**Class:** {class_name}')
    frontmatter_lines.append(f'**Status:** {status}')
    frontmatter_lines.append('')
    
    if status == 'complete':
        frontmatter_lines.append('Add your book review and notes here.')
    else:
        frontmatter_lines.append('This book is on my reading list.')
    
    # Write the file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(frontmatter_lines))
    
    print(f"\n✅ Book added successfully: {filename}")
    print(f"Location: {filepath}")
    print(f"\nNext steps:")
    print(f"1. Edit the file to add your review (if completed)")
    print(f"2. Update the cover image URL if needed")
    print(f"3. Add more tags if desired")

if __name__ == "__main__":
    add_book() 