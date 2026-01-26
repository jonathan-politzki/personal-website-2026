"use client";

import React, { useState, useEffect } from "react";
import Quote from "@/components/quote";
import Link from "next/link";
import { OutOfDistributionVis, StructureBreakdownVis } from "@/components/credo-visualizations";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/theme-context";

export default function Credo() {
  const [isGerman, setIsGerman] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const { setCredoIsDark } = useTheme();

  // Sync local isDark state with context for nav
  useEffect(() => {
    setCredoIsDark(isDark);
  }, [isDark, setCredoIsDark]);

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

      <div className="relative z-10 pt-32 px-6 md:px-16 max-w-5xl mx-auto pb-32">

        {/* --- Opening Statement --- */}
        <header className="mb-12">
          <h1 className={`text-3xl md:text-4xl font-light leading-snug font-[family-name:var(--font-serif)] ${theme.text}`}>
            I am guided by self-determination and I try to work on important, unlikely things.
          </h1>
        </header>

        {/* --- Human Focus Section --- */}
        <section className={`mb-10 pb-10 border-b ${theme.border}`}>
          <p className={`text-lg md:text-xl font-light leading-relaxed mb-5 font-[family-name:var(--font-serif)] ${theme.muted}`}>
            Human focus is the most misallocated resource on Earth.
          </p>

          <div className={`text-base leading-relaxed space-y-4 font-[family-name:var(--font-serif)] ${theme.muted}`}>
            <p>
              As computational systems improve, we must think deeply about <Link href="/writing/politzkis-law" className={`${theme.accent} border-b ${isDark ? "border-white/30 hover:border-white" : "border-black/30 hover:border-black"} transition-colors`}>where humans still stand above machines</Link>.
            </p>
            <p className={`text-sm font-mono ${theme.subtle}`}>
              Politzki's Law: Humans excel at high complexity, low data tasks—in other words, what is not known.
            </p>
            <p>
              Once we recognize this, the <Link href="/writing/politzkis-law" className={`${theme.accent} border-b ${isDark ? "border-white/30 hover:border-white" : "border-black/30 hover:border-black"} transition-colors`}>Human Focus Optimization Theory</Link> demands we direct our focus away from likely tasks and towards <strong className={theme.accent}>unlikely truth</strong>.
            </p>
          </div>
        </section>

        {/* --- Irreverence Section --- */}
        <section className={`mb-10 pb-10 border-b ${theme.border}`}>
          <h2 className={`text-sm font-mono uppercase tracking-widest mb-5 ${theme.accent}`}>
            Irreverence as a Virtue
          </h2>

          <p className={`text-sm italic mb-5 leading-relaxed ${theme.subtle}`}>
            "Irreverence is a key to progress." <span className="text-xs font-mono not-italic">— Joel Mokyr</span>
          </p>

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
        <section className={`mb-10 pb-10 border-b ${theme.border}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-44 w-full">
                <StructureBreakdownVis isDark={isDark} />
              </div>
              <div className={`text-xs font-mono uppercase tracking-widest ${theme.subtle}`}>
                Creative Destruction
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-44 w-full">
                <OutOfDistributionVis isDark={isDark} />
              </div>
              <div className={`text-xs font-mono uppercase tracking-widest ${theme.subtle}`}>
                Unlikely Truth
              </div>
            </div>
          </div>
        </section>

        {/* --- Quotes --- */}
        <section>
          <button
            onClick={() => setIsGerman(!isGerman)}
            className={`text-[10px] font-mono uppercase tracking-widest mb-4 transition-colors ${theme.subtle}`}
          >
            [{isGerman ? "Translate" : "Original"}]
          </button>

          <div className="space-y-4">
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
