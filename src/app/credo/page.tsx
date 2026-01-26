"use client";

import React, { useState } from "react";
import Quote from "@/components/quote";
import Link from "next/link";
import { OutOfDistributionVis, StructureBreakdownVis } from "@/components/credo-visualizations";
import { Sun, Moon } from "lucide-react";

export default function Credo() {
  const [isGerman, setIsGerman] = useState(true);
  const [isDark, setIsDark] = useState(true);

  const theme = isDark ? {
    bg: "bg-[#0a0a0a]",
    text: "text-[#ededed]",
    muted: "text-[#888]",
    subtle: "text-[#666]",
    border: "border-[#333]",
    accent: "text-white",
  } : {
    bg: "bg-[#fafaf9]",
    text: "text-[#1a1a1a]",
    muted: "text-[#666]",
    subtle: "text-[#888]",
    border: "border-[#e0e0e0]",
    accent: "text-[#1a1a1a]",
  };

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-24 right-6 md:right-24 z-50 p-2 rounded-full transition-colors ${
          isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/10 hover:bg-black/20 text-black"
        }`}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="relative z-10 pt-32 px-6 md:px-24 max-w-4xl mx-auto pb-32">

        {/* --- Opening Statement --- */}
        <header className="mb-16">
          <h1 className={`text-3xl md:text-4xl font-light leading-snug mb-8 font-[family-name:var(--font-serif)] ${theme.text}`}>
            I am guided by self-determination and I try to work on important, unlikely things.
          </h1>
        </header>

        {/* --- Human Focus Section --- */}
        <section className={`mb-12 pb-12 border-b ${theme.border}`}>
          <p className={`text-lg md:text-xl font-light leading-relaxed mb-6 font-[family-name:var(--font-serif)] ${theme.muted}`}>
            Human focus is the most misallocated resource on Earth.
          </p>

          <div className={`text-base leading-relaxed space-y-4 font-[family-name:var(--font-serif)] ${theme.muted}`}>
            <p>
              As computational systems improve, we must think deeply about <Link href="/writing/politzkis-law" className={`${theme.accent} border-b ${isDark ? "border-white/30 hover:border-white" : "border-black/30 hover:border-black"} transition-colors`}>where humans still stand above machines</Link>.
            </p>
            <p className={`text-sm font-mono pl-4 border-l-2 ${theme.border} ${theme.subtle}`}>
              Politzki's Law: Humans excel at high complexity, low data tasks—in other words, what is not known.
            </p>
            <p>
              Once we recognize this, the <Link href="/writing/politzkis-law" className={`${theme.accent} border-b ${isDark ? "border-white/30 hover:border-white" : "border-black/30 hover:border-black"} transition-colors`}>Human Focus Optimization Theory</Link> demands we direct our focus away from likely tasks and towards <strong className={theme.accent}>unlikely truth</strong>.
            </p>
          </div>
        </section>

        {/* --- Irreverence Section --- */}
        <section className={`mb-12 pb-12 border-b ${theme.border}`}>
          <h2 className={`text-sm font-mono uppercase tracking-widest mb-6 ${theme.accent}`}>
            Irreverence as a Virtue
          </h2>

          <blockquote className={`text-sm italic border-l-2 ${theme.border} pl-4 mb-6 leading-relaxed ${theme.subtle}`}>
            "Irreverence is a key to progress."
            <span className="block text-xs font-mono not-italic mt-2">— Joel Mokyr</span>
          </blockquote>

          <div className={`space-y-4 font-[family-name:var(--font-serif)] ${theme.muted}`}>
            <p className="text-base leading-relaxed">
              Irreverence isn't disrespect; it is the authentic independence required to assess the world as it is.
            </p>
            <p className="text-base leading-relaxed">
              Many institutions persist simply because they are established, even after they have decayed. Identifying obsolete structures is necessary to clear the way for innovations that were previously impossible.
            </p>
            <p className="text-base leading-relaxed">
              True progress can only be achieved by navigating <strong className={theme.accent}>out of distribution</strong>, into uncharted territory.
            </p>
          </div>
        </section>

        {/* --- Visualizations --- */}
        <section className={`mb-12 pb-12 border-b ${theme.border}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="h-48 w-full">
                <StructureBreakdownVis />
              </div>
              <div className={`text-xs font-mono uppercase tracking-widest ${theme.subtle}`}>
                Fig 1. Creative Destruction
              </div>
              <p className={`text-sm leading-relaxed ${theme.subtle}`}>
                Old frameworks must be cleared away to build room for better structures.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-48 w-full">
                <OutOfDistributionVis />
              </div>
              <div className={`text-xs font-mono uppercase tracking-widest ${theme.subtle}`}>
                Fig 2. Unlikely Truth
              </div>
              <p className={`text-sm leading-relaxed ${theme.subtle}`}>
                Directing focus away from the known and towards new, unlikely truth.
              </p>
            </div>
          </div>
        </section>

        {/* --- Quotes --- */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <div className={`h-px ${isDark ? "bg-[#333]" : "bg-[#ddd]"} w-8`} />
            <button
              onClick={() => setIsGerman(!isGerman)}
              className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${theme.subtle} hover:${theme.accent}`}
            >
              [{isGerman ? "Translate" : "Original"}]
            </button>
          </div>

          <div className="space-y-6">
            <Quote
              text={isGerman
                ? "Hat man sein wofür des Lebens, so verträgt man sich fast mit jedem wie."
                : "He who has a why to live can bear almost any how."}
              author="Friedrich Nietzsche"
              source="Twilight of the Idols"
            />

            <Quote
              text={isGerman
                ? "Wer immer strebend sich bemüht,\nden können wir erlösen."
                : "He who strives and lives to strive,\ncan earn redemption still."}
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
