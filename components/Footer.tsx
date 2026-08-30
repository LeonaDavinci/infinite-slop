import Link from "next/link";
import { site } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-white">{site.name}</p>
            <p className="mt-1 text-sm text-zinc-400">{site.tagline}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Link href="/live" className="hover:text-white">
              Live
            </Link>
            <Link href="/about" className="hover:text-white">
              About
            </Link>
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
            <a
              href={site.originStream}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              Original Stream
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} {site.name}. Inspired by{" "}
          <a
            href={site.originPost}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-300"
          >
            levels.io/i-built-infinite-slop
          </a>
          . Powered by{" "}
          <a
            href={site.sponsorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-300"
          >
            {site.sponsor}
          </a>
          .
        </div>
      </div>
    </footer>
  );
}
