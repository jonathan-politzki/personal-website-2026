import Link from "next/link";
import { OverviewVis } from "@/components/overview-vis";

export default function WritingOverview() {
  return (
    <main className="min-h-screen flex">
      
      {/* Sidebar Navigation for Writing */}
      <aside className="w-64 border-r border-[#222] hidden md:flex flex-col fixed top-0 bottom-0 left-0 pt-32 pb-8 px-6 bg-[#0a0a0a] z-10">
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-4">Writing Engine</h2>
          <nav className="flex flex-col gap-3 font-mono text-sm text-[#888]">
             <Link href="/writing" className="text-white border-l-2 border-white pl-3 -ml-3">Overview</Link>
             <Link href="/writing/graph" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">The Graph</Link>
             <Link href="/writing/dashboard" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Dashboard</Link>
             <Link href="/writing/read" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Library</Link>
             <Link href="/writing/chat" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Chat</Link>
             <Link href="/writing/compare" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Laboratory</Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 h-screen overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Text (2/3 width) */}
        <div className="flex-[2] p-8 md:p-24 flex flex-col justify-center max-w-2xl bg-[#0a0a0a] z-10 relative">
          <header className="mb-12">
            <h1 className="text-5xl font-light tracking-tight text-white mb-8">
              Overview
            </h1>
            <div className="text-lg text-[#aaa] font-light leading-relaxed space-y-6">
              <p>
                Writing is a way to map and understand the world. It is a process of collecting signals and data points, structuring them into frameworks, and compressing them to build models of the world.
              </p>
              <p>
                Writing is sometimes overly linear. I am experimenting with different ways to represent and engage with ideas that are less limiting.
              </p>
            </div>
          </header>

          <div className="space-y-4 border-t border-[#222] pt-8 max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#444] block mb-2">Experiments</span>
            <ul className="space-y-2 font-mono text-sm text-[#666]">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#444] rounded-full" /> 
                Feature & Theme Extraction
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#444] rounded-full" /> 
                Direct Engagement via LLM (Chat)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#444] rounded-full" /> 
                Feature Toggling & Dimensional Re-writing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[#444] rounded-full" /> 
                Novel Textual Visualization & Matching
              </li>
            </ul>
            <p className="text-xs text-[#444] mt-4 pt-4 border-t border-[#222]">
              If you have ideas for other experiments, please <a href="mailto:jonathan.politzki@gmail.com" className="text-[#888] hover:text-white border-b border-[#444]">reach out</a>.
            </p>
          </div>
        </div>

        {/* Right: Visualization (1/3 width) */}
        <div className="flex-1 relative border-l border-[#222] bg-[#0a0a0a] hidden md:block">
           <div className="absolute inset-0">
             <OverviewVis />
           </div>
        </div>

      </div>

    </main>
  );
}
