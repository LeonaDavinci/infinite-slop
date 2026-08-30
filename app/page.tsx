import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/config";

const features = [
  {
    title: "Infinite generation",
    description:
      "The stream keeps going. Every new scene is generated on the fly, so there is no last episode.",
  },
  {
    title: "Chat drives the story",
    description:
      "Type anything and the AI will generate the next video, attempting to connect it to what came before.",
  },
  {
    title: "Faster than you watch",
    description:
      "Fine-tuned on Minimax H3 as Max by fal.ai, the model generates video faster than real-time playback.",
  },
  {
    title: "Always live",
    description:
      "A 24/7 broadcast of surreal, ever-evolving AI slop you can drop into at any moment.",
  },
];

const faqs = [
  {
    question: "What is Infinite Slop?",
    answer:
      "Infinite Slop is an infinite, interactive AI-generated live stream. Chat messages become prompts for the next video clip, and the AI tries to connect each clip to the previous one.",
  },
  {
    question: "Who built Infinite Slop?",
    answer:
      "The project was built by Pieter Levels and is inspired by the original streams from marcantoinefon and rehan_shei.",
  },
  {
    question: "What AI model powers the stream?",
    answer:
      "fal.ai fine-tuned Minimax H3 into a model called Max, making it roughly 50x faster so it can generate video faster than you can watch.",
  },
  {
    question: "Is Infinite Slop free to watch?",
    answer:
      "Yes. The stream is free to watch and interact with, sponsored by fal.ai.",
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
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#8E2DE2]/30 via-[#C5156B]/10 to-transparent"></div>
          <div className="mx-auto max-w-7xl text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300">
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
            <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Infinite Slop{" "}
              <span className="gradient-text">Never Ends</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              An infinite, interactive AI-generated live stream. Type anything
              in chat and the AI will generate the next scene, connecting it to
              the story so far.
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
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-white transition hover:bg-white/10"
              >
                Read the story
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-white/10 bg-white/[0.02] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col justify-around gap-8 text-center sm:flex-row">
            <div>
              <p className="text-4xl font-bold text-white">{site.stats.views}</p>
              <p className="mt-1 text-sm text-zinc-400">Views</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">{site.stats.likes}</p>
              <p className="mt-1 text-sm text-zinc-400">Likes</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">
                {site.stats.reposts}
              </p>
              <p className="mt-1 text-sm text-zinc-400">Reposts</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Chat becomes content. Content becomes a story. The story never
                stops.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="glass rounded-3xl p-6 transition hover:-translate-y-1 hover:bg-white/[0.06]"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live CTA */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#8E2DE2]/20 to-[#C5156B]/20 p-1">
            <div className="rounded-[1.9rem] bg-black/60 px-8 py-16 text-center backdrop-blur-xl sm:px-16">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Drop into the stream
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-300">
                The live page recreates the experience from the original
                Infinite Slop broadcast. Unmute, open chat, and let the AI take
                over.
              </p>
              <Link
                href="/live"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-zinc-100"
              >
                Go to Live Stream
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.question}
                  className="group glass rounded-2xl p-6 open:bg-white/[0.05]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-white">
                    {f.question}
                    <span className="ml-4 text-zinc-500 transition group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-zinc-400">
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
