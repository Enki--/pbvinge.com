fastwhisper CLI wrapper
=======================

This repository includes a small CLI wrapper around the `faster-whisper` library at `scripts/fastwhisper_cli.py`.

Install
-------

Use your Python environment and install faster-whisper:

```bash
python -m pip install faster-whisper
```

Usage
-----

Basic usage (defaults: model=turbo, device=cpu, language=en, format=txt):

```bash
python scripts/fastwhisper_cli.py input.mp3
```

Specify model, language, output file and format:

```bash
python scripts/fastwhisper_cli.py -m small -d cpu -l en -f srt -o out.srt input.mp3
```

If you pass a directory as input, the script will transcribe each file inside it.

Notes
-----

- This wrapper aims to provide a small, stable CLI surface. It calls `WhisperModel` from `faster_whisper`.
- Output formats supported: txt, srt, vtt, json.
