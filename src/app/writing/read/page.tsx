import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export default function ReadingLibrary() {
  const posts = getAllPosts();

  // Group posts by year
  const postsByYear = posts.reduce((acc, post) => {
    const year = post.metadata.publishedAt?.split('-')[0] || 'Unknown';
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  const years = Object.keys(postsByYear).sort((a, b) => b.localeCompare(a));

  return (
    <main className="min-h-screen flex bg-[#fafaf9]">

      {/* Sidebar Navigation for Writing */}
      <aside className="w-64 border-r border-[#e0e0e0] hidden md:flex flex-col fixed top-0 bottom-0 left-0 pt-32 pb-8 px-6 bg-[#fafaf9] z-10">
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#888] mb-4">Writing Engine</h2>
          <nav className="flex flex-col gap-3 font-mono text-sm text-[#666]">
             <Link href="/writing" className="hover:text-[#1a1a1a] transition-colors hover:pl-2 hover:border-l-2 hover:border-[#ccc] -ml-3 pl-3 duration-200">Overview</Link>
             <Link href="/writing/read" className="text-[#1a1a1a] border-l-2 border-[#1a1a1a] pl-3 -ml-3">Library</Link>
             <Link href="/writing/graph" className="hover:text-[#1a1a1a] transition-colors hover:pl-2 hover:border-l-2 hover:border-[#ccc] -ml-3 pl-3 duration-200">The Graph</Link>
             <Link href="/writing/dashboard" className="hover:text-[#1a1a1a] transition-colors hover:pl-2 hover:border-l-2 hover:border-[#ccc] -ml-3 pl-3 duration-200">Dashboard</Link>
             <Link href="/writing/chat" className="hover:text-[#1a1a1a] transition-colors hover:pl-2 hover:border-l-2 hover:border-[#ccc] -ml-3 pl-3 duration-200">Chat</Link>
             <Link href="/writing/compare" className="hover:text-[#1a1a1a] transition-colors hover:pl-2 hover:border-l-2 hover:border-[#ccc] -ml-3 pl-3 duration-200">Laboratory</Link>
          </nav>
        </div>

        {/* Stats */}
        <div className="mt-auto pt-8 border-t border-[#e0e0e0]">
          <div className="text-xs font-mono uppercase tracking-widest text-[#888] mb-2">Archive</div>
          <div className="text-2xl font-light text-[#1a1a1a]">{posts.length}</div>
          <div className="text-xs text-[#888]">essays</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 pt-32 px-8 md:px-16 pb-32">

        {/* Header */}
        <header className="mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#1a1a1a] mb-4 font-[family-name:var(--font-serif)]">
            The Library
          </h1>
          <p className="text-lg text-[#666] font-light">
            {posts.length} essays spanning {years[years.length - 1]} to {years[0]}
          </p>
        </header>

        {/* Essays by Year */}
        <div className="space-y-16 max-w-4xl">
          {years.map((year) => (
            <section key={year}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xs font-mono uppercase tracking-widest text-[#888]">{year}</h2>
                <div className="flex-1 h-px bg-[#e0e0e0]" />
                <span className="text-xs font-mono text-[#888]">{postsByYear[year].length}</span>
              </div>

              <div className="space-y-1">
                {postsByYear[year].map((post) => (
                  <Link
                    key={post.slug}
                    href={`/writing/${post.slug}`}
                    className="group flex items-baseline gap-4 py-3 border-b border-[#e8e8e8] hover:border-[#ccc] transition-colors"
                  >
                    {/* Date */}
                    <time className="text-xs font-mono text-[#888] shrink-0 w-20">
                      {post.metadata.publishedAt?.slice(5) || ''}
                    </time>

                    {/* Title & Summary */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#333] group-hover:text-[#1a1a1a] transition-colors truncate font-[family-name:var(--font-serif)]">
                        {post.metadata.title}
                      </h3>
                      {post.metadata.summary && (
                        <p className="text-sm text-[#888] truncate mt-0.5">
                          {post.metadata.summary}
                        </p>
                      )}
                    </div>

                    {/* Type badge */}
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#888] shrink-0 hidden sm:block">
                      {post.metadata.type || 'essay'}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

      </div>

    </main>
  );
}
