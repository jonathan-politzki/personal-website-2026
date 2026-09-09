import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/mdx";
import { ARCHIVE_KEY } from "@/lib/archive";
import { narratedSlugs } from "@/lib/narration";

export const metadata = {
  title: "Archive · Jonathan Politzki",
  robots: { index: false, follow: false },
};

export default async function Archive({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (key !== ARCHIVE_KEY) notFound();

  const posts = getAllPosts({ includeHidden: true });

  const postsByYear = posts.reduce((acc, post) => {
    const year = post.metadata.publishedAt?.slice(0, 4) || "Undated";
    (acc[year] ??= []).push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  const years = Object.keys(postsByYear).sort((a, b) => b.localeCompare(a));

  return (
    <main>
      <h1>Archive</h1>
      <p className="note">
        Everything, including the {posts.filter((p) => p.metadata.hidden).length} pieces
        that are not public. Marked ones are unlisted.
      </p>
      {years.map((year) => (
        <section key={year}>
          <b>{year}</b>
          <ul>
            {postsByYear[year].map((post) => (
              <li key={post.slug}>
                {post.metadata.externalUrl ? (
                  <a
                    href={post.metadata.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {post.metadata.title}
                  </a>
                ) : (
                  <Link
                    href={
                      post.metadata.hidden
                        ? `/writing/private/${post.slug}`
                        : `/writing/${post.slug}`
                    }
                  >
                    {post.metadata.title}
                  </Link>
                )}
                {post.metadata.hidden && <span className="note"> · unlisted</span>}
                {narratedSlugs.has(post.slug) && <span className="note"> · narrated</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
