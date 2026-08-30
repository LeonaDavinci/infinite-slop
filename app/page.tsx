import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/config";

const features = [
  {
    title: "Truly infinite playback",
    description:
      "There is no final episode. Every scene is created on demand, so the live stream can keep running 24/7 without running out of content.",
  },
  {
    title: "Chat becomes the script",
    description:
      "Anything you type in chat is turned into a prompt. The AI then produces the next clip and attempts to bridge it to the previous scene.",
  },
  {
    title: "Faster than real time",
    description:
      "Built on fal.ai's fine-tuned Max model, the pipeline generates clips fast enough to stay ahead of the viewer, removing loading waits.",
  },
  {
    title: "Open to everyone",
    description:
      "The stream is free to watch and interact with. No account is required to see what an AI-powered live broadcast looks like.",
  },
];

const faqs = [
  {
    question: "What is Infinite Slop?",
    answer:
      "Infiniteslop is a never-ending, interactive AI-generated live stream. Viewers type messages in chat, and each message inspires the next AI-generated video clip. The AI tries to connect the new clip to what came before, creating a loose but continuous storyline.",
  },
  {
    question: "Who created Infinite Slop?",
    answer:
      "The project was built by Pieter Levels. The original idea was inspired by live streams from marcantoinefon and rehan_shei, which showed how AI could power continuous broadcasts. You can read the full announcement on levels.io/infinite-slop.",
  },
  {
    question: "What AI model runs the stream?",
    answer:
      "The stream uses Max, a fine-tuned version of Minimax H3 created and accelerated by fal.ai. The fine-tune made the model roughly 50x faster, which is essential for a real-time experience.",
  },
  {
    question: "Can I watch Infinite Slop for free?",
    answer:
      "Yes. The original stream at infiniteslop.ai is free, and this site embeds it with extra context, an unmute overlay, and a chat panel.",
  },
  {
    question: "How is this site related to levels.io?",
    answer:
      "This is an SEO-focused companion site for the Infiniteslop project Pieter Levels announced at levels.io/infinite-slop. It links back to the official announcement and the original live stream, and helps people learn how to watch Infiniteslop.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#8E2DE2]/10 via-[#C5156B]/5 to-transparent"></div>
          <div className="mx-auto max-w-7xl text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-600 shadow-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-[#C5156B]"></span>
              Live on {site.domain}
            </div>
            <Image
              src="/infinite-slop-logo.svg"
              alt="Infinite Slop logo"
              width={160}
              height={160}
              className="mx-auto mb-10"
              priority
            />
            <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
              Infinite Slop{" "}
              <span className="gradient-text">Never Ends</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              Infiniteslop is a never-ending, interactive AI-generated live
              stream. Type in chat and the next scene is generated for you,
              stitched into the story by AI. Watch Infiniteslop live, free, 24/7.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/live"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8E2DE2] to-[#C5156B] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#C5156B]/25 transition hover:opacity-90"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
                </span>
                Watch Live
              </Link>
              <a
                href={site.originPost}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-8 py-4 text-base font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50"
              >
                Read the original announcement
              </a>
            </div>
            <p className="mt-6 text-sm text-zinc-500">
              Inspired by{" "}
              <a
                href={site.originPost}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-700 underline hover:text-zinc-900"
              >
                {site.originPostLabel}
              </a>
              .
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-zinc-200 bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col justify-around gap-8 text-center sm:flex-row">
            <div>
              <p className="text-4xl font-bold text-zinc-900">{site.stats.views}</p>
              <p className="mt-1 text-sm text-zinc-600">Views</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-zinc-900">{site.stats.likes}</p>
              <p className="mt-1 text-sm text-zinc-600">Likes</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-zinc-900">
                {site.stats.reposts}
              </p>
              <p className="mt-1 text-sm text-zinc-600">Reposts</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-lg text-zinc-600">
                Chat becomes a prompt. The prompt becomes a scene. The scenes
                become an endless story.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="card rounded-3xl p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live CTA */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#8E2DE2]/10 to-[#C5156B]/10 p-1">
            <div className="rounded-[1.9rem] bg-white/90 px-8 py-16 text-center backdrop-blur-xl sm:px-16">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Drop into the stream
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
                The Infiniteslop live page mirrors the original broadcast. Unmute,
                open chat, and watch AI-generated video update in real time — a
                24/7 AI broadcast anyone can join for free. Read the announcement on{" "}
                <a
                  href={site.originPost}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#C5156B] underline hover:text-zinc-900"
                >
                  {site.originPostLabel}
                </a>
                .
              </p>
              <Link
                href="/live"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8E2DE2] to-[#C5156B] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#C5156B]/20 transition hover:opacity-90"
              >
                Go to Live Stream
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.question}
                  className="group card rounded-2xl p-6 open:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-zinc-900">
                    {f.question}
                    <span className="ml-4 text-zinc-400 transition group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-zinc-600">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={faqJsonLd} />
    </>
  );
}
