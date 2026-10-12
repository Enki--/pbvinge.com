import os
import sys
import unittest

# Ensure the repository root is importable so `scripts` can be imported when
# running tests directly from the tests/ directory.
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from scripts.fastwhisper_cli import format_timestamp


class TestFormatTimestamp(unittest.TestCase):
    def test_zero(self):
        self.assertEqual(format_timestamp(0), "00:00:00.000")

    def test_seconds(self):
        self.assertEqual(format_timestamp(1.234), "00:00:01.234")

    def test_minutes(self):
        self.assertEqual(format_timestamp(61.5), "00:01:01.500")

    def test_hours(self):
        self.assertEqual(format_timestamp(3661.789), "01:01:01.789")


if __name__ == "__main__":
    unittest.main()
