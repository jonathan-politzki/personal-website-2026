import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Work() {
  return (
    <main className="min-h-screen pt-32 px-8 md:px-24 max-w-5xl mx-auto pb-32">
      
      {/* Intro */}
      <section className="mb-32 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-8">
          Irreverent Capital
        </h1>
        <p className="text-xl md:text-2xl text-[#888] font-light leading-relaxed">
          I try to work on unlikely, non-linear, important things.
          Irreverent Capital builds businesses that address unaddressed societal fractures.
        </p>
      </section>

      {/* Projects */}
      <section className="space-y-24 border-l border-[#222] pl-8 md:pl-16">
        
        {/* Jean Memory */}
        <div className="group">
          <span className="text-xs font-mono uppercase tracking-widest text-[#444] mb-2 block">Flagship // AI Infrastructure</span>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4">
            <h2 className="text-4xl md:text-5xl font-medium text-white group-hover:text-[#ccc] transition-colors">
              Jean Memory
            </h2>
            <a 
              href="https://jeanmemory.com" 
              target="_blank"
              className="hidden md:flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-[#666] hover:text-white transition-colors"
            >
              [Launch Terminal] <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          <p className="text-lg text-[#888] leading-relaxed max-w-2xl mb-8">
            The universal memory layer for machine intelligence. We build the infrastructure that allows AI to retain context, understand users, and evolve over time.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-[#555] uppercase tracking-widest">
             <span className="border border-[#222] px-2 py-1">Founded 2024</span>
             <span className="border border-[#222] px-2 py-1">Venture Backed</span>
             <span className="border border-[#222] px-2 py-1">Infrastructure</span>
          </div>
        </div>

        {/* Advisory / Other Work */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#444] mb-2 block">Collaboration</span>
          <h2 className="text-3xl font-medium text-white mb-4">
            Thematic Investing & Advisory
          </h2>
          <p className="text-[#888] leading-relaxed max-w-2xl mb-6">
            I collaborate with entrepreneurs, companies, and thematic investors who are building the future of cognition and human agency.
          </p>
          <a href="mailto:hello@jonathanpolitzki.com" className="text-sm font-mono uppercase tracking-widest text-[#666] hover:text-white transition-colors border-b border-[#333] hover:border-white pb-1">
            Initiate Contact
          </a>
        </div>

      </section>

    </main>
  );
}
