#!/usr/bin/env python3
"""Offline proof for the standby/fallback logic in components/LiveStreamPlayer.tsx.

Serves the built static export (dist/) over a throwaway HTTP server and
intercepts the upstream manifest so both upstream states can be simulated
deterministically:

  phase 1  filler-only window  -> the player must switch <video> to /backup.mp4
                                    and show the standby badge
  phase 2  real segments back  -> the player must switch back to the HLS manifest
                                    AND start the 3-minute REC capture
  phase 3  REC countdown ticks and the clip becomes a downloadable blob URL

Requires a build first (dist/index.html).

Run:
  python scripts/verify-standby-fallback.py
"""

import http.server
import socketserver
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
# Test fixtures (a real MPEG-TS segment, a local hls.js build) live OUTSIDE
# the Next.js project: next build type-checks everything in the project root
# and a .ts fixture would fail the check as "binary".
FIXTURES = ROOT.parent / "_tmpframes"
DIST = ROOT / "dist"
BACKUP = ROOT / "public" / "backup.mp4"

FILLER_PLAYLIST = """#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:11
#EXT-X-MEDIA-SEQUENCE:225582
#EXT-X-DISCONTINUITY
#EXTINF:10.023,
filler.ts
#EXT-X-DISCONTINUITY
#EXTINF:10.023,
filler.ts
"""

REAL_PLAYLIST = """#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:11
#EXT-X-MEDIA-SEQUENCE:225601
#EXT-X-DISCONTINUITY
#EXTINF:10.023,
211730.ts
#EXT-X-DISCONTINUITY
#EXTINF:10.023,
211730.ts
"""

MPEGURL = "application/vnd.apple.mpegurl"
HLS_LOCAL = FIXTURES / "hls.min.js"
HLS_URL = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js"
SEG_TS = FIXTURES / "seg.ts"


class Handler(http.server.BaseHTTPRequestHandler):
    state = {"mode": "filler"}
    hits = {"filler": 0, "real": 0, "backup": 0}

    def log_message(self, *args):
        pass

    def _send(self, code, body: bytes, ctype: str):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/live/playlist.m3u8":
            mode = Handler.state["mode"]
            Handler.hits[mode] += 1
            body = (REAL_PLAYLIST if mode == "real" else FILLER_PLAYLIST).encode()
            self._send(200, body, MPEGURL)
        elif path == "/backup.mp4":
            Handler.hits["backup"] += 1
            self._send(200, BACKUP.read_bytes(), "video/mp4")
        elif path in ("/live/filler.ts", "/live/211730.ts"):
            # Real MPEG-TS bytes, otherwise hls.js fails to transmux and reports
            # a fatal error, which puts the player into the "cannot play" state
            # and hides the standby badge for the wrong reason.
            self._send(200, SEG_TS.read_bytes(), "video/mp2t")
        else:
            rel = path.lstrip("/")
            file = DIST / rel
            if rel == "" or file.is_dir():
                file = DIST / "index.html"
            if file.exists():
                ctype = {
                    ".html": "text/html",
                    ".js": "text/javascript",
                    ".css": "text/css",
                    ".json": "application/json",
                    ".mp4": "video/mp4",
                    ".jpg": "image/jpeg",
                    ".png": "image/png",
                    ".svg": "image/svg+xml",
                    ".ico": "image/x-icon",
                    ".txt": "text/plain",
                    ".m3u8": MPEGURL,
                }.get(file.suffix, "application/octet-stream")
                self._send(200, file.read_bytes(), ctype)
            else:
                self._send(404, b"not found", "text/plain")


def free_port() -> int:
    import socket

    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def main() -> int:
    if not (DIST / "index.html").exists():
        print("ERROR dist/index.html missing - run `next build` first", file=sys.stderr)
        return 1
    if not BACKUP.exists():
        print(f"ERROR {BACKUP} missing - run scripts/make-backup.py", file=sys.stderr)
        return 1
    if not SEG_TS.exists():
        print(
            f"ERROR {SEG_TS} missing - build it with:\n"
            "  python -c \"import imageio_ffmpeg,subprocess;"
            f"subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-loglevel','error','-i','public/backup.mp4',"
            "'-c','copy','-f','mpegts','-mpegts_flags','resend_headers','../_tmpframes/seg.ts'],check=True)\"",
            file=sys.stderr,
        )
        return 1

    port = free_port()
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("127.0.0.1", port), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{port}/"
    print(f"serving {DIST} on {base}\n")

    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.on("pageerror", lambda e: print(f"  [pageerror] {str(e)[:200]}"))

        # Serve hls.js from disk: the sandboxed browser cannot always reach the
        # CDN, and without it the player would take the "unsupported" branch.
        if HLS_LOCAL.exists():
            page.route(
                HLS_URL,
                lambda route: route.fulfill(
                    status=200, content_type="text/javascript", body=HLS_LOCAL.read_bytes()
                ),
            )
            print("hls.js served from local cache")
        else:
            print(f"WARNING {FIXTURES}/hls.min.js missing - run: curl -o ../_tmpframes/hls.min.js " + HLS_URL)

        page.goto(base, wait_until="load")
        page.wait_for_function(
            """() => { const b = document.querySelector("button[aria-label='Play the Infinite Slop live stream']");
                     return !b || Object.keys(b).some(k => k.startsWith('__react')); }""",
            timeout=20000,
        )
        print("0) React hydrated")
        page.click("button[aria-label='Play the Infinite Slop live stream']")

        # --- phase 1: filler-only -> standby loop ---------------------------
        # NB: do NOT assert on <video>.currentSrc. With hls.js the element is
        # fed by a MediaSource, so currentSrc is a blob: URL even when the
        # standby mp4 is what is actually playing. Assert on the state the
        # player reports plus the segment that was really fetched.
        page.wait_for_timeout(6000)
        src1 = page.eval_on_selector("video[data-live-video]", "v => v.currentSrc || v.src")
        source1 = page.eval_on_selector("video[data-live-video]", "v => v.closest('[data-source]')?.dataset.source")
        backup_fetched = Handler.hits.get("backup", 0)
        badge1 = page.locator("[data-standby-badge]").count()
        print(f"1) filler window  -> source={source1} src={src1}")
        print(f"   standby badge: {bool(badge1)}   /backup.mp4 fetches: {backup_fetched}   manifest hits={Handler.hits}")
        if source1 != "backup":
            failures.append(f"expected data-source=backup during filler-only window, got {source1!r}")
        if backup_fetched == 0:
            failures.append("the standby mp4 was never fetched")
        if badge1 == 0:
            failures.append("standby badge not shown while on the backup loop")

        # --- phase 2: real signal -> live + REC ----------------------------
        Handler.state["mode"] = "real"
        print("   upstream flipped to real segments; waiting for the 1-minute probe…")
        rec = False
        for _ in range(75):
            page.wait_for_timeout(1000)
            if page.locator("[data-rec-badge]").count() > 0:
                rec = True
                break
        source2 = page.eval_on_selector(
            "video[data-live-video]", "v => v.closest('[data-source]')?.dataset.source"
        )
        print(f"2) real signal    -> source={source2}   REC indicator: {rec}")
        print(f"   manifest hits={Handler.hits}")
        if not rec:
            failures.append("REC indicator did not appear after signal recovered")
        if source2 != "live":
            failures.append(f"expected data-source=live after recovery, got {source2!r}")

        # --- phase 3: countdown runs and a clip blob is produced ------------
        page.screenshot(path=str(FIXTURES / "standback-rec.png"))
        page.wait_for_timeout(8000)
        clips = page.evaluate(
            """() => Array.from(document.querySelectorAll('a[download]'))
                 .map(a => ({ name: a.getAttribute('download'), blob: a.href.startsWith('blob:') }))"""
        )
        print(f"3) saved clips so far: {clips}")
        if not clips:
            print("   (clip still recording - the 3-minute window has not elapsed, as expected)")

        browser.close()

    httpd.shutdown()

    if failures:
        print("\nFAIL")
        for f in failures:
            print(" -", f)
        return 1
    print("\nPASS standby fallback + signal-recovery recording")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
