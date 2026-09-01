import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/config";

export const metadata = {
  title: "Infinite Slop Hot Moments – Best Clips & Highlights",
  description:
    "Watch the hottest Infinite Slop moments: the best AI-generated clips, viral highlights, and most-loved scenes from the 24/7 Infiniteslop AI live stream.",
  keywords: [
    "infinite slop hot moments",
    "infiniteslop hot moments",
    "hot moments infinite slop",
    "infinite slop best clips",
    "infinite slop highlights",
    "infinite slop viral moments",
  ],
  alternates: { canonical: `${site.url}/moments` },
};

const moments = [
  {
    id: 1,
    title: "The neon city that never loaded",
    desc: "A chat prompt spawned an entire glowing skyline that kept re-rendering itself frame after frame.",
    duration: "0:48",
    views: "214K",
    grad: "from-[#8E2DE2] to-[#C5156B]",
  },
  {
    id: 2,
    title: "When the AI invented a new animal",
    desc: "Someone typed 'a creature that is half cat, half cloud' and the stream obliged.",
    duration: "1:12",
    views: "189K",
    grad: "from-[#C5156B] to-[#8E2DE2]",
  },
  {
    id: 3,
    title: "The longest unbroken storyline",
    desc: "Twelve chat messages stitched into one continuous scene without a single cut.",
    duration: "2:05",
    views: "156K",
    grad: "from-[#8E2DE2] to-[#FF5C9E]",
  },
  {
    id: 4,
    title: "Rain inside a spaceship",
    desc: "A surreal request turned into one of the most shared Infiniteslop highlights this week.",
    duration: "0:37",
    views: "142K",
    grad: "from-[#FF5C9E] to-[#C5156B]",
  },
  {
    id: 5,
    title: "The dancing robots reunion",
    desc: "Characters from an earlier clip returned, proving the AI remembers what came before.",
    duration: "1:33",
    views: "131K",
    grad: "from-[#C5156B] to-[#8E2DE2]",
  },
  {
    id: 6,
    title: "A quiet moment that went viral",
    desc: "Not every hot moment is loud — this calm scene became an unexpected fan favorite.",
    duration: "0:54",
    views: "118K",
    grad: "from-[#8E2DE2] to-[#C5156B]",
  },
];

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Infinite Slop Hot Moments",
  description:
    "A curated collection of the best clips, highlights, and viral moments from the Infinite Slop AI live stream.",
  url: `${site.url}/moments`,
  isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
};

export default function MomentsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#8E2DE2]/10 via-[#C5156B]/5 to-transparent"></div>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm text-zinc-600 shadow-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-[#C5156B]"></span>
              Hot Moments
            </div>
            <h1 className="mx-auto max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-6xl">
              Infinite Slop{" "}
              <span className="bg-gradient-to-r from-[#8E2DE2] to-[#C5156B] bg-clip-text text-transparent">
                Hot Moments
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              The best clips, viral highlights, and most-loved scenes from the
              24/7 Infiniteslop AI live stream. Every moment below was generated
              live from a single chat message.
            </p>
            <Link
              href="/live"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8E2DE2] to-[#C5156B] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#C5156B]/25 transition hover:opacity-90"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
              </span>
              Watch the Live Stream
            </Link>
          </div>
        </section>

        {/* Moments grid */}
        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Popular live clips
              </h2>
              <p className="mt-4 text-lg text-zinc-600">
                Hand-picked Infinite Slop hot moments, ranked by views.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moments.map((m) => (
                <Link
                  key={m.id}
                  href="/live"
                  className="card group overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${m.grad}`}
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-110">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ml-1 h-7 w-7 text-[#8E2DE2]"
                      >
                        <path d="M5 4.5v15l13.5-7.5L5 4.5z" />
                      </svg>
                    </span>
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                      {m.duration}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-zinc-900">
                        {m.title}
                      </h3>
                      <span className="text-xs text-zinc-500">{m.views} views</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                      {m.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#8E2DE2]/10 to-[#C5156B]/10 p-1">
            <div className="rounded-[1.9rem] bg-white/90 px-8 py-16 text-center backdrop-blur-xl sm:px-16">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Catch the next hot moment live
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
                New Infinite Slop moments are generated every minute. Jump into
                the stream and your chat message could be the next viral clip.
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
      </main>
      <Footer />
      <JsonLd data={collectionJsonLd} />
    </>
  );
}
