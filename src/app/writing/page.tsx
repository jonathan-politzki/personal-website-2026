import Link from "next/link";

export default function WritingOverview() {
  return (
    <main className="min-h-screen flex">
      
      {/* Sidebar Navigation for Writing */}
      <aside className="w-64 border-r border-[#222] hidden md:flex flex-col fixed top-0 bottom-0 left-0 pt-32 pb-8 px-6 bg-[#0a0a0a] z-10">
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-4">Writing Engine</h2>
          <nav className="flex flex-col gap-3 font-mono text-sm text-[#888]">
             <Link href="/writing" className="text-white border-l-2 border-white pl-3 -ml-3">Overview</Link>
             <Link href="/writing/read" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Library</Link>
             <Link href="/writing/graph" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">The Graph</Link>
             <Link href="/writing/dashboard" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Dashboard</Link>
             <Link href="/writing/compare" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Laboratory</Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 pt-32 px-8 md:px-24 max-w-5xl">
        
        {/* Intro / Philosophy */}
        <section className="mb-32 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-8">
            I write to understand the world.
          </h1>
          <p className="text-xl md:text-2xl text-[#888] font-light leading-relaxed">
            Writing is not just output; it is a compilation process for the mind. 
            I experiment with how text can be dynamic, non-linear, and alive.
          </p>
        </section>

        {/* Text-Based Index (No Boxes) */}
        <section className="space-y-16 border-l border-[#222] pl-8">
          
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#444] mb-2 block">01 // Visualization</span>
            <Link href="/writing/graph" className="group">
              <h2 className="text-3xl font-medium text-[#ccc] group-hover:text-white transition-colors mb-2">The Graph</h2>
              <p className="text-[#666] max-w-xl">
                High-dimensionality clustering and temporal plotting of the essay corpus.
              </p>
            </Link>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#444] mb-2 block">02 // Meta-Analysis</span>
            <Link href="/writing/dashboard" className="group">
              <h2 className="text-3xl font-medium text-[#ccc] group-hover:text-white transition-colors mb-2">The Dashboard</h2>
              <p className="text-[#666] max-w-xl">
                AI-driven extraction of latent themes and insights across 50+ essays.
              </p>
            </Link>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#444] mb-2 block">03 // Reading</span>
            <Link href="/writing/read" className="group">
              <h2 className="text-3xl font-medium text-[#ccc] group-hover:text-white transition-colors mb-2">The Library</h2>
              <p className="text-[#666] max-w-xl">
                The complete archive. Read, chat, and interact with individual texts.
              </p>
            </Link>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#444] mb-2 block">04 // Experiments</span>
            <Link href="/writing/compare" className="group">
              <h2 className="text-3xl font-medium text-[#ccc] group-hover:text-white transition-colors mb-2">The Laboratory</h2>
              <p className="text-[#666] max-w-xl">
                Comparative analysis tools and dimensional re-writing experiments.
              </p>
            </Link>
          </div>

        </section>

      </div>

    </main>
  );
}
