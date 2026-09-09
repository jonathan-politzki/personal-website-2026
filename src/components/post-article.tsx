import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { FactorList, Factor } from '@/components/mdx/factor-list';
import { Listen } from '@/components/listen';
import { getNarration } from '@/lib/narration';
import type { Post } from '@/lib/mdx';

/** Shared by the public /writing/[slug] route and the unlisted /writing/private one. */
export function PostArticle({ post }: { post: Post }) {
  const narration = getNarration(post.slug);

  return (
    <article className="post">
      <h1>{post.metadata.title}</h1>
      <p className="byline">
        <time>{post.metadata.publishedAt}</time>
        {' · '}
        {post.metadata.type || 'Essay'}
      </p>
      {post.metadata.summary && <p className="note">{post.metadata.summary}</p>}
      {narration && (
        <Listen slug={post.slug} minutes={narration.minutes} partial={narration.partial} />
      )}
      <MDXRemote
        source={post.content}
        components={{ FactorList, Factor }}
        options={{
          mdxOptions: {
            rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
          },
        }}
      />
    </article>
  );
}
