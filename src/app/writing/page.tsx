import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export const metadata = {
  title: "Writing — Jonathan Politzki",
};

export default function Writing() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-10 md:px-12">
      <h1 className="mb-4 border-b border-rule pb-4 text-3xl font-medium">
        Writing
      </h1>
      <p className="mt-8 leading-relaxed text-muted">
        I use writing to map and compress my belief system. {posts.length}{" "}
        essays, newest first.
      </p>

      <ul className="mt-8 list-disc space-y-2.5 pl-5 leading-relaxed marker:text-rule">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/writing/${post.slug}`}
              className="text-accent transition-all hover:underline hover:underline-offset-4"
            >
              {post.metadata.title}
            </Link>{" "}
            <span className="text-sm text-muted">
              ({post.metadata.publishedAt?.slice(0, 4)})
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
