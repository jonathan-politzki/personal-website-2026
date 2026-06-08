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
             <Link href="/writing/read" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Library</Link>
             <Link href="/writing/dashboard" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Dashboard</Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 h-screen overflow-hidden flex flex-col md:flex-row">

        {/* Left: Text (2/3 width) */}
        <div className="flex-[2] p-8 md:p-24 flex flex-col justify-center max-w-2xl bg-[#0a0a0a] z-10 relative">
          <header>
            <h1 className="text-5xl font-light tracking-tight text-white mb-8">
              Overview
            </h1>
            <div className="text-lg text-[#aaa] font-light leading-relaxed space-y-6">
              <p>
                I use writing to map and compress my belief system.
              </p>
            </div>
          </header>
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
