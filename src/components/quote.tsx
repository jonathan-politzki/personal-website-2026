"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuoteProps {
  text: string;
  author: string;
  source?: string;
}

export default function Quote({ text, author, source }: QuoteProps) {
  return (
    <div className="group cursor-default py-2">
      <div className="relative flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm md:text-base italic font-serif text-[#555] leading-relaxed whitespace-pre-line"
          >
            "{text}"
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-baseline gap-2 mt-1 opacity-60">
        <div className="text-[10px] font-bold text-[#444] uppercase tracking-wider">{author}</div>
        {source && <div className="text-[10px] text-[#333] font-mono uppercase tracking-widest">— {source}</div>}
      </div>
    </div>
  );
}
