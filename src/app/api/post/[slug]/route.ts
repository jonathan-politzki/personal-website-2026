import { NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/mdx';

// Simple markdown to HTML converter for the reading lab
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Remove MDX imports and components
    .replace(/^import\s+.*$/gm, '')
    .replace(/<[A-Z][a-zA-Z]*\s*\/>/g, '')
    .replace(/<[A-Z][a-zA-Z]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g, '')
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-10 mb-4">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-12 mb-6">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline underline-offset-4 hover:opacity-70">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="my-8 rounded max-w-full" />')
    // Blockquotes
    .replace(/^>\s*(.*$)/gm, '<blockquote class="border-l-2 pl-4 my-6 italic opacity-80">$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-8 border-current opacity-20" />')
    // Lists
    .replace(/^\d+\.\s+(.*$)/gm, '<li class="ml-6 list-decimal">$1</li>')
    .replace(/^[-*]\s+(.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
    // Paragraphs - wrap remaining lines
    .split('\n\n')
    .map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<')) return block;
      return `<p class="mb-6">${block.replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');

  return html;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    const htmlContent = markdownToHtml(post.content);

    return NextResponse.json({
      metadata: post.metadata,
      content: htmlContent,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    );
  }
}
