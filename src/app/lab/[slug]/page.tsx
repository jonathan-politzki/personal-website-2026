"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Settings, X } from "lucide-react";
import Link from "next/link";

interface PostData {
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    type?: string;
  };
  content: string;
}

// Your preferred config as the baseline
type ThemeOption = "light" | "dark" | "sepia";
type LineHeightOption = "tight" | "normal" | "relaxed" | "loose";
type AlignOption = "left" | "justify";
type MeasureOption = "narrow" | "normal" | "wide";
type ParagraphOption = "spacing" | "indent";
type AccentOption = "mono" | "warm";

const themeClasses: Record<ThemeOption, { bg: string; text: string; muted: string; border: string }> = {
  light: { bg: "bg-[#fafaf9]", text: "text-[#1a1a1a]", muted: "text-[#666]", border: "border-[#e0e0e0]" },
  dark: { bg: "bg-[#0a0a0a]", text: "text-[#e0e0e0]", muted: "text-[#888]", border: "border-[#333]" },
  sepia: { bg: "bg-[#f4ecd8]", text: "text-[#3d3222]", muted: "text-[#6b5d4d]", border: "border-[#d4c4a8]" },
};

const lineHeightClasses: Record<LineHeightOption, string> = {
  tight: "leading-6",    // 1.5
  normal: "leading-7",   // 1.75
  relaxed: "leading-8",  // 2.0
  loose: "leading-9",    // 2.25
};

const measureClasses: Record<MeasureOption, string> = {
  narrow: "max-w-lg",   // ~512px - very focused
  normal: "max-w-2xl",  // ~672px - standard
  wide: "max-w-3xl",    // ~768px - expansive
};

const accentColors: Record<AccentOption, Record<ThemeOption, string>> = {
  mono: { light: "#1a1a1a", dark: "#e0e0e0", sepia: "#3d3222" },
  warm: { light: "#ea580c", dark: "#f59e0b", sepia: "#c2410c" },
};

export default function ReadingLab({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("");
  const [post, setPost] = useState<PostData | null>(null);
  const [showPanel, setShowPanel] = useState(true);

  // YOUR PREFERRED CONFIG AS DEFAULTS
  const [theme, setTheme] = useState<ThemeOption>("light");

  // NEW EXPERIMENTS - things science says matter
  const [lineHeight, setLineHeight] = useState<LineHeightOption>("normal");
  const [align, setAlign] = useState<AlignOption>("left");
  const [measure, setMeasure] = useState<MeasureOption>("normal");
  const [paragraph, setParagraph] = useState<ParagraphOption>("spacing");
  const [accent, setAccent] = useState<AccentOption>("mono");

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/post/${slug}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.error(err));
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-[#666] font-mono text-sm">Loading...</div>
      </div>
    );
  }

  const themeStyle = themeClasses[theme];

  return (
    <main className={`min-h-screen ${themeStyle.bg} ${themeStyle.text} transition-colors duration-300`}>
      {/* Control Panel Toggle */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`fixed top-20 right-4 z-50 p-3 rounded-full ${
          theme === "dark" ? "bg-white/10 hover:bg-white/20" : "bg-black/10 hover:bg-black/20"
        } transition-colors`}
      >
        {showPanel ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
      </button>

      {/* Control Panel */}
      {showPanel && (
        <div className={`fixed top-32 right-4 z-50 w-72 p-4 rounded-xl border ${
          theme === "dark"
            ? "bg-[#111] border-[#333]"
            : theme === "light"
            ? "bg-white border-[#ddd] shadow-lg"
            : "bg-[#efe6d5] border-[#d4c4a8] shadow-lg"
        }`}>
          <h3 className="font-mono text-xs uppercase tracking-widest mb-4 opacity-60">Reading Lab v2</h3>
          <p className="text-[10px] opacity-40 mb-4">Base: serif / light / high contrast / base size</p>

          {/* Theme */}
          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-wider mb-2 opacity-60">Theme</label>
            <div className="flex gap-1">
              {(["light", "dark", "sepia"] as ThemeOption[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex-1 py-1.5 px-2 text-xs font-mono rounded ${
                    theme === t
                      ? theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                      : theme === "dark" ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height - Science: optimal is 1.5-2.0x */}
          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-wider mb-2 opacity-60">
              Line Height <span className="opacity-40">(1.5-2.25x)</span>
            </label>
            <div className="flex gap-1">
              {(["tight", "normal", "relaxed", "loose"] as LineHeightOption[]).map((lh) => (
                <button
                  key={lh}
                  onClick={() => setLineHeight(lh)}
                  className={`flex-1 py-1.5 px-1 text-[10px] font-mono rounded ${
                    lineHeight === lh
                      ? theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                      : theme === "dark" ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  {lh}
                </button>
              ))}
            </div>
          </div>

          {/* Text Alignment - Science: ragged right reduces fatigue */}
          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-wider mb-2 opacity-60">
              Alignment
            </label>
            <div className="flex gap-1">
              {(["left", "justify"] as AlignOption[]).map((a) => (
                <button
                  key={a}
                  onClick={() => setAlign(a)}
                  className={`flex-1 py-1.5 px-2 text-xs font-mono rounded ${
                    align === a
                      ? theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                      : theme === "dark" ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  {a === "left" ? "ragged" : "justify"}
                </button>
              ))}
            </div>
          </div>

          {/* Measure/Line Length - Science: 45-75 chars optimal */}
          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-wider mb-2 opacity-60">
              Line Width <span className="opacity-40">(measure)</span>
            </label>
            <div className="flex gap-1">
              {(["narrow", "normal", "wide"] as MeasureOption[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMeasure(m)}
                  className={`flex-1 py-1.5 px-2 text-xs font-mono rounded ${
                    measure === m
                      ? theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                      : theme === "dark" ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Paragraph Style - indent vs spacing */}
          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-wider mb-2 opacity-60">
              Paragraphs
            </label>
            <div className="flex gap-1">
              {(["spacing", "indent"] as ParagraphOption[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setParagraph(p)}
                  className={`flex-1 py-1.5 px-2 text-xs font-mono rounded ${
                    paragraph === p
                      ? theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                      : theme === "dark" ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Accent (blockquote color) */}
          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-wider mb-2 opacity-60">
              Accent
            </label>
            <div className="flex gap-1">
              {(["mono", "warm"] as AccentOption[]).map((a) => (
                <button
                  key={a}
                  onClick={() => setAccent(a)}
                  className={`flex-1 py-1.5 px-2 text-xs font-mono rounded ${
                    accent === a
                      ? theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                      : theme === "dark" ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Current config */}
          <div className={`mt-4 pt-4 border-t ${theme === "dark" ? "border-[#333]" : "border-[#ccc]"}`}>
            <div className="text-[10px] font-mono opacity-40">
              {theme} / {lineHeight} / {align} / {measure} / {paragraph} / {accent}
            </div>
          </div>
        </div>
      )}

      {/* Article */}
      <article className={`${measureClasses[measure]} mx-auto pt-24 pb-32 px-6`}>
        {/* Back link */}
        <nav className="mb-8 pt-2">
          <Link
            href={`/writing/${slug}`}
            className={`group inline-flex items-center gap-2 ${themeStyle.muted} transition-colors`}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-mono text-sm uppercase tracking-widest">Back to Essay</span>
          </Link>
        </nav>

        {/* Header */}
        <header className={`mb-16 border-b pb-8 ${themeStyle.border}`}>
          <div className="flex flex-col gap-4 mb-8">
            <div className={`flex items-center gap-4 text-xs font-mono uppercase tracking-widest ${themeStyle.muted}`}>
              <time>{post.metadata.publishedAt}</time>
              <span>/</span>
              <span>Reading Lab v2</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-tight font-[family-name:var(--font-serif)]">
              {post.metadata.title}
            </h1>
          </div>
          <p className={`text-xl ${themeStyle.muted} font-light leading-relaxed`}>
            {post.metadata.summary}
          </p>
        </header>

        {/* Content */}
        <div
          className={`
            font-[family-name:var(--font-serif)]
            font-light
            text-base
            ${lineHeightClasses[lineHeight]}
            ${align === "justify" ? "text-justify hyphens-auto" : "text-left"}
            ${paragraph === "spacing" ? "space-y-6" : ""}
          `}
          style={{
            ["--accent-color" as string]: accentColors[accent][theme],
            ["--paragraph-indent" as string]: paragraph === "indent" ? "1.5em" : "0",
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <style jsx global>{`
          article p {
            text-indent: var(--paragraph-indent, 0);
            margin-bottom: ${paragraph === "indent" ? "0" : "1.5rem"};
          }
          article p:first-of-type {
            text-indent: 0;
          }
          article blockquote {
            border-left: 3px solid var(--accent-color, currentColor);
            padding-left: 1.5rem;
            margin: 1.5rem 0;
            font-style: italic;
            opacity: 0.9;
          }
          article h2, article h3 {
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 500;
          }
        `}</style>
      </article>
    </main>
  );
}
