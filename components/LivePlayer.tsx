"use client";

import { useState } from "react";
import { site } from "@/lib/config";

export default function LivePlayer() {
  const [overlay, setOverlay] = useState(true);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl shadow-[#C5156B]/10">
      {overlay ? (
        <button
          type="button"
          onClick={() => setOverlay(false)}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-900/65 text-white transition hover:bg-zinc-900/55"
          aria-label="Unmute and watch the live stream"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#8E2DE2] to-[#C5156B] shadow-lg shadow-[#C5156B]/30">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-1 h-10 w-10 text-white"
            >
              <path d="M5 4.5v15l13.5-7.5L5 4.5z" />
            </svg>
          </div>
          <span className="mt-4 text-lg font-semibold">Click to unmute</span>
          <span className="mt-1 text-sm text-zinc-200">
            Watch Infinite Slop live
          </span>
        </button>
      ) : null}
      <iframe
        src={site.originStream}
        title="Infinite Slop live stream"
        className="h-full w-full"
        allow="autoplay; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
      <a
        href={site.originStream}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 top-4 z-10 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/90"
      >
        Open original stream
      </a>
    </div>
  );
}
