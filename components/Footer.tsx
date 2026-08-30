import Link from "next/link";
import { site } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-zinc-900">{site.name}</p>
            <p className="mt-1 text-sm text-zinc-600">{site.tagline}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-600">
            <Link href="/" className="hover:text-zinc-900">
              Home
            </Link>
            <Link href="/live" className="hover:text-zinc-900">
              Live
            </Link>
            <Link href="/about" className="hover:text-zinc-900">
              About
            </Link>
            <Link href="/blog" className="hover:text-zinc-900">
              Blog
            </Link>
            <a
              href={site.originStream}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900"
            >
              Original Stream
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} {site.name}. Concept and announcement by{" "}
          <a
            href={site.originPost}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-700 underline hover:text-zinc-900"
          >
            {site.originPostLabel}
          </a>
          . Powered by{" "}
          <a
            href={site.sponsorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-700 underline hover:text-zinc-900"
          >
            {site.sponsor}
          </a>
          .
        </div>
      </div>
    </footer>
  );
}
