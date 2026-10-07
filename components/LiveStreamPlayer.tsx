"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MANIFEST_URL = "/live/playlist.m3u8";
const ARCHIVE_URL = "/archive/playlist.m3u8";
const HLS_CDN = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";
const POSTER = "/video.jpg";
const BACKUP_URL = "/backup.mp4";

/** How often we re-check whether the upstream window still has real segments. */
const SIGNAL_CHECK_MS = 60_000;
/** How long we keep recording once real signal comes back. */
const RECORD_MS = 180_000;

type HlsErrorData = { fatal?: boolean };
type HlsInstance = {
  destroy: () => void;
  loadSource: (url: string) => void;
  attachMedia: (video: HTMLVideoElement) => void;
  on: (event: string, cb: (event: string, data: HlsErrorData) => void) => void;
};
type HlsStatic = {
  new (config?: Record<string, unknown>): HlsInstance;
  isSupported: () => boolean;
  Events: { ERROR: string };
};

type Source = "idle" | "live" | "archive" | "backup";
type Recorder = {
  start: (timeslice?: number) => void;
  stop: () => void;
  state: "recording" | "inactive";
  ondataavailable: ((ev: { data: Blob }) => void) | null;
  onstop: (() => void) | null;
};

/**
 * Read the segment URIs out of an HLS playlist.
 */
function parseSegments(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

/**
 * Decide whether the upstream *live* playlist still carries real programme.
 * `filler.ts` is the origin's "signal lost / retuning" slate — a live window
 * made up entirely of filler means nothing new is being broadcast right now.
 */
async function hasRealSignal(signal: AbortSignal): Promise<boolean> {
  const res = await fetch(`${MANIFEST_URL}?probe=${Date.now()}`, {
    cache: "no-store",
    signal,
  });
  if (!res.ok) return false;
  const segments = parseSegments(await res.text());
  if (segments.length === 0) return false;
  return segments.some((seg) => !/^filler\.m?ts$/i.test(seg.split("/").pop() ?? ""));
}

/**
 * The origin keeps the last ~150 AI-generated clips (about 37 minutes) as a
 * VOD playlist — that is the "swipe back through recent programmes" feed on
 * infiniteslop.ai. When the live window is all filler we replay those instead
 * of a flat placeholder, so the page always shows real generated content.
 */
async function hasArchive(signal: AbortSignal): Promise<boolean> {
  const res = await fetch(`${ARCHIVE_URL}?probe=${Date.now()}`, {
    cache: "no-store",
    signal,
  });
  if (!res.ok) return false;
  const text = await res.text();
  if (!text.includes("#EXTM3U")) return false;
  return parseSegments(text).length > 0;
}

export default function LiveStreamPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<HlsInstance | null>(null);
  const recorderRef = useRef<Recorder | null>(null);
  const recordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);
  const sourceRef = useRef<Source>("idle");

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [source, setSource] = useState<Source>("idle");
  const [lostAt, setLostAt] = useState<number | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordLeft, setRecordLeft] = useState(0);
  const [clips, setClips] = useState<{ name: string; url: string; size: number }[]>([]);

  // Cosmetic 3 · 2 · 1 · 0 placeholder while the first segments download,
  // so the overlay never looks frozen. Counts down exactly once and then
  // rests at 0 — it never loops back to 3.
  useEffect(() => {
    if (!started || failed || playing) return;
    setCountdown(3);
    const id = setInterval(() => setCountdown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(id);
  }, [started, failed, playing]);

  // ---- recording -----------------------------------------------------------
  const stopRecording = useCallback(() => {
    if (recordTimerRef.current) {
      clearTimeout(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    const rec = recorderRef.current;
    recorderRef.current = null;
    if (rec && rec.state === "recording") {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    }
    setRecording(false);
    setRecordLeft(0);
  }, []);

  // Captures the <video> element through a canvas and keeps the last clip as an
  // object URL so the visitor can download it. Only runs while real signal is on.
  const startRecording = useCallback(() => {
    const video = videoRef.current;
    if (!video || recorderRef.current) return;
    if (typeof MediaRecorder === "undefined") return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx || typeof canvas.captureStream !== "function") return;

    let stream: MediaStream;
    try {
      stream = canvas.captureStream(30);
    } catch {
      return;
    }

    const mime = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"].find(
      (m) => MediaRecorder.isTypeSupported(m),
    );
    let rec: Recorder;
    try {
      rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 4_000_000 } : undefined) as Recorder;
    } catch {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }

    const chunks: Blob[] = [];
    rec.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) chunks.push(ev.data);
    };
    rec.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      if (chunks.length === 0) return;
      const type = chunks[0].type || "video/webm";
      const blob = new Blob(chunks, { type });
      const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const url = URL.createObjectURL(blob);
      const ext = type.includes("mp4") ? "mp4" : "webm";
      const name = `infinite-slop-${stamp}.${ext}`;
      setClips((prev) => [{ name, url, size: blob.size }, ...prev].slice(0, 3));
    };

    const pump = () => {
      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      rafRef.current = requestAnimationFrame(pump);
    };
    pump();

    rec.start(1000);
    recorderRef.current = rec;
    setRecording(true);
    setRecordLeft(Math.round(RECORD_MS / 1000));

    const startedAt = Date.now();
    const tick = setInterval(() => {
      const left = RECORD_MS - (Date.now() - startedAt);
      setRecordLeft(Math.max(0, Math.round(left / 1000)));
    }, 1000);
    recordTimerRef.current = setTimeout(() => {
      clearInterval(tick);
      stopRecording();
    }, RECORD_MS);
  }, [stopRecording]);


  // ---- source switching ----------------------------------------------------
  const teardownHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  // Detach whatever the element is currently playing. hls.js attaches a
  // MediaSource to `src`; setting `src` back to a plain URL is not enough while
  // that attachment is live, and `load()` throws InvalidStateError. Detach the
  // MediaSource first, then clear the attribute, then reset.
  const detachMedia = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.pause();
    } catch {
      /* nothing loaded yet */
    }
    if (video.srcObject) {
      try {
        video.srcObject = null;
      } catch {
        /* Safari can refuse while a MediaSource is still open */
      }
    }
    video.removeAttribute("src");
    try {
      video.load();
    } catch {
      /* ignore InvalidStateError, the next src assignment re-runs load() */
    }
  }, []);

  const attachLive = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    teardownHls();
    // Coming back from the standby loop: drop the mp4 source so MSE can take over.
    video.loop = false;
    detachMedia();
    setFailed(false);

    const Hls = (window as unknown as { Hls?: HlsStatic }).Hls;
    if (Hls && Hls.isSupported()) {
      // Chrome / Edge / Firefox via hls.js (MSE)
      const instance = new Hls({
        lowLatencyMode: true,
        manifestLoadingMaxRetry: 4,
        manifestLoadingRetryDelay: 2000,
      });
      instance.on(Hls.Events.ERROR, (_event, data) => {
        // Ignore errors from an instance we already tore down: switching to the
        // standby loop destroys hls and it can emit one last fatal error, which
        // must not flip the player into the "cannot play" state.
        if (hlsRef.current !== instance) return;
        if (data?.fatal) setFailed(true);
      });
      instance.loadSource(MANIFEST_URL);
      instance.attachMedia(video);
      hlsRef.current = instance;
      video.play().catch(() => {});
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari / iOS: native HLS
      video.src = MANIFEST_URL;
      video.play().catch(() => {});
    } else {
      setFailed(true);
    }
  }, [teardownHls, detachMedia]);

  const attachBackup = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    teardownHls();
    detachMedia();
    video.loop = true;
    // hls.js writes its MediaSource blob URL onto `src` and clears it
    // asynchronously while tearing down, which would clobber an assignment made
    // in the same tick. Re-assert the standby source on the next tick.
    window.setTimeout(() => {
      const el = videoRef.current;
      if (!el || sourceRef.current !== "backup") return;
      el.src = BACKUP_URL;
      el.play().catch(() => {});
    }, 0);
  }, [teardownHls, detachMedia]);

  // Replay the origin's recent-clips feed. It is a VOD playlist, so it simply
  // ends (or we stop) — nothing to top up.
  const attachArchive = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    teardownHls();
    detachMedia();
    setFailed(false);

    const Hls = (window as unknown as { Hls?: HlsStatic }).Hls;
    if (Hls && Hls.isSupported()) {
      const instance = new Hls({ lowLatencyMode: false });
      instance.on(Hls.Events.ERROR, (_event, data) => {
        if (hlsRef.current !== instance) return;
        // The archive feed is stale-able; if it dies, drop to the standby clip.
        if (data?.fatal) {
          setSource("backup");
          sourceRef.current = "backup";
          attachBackup();
        }
      });
      instance.loadSource(ARCHIVE_URL);
      instance.attachMedia(video);
      hlsRef.current = instance;
      video.play().catch(() => {});
      // VOD playlist: replay it when the viewer reaches the end.
      video.onended = () => {
        if (sourceRef.current !== "archive") return;
        instance.loadSource(ARCHIVE_URL);
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.loop = true;
      video.src = ARCHIVE_URL;
      video.play().catch(() => {});
    } else {
      setFailed(true);
    }
  }, [teardownHls, detachMedia, attachBackup]);

  const useSource = useCallback(
    (next: Source) => {
      if (sourceRef.current === next) return;
      sourceRef.current = next;
      setSource(next);
      if (next === "backup") {
        stopRecording();
        setFailed(false);
        attachBackup();
      } else if (next === "archive") {
        stopRecording();
        setFailed(false);
        attachArchive();
      } else {
        attachLive();
      }
    },
    [attachBackup, attachArchive, attachLive, stopRecording],
  );

  // ---- boot: click to play, then start the health probe ---------------------
  useEffect(() => {
    if (!started) return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    const loadHls = () => {
      if (cancelled) return;
      const Hls = (window as unknown as { Hls?: HlsStatic }).Hls;
      if (Hls) {
        attachLive();
      } else {
        const script = document.createElement("script");
        script.src = HLS_CDN;
        script.async = true;
        script.onload = () => {
          if (!cancelled) attachLive();
        };
        script.onerror = () => setFailed(true);
        document.head.appendChild(script);
      }
    };

    sourceRef.current = "live";
    setSource("live");
    loadHls();

    const onPlaying = () => setPlaying(true);
    const onWaiting = () => setPlaying(false);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("waiting", onWaiting);

    return () => {
      cancelled = true;
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onWaiting);
      stopRecording();
      teardownHls();
    };
  }, [started, attachLive, teardownHls, stopRecording]);

  // ---- once a minute: is the upstream still airing real programme? ---------
  useEffect(() => {
    if (!started) return;
    const controller = new AbortController();
    let stopped = false;

    const check = async () => {
      if (stopped) return;
      let alive = false;
      try {
        alive = await hasRealSignal(controller.signal);
      } catch {
        alive = false;
      }
      if (stopped) return;

      if (alive) {
        setLostAt(null);
        const wasDown = sourceRef.current === "backup" || sourceRef.current === "archive";
        useSource("live");
        // Signal came back: grab three minutes of it before it can drop again.
        if (wasDown && !recorderRef.current) startRecording();
        return;
      }

      // Live window is all filler. Prefer replaying what the origin already
      // generated in the last ~37 minutes over a placeholder clip.
      let archived = false;
      if (sourceRef.current !== "archive") {
        try {
          archived = await hasArchive(controller.signal);
        } catch {
          archived = false;
        }
      }
      if (stopped) return;

      setLostAt(Date.now());
      useSource(archived ? "archive" : "backup");
    };

    check();
    const id = setInterval(check, SIGNAL_CHECK_MS);
    return () => {
      stopped = true;
      controller.abort();
      clearInterval(id);
    };
  }, [started, useSource, startRecording]);

  // Release saved clip URLs on unmount.
  const clipsRef = useRef(clips);
  clipsRef.current = clips;
  useEffect(() => {
    return () => {
      clipsRef.current.forEach((c) => URL.revokeObjectURL(c.url));
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) video.play().catch(() => {});
  };

  const showArchiveBadge = started && source === "archive" && !failed;
  const showStandbyBadge = started && source === "backup" && !failed;

  return (
    <div
      data-source={source}
      data-recording={recording ? "true" : "false"}
      className="relative overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl shadow-[#C5156B]/10"
    >
      <video
        ref={videoRef}
        data-live-video=""
        poster={POSTER}
        muted
        playsInline
        controls={started}
        preload="none"
        aria-label="Infinite Slop live video"
        aria-describedby="infiniteslop-live-player"
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        className="aspect-video w-full"
      />

      {/* Click-to-play overlay: nothing loads until the visitor presses play */}
      {!started && !failed ? (
        <button
          type="button"
          onClick={() => setStarted(true)}
          aria-label="Play the Infinite Slop live stream"
          className="group absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/40 backdrop-blur-[2px] transition hover:bg-zinc-900/55"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#8E2DE2] to-[#C5156B] shadow-xl shadow-[#C5156B]/40 transition group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="ml-1 h-9 w-9 fill-white"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white">
            <span className="h-2 w-2 animate-ping rounded-full bg-[#C5156B]"></span>
            LIVE — click to play
          </span>
        </button>
      ) : null}

      {started && !failed && !playing && source === "live" ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-white">
          <p className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 animate-ping rounded-full bg-[#C5156B]"></span>
            Connecting to the live stream…
          </p>
          <p
            key={countdown}
            className="mt-3 text-4xl font-semibold tabular-nums text-white/90"
          >
            {countdown}
          </p>
          <p className="mt-1 text-xs text-white/50">Hang tight…</p>
        </div>
      ) : null}

      {/* Standby / archive / recording status strip */}
      {started && !failed && (showStandbyBadge || showArchiveBadge || recording) ? (
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
          {showArchiveBadge ? (
            <span
              data-archive-badge=""
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900/85 px-3.5 py-1.5 text-xs font-semibold text-sky-300 backdrop-blur"
            >
              <span className="h-2 w-2 animate-ping rounded-full bg-sky-400"></span>
              Live signal lost — replaying recent episodes
              {lostAt ? (
                <span className="font-normal text-sky-200/70">
                  since {new Date(lostAt).toLocaleTimeString()}
                </span>
              ) : null}
            </span>
          ) : null}
          {showStandbyBadge ? (
            <span
              data-standby-badge=""
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900/85 px-3.5 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur"
            >
              <span className="h-2 w-2 animate-ping rounded-full bg-amber-400"></span>
              Upstream signal lost — playing the standby loop
              {lostAt ? (
                <span className="font-normal text-amber-200/70">
                  since {new Date(lostAt).toLocaleTimeString()}
                </span>
              ) : null}
            </span>
          ) : null}
          {recording ? (
            <span
              data-rec-badge=""
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900/85 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur"
            >
              <span className="h-2 w-2 animate-ping rounded-full bg-[#C5156B]"></span>
              REC — capturing {Math.floor(recordLeft / 60)}:
              {String(recordLeft % 60).padStart(2, "0")}
            </span>
          ) : null}
        </div>
      ) : null}

      {started && !failed ? (
        <button
          type="button"
          onClick={toggleSound}
          className="absolute bottom-4 right-4 rounded-full bg-zinc-900/80 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-zinc-900"
        >
          {muted ? "Unmute" : "Mute"}
        </button>
      ) : null}

      {/* Clips captured after signal recovered */}
      {clips.length > 0 ? (
        <div className="absolute bottom-14 left-4 right-16 flex flex-col gap-1.5">
          {clips.map((clip) => (
            <a
              key={clip.url}
              href={clip.url}
              download={clip.name}
              className="pointer-events-auto w-fit rounded-full bg-zinc-900/85 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-[#C5156B]"
            >
              ↓ Save clip ({Math.max(1, Math.round(clip.size / 1024))} KB)
            </a>
          ))}
        </div>
      ) : null}

      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-center text-white">
          <p className="px-6 text-lg font-medium">
            Your browser cannot play this live stream.
          </p>
          <a
            href="https://infiniteslop.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 rounded-full bg-gradient-to-r from-[#8E2DE2] to-[#C5156B] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Watch on official website
          </a>
        </div>
      ) : null}
    </div>
  );
}
