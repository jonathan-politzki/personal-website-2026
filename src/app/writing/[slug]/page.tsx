import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import * as Components from '@/components/mdx-components';
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
    <main>
      <article className="mx-auto w-full max-w-2xl px-6 pb-24 pt-8">
        <nav className="mb-10">
          <Link
            href="/writing"
            className="font-mono text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-ink"
          >
            &larr; Writing
          </Link>
        </nav>

        <header className="mb-12 border-b border-rule pb-8">
          <time className="mb-4 block font-mono text-xs uppercase tracking-[0.15em] text-muted">
            {post.metadata.publishedAt}
          </time>
          <h1 className="mb-4 text-3xl font-light leading-tight tracking-tight md:text-4xl">
            {post.metadata.title}
          </h1>
          {post.metadata.summary && (
            <p className="text-lg font-light leading-relaxed text-muted">
              {post.metadata.summary}
            </p>
          )}
        </header>

        <div
          className="prose prose-neutral max-w-none
            prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-ink
            prose-p:font-light prose-p:leading-7 prose-p:text-ink
            prose-strong:font-medium prose-strong:text-ink
            prose-a:text-ink prose-a:underline prose-a:decoration-rule prose-a:underline-offset-4 hover:prose-a:decoration-ink
            prose-li:text-ink prose-ul:my-6"
        >
          <MDXRemote
            source={post.content}
            components={Components}
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
