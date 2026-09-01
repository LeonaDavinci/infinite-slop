"use client";

export default function LivePlayer() {
  return (
    <a
      href="https://levels.io/infinite-slop"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-video w-full overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl shadow-[#C5156B]/10"
      aria-label="Watch Infinite Slop on levels.io"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/infinite-slop-live.jpg"
        alt="Infinite Slop live stream preview"
        className="h-full w-full object-cover transition group-hover:scale-[1.02]"
      />
      <span className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/55 transition group-hover:bg-zinc-900/45">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#8E2DE2] to-[#C5156B] shadow-lg shadow-[#C5156B]/30">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-1 h-10 w-10 text-white"
          >
            <path d="M5 4.5v15l13.5-7.5L5 4.5z" />
          </svg>
        </span>
        <span className="mt-4 text-lg font-semibold text-white">
          Watch on levels.io
        </span>
        <span className="mt-1 text-sm text-zinc-200">
          Infinite Slop live stream
        </span>
      </span>
      <span className="absolute right-4 top-4 z-10 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition group-hover:bg-black/90">
        Open original stream
      </span>
    </a>
  );
}
