"use client";

import { useEffect, useRef, useState } from "react";

const MANIFEST_URL = "/live/playlist.m3u8";
const HLS_CDN = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";

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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: HlsInstance | null = null;
    let cancelled = false;

    const attach = () => {
      const Hls = (window as unknown as { Hls?: HlsStatic }).Hls;
      if (Hls && Hls.isSupported()) {
        // Chrome / Edge / Firefox via hls.js (MSE)
        const instance = new Hls();
        instance.on(Hls.Events.ERROR, (_event, data) => {
          if (data?.fatal) setFailed(true);
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

    return () => {
      cancelled = true;
      if (hls) hls.destroy();
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl shadow-[#C5156B]/10">
      <video
        ref={videoRef}
        data-live-video=""
        muted
        autoPlay
        playsInline
        preload="metadata"
        aria-label="Infinite Slop live video"
        aria-describedby="infiniteslop-live-player"
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        className="aspect-video w-full"
      />
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
