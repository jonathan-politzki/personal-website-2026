import React from "react";
import Link from "next/link";
import analysis from "@/data/corpus-analysis.json";

export default function Dashboard() {
  const { stats, themes, summary } = analysis;

  return (
    <main className="min-h-screen flex">

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#222] hidden md:flex flex-col fixed top-0 bottom-0 left-0 pt-32 pb-8 px-6 bg-[#0a0a0a] z-10">
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-4">Writing Engine</h2>
          <nav className="flex flex-col gap-3 font-mono text-sm text-[#888]">
             <Link href="/writing" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Overview</Link>
             <Link href="/writing/read" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Library</Link>
             <Link href="/writing/graph" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">The Graph</Link>
             <Link href="/writing/dashboard" className="text-white border-l-2 border-white pl-3 -ml-3">Dashboard</Link>
             <Link href="/writing/chat" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Chat</Link>
             <Link href="/writing/compare" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Laboratory</Link>
          </nav>
        </div>

        <div className="mt-auto pt-8 border-t border-[#222]">
          <div className="text-xs font-mono uppercase tracking-widest text-[#444] mb-2">Last Updated</div>
          <div className="text-sm text-[#666]">{new Date(analysis.generated_at).toLocaleDateString()}</div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 pt-32 px-8 md:px-16 pb-32 max-w-5xl">

        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6">
            Dashboard
          </h1>
          <p className="text-lg text-[#666] font-light max-w-2xl leading-relaxed">
            AI-extracted signals and themes from the corpus. Our writing reveals patterns we may not consciously recognize.
          </p>
        </header>

        {/* Quote */}
        <div className="mb-16 border-l-2 border-[#333] pl-6 italic text-[#888] font-light max-w-2xl">
           &quot;Latent ideas and emotions hiding in deeper layers of the psyche may find their way into our lyric scenes and canvases.&quot;
           <div className="text-xs font-mono uppercase tracking-widest text-[#555] mt-2 not-italic">— Rick Rubin</div>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="border border-[#222] p-5 bg-[#0a0a0a]">
            <div className="text-xs font-mono uppercase tracking-widest text-[#444] mb-2">Essays</div>
            <div className="text-2xl text-white font-light">{stats.total_essays}</div>
          </div>
          <div className="border border-[#222] p-5 bg-[#0a0a0a]">
            <div className="text-xs font-mono uppercase tracking-widest text-[#444] mb-2">Words</div>
            <div className="text-2xl text-white font-light">{stats.total_words.toLocaleString()}</div>
          </div>
          <div className="border border-[#222] p-5 bg-[#0a0a0a]">
            <div className="text-xs font-mono uppercase tracking-widest text-[#444] mb-2">Tokens</div>
            <div className="text-2xl text-white font-light">{(stats.total_tokens || 0).toLocaleString()}</div>
          </div>
          <div className="border border-[#222] p-5 bg-[#0a0a0a]">
            <div className="text-xs font-mono uppercase tracking-widest text-[#444] mb-2">Avg Length</div>
            <div className="text-2xl text-white font-light">{stats.avg_words.toLocaleString()}</div>
          </div>
        </section>

        {/* Corpus Summary */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#444]">Corpus Summary</h2>
            <span className="text-[10px] font-mono text-[#555] border border-[#333] px-1.5 py-0.5 rounded">AI GENERATED</span>
          </div>
          <div className="text-lg text-[#aaa] font-light leading-relaxed border-l-2 border-white pl-6">
            {summary || "Summary not available."}
          </div>
        </section>

        {/* Latent Themes */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#444]">Extracted Themes</h2>
            <span className="text-[10px] font-mono text-[#555] border border-[#333] px-1.5 py-0.5 rounded">AI GENERATED</span>
          </div>

          <div className="space-y-6">
            {themes.map((theme: { name: string; score: number; description: string }, i: number) => (
              <div key={i} className="group">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-xl font-light text-[#ccc] group-hover:text-white transition-colors">
                    {theme.name}
                  </h3>
                  <span className="text-xs font-mono text-[#555]">{theme.score}%</span>
                </div>

                <div className="h-1 w-full bg-[#151515] mb-3 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-[#333] group-hover:bg-white transition-colors duration-500 rounded-full"
                    style={{ width: `${theme.score}%` }}
                  />
                </div>

                <p className="text-sm text-[#666] leading-relaxed">
                  {theme.description}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>

    </main>
  );
}
