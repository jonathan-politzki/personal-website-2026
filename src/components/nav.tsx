"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { Logo } from "@/components/logo";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWritingOpen, setIsWritingOpen] = useState(false);

  return (
    <>
      {/* Explicitly ensure z-index is highest and fixed positioning works */}
      <div className="fixed top-0 right-0 p-6 md:p-8 z-[100] pointer-events-none flex justify-between w-full items-start">
        {/* Logo - Top Left */}
        <Link href="/" className="pointer-events-auto p-2 text-white/80 hover:text-white transition-colors">
          <Logo className="w-8 h-8" />
        </Link>

        {/* Hamburger Menu Trigger - Top Right */}
        <button 
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto p-2 hover:bg-white/10 text-white/50 hover:text-white transition-colors rounded-md bg-black/20 backdrop-blur-sm md:bg-transparent"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Side Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 bg-[#0a0a0a] border-l border-[#222] z-[101] flex flex-col shadow-2xl overflow-y-auto"
            >
              {/* Close Button */}
              <div className="p-8 flex justify-end">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Links */}
              <nav className="flex flex-col px-8 gap-4">
                <Link onClick={() => setIsOpen(false)} href="/" className="text-sm font-mono uppercase tracking-widest text-[#888] hover:text-white hover:pl-2 transition-all">
                  00 // Home
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/credo" className="text-sm font-mono uppercase tracking-widest text-[#888] hover:text-white hover:pl-2 transition-all">
                  01 // Credo
                </Link>
                <div className="h-px w-full bg-[#222] my-2" />
                
                <Link onClick={() => setIsOpen(false)} href="/interests" className="text-sm font-mono uppercase tracking-widest text-[#888] hover:text-white hover:pl-2 transition-all">
                  02 // Interests
                </Link>
                
                {/* Nested Writing Menu */}
                <div>
                  <button 
                    onClick={() => setIsWritingOpen(!isWritingOpen)}
                    className="flex items-center justify-between w-full text-sm font-mono uppercase tracking-widest text-[#888] hover:text-white hover:pl-2 transition-all"
                  >
                    <span>03 // Writing</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isWritingOpen ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isWritingOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-4 border-l border-[#222] ml-2 mt-2 flex flex-col gap-2"
                      >
                        <Link onClick={() => setIsOpen(false)} href="/writing" className="text-xs font-mono uppercase tracking-widest text-[#555] hover:text-white py-1 block">
                          Overview
                        </Link>
                        <Link onClick={() => setIsOpen(false)} href="/writing/graph" className="text-xs font-mono uppercase tracking-widest text-[#555] hover:text-white py-1 block">
                          The Graph
                        </Link>
                        <Link onClick={() => setIsOpen(false)} href="/writing/dashboard" className="text-xs font-mono uppercase tracking-widest text-[#555] hover:text-white py-1 block">
                          Dashboard
                        </Link>
                        <Link onClick={() => setIsOpen(false)} href="/writing/read" className="text-xs font-mono uppercase tracking-widest text-[#555] hover:text-white py-1 block">
                          Library
                        </Link>
                        <Link onClick={() => setIsOpen(false)} href="/writing/chat" className="text-xs font-mono uppercase tracking-widest text-[#555] hover:text-white py-1 block">
                          Chat
                        </Link>
                        <Link onClick={() => setIsOpen(false)} href="/writing/compare" className="text-xs font-mono uppercase tracking-widest text-[#555] hover:text-white py-1 block">
                          Laboratory
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link onClick={() => setIsOpen(false)} href="/work" className="text-sm font-mono uppercase tracking-widest text-[#888] hover:text-white hover:pl-2 transition-all">
                  04 // Work
                </Link>
                
                <div className="h-px w-full bg-[#222] my-2" />
                
                <Link onClick={() => setIsOpen(false)} href="/connect" className="text-sm font-mono uppercase tracking-widest text-[#888] hover:text-white hover:pl-2 transition-all">
                  05 // Connect
                </Link>
              </nav>

              {/* Footer in Menu */}
              <div className="mt-auto p-8 border-t border-[#222]">
                <div className="text-[10px] font-mono text-[#444] uppercase tracking-widest mb-2">
                  Jonathan Politzki
                </div>
                <div className="text-[10px] font-mono text-[#333]">
                  System Status: Online
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
