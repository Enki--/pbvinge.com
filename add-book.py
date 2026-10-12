#!/usr/bin/env python3
"""Create one book note interactively; no transcription or migration packages."""
import json
import os
import re
import tempfile
import unicodedata
from datetime import date
from pathlib import Path


def create_safe_filename(title):
    """Keep Unicode letters/numbers and reject titles without a useful stem."""
    normalized = unicodedata.normalize("NFKC", title).strip().lower()
    stem = re.sub(r"[\W_]+", "-", normalized, flags=re.UNICODE).strip("-")
    if not stem:
        raise ValueError("Title must contain a letter or number for the filename.")
    return stem


def build_book_content(*, title, authors, status, cover_image, tags=(),
                       class_name="", created=None):
    """Serialize all string metadata as JSON-compatible YAML scalars."""
    title = title.strip()
    if not title:
        raise ValueError("Title is required.")
    create_safe_filename(title)
    authors = [author.strip() for author in authors if author.strip()]
    if not authors:
        raise ValueError("At least one author is required.")
    if status not in {"complete", "reading", "to read"}:
        raise ValueError("Choose complete, reading, or to read.")
    data = {
        "title": title,
        "author": authors,
        "status": status,
        "cover": cover_image.strip(),
        "tags": [tag.strip() for tag in tags if tag.strip()],
        "isPublished": True,
    }
    if class_name.strip():
        data["class"] = class_name.strip()
    if status == "complete":
        data["created"] = (created or date.today()).isoformat()
    frontmatter = ["---"]
    frontmatter.extend(
        key + ": " + json.dumps(value, ensure_ascii=True)
        for key, value in data.items()
    )
    frontmatter.extend(["---", "", "# " + title, "",
                        "**Author:** " + ", ".join(authors)])
    if class_name.strip():
        frontmatter.append("**Class:** " + class_name.strip())
    frontmatter.extend(["**Status:** " + status, "",
                        "Add your book review and notes here." if status == "complete"
                        else "This book is on my reading list.", ""])
    return "\n".join(frontmatter)


def save_book(path, content, *, expected_existing=None):
    """Create exclusively, or replace only the exact bytes reviewed by the user."""
    path = Path(path)
    if path.is_symlink():
        raise ValueError("Refusing to replace a symlink.")
    path.parent.mkdir(parents=True, exist_ok=True)
    encoded = content.encode("utf-8")
    if expected_existing is None:
        with path.open("xb") as handle:
            handle.write(encoded)
        return
    if path.read_bytes() != expected_existing:
        raise ValueError("Book changed after overwrite confirmation; review it again.")
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as handle:
            temporary = Path(handle.name)
            os.fchmod(handle.fileno(), path.stat().st_mode & 0o777)
            handle.write(encoded)
            handle.flush()
            os.fsync(handle.fileno())
        if path.is_symlink() or path.read_bytes() != expected_existing:
            raise ValueError("Book changed after overwrite confirmation; review it again.")
        os.replace(temporary, path)
        temporary = None
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def add_book(*, book_dir=None, input_fn=input, output_fn=print):
    """Collect/validate metadata before creating any file or directory."""
    output_fn("=== Add New Book ===")
    try:
        title = input_fn("Book title: ").strip()
        authors = input_fn("Author(s) (comma-separated): ").split(",")
        class_name = input_fn("Class (e.g., 600, 601, 690): ").strip()
        output_fn("1. complete  2. reading  3. to read")
        choice = input_fn("Status (1-3): ").strip()
        status = {"1": "complete", "2": "reading", "3": "to read"}.get(choice)
        cover = input_fn("Cover image URL: ").strip()
        tags = input_fn("Tags (comma-separated): ").split(",")
        content = build_book_content(
            title=title, authors=authors, status=status, cover_image=cover,
            tags=tags, class_name=class_name,
        )
        folder = Path(book_dir) if book_dir is not None else Path(__file__).resolve().parent / "src/content/books"
        path = folder / (create_safe_filename(title) + ".md")
        expected = None
        if path.exists():
            if path.is_symlink():
                raise ValueError("Refusing to replace a symlink.")
            expected = path.read_bytes()
            if input_fn("Overwrite existing " + path.name + "? (y/N): ").strip().lower() != "y":
                output_fn("Book not added.")
                return 1
        save_book(path, content, expected_existing=expected)
        output_fn("Book added: " + str(path))
        return 0
    except (ValueError, OSError, EOFError) as error:
        output_fn("Book not added: " + str(error))
        return 1


if __name__ == "__main__":
    raise SystemExit(add_book())
