"use client";

import { useEffect, useRef, useState } from "react";

const MANIFEST_URL = "/live/playlist.m3u8";
const HLS_CDN = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";
const POSTER = "/video.jpg";

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

export default function LiveStreamPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);

  // Only start loading the stream after the visitor clicks play.
  useEffect(() => {
    if (!started) return;
    const video = videoRef.current;
    if (!video) return;

    let hls: HlsInstance | null = null;
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;

    const scheduleRetry = () => {
      if (cancelled) return;
      if (attempts >= 5) {
        setFailed(true);
        return;
      }
      attempts += 1;
      retryTimer = setTimeout(() => {
        if (cancelled) return;
        setFailed(false);
        if (hls) {
          hls.destroy();
          hls = null;
        }
        attach();
      }, 4000);
    };

    const attach = () => {
      const Hls = (window as unknown as { Hls?: HlsStatic }).Hls;
      if (Hls && Hls.isSupported()) {
        // Chrome / Edge / Firefox via hls.js (MSE)
        const instance = new Hls({
          lowLatencyMode: true,
          manifestLoadingMaxRetry: 4,
          manifestLoadingRetryDelay: 2000,
        });
        instance.on(Hls.Events.ERROR, (_event, data) => {
          if (data?.fatal) scheduleRetry();
        });
        instance.loadSource(MANIFEST_URL);
        instance.attachMedia(video);
        hls = instance;
        video.play().catch(() => {});
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari / iOS: native HLS
        video.src = MANIFEST_URL;
        video.play().catch(() => {});
      } else {
        setFailed(true);
      }
    };

    if ((window as unknown as { Hls?: HlsStatic }).Hls) {
      attach();
    } else {
      const script = document.createElement("script");
      script.src = HLS_CDN;
      script.async = true;
      script.onload = () => {
        if (!cancelled) attach();
      };
      script.onerror = () => setFailed(true);
      document.head.appendChild(script);
    }

    const onPlaying = () => setPlaying(true);
    const onWaiting = () => setPlaying(false);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("waiting", onWaiting);

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onWaiting);
      if (hls) hls.destroy();
    };
  }, [started]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) video.play().catch(() => {});
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl shadow-[#C5156B]/10">
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

      {started && !failed && !playing ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-zinc-900 text-white">
          <p className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 animate-ping rounded-full bg-[#C5156B]"></span>
            Connecting to the live stream…
          </p>
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
