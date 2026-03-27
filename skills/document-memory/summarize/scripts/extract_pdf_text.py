#!/usr/bin/env python3
"""Extract plain text from a PDF using pypdf."""

from __future__ import annotations

import io
import sys
from pathlib import Path

from pypdf import PdfReader


def extract_text(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    parts = []
    for page in reader.pages:
        page_text = page.extract_text() or ""
        page_text = page_text.strip()
        if page_text:
            parts.append(page_text)
    return "\n\n".join(parts).strip()


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: extract_pdf_text.py <pdf_path>", file=sys.stderr)
        return 2

    pdf_path = Path(sys.argv[1]).expanduser().resolve()
    if not pdf_path.exists():
        print(f"PDF file not found: {pdf_path}", file=sys.stderr)
        return 1

    try:
        text = extract_text(pdf_path)
    except Exception as exc:  # pragma: no cover - surface raw extraction failures
        print(f"PDF extraction failed: {exc}", file=sys.stderr)
        return 1

    if not text:
        print(
            "PDF extraction returned empty text. The PDF may be image-based or missing a readable text layer.",
            file=sys.stderr,
        )
        return 1

    buffer = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", write_through=True)
    buffer.write(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
