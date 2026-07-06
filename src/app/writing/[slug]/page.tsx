import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-10 md:px-12">
      <article>
        <nav className="mb-8 text-[15px]">
          <Link
            href="/writing"
            className="text-accent transition-all hover:underline hover:underline-offset-4"
          >
            &larr; All writing
          </Link>
        </nav>

        <header className="mb-10 border-b border-rule pb-6">
          <h1 className="mb-3 text-3xl font-medium leading-tight">
            {post.metadata.title}
          </h1>
          <time className="text-sm text-muted">
            {post.metadata.publishedAt}
          </time>
          {post.metadata.summary && (
            <p className="mt-4 text-lg italic leading-relaxed text-muted">
              {post.metadata.summary}
            </p>
          )}
        </header>

        <div
          className="prose prose-neutral max-w-none
            prose-headings:font-medium prose-headings:text-ink
            prose-p:text-ink
            prose-strong:font-semibold prose-strong:text-ink
            prose-li:text-ink prose-ul:my-6"
        >
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                ],
              },
            }}
          />
        </div>
      </article>
    </main>
  );
}
