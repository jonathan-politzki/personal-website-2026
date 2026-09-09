import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import { notFound, redirect } from 'next/navigation';
import { PostArticle } from '@/components/post-article';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

function publicPost(slug: string) {
  try {
    const post = getPostBySlug(slug);
    // Unlisted posts live under /writing/private, which robots.txt keeps crawlers
    // out of. This path denies they exist at all.
    return post.metadata.hidden ? null : post;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = publicPost(slug);
  if (!post) return {};
  return {
    title: `${post.metadata.title} · Jonathan Politzki`,
    description: post.metadata.summary,
  };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = publicPost(slug);
  if (!post) notFound();

  if (post.metadata.externalUrl) {
    redirect(post.metadata.externalUrl);
  }

  return <PostArticle post={post} />;
}
