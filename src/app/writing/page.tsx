import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export const metadata = {
  title: "Writing — Jonathan Politzki",
};

export default function Writing() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-12">
      <h1 className="mb-3 text-2xl font-light tracking-tight">Writing</h1>
      <p className="mb-10 font-light text-muted">
        I use writing to map and compress my belief system.
      </p>

      <ul className="list-disc space-y-3 pl-5 marker:text-rule">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/writing/${post.slug}`}
              className="font-light underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
            >
              {post.metadata.title}
            </Link>
            <span className="ml-3 font-mono text-xs text-muted">
              {post.metadata.publishedAt?.slice(0, 4)}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
