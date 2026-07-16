import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { FactorList, Factor } from '@/components/mdx/factor-list';

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
    <main className="min-h-screen bg-[#fafaf9] font-[family-name:var(--font-source-serif),Georgia,serif] text-[#1a1a1a] selection:bg-black selection:text-white">
      <article className="mx-auto max-w-2xl px-6 pb-32 pt-10">
        <header className="mb-16 border-b border-[#e0e0e0] pb-8">
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex items-center gap-4 font-[family-name:var(--font-geist-mono),monospace] text-xs uppercase tracking-widest text-[#888]">
              <time>{post.metadata.publishedAt}</time>
              <span>/</span>
              <span className="text-[#666]">{post.metadata.type || 'Essay'}</span>
            </div>
            <h1 className="text-4xl font-light leading-tight tracking-tight text-[#1a1a1a] md:text-5xl">
              {post.metadata.title}
            </h1>
          </div>
          {post.metadata.summary && (
            <p className="text-xl font-light leading-relaxed text-[#555]">
              {post.metadata.summary}
            </p>
          )}
        </header>

        <div
          className="prose prose-base prose-neutral max-w-none
            prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-[#1a1a1a]
            prose-p:text-[#1a1a1a] prose-p:leading-7 prose-p:font-light
            prose-strong:text-[#1a1a1a] prose-strong:font-medium
            prose-a:text-[#1a1a1a] prose-a:underline prose-a:decoration-[#ccc] prose-a:underline-offset-4 hover:prose-a:decoration-[#1a1a1a] prose-a:transition-all
            prose-li:text-[#1a1a1a] prose-ul:my-6
            prose-blockquote:border-l-2 prose-blockquote:border-[#1a1a1a] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[#555]"
        >
          <MDXRemote
            source={post.content}
            components={{ FactorList, Factor }}
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
