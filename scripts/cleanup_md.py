#!/usr/bin/env python3
"""Preview a conservative Markdown cleanup; writes require an explicit review."""
import argparse
import difflib
import hashlib
import os
import re
import sys
import tempfile
from pathlib import Path


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def _protected(path):
    parts = Path(path).resolve().parts
    return any(parts[index:index + 2] == ("public", "archives")
               for index in range(len(parts) - 1))


def cleanup_markdown(text):
    """Pure transform. Refuse uncertain TOC boundaries instead of discarding text."""
    lines = text.splitlines(keepends=True)
    newline = "\r\n" if "\r\n" in text else "\n"
    toc_pattern = re.compile(r"^###\s+Table of Contents\s*$")
    preface_pattern = re.compile(r"^###\s+Preface\s*$")
    # Headings in frontmatter or code samples are never structural boundaries.
    active = []
    in_frontmatter = bool(lines and lines[0].strip() == "---")
    code_fence = None
    for index, line in enumerate(lines):
        eligible = not in_frontmatter and code_fence is None and not line.startswith(("    ", "\t"))
        active.append(eligible)
        if in_frontmatter:
            if index > 0 and line.strip() == "---":
                in_frontmatter = False
            continue
        fence = re.match(r"^ {0,3}(" + re.escape(chr(96)) + r"{3,}|~{3,})", line)
        if fence and code_fence is None:
            code_fence = fence.group(1)
            active[-1] = False
        elif code_fence and re.fullmatch(
                r" {0,3}" + re.escape(code_fence[0]) + "{" + str(len(code_fence)) + r",}\s*", line):
            code_fence = None
            active[-1] = False
    toc_indexes = [i for i, line in enumerate(lines)
                   if active[i] and toc_pattern.fullmatch(line.strip())]
    replacement = None
    if toc_indexes:
        if len(toc_indexes) != 1:
            raise ValueError("Ambiguous Table of Contents headings; edit manually.")
        start = toc_indexes[0]
        ends = [i for i in range(start + 1, len(lines))
                if active[i] and preface_pattern.fullmatch(lines[i].strip())]
        if len(ends) != 1:
            raise ValueError("A single Preface terminator is required; no cleanup performed.")
        end = ends[0]
        table_lines = [line.strip() for line in lines[start + 1:end] if line.strip()]
        if not table_lines or any(not line.startswith("|") for line in table_lines):
            raise ValueError("TOC contains non-table text; refusing to discard it.")
        if any("\\|" in line for line in table_lines):
            raise ValueError("TOC has escaped table delimiters; edit manually.")
        # Keep actual titles and links from the existing table; never invent chapters.
        titles = []
        for line in table_lines:
            cells = [cell.strip() for cell in line.strip("|").split("|")]
            if all(not cell or re.fullmatch(r":?-+:?", cell.replace(" ", "")) for cell in cells):
                continue
            first = next((cell for cell in cells if cell), "")
            if first.lower() in {"contents", "chapter", "title", "table of contents"}:
                continue
            if first:
                titles.append("- " + " — ".join(cell for cell in cells if cell) + newline)
        if not titles:
            raise ValueError("No TOC entries could be preserved; edit manually.")
        replacement = (start, end, ["## Table of Contents" + newline, newline] + titles + [newline])
    out = []
    i = 0
    while i < len(lines):
        if replacement and i == replacement[0]:
            out.extend(replacement[2])
            i = replacement[1]
            continue
        line = lines[i]
        if not active[i]:
            out.append(line)
            i += 1
            continue
        if re.fullmatch(r"\s*- - -\s*", line):
            line = "---" + (newline if line.endswith(("\n", "\r")) else "")
        elif re.match(r"^\s*\d+\\\.\s", line):
            line = re.sub(r"\\\.", ".", line, count=1)
        elif re.match(r"^\s*##\s+Chapter\s+[IVXLCDM]+: .*?\*\*\s*$", line):
            line = re.sub(r"\*\*(\r?\n)?$", lambda match: match.group(1) or "", line)
        out.append(line)
        i += 1
    return "".join(out)


def apply_reviewed(source, preview, expected_source, expected_preview):
    """Require reviewed hashes, preserve a backup, and replace atomically."""
    source, preview = Path(source), Path(preview)
    if _protected(source) or _protected(preview):
        raise ValueError("Captured archives cannot be processed by this helper.")
    if (source.is_symlink() or preview.is_symlink()
            or source.resolve() == preview.resolve() or source.samefile(preview)):
        raise ValueError("Source and preview must be distinct regular files.")
    original, candidate = source.read_bytes(), preview.read_bytes()
    if sha256(original) != expected_source or sha256(candidate) != expected_preview:
        raise ValueError("Source or preview changed since review; preview again.")
    if cleanup_markdown(original.decode("utf-8")).encode("utf-8") != candidate:
        raise ValueError("Preview does not match this source and transform.")
    if candidate == original:
        return None
    backup = source.with_name(source.name + "." + expected_source[:12] + ".bak")
    if backup.exists():
        if backup.is_symlink() or backup.read_bytes() != original:
            raise ValueError("Existing backup does not match the original.")
    else:
        with backup.open("xb") as handle:
            handle.write(original)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=source.parent, delete=False) as handle:
            temporary = Path(handle.name)
            os.fchmod(handle.fileno(), source.stat().st_mode & 0o777)
            handle.write(candidate)
            handle.flush()
            os.fsync(handle.fileno())
        if source.is_symlink() or source.read_bytes() != original:
            raise ValueError("Source changed during apply; original preserved.")
        os.replace(temporary, source)
        temporary = None
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
    return backup


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--preview", type=Path, help="Create a review file without changing the source.")
    parser.add_argument("--apply-reviewed", type=Path, help="Apply a reviewed preview with both expected hashes.")
    parser.add_argument("--source-sha256")
    parser.add_argument("--preview-sha256")
    args = parser.parse_args(argv)
    try:
        if args.preview and args.apply_reviewed:
            raise ValueError("Choose preview or apply, not both.")
        if _protected(args.source) or args.source.is_symlink():
            raise ValueError("Captured archives and symlinks cannot be processed.")
        if args.apply_reviewed:
            if not args.source_sha256 or not args.preview_sha256:
                raise ValueError("Apply requires the reviewed source and preview SHA-256 hashes.")
            backup = apply_reviewed(args.source, args.apply_reviewed,
                                    args.source_sha256, args.preview_sha256)
            print("NO_CHANGES" if backup is None else "APPLIED; original backup: " + str(backup))
            return 0
        original = args.source.read_bytes()
        text = original.decode("utf-8")
        transformed = cleanup_markdown(text)
        sys.stdout.writelines(difflib.unified_diff(
            text.splitlines(keepends=True), transformed.splitlines(keepends=True),
            fromfile=str(args.source), tofile="proposed cleanup",
        ))
        if args.preview:
            if _protected(args.preview) or args.preview.resolve() == args.source.resolve():
                raise ValueError("Preview must be a new file outside captured archives.")
            with args.preview.open("xb") as handle:
                handle.write(transformed.encode("utf-8"))
        print("Source SHA-256: " + sha256(original))
        print("Preview SHA-256: " + sha256(transformed.encode("utf-8")))
        print("Review the diff before applying; the source has not been changed.")
        return 0
    except (ValueError, OSError, UnicodeError) as error:
        print("No source replacement: " + str(error), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
