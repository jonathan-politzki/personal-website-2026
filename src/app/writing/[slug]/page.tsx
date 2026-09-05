import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound, redirect } from 'next/navigation';
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

  if (post.metadata.externalUrl) {
    redirect(post.metadata.externalUrl);
  }

  return (
    <article className="post">
      <h1>{post.metadata.title}</h1>
      <p className="byline">
        <time>{post.metadata.publishedAt}</time>
        {' · '}
        {post.metadata.type || 'Essay'}
      </p>
      {post.metadata.summary && <p className="note">{post.metadata.summary}</p>}
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
    </article>
  );
}
