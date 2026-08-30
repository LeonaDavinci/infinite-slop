import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "What Is Infinite Slop?",
  description:
    "A complete introduction to Infinite Slop: the never-ending AI live stream where every chat message drives the next generated scene.",
  alternates: {
    canonical: "/blog/what-is-infinite-slop",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Is Infinite Slop?",
  description:
    "A complete introduction to Infinite Slop: the never-ending AI live stream where every chat message drives the next generated scene.",
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
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>{" "}
            / <span className="text-zinc-300">What Is Infinite Slop?</span>
          </nav>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            What Is Infinite Slop?
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Infinite Slop is an infinite, interactive AI-generated live stream. It
            plays forever, and the audience decides what happens next.
          </p>

          <h2 className="mt-12 text-2xl font-semibold text-white">
            The basic idea
          </h2>
          <p className="text-zinc-300">
            Imagine a live TV channel that never repeats. Instead of a fixed
            schedule, the content is generated in real time by AI. Viewers type
            messages into a chat box, and each message becomes the prompt for the
            next clip. The AI then tries to connect the new clip to the previous
            one, so the broadcast keeps some kind of sequence or storyline.
          </p>
          <p className="text-zinc-300">
            That is Infinite Slop. The name is playful, but the concept is a real
            experiment in AI-generated media. It explores what happens when
            content is not produced ahead of time, but created on demand by the
            audience.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-white">
            Why people watch it
          </h2>
          <p className="text-zinc-300">
            Part of the appeal is unpredictability. Because the next scene is
            driven by chat, no one knows what will appear next. Another part is the
            sense of participation: a single message can change the direction of
            the entire stream.
          </p>
          <p className="text-zinc-300">
            The project also sits at the edge of a larger trend: AI that can
            generate video. As video models become faster and cheaper, formats like
            Infinite Slop become possible. A stream that once required a studio,
            crew, and broadcast equipment can now run from a model and a chat box.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-white">
            Where to watch
          </h2>
          <p className="text-zinc-300">
            You can watch the live stream on{" "}
            <Link href="/live" className="text-[#C5156B] underline hover:text-white">
              our Live page
            </Link>
            . It mirrors the original broadcast at{" "}
            <a
              href={site.originStream}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5156B] underline hover:text-white"
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
