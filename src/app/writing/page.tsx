import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export const metadata = {
  title: "Writing — Jonathan Politzki",
};

export default function Writing() {
  const posts = getAllPosts();

  return (
    <main className="w-full px-6 pb-24 pt-10 md:px-12 lg:px-16">
      <h1 className="mb-4 border-b border-rule pb-4 text-3xl font-medium">
        I write to understand the world.
      </h1>

      <ul className="mt-8 list-disc space-y-2.5 pl-5 leading-relaxed marker:text-rule">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/writing/${post.slug}`}
              className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
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
