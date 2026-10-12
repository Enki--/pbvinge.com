"""Synthetic regression cases for maintained helpers; no models or real content."""
import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
from datetime import date

ROOT = Path(__file__).resolve().parents[1]


def load_module(name, filename):
    spec = importlib.util.spec_from_file_location(name, filename)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


book = load_module("book_helper_test", ROOT / "add-book.py")
cleanup = load_module("cleanup_helper_test", ROOT / "scripts/cleanup_md.py")


class HelperTests(unittest.TestCase):
    def temporary(self):
        # Agent checks can keep all fixtures in their assigned scratch directory.
        return tempfile.TemporaryDirectory(dir=os.environ.get("PBV_HELPER_TEST_TMP"))

    def test_all_metadata_strings_round_trip_without_extra_yaml_fields(self):
        values = {
            "title": 'The "Quoted" Title\\path',
            "authors": ['姓, 名', 'Quoted "Author"'],
            "cover_image": 'https://example.test/"cover"?q=\\x',
            "tags": ['a: b', 'line\nbreak', 'quote"'],
            "class_name": '600"\nforged: true',
            "status": "complete",
            "created": date(2026, 10, 12),
        }
        result = book.build_book_content(**values)
        block = result.split("---", 2)[1].strip().splitlines()
        parsed = {key: json.loads(value) for key, value in
                  (line.split(": ", 1) for line in block)}
        self.assertEqual(set(parsed), {"title", "author", "status", "cover", "tags",
                                      "class", "isPublished", "created"})
        self.assertEqual(parsed["title"], values["title"])
        self.assertEqual(parsed["author"], values["authors"])
        self.assertEqual(parsed["cover"], values["cover_image"])
        self.assertEqual(parsed["class"], values["class_name"])
        self.assertEqual(parsed["tags"], values["tags"])
        self.assertEqual(parsed["created"], "2026-10-12")

    def test_unicode_filename_and_empty_stem(self):
        self.assertEqual(book.create_safe_filename("战争与和平"), "战争与和平")
        self.assertEqual(book.create_safe_filename("../Quoted / Title"), "quoted-title")
        for title in ("!!!", "😀", "   ", ".../"):
            with self.assertRaises(ValueError):
                book.create_safe_filename(title)

    def test_missing_authors_and_invalid_status_fail_before_writes(self):
        with self.temporary() as temporary:
            folder = Path(temporary) / "books"
            for author, status in (("", "1"), ("Author", "9")):
                answers = iter(["A Book", author, "", status, "", ""])
                self.assertEqual(book.add_book(
                    book_dir=folder, input_fn=lambda _: next(answers),
                    output_fn=lambda _: None,
                ), 1)
                self.assertFalse(folder.exists())

    def test_overwrite_requires_confirmation_and_unchanged_bytes(self):
        with self.temporary() as temporary:
            path = Path(temporary) / "a-book.md"
            path.write_text("original", encoding="utf-8")
            answers = iter(["A Book", "Author", "", "2", "", "", "n"])
            self.assertEqual(book.add_book(
                book_dir=path.parent, input_fn=lambda _: next(answers),
                output_fn=lambda _: None,
            ), 1)
            self.assertEqual(path.read_text(), "original")
            with self.assertRaises(FileExistsError):
                book.save_book(path, "new")
            with self.assertRaises(ValueError):
                book.save_book(path, "new", expected_existing=b"stale")
            self.assertEqual(path.read_text(), "original")
            book.save_book(path, "new", expected_existing=b"original")
            self.assertEqual(path.read_text(), "new")

    def test_cleanup_import_has_no_file_io(self):
        with patch.object(Path, "read_text", side_effect=AssertionError("read")), \
                patch.object(Path, "write_text", side_effect=AssertionError("write")):
            load_module("cleanup_import_test", ROOT / "scripts/cleanup_md.py")

    def test_cleanup_preserves_frontmatter_fenced_code_and_final_newline(self):
        tick = chr(96) * 3
        source = ('---\ntitle: "Sample"\n---\n' + tick + '\n'
                  '### Table of Contents\n- - -\n1\\. Example\n' + tick +
                  '\n    - - -\n- - -\n1\\. Actual')
        result = cleanup.cleanup_markdown(source)
        self.assertIn(tick + '\n### Table of Contents\n- - -\n1\\. Example\n' + tick, result)
        self.assertIn("\n    - - -\n", result)
        self.assertTrue(result.endswith("\n---\n1. Actual"))
        self.assertEqual(cleanup.cleanup_markdown(result), result)

    def test_missing_or_ambiguous_toc_terminator_does_not_discard_tail(self):
        for source in (
            "### Table of Contents\n| Preface | 1 |\nVALUABLE TAIL",
            "### Table of Contents\n| Preface | 1 |\n### Preface\nA\n### Preface\nB",
            "### Table of Contents\nNOT TABLE\n### Preface\nVALUABLE TAIL",
        ):
            with self.assertRaises(ValueError):
                cleanup.cleanup_markdown(source)

    def test_toc_entries_links_page_values_and_document_tail_survive(self):
        source = ("### Table of Contents\n| Title | Page |\n| --- | --- |\n"
                  "| [Preface](#preface) | iii |\n| Chapter I | 12 |\n"
                  "### Preface\nVALUABLE TAIL\n")
        result = cleanup.cleanup_markdown(source)
        self.assertIn("- [Preface](#preface) — iii\n", result)
        self.assertIn("- Chapter I — 12\n", result)
        self.assertTrue(result.endswith("### Preface\nVALUABLE TAIL\n"))

    def test_default_preview_no_source_write_then_hash_guard_and_backup(self):
        with self.temporary() as temporary:
            source, preview = Path(temporary) / "source.md", Path(temporary) / "preview.md"
            source.write_bytes(b"BODY\n- - -\n")
            original = source.read_bytes()
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(cleanup.main([str(source)]), 0)
                self.assertEqual(cleanup.main([str(source), "--preview", str(preview)]), 0)
            self.assertEqual(source.read_bytes(), original)
            with self.assertRaises(ValueError):
                cleanup.apply_reviewed(source, preview, "wrong", cleanup.sha256(preview.read_bytes()))
            self.assertEqual(source.read_bytes(), original)
            backup = cleanup.apply_reviewed(source, preview, cleanup.sha256(original),
                                           cleanup.sha256(preview.read_bytes()))
            self.assertEqual(backup.read_bytes(), original)
            self.assertEqual(source.read_bytes(), b"BODY\n---\n")

    def test_changed_preview_and_archive_paths_refused(self):
        with self.temporary() as temporary:
            source, preview = Path(temporary) / "source.md", Path(temporary) / "preview.md"
            source.write_bytes(b"- - -\n")
            preview.write_bytes(b"forged content")
            with self.assertRaises(ValueError):
                cleanup.apply_reviewed(source, preview, cleanup.sha256(source.read_bytes()),
                                       cleanup.sha256(preview.read_bytes()))
            self.assertEqual(source.read_bytes(), b"- - -\n")
            preview.unlink()
            os.link(source, preview)
            with self.assertRaisesRegex(ValueError, "distinct regular files"):
                cleanup.apply_reviewed(source, preview, cleanup.sha256(source.read_bytes()),
                                       cleanup.sha256(preview.read_bytes()))
            protected = Path(temporary) / "public/archives/91st/never-opened.md"
            with self.assertRaises(ValueError):
                cleanup.apply_reviewed(protected, preview, "", "")
            self.assertFalse(protected.parent.exists())


if __name__ == "__main__":
    unittest.main()
