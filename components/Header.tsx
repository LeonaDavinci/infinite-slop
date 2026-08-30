"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/config";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/infinite-slop-logo.svg"
            alt="Infinite Slop logo"
            width={40}
            height={40}
            priority
          />
          <span className="text-lg font-semibold tracking-tight text-zinc-900">
            Infinite Slop
          </span>
        </Link>
        <nav
          className="hidden items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 sm:flex"
          aria-label="Primary navigation"
        >
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <a
          href="/live"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8E2DE2] to-[#C5156B] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#C5156B]/20 transition hover:opacity-90"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
          </span>
          Watch Live
        </a>
      </div>
    </header>
  );
}
