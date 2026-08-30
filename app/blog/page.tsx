import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { posts } from "@/lib/config";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read the latest articles about Infinite Slop: what it is, how it works, and the AI video technology behind the stream.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndex() {
  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Infinite Slop Blog
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Deep dives into the project, the AI model, and the future of
            generative live streams.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group glass rounded-3xl p-6 transition hover:bg-white/[0.06]"
              >
                <time className="text-sm text-zinc-500">{post.publishedAt}</time>
                <h2 className="mt-2 text-xl font-semibold text-white transition group-hover:text-[#C5156B]">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
