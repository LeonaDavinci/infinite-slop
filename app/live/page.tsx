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
    videos: [
      {
        url: site.originStream,
        type: "text/html",
      },
    ],
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
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Infinite Slop Live
              </h1>
              <p className="mt-2 text-zinc-400">
                An infinite AI-generated stream. Chat writes the next scene.
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-sm text-zinc-300 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
              </span>
              LIVE
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <Suspense
              fallback={
                <div className="aspect-video w-full animate-pulse rounded-3xl bg-zinc-900" />
              }
            >
              <LivePlayer />
            </Suspense>
            <div className="h-[420px] lg:h-auto">
              <Suspense
                fallback={
                  <div className="h-full w-full animate-pulse rounded-3xl bg-zinc-900" />
                }
              >
                <ChatPanel />
              </Suspense>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold text-white">
              About this stream
            </h2>
            <p className="mt-2 text-zinc-400">
              This page mirrors the original{" "}
              <a
                href={site.originStream}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5156B] underline hover:text-white"
              >
                Infinite Slop broadcast
              </a>
              . If the player does not load, open the original stream in a new
              tab. The stream is interactive: anything you type in chat becomes
              the prompt for the next AI-generated scene.
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <JsonLd data={videoJsonLd} />
    </>
  );
}
