import { getPostBySlug } from '@/lib/mdx';
import { notFound, redirect } from 'next/navigation';
import { PostArticle } from '@/components/post-article';

// No generateStaticParams: unlisted slugs stay out of the build manifest and
// these pages render on demand.

function unlistedPost(slug: string) {
  try {
    const post = getPostBySlug(slug);
    return post.metadata.hidden ? post : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = unlistedPost(slug);
  if (!post) return {};
  return {
    title: `${post.metadata.title} · Jonathan Politzki`,
    // Belt and braces with the robots.txt disallow on this whole prefix.
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function UnlistedPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = unlistedPost(slug);
  // A post that has since been made public belongs at its canonical URL.
  // redirect() throws, so it has to happen outside the try.
  if (!post) {
    let nowPublic = false;
    try {
      nowPublic = !getPostBySlug(slug).metadata.hidden;
    } catch {}
    if (nowPublic) redirect(`/writing/${slug}`);
    notFound();
  }

  if (post.metadata.externalUrl) {
    redirect(post.metadata.externalUrl);
  }

  return <PostArticle post={post} />;
}
