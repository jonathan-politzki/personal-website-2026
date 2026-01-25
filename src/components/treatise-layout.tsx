"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Clock, FileText, Hash, Share2, Printer, Eye, Battery, Wifi } from 'lucide-react';
import Link from 'next/link';

type Heading = {
  id: string;
  text: string;
  level: number;
};

export default function TreatiseLayout({ 
  children, 
  metadata, 
  headings 
}: { 
  children: React.ReactNode;
  metadata: any;
  headings: Heading[];
}) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeHeading, setActiveHeading] = useState("");
  const [time, setTime] = useState("");
  
  // HUD Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for headings
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -60% 0%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#a0a0a0] font-mono selection:bg-lime-900 selection:text-white overflow-x-hidden">
      
      {/* --- HUD: Top Bar (Fixed) --- */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-[#0a0a0a] border-b border-[#222] z-50 flex items-center justify-between px-4 text-xs font-bold tracking-widest uppercase">
        <div className="flex items-center gap-6">
           <Link href="/writing" className="flex items-center gap-2 text-lime-500 hover:text-lime-300 transition-colors">
              <ArrowLeft className="w-3 h-3" /> EXIT TERMINAL
           </Link>
           <span className="hidden md:inline-block text-[#444]">|</span>
           <span className="hidden md:inline-block text-white truncate max-w-[300px]">{metadata.title}</span>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-2 text-[#444]">
              <Wifi className="w-3 h-3" /> <span className="text-lime-500">ONLINE</span>
           </div>
           <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-lime-500" /> {time}
           </div>
        </div>

        {/* Reading Progress Bar (Attached to bottom of header) */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-lime-500 origin-left"
          style={{ scaleX }}
        />
      </header>

      {/* --- HUD: Left Sidebar (Navigation) --- */}
      <nav className="fixed top-12 left-0 bottom-0 w-64 bg-[#080808] border-r border-[#222] hidden xl:flex flex-col z-40">
         <div className="p-4 border-b border-[#222]">
            <h2 className="text-[10px] text-[#555] mb-2">DOCUMENT STRUCTURE</h2>
            <div className="flex items-center gap-2 text-lime-500">
               <Hash className="w-4 h-4" /> 
               <span className="text-sm font-bold">{headings.length} SECTIONS</span>
            </div>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-[#222] scrollbar-track-transparent">
            {headings.map((heading) => (
               <a 
                 key={heading.id}
                 href={`#${heading.id}`}
                 className={`block text-[10px] py-1 leading-tight transition-colors border-l-2 pl-3 ${
                    activeHeading === heading.id 
                    ? 'border-lime-500 text-lime-400' 
                    : 'border-transparent text-[#444] hover:text-[#888]'
                 }`}
                 style={{ marginLeft: (heading.level - 2) * 8 }}
               >
                  {heading.text}
               </a>
            ))}
         </div>
         <div className="p-4 border-t border-[#222] bg-[#050505]">
            <div className="grid grid-cols-2 gap-2 text-[10px] text-[#444]">
               <div className="flex flex-col">
                  <span>WORDS</span>
                  <span className="text-white">15,420</span>
               </div>
               <div className="flex flex-col">
                  <span>EST. READ</span>
                  <span className="text-white">65 MIN</span>
               </div>
            </div>
         </div>
      </nav>

      {/* --- HUD: Right Sidebar (Context/Meta) --- */}
      <aside className="fixed top-12 right-0 bottom-0 w-12 border-l border-[#222] bg-[#080808] hidden lg:flex flex-col items-center py-4 gap-6 z-40">
         <div className="flex flex-col gap-4">
             <button className="p-2 text-[#444] hover:text-white transition-colors" title="Print PDF">
                <Printer className="w-4 h-4" />
             </button>
             <button className="p-2 text-[#444] hover:text-white transition-colors" title="Share">
                <Share2 className="w-4 h-4" />
             </button>
         </div>
         <div className="flex-1 w-[1px] bg-[#222]" />
         <div className="writing-mode-vertical text-[10px] text-[#333] tracking-[0.2em] font-bold">
            JONATHAN POLITZKI // ARCHIVE
         </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="pt-24 pb-32 px-4 md:px-12 xl:pl-80 xl:pr-32 max-w-[1920px] mx-auto min-h-screen relative">
         
         {/* Background Grid Lines (Subtle) */}
         <div className="absolute inset-0 pointer-events-none" 
              style={{ backgroundImage: 'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.2 }}>
         </div>

         {/* Document Header */}
         <div className="mb-20 max-w-4xl border-b border-[#222] pb-12 relative z-10">
            <div className="inline-block bg-lime-500/10 border border-lime-500/20 text-lime-400 px-3 py-1 text-xs font-bold mb-6">
               CLASSIFIED: PUBLIC // TYPE: {metadata.type?.toUpperCase() || 'DOCUMENT'}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8 uppercase">
               {metadata.title}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#666] border-t border-[#222] pt-8">
               <div>
                  <span className="block text-[#444] mb-1">PUBLISHED</span>
                  {metadata.publishedAt}
               </div>
               <div className="md:col-span-2">
                  <span className="block text-[#444] mb-1">ABSTRACT</span>
                  {metadata.summary}
               </div>
            </div>
         </div>

         {/* Content Wrapper */}
         <div className="prose prose-invert prose-lg max-w-4xl relative z-10
            prose-headings:font-bold prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-white
            prose-p:text-[#b0b0b0] prose-p:leading-8
            prose-a:text-lime-500 prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-2 prose-blockquote:border-lime-500 prose-blockquote:bg-[#0a0a0a] prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:text-white prose-blockquote:font-normal prose-blockquote:not-italic
            prose-strong:text-white prose-code:text-lime-400 prose-code:bg-[#111] prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm
         ">
            {children}
         </div>

      </main>

      {/* Footer "System" Status */}
      <footer className="fixed bottom-0 left-0 right-0 h-8 bg-[#0a0a0a] border-t border-[#222] z-50 flex items-center justify-between px-4 text-[10px] text-[#444] uppercase tracking-wider">
         <div>
            SYSTEM STATUS: <span className="text-lime-500">OPTIMAL</span>
         </div>
         <div className="flex gap-4">
            <span>RENDER: REACT/NEXT.JS</span>
            <span>LATENCY: 12ms</span>
         </div>
      </footer>
    </div>
  );
}
