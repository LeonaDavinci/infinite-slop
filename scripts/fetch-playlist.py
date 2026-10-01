#!/usr/bin/env python3
"""Fetch the Infinite Slop live HLS playlist from infiniteslop.ai and save it
locally with segment URLs rewritten to absolute (so a static-hosted copy of the
playlist still points at the origin's segment files).

Writes to:
  - public/playlist.m3u8   (included in every `npm run build`)
  - dist/playlist.m3u8     (so the live preview can be refreshed without a rebuild)

Usage:
  python scripts/fetch-playlist.py
"""

import re
import sys
import urllib.request
from pathlib import Path

SRC = "https://infiniteslop.ai/live/playlist.m3u8"
BASE = "https://infiniteslop.ai/live/"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"
    ),
    "Cache-Control": "no-cache",
}

ROOT = Path(__file__).resolve().parent.parent


def fetch_playlist() -> str:
    req = urllib.request.Request(SRC, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", "ignore")


def rewrite_segments(text: str) -> str:
    """Convert every non-comment line (a segment URI) to an absolute URL."""
    out = []
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith("#"):
            out.append(line)
            continue
        if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", line):
            line = BASE + line.lstrip("/")
        out.append(line)
    return "\n".join(out) + "\n"


def main() -> int:
    try:
        text = rewrite_segments(fetch_playlist())
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR fetching {SRC}: {exc}", file=sys.stderr)
        return 1

    for dest in (ROOT / "public" / "playlist.m3u8", ROOT / "dist" / "playlist.m3u8"):
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(text, encoding="utf-8")
        print(f"wrote {dest} ({len(text)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
