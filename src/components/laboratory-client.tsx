"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, GitMerge } from "lucide-react";

function renderMarkdown(text: string) {
  let html = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#222] px-1 rounded">$1</code>');
  return html;
}

interface Post {
  slug: string;
  title: string;
}

export default function Laboratory({ posts }: { posts: Post[] }) {
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const [prompt, setPrompt] = useState("");
  const [externalText, setExternalText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const togglePost = (post: Post) => {
    if (selectedPosts.find(p => p.slug === post.slug)) {
      setSelectedPosts(prev => prev.filter(p => p.slug !== post.slug));
    } else {
      setSelectedPosts(prev => [...prev, post]);
    }
  };

  const runAnalysis = async () => {
    if (selectedPosts.length === 0 && !externalText) return;
    setIsLoading(true);
    setAnalysis("");

    try {
      const response = await fetch('/api/analyze-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slugs: selectedPosts.map(p => p.slug),
          externalText,
          prompt: prompt || "Compare and contrast these texts. Identify the main axes of agreement and disagreement."
        }),
      });

      const data = await response.json();
      setAnalysis(data.content || "Analysis failed.");
    } catch (e) {
      setAnalysis("Error running analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#222] hidden md:flex flex-col fixed top-0 bottom-0 left-0 pt-32 pb-8 px-6 bg-[#0a0a0a] z-10">
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-4">Writing Engine</h2>
          <nav className="flex flex-col gap-3 font-mono text-sm text-[#888]">
             <Link href="/writing" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Overview</Link>
             <Link href="/writing/read" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Library</Link>
             <Link href="/writing/graph" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">The Graph</Link>
             <Link href="/writing/dashboard" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Dashboard</Link>
             <Link href="/writing/chat" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Chat</Link>
             <Link href="/writing/compare" className="text-white border-l-2 border-white pl-3 -ml-3">Laboratory</Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 pt-24 md:pt-32 flex flex-col min-h-screen w-full">

        {/* Header */}
        <header className="px-6 md:px-8 pb-8 border-b border-[#222]">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-2">Laboratory</h1>
          <p className="text-sm text-[#666]">Select essays to compare, blend, or analyze together.</p>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row">

          {/* Essay Selection Panel */}
          <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-[#222] flex flex-col h-[300px] lg:h-auto">
            <div className="p-4 border-b border-[#222]">
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#666] mb-3">Selected</h2>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {selectedPosts.length === 0 ? (
                  <span className="text-xs text-[#444]">None selected</span>
                ) : (
                  selectedPosts.map(post => (
                    <span key={post.slug} className="text-[10px] bg-white text-black px-2 py-1 rounded flex items-center gap-1">
                      {post.title.slice(0, 20)}{post.title.length > 20 ? '...' : ''}
                      <button onClick={() => togglePost(post)}><X className="w-3 h-3" /></button>
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 max-h-[400px]">
              {posts.map(post => (
                <button
                  key={post.slug}
                  onClick={() => togglePost(post)}
                  className={`w-full text-left p-3 text-sm hover:bg-[#151515] transition-colors rounded mb-1 flex items-center gap-3 ${selectedPosts.find(p => p.slug === post.slug) ? 'bg-[#151515] text-white' : 'text-[#666]'}`}
                >
                  <div className={`w-3 h-3 border flex-shrink-0 ${selectedPosts.find(p => p.slug === post.slug) ? 'bg-white border-white' : 'border-[#444]'}`} />
                  <span className="truncate">{post.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Workspace */}
          <div className="flex-1 flex flex-col">

            {/* Visual */}
            <div className="p-4 flex items-center justify-center border-b border-[#222] min-h-[100px]">
              {selectedPosts.length === 0 && !externalText ? (
                <div className="text-[#333] font-mono text-sm uppercase tracking-widest">Select items to blend</div>
              ) : (
                <div className="flex gap-6 items-center flex-wrap justify-center">
                   {selectedPosts.map((p) => (
                     <div key={p.slug} className="w-20 h-24 border border-[#333] bg-[#111] flex items-center justify-center p-2 text-center text-[10px] text-[#888]">
                        {p.title.slice(0, 30)}
                     </div>
                   ))}
                   {externalText && (
                     <div className="w-20 h-24 border border-dashed border-[#333] bg-[#111] flex items-center justify-center p-2 text-center text-[10px] text-[#888]">
                        External
                     </div>
                   )}
                   <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-white/5">
                      <GitMerge className="w-5 h-5 text-white" />
                   </div>
                </div>
              )}
            </div>

            {/* Controls & Output */}
            <div className="flex flex-col xl:flex-row border-t border-[#222] flex-1">

               {/* Controls */}
               <div className="w-full xl:w-80 p-6 border-b xl:border-b-0 xl:border-r border-[#222] flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-[#444] block mb-2">Prompt</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. Compare the themes..."
                      className="w-full h-20 bg-[#111] border border-[#222] rounded p-3 text-sm text-[#ccc] focus:border-[#444] outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-[#444] block mb-2">External Text</label>
                    <textarea
                      value={externalText}
                      onChange={(e) => setExternalText(e.target.value)}
                      placeholder="Paste text to compare..."
                      className="w-full h-20 bg-[#111] border border-[#222] rounded p-3 text-sm text-[#ccc] focus:border-[#444] outline-none resize-none"
                    />
                  </div>

                  <button
                    onClick={runAnalysis}
                    disabled={isLoading || (selectedPosts.length === 0 && !externalText)}
                    className="w-full py-3 bg-white text-black font-medium rounded hover:bg-[#ccc] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Analyzing..." : "Run Analysis"}
                  </button>
               </div>

               {/* Output */}
               <div className="flex-1 p-6 overflow-y-auto max-h-[400px]">
                  {analysis ? (
                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-widest text-[#666] mb-4">Output</h3>
                      <div
                        className="leading-relaxed text-[#ccc] text-sm space-y-3"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(analysis)
                            .split('\n\n')
                            .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
                            .join('')
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-[#333] font-mono text-xs">
                      [Awaiting analysis]
                    </div>
                  )}
               </div>

            </div>
          </div>

        </div>
      </div>

    </main>
  );
}
