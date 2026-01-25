import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Twitter, Mail, Mic } from "lucide-react";

export default function Connect() {
  return (
    <main className="min-h-screen pt-32 px-8 md:px-24 max-w-5xl mx-auto pb-32">
      
      <header className="mb-24">
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-8">
          Connect
        </h1>
        <p className="text-xl md:text-2xl text-[#888] font-light leading-relaxed max-w-2xl">
          Digital presence and communication channels.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 border-t border-[#222] pt-16">
        
        {/* Direct Contact */}
        <section className="space-y-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#444] block">Direct Line</span>
          <div>
            <a 
              href="mailto:hello@jonathanpolitzki.com" 
              className="text-2xl md:text-3xl font-mono text-white hover:text-[#888] transition-colors border-b border-[#333] hover:border-white pb-2"
            >
              hello@jonathanpolitzki.com
            </a>
          </div>
        </section>

        {/* Socials & Profiles */}
        <section className="space-y-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#444] block">Networks</span>
          <div className="flex flex-col gap-6">
            <a href="#" className="group flex items-center justify-between border-b border-[#222] pb-4 hover:border-white transition-colors">
              <span className="flex items-center gap-4 text-lg text-[#ccc] group-hover:text-white">
                <Twitter className="w-5 h-5" /> Twitter / X
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#444] group-hover:text-white" />
            </a>
            <a href="#" className="group flex items-center justify-between border-b border-[#222] pb-4 hover:border-white transition-colors">
              <span className="flex items-center gap-4 text-lg text-[#ccc] group-hover:text-white">
                <Linkedin className="w-5 h-5" /> LinkedIn
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#444] group-hover:text-white" />
            </a>
            <a href="#" className="group flex items-center justify-between border-b border-[#222] pb-4 hover:border-white transition-colors">
              <span className="flex items-center gap-4 text-lg text-[#ccc] group-hover:text-white">
                <Github className="w-5 h-5" /> GitHub
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#444] group-hover:text-white" />
            </a>
            <a href="https://jonathanpolitzki.substack.com" className="group flex items-center justify-between border-b border-[#222] pb-4 hover:border-white transition-colors">
              <span className="flex items-center gap-4 text-lg text-[#ccc] group-hover:text-white">
                <span className="w-5 h-5 bg-[#ff6719] rounded-sm flex items-center justify-center text-[10px] text-white font-bold">S</span> Substack
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#444] group-hover:text-white" />
            </a>
          </div>
        </section>

        {/* Media / Podcasts */}
        <section className="space-y-8 md:col-span-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#444] block">Appearances</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-[#111] border border-[#222] p-6 hover:border-white transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                   <Mic className="w-6 h-6 text-[#444] group-hover:text-white transition-colors" />
                   <span className="text-xs font-mono text-[#555]">2025</span>
                </div>
                <h3 className="text-xl text-white mb-2">The Future of Memory</h3>
                <p className="text-[#666] text-sm">Podcast Name • Episode 42</p>
             </div>
             
             {/* Placeholder for future podcasts */}
             <div className="bg-[#0a0a0a] border border-[#222] border-dashed p-6 flex items-center justify-center text-[#333] text-xs font-mono uppercase tracking-widest">
                [More Coming Soon]
             </div>
          </div>
        </section>

      </div>

    </main>
  );
}
