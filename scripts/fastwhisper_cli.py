#!/usr/bin/env python3
"""Command-line wrapper around the `faster-whisper` transcription library.

Usage examples:
  python scripts/fastwhisper_cli.py --model small --device cpu input.mp3
  python scripts/fastwhisper_cli.py -m medium -l en --output out.txt input.mp3

This script exposes a small set of options: model, device, language, output path
and output format (txt, srt, vtt, json). It uses the `faster_whisper` package.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import List, Optional

from typing import Any, TYPE_CHECKING

if TYPE_CHECKING:
    # For type checking only - import the real class when tools analyze types
    from faster_whisper import WhisperModel  # type: ignore
else:
    # At runtime, avoid importing faster_whisper during module import so code
    # (and tests) can run without the dependency installed.
    WhisperModel = Any
    print("Warning: faster_whisper not installed. Transcription will fail at runtime unless installed.", file=sys.stderr)


def write_plain_text(segments: List[dict], out_path: Path) -> None:
    with out_path.open("w", encoding="utf-8") as f:
        for seg in segments:
            f.write(seg["text"].lstrip() + "\n")


def write_json(segments: List[dict], out_path: Path) -> None:
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(segments, f, ensure_ascii=False, indent=2)


def format_timestamp(seconds: float) -> str:
    # formats seconds into HH:MM:SS.mmm
    ms = int(round(seconds * 1000))
    s, ms = divmod(ms, 1000)
    h, s = divmod(s, 3600)
    m, s = divmod(s, 60)
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


def write_srt(segments: List[dict], out_path: Path) -> None:
    with out_path.open("w", encoding="utf-8") as f:
        for i, seg in enumerate(segments, start=1):
            start = format_timestamp(seg["start"])
            end = format_timestamp(seg["end"])
            text = seg["text"].strip()
            f.write(f"{i}\n{start} --> {end}\n{text}\n\n")


def write_vtt(segments: List[dict], out_path: Path) -> None:
    with out_path.open("w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n")
        for seg in segments:
            start = format_timestamp(seg["start"]).replace('.', ',')
            end = format_timestamp(seg["end"]).replace('.', ',')
            text = seg["text"].strip()
            f.write(f"{start} --> {end}\n{text}\n\n")


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Transcribe audio using faster-whisper")
    p.add_argument("input", help="input audio file or directory")
    p.add_argument("-m", "--model", default="turbo", help="model name or size (e.g. turbo, tiny, base, small, medium, large)")
    p.add_argument("-d", "--device", default="cpu", help="device: cpu, cuda, auto")
    p.add_argument("-l", "--language", default="en", help="force language (e.g. en)")
    p.add_argument("-o", "--output", default=None, help="output file path (defaults to input.ext.txt)")
    p.add_argument("-f", "--format", default="txt", choices=("txt", "srt", "vtt", "json"), help="output format")
    p.add_argument("--beam-size", type=int, default=5, help="beam size for transcription (if supported)")
    return p.parse_args(argv)


def collect_segments(result) -> List[dict]:
    segments = []
    # result is expected to be an Iterable of segments from faster_whisper
    for segment in result:
        segments.append({
            "start": float(segment.start),
            "end": float(segment.end),
            "text": str(segment.text),
        })
    return segments


def transcribe_file(model: WhisperModel, path: Path, args: argparse.Namespace) -> List[dict]:
    segments: List[dict] = []
    # faster-whisper's transcribe returns an iterator of segments
    transcribe_kwargs = {}
    if args.language:
        transcribe_kwargs["language"] = args.language
    # some versions accept beam_size or beam_size param; use common name
    if args.beam_size:
        transcribe_kwargs["beam_size"] = args.beam_size

    result = model.transcribe(str(path), **transcribe_kwargs)
    # depending on faster-whisper version, transcribe might return (segments, info) or segments iterable
    if isinstance(result, tuple) and len(result) == 2:
        segments_iter, _ = result
    else:
        segments_iter = result

    segments = collect_segments(segments_iter)
    return segments


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)
    inp = Path(args.input)
    if not inp.exists():
        print(f"Input not found: {inp}", file=sys.stderr)
        return 2

    model = WhisperModel(args.model, device=args.device)

    if inp.is_dir():
        files = sorted([p for p in inp.iterdir() if p.is_file()])
    else:
        files = [inp]

    for path in files:
        out_path = None
        if args.output:
            out_path = Path(args.output)
            # if output is a directory, write per-file
            if out_path.is_dir():
                out_file = out_path / (path.name + "." + args.format)
            else:
                out_file = out_path
        else:
            out_file = path.with_suffix(path.suffix + "." + args.format)

        print(f"Transcribing {path} -> {out_file} using model={args.model} device={args.device}")
        segments = transcribe_file(model, path, args)

        if args.format == "txt":
            write_plain_text(segments, out_file)
        elif args.format == "json":
            write_json(segments, out_file)
        elif args.format == "srt":
            write_srt(segments, out_file)
        elif args.format == "vtt":
            write_vtt(segments, out_file)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
