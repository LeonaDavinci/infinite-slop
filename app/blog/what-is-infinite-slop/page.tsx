import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "What Is Infinite Slop?",
  description:
    "A complete introduction to Infinite Slop: the never-ending AI live stream where chat prompts become the next generated scene. Original concept by Pieter Levels.",
  alternates: {
    canonical: "/blog/what-is-infinite-slop",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Is Infinite Slop?",
  description:
    "A complete introduction to Infinite Slop: the never-ending AI live stream where chat prompts become the next generated scene.",
  author: {
    "@type": "Person",
    name: site.author,
    url: site.authorUrl,
  },
  publisher: {
    "@type": "Organization",
    name: site.name,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/infinite-slop-logo.png`,
    },
  },
  datePublished: "2026-08-30",
  dateModified: "2026-08-30",
  image: `${site.url}/og-image.png`,
};

export default function WhatIsPost() {
  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <nav className="text-sm text-zinc-500" aria-label="Breadcrumb">
            <Link href="/blog" className="hover:text-zinc-900">
              Blog
            </Link>{" "}
            / <span className="text-zinc-700">What Is Infinite Slop?</span>
          </nav>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            What Is Infinite Slop?
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            Infinite Slop is a live stream that never stops. Instead of playing
            pre-recorded videos, it generates each clip with AI. The audience
            participates by typing ideas into a chat box, and every idea becomes
            a prompt for the next scene.
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-zinc-900">
            The core concept
          </h2>
          <p className="mt-4 leading-7 text-zinc-700">
            Think of a television channel that has no schedule, no rerun list,
            and no final episode. Every time someone sends a message in chat, an
            AI video model receives that message as a prompt and produces a new
            short clip. The system then tries to connect the new clip to the one
            before it, so the broadcast keeps some kind of thread or story.
          </p>
          <p className="mt-4 leading-7 text-zinc-700">
            That is the essence of Infinite Slop. The name is deliberately
            playful, but the underlying idea is a serious experiment in
            generative media: what happens when content is not produced ahead
            of time, but invented on the spot by the audience and the AI
            together?
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-zinc-900">
            Why people keep watching
          </h2>
          <p className="mt-4 leading-7 text-zinc-700">
            Part of the appeal is pure unpredictability. Because the next scene
            is driven by chat, nobody knows what will appear next. Another part
            is agency: a single message can reshape the entire stream. Viewers
            are not just watching a broadcast; they are co-writing it in real
            time.
          </p>
          <p className="mt-4 leading-7 text-zinc-700">
            Infinite Slop also sits at the intersection of two fast-moving
            trends: live streaming and generative AI. As video models become
            faster and cheaper, formats like this become feasible. A 24/7
            broadcast that once required a studio, crew, and broadcast
            infrastructure can now run from a fine-tuned model and a chat
            interface.
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-zinc-900">
            Origins and attribution
          </h2>
          <p className="mt-4 leading-7 text-zinc-700">
            Infinite Slop was built by Pieter Levels and shared on{" "}
            <a
              href={site.originPost}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#C5156B] underline hover:text-zinc-900"
            >
              {site.originPostLabel}
            </a>
            . The original idea came from streams by{" "}
            <a
              href="https://x.com/marcantoinefon"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#C5156B] underline hover:text-zinc-900"
            >
              marcantoinefon
            </a>{" "}
            and{" "}
            <a
              href="https://x.com/rehan_shei"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#C5156B] underline hover:text-zinc-900"
            >
              rehan_shei
            </a>
            . The stream is sponsored by{" "}
            <a
              href={site.sponsorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#C5156B] underline hover:text-zinc-900"
            >
              {site.sponsor}
            </a>
            , whose fine-tuned Max model makes the real-time loop possible.
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-zinc-900">
            Where to watch
          </h2>
          <p className="mt-4 leading-7 text-zinc-700">
            You can watch the live stream on{" "}
            <Link
              href="/live"
              className="font-medium text-[#C5156B] underline hover:text-zinc-900"
            >
              our Live page
            </Link>
            . It mirrors the original broadcast at{" "}
            <a
              href={site.originStream}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#C5156B] underline hover:text-zinc-900"
            >
              infiniteslop.ai
            </a>
            , with an unmute button and a chat panel so you can join the story.
          </p>
        </article>
      </main>
      <Footer />
      <JsonLd data={articleJsonLd} />
    </>
  );
}
