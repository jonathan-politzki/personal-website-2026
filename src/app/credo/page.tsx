import Link from "next/link";
import Quote from "@/components/quote";

export default function Credo() {
  return (
    <main className="min-h-screen pt-32 px-8 md:px-24 max-w-5xl mx-auto pb-32">
      
      {/* --- Header / Introduction --- */}
      <header className="mb-24">
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-8">
          Credo
        </h1>
        <p className="text-xl md:text-2xl text-[#888] font-light leading-relaxed max-w-3xl">
          I believe human focus is the most misallocated resource on Earth. 
          As computational systems improve, we must actively design for agency, continuity, and self-determination.
        </p>
      </header>

      {/* --- Quotes Section (Entry) --- */}
      <section className="mb-32 space-y-6 max-w-2xl border-l-2 border-[#222] pl-6 py-2">
        <Quote 
          text="Hat man sein wofür des Lebens, so verträgt man sich fast mit jedem wie."
          author="Friedrich Nietzsche"
          source="Twilight of the Idols"
        />
        
        <Quote 
          text="Wer immer strebend sich bemüht, den können wir erlösen."
          author="Johann Wolfgang von Goethe"
          source="Faust, Part II"
        />

        <Quote 
          text="Nur wer sich wandelt, bleibt mit mir verwandt."
          author="Friedrich Nietzsche"
          source="Posthumous Fragments"
        />
      </section>

      {/* --- Core Concepts --- */}
      <div className="space-y-32 pl-8 md:pl-16">
        
        <section>
          <span className="text-sm font-mono text-[#444] block mb-2">01 // The Problem</span>
          <h2 className="text-3xl font-medium text-white mb-6">Politzki's Law</h2>
          <p className="text-lg text-[#aaa] leading-relaxed max-w-2xl">
            The value of a human hour scales exponentially with the depth of focus applied, but our current infrastructure is designed to fragment that focus linearly.
          </p>
        </section>

        <section>
          <span className="text-sm font-mono text-[#444] block mb-2">02 // The Solution</span>
          <h2 className="text-3xl font-medium text-white mb-6">Human Focus Optimization</h2>
          <p className="text-lg text-[#aaa] leading-relaxed max-w-2xl">
            We need new guiding principles for complexity. I build systems (like Jean Memory) that offload context retention to machines, allowing humans to focus purely on synthesis and creation.
          </p>
        </section>

      </div>

    </main>
  );
}
