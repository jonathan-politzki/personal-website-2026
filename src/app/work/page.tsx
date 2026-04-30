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
          Builds important, unlikely technology businesses.
        </p>
      </section>

      {/* Projects */}
      <section className="space-y-24 border-l border-[#222] pl-8 md:pl-16">
        
        {/* Jean Memory */}
        <div className="group border border-[#222] bg-[#0a0a0a] p-8 hover:border-[#444] transition-colors max-w-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-medium text-white mb-2">
                Jean
              </h2>
              <span className="text-xs font-mono uppercase tracking-widest text-[#555]">
                Founded 2024 // Person Embeddings
              </span>
            </div>
            <a 
              href="https://jeanmemory.com" 
              target="_blank"
              className="p-2 border border-[#333] hover:bg-white hover:text-black transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          
          <div className="space-y-6 text-[#888] leading-relaxed">
            <p>
              A universal matching engine. Jean builds person embeddings — high-fidelity representations of who someone is — and the infrastructure to match them, at scale, against the people, opportunities, and ideas they are most compatible with in the world.
            </p>
            <p>
              The translation layer between humans and AI: capture enough of a person to render them as a vector, then let any application — agent, marketplace, social graph — query against it.
            </p>
            <div className="text-sm border-t border-[#222] pt-4">
              <strong className="text-[#ccc] font-normal block mb-2">From memory to matching</strong>
              <p>
                Jean started as an AI memory layer. The same representations that let an AI remember a user turn out to be the substrate for precision matchmaking — once a person is encoded, similarity and compatibility are just queries.
              </p>
            </div>
          </div>
        </div>

      </section>

    </main>
  );
}
