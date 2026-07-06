import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export const metadata = {
  title: "Writing — Jonathan Politzki",
};

export default function Writing() {
  const posts = getAllPosts();

  const postsByYear = posts.reduce((acc, post) => {
    const year = post.metadata.publishedAt?.slice(0, 4) || "Undated";
    (acc[year] ??= []).push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  const years = Object.keys(postsByYear).sort((a, b) => b.localeCompare(a));

  return (
    <main className="w-full px-6 pb-24 pt-10 md:px-12 lg:px-16">
      <div className="space-y-12">
        {years.map((year) => (
          <section key={year}>
            <h2 className="mb-5 border-b border-rule pb-2 text-sm font-medium uppercase tracking-wide text-muted">
              {year}
            </h2>
            <ul className="list-disc space-y-2.5 pl-5 leading-relaxed marker:text-rule">
              {postsByYear[year].map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/writing/${post.slug}`}
                    className="text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    {post.metadata.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
