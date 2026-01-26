import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import * as Components from '@/components/mdx-components';
import { notFound } from 'next/navigation';
import TreatiseLayout from '@/components/treatise-layout';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Helper to extract headings for the TOC
function extractHeadings(content: string) {
  const headingRegex = /^(#{2,3})\s+(.*)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    headings.push({ id, text, level });
  }
  return headings;
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let post;
  try {
    post = getPostBySlug(slug);
  } catch (e) {
    notFound();
  }

  const headings = extractHeadings(post.content);
  const isTreatise = post.metadata.type === 'treatise';

  const content = (
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
  );

  // --- TREATISE / MAXIMALIST VIEW ---
  if (isTreatise) {
    return (
      <TreatiseLayout metadata={post.metadata} headings={headings}>
        {content}
      </TreatiseLayout>
    );
  }

  // --- STANDARD / ESSAY VIEW ---
  return (
    <main className="min-h-screen bg-[#fafaf9] text-[#1a1a1a] font-[family-name:var(--font-serif)] selection:bg-black selection:text-white">

      <article className="max-w-2xl mx-auto pt-24 pb-32 px-6">

        {/* Back to Library - static at top, below logo */}
        <nav className="mb-8 pt-2">
          <Link href="/writing/read" className="group inline-flex items-center gap-2 text-[#666] hover:text-[#1a1a1a] transition-colors">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-mono text-sm uppercase tracking-widest">Library</span>
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-16 border-b border-[#e0e0e0] pb-8">
          <div className="flex flex-col gap-4 mb-8">
             <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-[#888]">
                <time>{post.metadata.publishedAt}</time>
                <span>/</span>
                <span className="text-[#666]">{post.metadata.type || 'Essay'}</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#1a1a1a] leading-tight font-[family-name:var(--font-serif)]">
               {post.metadata.title}
             </h1>
          </div>
          <p className="text-xl text-[#555] font-light leading-relaxed">
            {post.metadata.summary}
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-neutral max-w-none
          prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-[#1a1a1a] prose-headings:font-[family-name:var(--font-serif)]
          prose-p:text-[#1a1a1a] prose-p:leading-8 prose-p:font-light
          prose-strong:text-[#1a1a1a] prose-strong:font-medium
          prose-a:text-[#1a1a1a] prose-a:underline prose-a:decoration-[#ccc] prose-a:underline-offset-4 hover:prose-a:decoration-[#1a1a1a] prose-a:transition-all
          prose-li:text-[#1a1a1a] prose-ul:my-6
          prose-blockquote:border-l-2 prose-blockquote:border-[#1a1a1a] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[#555]
        ">
          {content}
        </div>

      </article>
    </main>
  );
}
