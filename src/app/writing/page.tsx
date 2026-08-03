import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export const metadata = {
  title: "Writing · Jonathan Politzki",
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
    <main>
      <h1>Writing</h1>
      {years.map((year) => (
        <section key={year}>
          <b>{year}</b>
          <ul>
            {postsByYear[year].map((post) => (
              <li key={post.slug}>
                <Link href={`/writing/${post.slug}`}>
                  {post.metadata.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
