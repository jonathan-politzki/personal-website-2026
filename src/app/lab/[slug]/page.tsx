"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Settings, X } from "lucide-react";
import Link from "next/link";

// We'll fetch the post content client-side for this lab
interface PostData {
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    type?: string;
  };
  content: string;
}

type FontOption = "sans" | "serif" | "mono";
type ThemeOption = "dark" | "light" | "sepia";
type WeightOption = "light" | "regular" | "medium";
type ContrastOption = "muted" | "normal" | "high";
type SizeOption = "base" | "large" | "xl";

const fontClasses: Record<FontOption, string> = {
  sans: "font-sans",
  serif: "font-[family-name:var(--font-serif)]",
  mono: "font-mono",
};

const themeClasses: Record<ThemeOption, { bg: string; text: string; muted: string }> = {
  dark: { bg: "bg-[#0a0a0a]", text: "text-[#ededed]", muted: "text-[#888]" },
  light: { bg: "bg-[#fafaf9]", text: "text-[#1a1a1a]", muted: "text-[#666]" },
  sepia: { bg: "bg-[#f4ecd8]", text: "text-[#3d3222]", muted: "text-[#6b5d4d]" },
};

const weightClasses: Record<WeightOption, string> = {
  light: "font-light",
  regular: "font-normal",
  medium: "font-medium",
};

const contrastClasses: Record<ContrastOption, Record<ThemeOption, string>> = {
  muted: { dark: "text-[#aaa]", light: "text-[#555]", sepia: "text-[#5a4a3a]" },
  normal: { dark: "text-[#ccc]", light: "text-[#333]", sepia: "text-[#3d3222]" },
  high: { dark: "text-[#ededed]", light: "text-[#1a1a1a]", sepia: "text-[#2a1f14]" },
};

const sizeClasses: Record<SizeOption, string> = {
  base: "text-base leading-7",
  large: "text-lg leading-8",
  xl: "text-xl leading-9",
};

export default function ReadingLab({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("");
  const [post, setPost] = useState<PostData | null>(null);
  const [showPanel, setShowPanel] = useState(true);

  // Reading settings
  const [font, setFont] = useState<FontOption>("sans");
  const [theme, setTheme] = useState<ThemeOption>("dark");
  const [weight, setWeight] = useState<WeightOption>("light");
  const [contrast, setContrast] = useState<ContrastOption>("muted");
  const [size, setSize] = useState<SizeOption>("large");

  // Resolve params
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  // Fetch post data
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/post/${slug}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.error(err));
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#666] font-mono text-sm">Loading...</div>
      </div>
    );
  }

  const themeStyle = themeClasses[theme];
  const textContrast = contrastClasses[contrast][theme];

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
        <div className={`fixed top-32 right-4 z-50 w-64 p-4 rounded-xl border ${
          theme === "dark"
            ? "bg-[#111] border-[#333]"
            : theme === "light"
            ? "bg-white border-[#ddd] shadow-lg"
            : "bg-[#efe6d5] border-[#d4c4a8] shadow-lg"
        }`}>
          <h3 className="font-mono text-xs uppercase tracking-widest mb-4 opacity-60">Reading Lab</h3>

          {/* Font */}
          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-wider mb-2 opacity-60">Font</label>
            <div className="flex gap-1">
              {(["sans", "serif", "mono"] as FontOption[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFont(f)}
                  className={`flex-1 py-1.5 px-2 text-xs font-mono rounded ${
                    font === f
                      ? theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                      : theme === "dark" ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-wider mb-2 opacity-60">Theme</label>
            <div className="flex gap-1">
              {(["dark", "light", "sepia"] as ThemeOption[]).map((t) => (
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

          {/* Weight */}
          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-wider mb-2 opacity-60">Weight</label>
            <div className="flex gap-1">
              {(["light", "regular", "medium"] as WeightOption[]).map((w) => (
                <button
                  key={w}
                  onClick={() => setWeight(w)}
                  className={`flex-1 py-1.5 px-2 text-xs font-mono rounded ${
                    weight === w
                      ? theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                      : theme === "dark" ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Contrast */}
          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-wider mb-2 opacity-60">Contrast</label>
            <div className="flex gap-1">
              {(["muted", "normal", "high"] as ContrastOption[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setContrast(c)}
                  className={`flex-1 py-1.5 px-2 text-xs font-mono rounded ${
                    contrast === c
                      ? theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                      : theme === "dark" ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-4">
            <label className="block text-xs font-mono uppercase tracking-wider mb-2 opacity-60">Size</label>
            <div className="flex gap-1">
              {(["base", "large", "xl"] as SizeOption[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-1.5 px-2 text-xs font-mono rounded ${
                    size === s
                      ? theme === "dark" ? "bg-white text-black" : "bg-black text-white"
                      : theme === "dark" ? "bg-white/10" : "bg-black/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Current combo display */}
          <div className={`mt-4 pt-4 border-t ${theme === "dark" ? "border-[#333]" : "border-[#ccc]"}`}>
            <div className="text-[10px] font-mono opacity-40">
              {font} / {theme} / {weight} / {contrast} / {size}
            </div>
          </div>
        </div>
      )}

      {/* Article */}
      <article className="max-w-2xl mx-auto pt-24 pb-32 px-6">
        {/* Back link */}
        <nav className="mb-8 pt-2">
          <Link
            href={`/writing/${slug}`}
            className={`group inline-flex items-center gap-2 ${themeStyle.muted} hover:${themeStyle.text} transition-colors`}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-mono text-sm uppercase tracking-widest">Back to Essay</span>
          </Link>
        </nav>

        {/* Header */}
        <header className={`mb-16 border-b pb-8 ${theme === "dark" ? "border-[#222]" : "border-[#ddd]"}`}>
          <div className="flex flex-col gap-4 mb-8">
            <div className={`flex items-center gap-4 text-xs font-mono uppercase tracking-widest ${themeStyle.muted}`}>
              <time>{post.metadata.publishedAt}</time>
              <span>/</span>
              <span>Reading Lab</span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-medium tracking-tight leading-tight ${fontClasses[font]}`}>
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
            ${fontClasses[font]}
            ${weightClasses[weight]}
            ${textContrast}
            ${sizeClasses[size]}
            space-y-6
          `}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
