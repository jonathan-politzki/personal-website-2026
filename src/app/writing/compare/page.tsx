import { getAllPosts } from "@/lib/mdx";
import LaboratoryClient from "@/components/laboratory-client";

export default function LaboratoryPage() {
  const posts = getAllPosts();
  
  const serializedPosts = posts.map(post => ({
    slug: post.slug,
    title: post.metadata.title,
  }));

  return <LaboratoryClient posts={serializedPosts} />;
}
