import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LivePlayer from "@/components/LivePlayer";
import ChatPanel from "@/components/ChatPanel";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Infinite Slop Live Stream",
  description:
    "Watch Infinite Slop live. An infinite, interactive AI-generated video stream. Type in chat and the AI will generate the next scene.",
  alternates: {
    canonical: "/live",
  },
  openGraph: {
    type: "video.other",
    title: "Infinite Slop Live Stream",
    description:
      "Watch Infinite Slop live. An infinite, interactive AI-generated video stream.",
    url: `${site.url}/live`,
    images: ["/og-image.png"],
  },
};

const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Infinite Slop Live Stream",
  description:
    "An infinite, interactive AI-generated live stream where chat drives the next generated scene.",
  thumbnailUrl: `${site.url}/og-image.png`,
  contentUrl: site.originStream,
  embedUrl: site.originStream,
  uploadDate: site.stats.published,
  broadcastEvent: {
    "@type": "BroadcastEvent",
    name: "Infinite Slop 24/7 AI Stream",
    isLiveBroadcast: true,
    startDate: site.stats.published,
  },
};

export default function LivePage() {
  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Infinite Slop Live
              </h1>
              <p className="mt-2 text-zinc-600">
                A never-ending AI-generated stream. Chat writes the next scene.
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
              </span>
              LIVE
            </div>
          </div>

          {/* Enlarged full-width player */}
          <Suspense
            fallback={
              <div className="aspect-video w-full animate-pulse rounded-3xl bg-zinc-100" />
            }
          >
            <LivePlayer />
          </Suspense>

          {/* Chat panel moved below the stream, full width */}
          <div className="mx-auto mt-6 max-w-[960px]">
            <div className="mb-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <h2 className="text-lg font-semibold text-zinc-900">
                Live chat — your words become the next scene
              </h2>
            </div>
            <div className="h-[520px] sm:h-[560px]">
              <Suspense
                fallback={
                  <div className="h-full w-full animate-pulse rounded-3xl bg-zinc-100" />
                }
              >
                <ChatPanel />
              </Suspense>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">
              About this stream
            </h2>
            <p className="mt-2 text-zinc-600">
              This page mirrors the original{" "}
              <a
                href={site.originStream}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#C5156B] underline hover:text-zinc-900"
              >
                Infinite Slop broadcast
              </a>
              . If the player does not load, open the original stream in a new
              tab. The stream is interactive: anything you type in chat becomes
              the prompt for the next AI-generated scene. The project was
              announced on{" "}
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
          </div>
        </div>
      </main>
      <Footer />
      <JsonLd data={videoJsonLd} />
    </>
  );
}
