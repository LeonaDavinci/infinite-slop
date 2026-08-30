import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Infinite Slop: the story behind the project, the team, the AI model, and the sponsor fal.ai.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            About Infinite Slop
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Infinite Slop is an infinite, interactive AI-generated live stream. It
            was built by{" "}
            <a
              href={site.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5156B] underline hover:text-white"
            >
              Pieter Levels
            </a>{" "}
            and launched on levels.io. The stream plays forever: whatever you
            type in chat becomes the next scene, and the AI tries to connect it to
            the previous video so the story continues.
          </p>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-white">Origins</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              The idea came from{" "}
              <a
                href="https://x.com/marcantoinefon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5156B] underline hover:text-white"
              >
                marcantoinefon
              </a>{" "}
              and{" "}
              <a
                href="https://x.com/rehan_shei"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5156B] underline hover:text-white"
              >
                rehan_shei
              </a>
              , whose original streams showed that AI could power continuous
              broadcast content. Pieter Levels turned the concept into a polished
              public experience and made it free for everyone to watch and
              interact with.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-white">The AI model</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              Running a never-ending AI video stream is expensive.{" "}
              <a
                href={site.sponsorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5156B] underline hover:text-white"
              >
                fal.ai
              </a>{" "}
              sponsors the project and fine-tuned the Minimax H3 model into a new
              model called Max. The result is roughly 50x faster inference, which
              lets the system generate video faster than you can watch it.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-white">Why it matters</h2>
            <p className="mt-4 leading-7 text-zinc-400">
              Infinite Slop is a glimpse at a future where live media is generated,
              personalized, and infinite. It blends community interaction with
              generative AI in a simple interface: a video player and a chat box.
            </p>
          </section>

          <div className="mt-12 flex gap-4">
            <Link
              href="/live"
              className="rounded-full bg-gradient-to-r from-[#8E2DE2] to-[#C5156B] px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Watch the stream
            </Link>
            <a
              href={site.originPost}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Read the announcement
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
