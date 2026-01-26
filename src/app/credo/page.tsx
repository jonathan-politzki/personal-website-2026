"use client";

import React, { useState } from "react";
import Quote from "@/components/quote";
import Link from "next/link";
import { OutOfDistributionVis, StructureBreakdownVis } from "@/components/credo-visualizations";

export default function Credo() {
  const [isGerman, setIsGerman] = useState(true);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      
      <div className="relative z-10 pt-32 px-8 md:px-24 max-w-6xl mx-auto pb-32">
        
        {/* --- Core Statement --- */}
        <header className="mb-24 max-w-3xl">
          <blockquote className="text-2xl md:text-4xl font-light leading-relaxed border-l-4 border-white pl-8 py-2 text-[#ccc]">
            Human focus is the most misallocated resource on Earth.
          </blockquote>
          
          <div className="mt-12 text-lg md:text-xl text-[#888] font-light leading-relaxed space-y-8 pl-9">
            <p>
              As computational systems improve, we must think deeply about <Link href="/writing/politzkis-law" className="text-white border-b border-white/30 hover:border-white transition-colors">where humans still stand above machines</Link>.
            </p>
            <div className="text-sm md:text-base text-[#666] font-mono pl-4 border-l border-[#333]">
              // Politzki's Law: Humans excel at high complexity, low data tasks. <br/>
              // In other words, what is not known.
            </div>
            <p>
              Once we recognize this, the <Link href="/writing/politzkis-law#human-focus-optimization-theory" className="text-white border-b border-white/30 hover:border-white transition-colors">Human Focus Optimization Theory</Link> demands we direct our focus away from likely tasks and towards <strong className="text-white font-normal">unlikely truth</strong>, where we can truly leverage our human capabilities.
            </p>
          </div>
        </header>

        {/* --- Bridge: Irreverence as a Virtue --- */}
        <section className="mb-24 pl-9 max-w-3xl border-l border-[#222]">
           <h2 className="text-sm font-mono uppercase tracking-widest text-white mb-6">
             Irreverence as a Virtue
           </h2>
           
           <blockquote className="text-base text-[#888] italic border-l-2 border-[#444] pl-4 mb-8 leading-relaxed">
             “If the culture is heavily infused with respect and worship of ancient wisdom so that any intellectual innovation is considered deviant and blasphemous, technological creativity will be similarly constrained. Irreverence is a key to progress.”
             <br/>
             <span className="text-xs font-mono not-italic text-[#555] mt-2 block">— Joel Mokyr, A Culture of Growth</span>
           </blockquote>

           <div className="mb-8">
             <p className="text-lg text-[#aaa] leading-relaxed mb-6">
               Irreverence isn't disrespect; it is the authentic independence required to assess the world as it is.
             </p>
             <p className="text-lg text-[#aaa] leading-relaxed">
               Many institutions and procedures persist simply because they are established, even after they have decayed or ceased to be optimal. Identifying obsolete structures is a necessary step to clear the way for innovations that were previously impossible.
             </p>
             <p className="text-lg text-[#aaa] leading-relaxed mt-6">
               True progress can only be achieved by navigating <strong className="text-white">out of distribution</strong>, into uncharted territory.
             </p>
           </div>
        </section>

        {/* --- Visualizations Section --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 pl-9">
          
          {/* Graph 1: Structural Renewal */}
          <div className="space-y-4">
            <div className="h-64 w-full">
              <StructureBreakdownVis />
            </div>
            <div className="text-xs font-mono text-[#555] uppercase tracking-widest">
              Fig 1. Creative Destruction
            </div>
            <p className="text-sm text-[#666] leading-relaxed">
              Old frameworks must be actively cleared away to build room for better structures. Growth through change.
            </p>
          </div>

          {/* Graph 2: Out of Distribution */}
          <div className="space-y-4">
            <div className="h-64 w-full">
              <OutOfDistributionVis />
            </div>
            <div className="text-xs font-mono text-[#555] uppercase tracking-widest">
              Fig 2. Unlikely Truth
            </div>
            <p className="text-sm text-[#666] leading-relaxed">
              Directing focus away from Known / Likely and towards new Unlikely Truth and innovation.
            </p>
          </div>

        </section>

        {/* --- Quotes Section --- */}
        <section className="mb-32 max-w-2xl pl-9">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px bg-[#333] w-12" />
            <button 
              onClick={() => setIsGerman(!isGerman)}
              className="text-[10px] font-mono uppercase tracking-widest text-[#444] hover:text-white transition-colors"
            >
              [{isGerman ? "Translate" : "Reset"}]
            </button>
          </div>

          <div className="space-y-8">
            <Quote 
              text={isGerman 
                ? "Hat man sein wofür des Lebens, so verträgt man sich fast mit jedem wie." 
                : "He who has a why to live can bear almost any how."}
              author="Friedrich Nietzsche"
              source="Twilight of the Idols"
            />
            
            <Quote 
              text={isGerman 
                ? "Wer immer strebend sich bemüht, den können wir erlösen." 
                : "He who strives and lives to strive can earn redemption still."}
              author="Johann Wolfgang von Goethe"
              source="Faust, Part II"
            />

            <Quote 
              text={isGerman 
                ? "Nur wer sich wandelt, bleibt mit mir verwandt." 
                : "Only he who is constantly changing is my kin."}
              author="Friedrich Nietzsche"
              source="Posthumous Fragments"
            />
          </div>
        </section>

      </div>
    </main>
  );
}
