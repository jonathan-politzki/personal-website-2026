"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const Note = ({ children }: { children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="my-6 p-4 bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-200 text-sm font-mono rounded-r-lg"
  >
    <span className="block font-bold text-yellow-500 mb-1 uppercase text-xs tracking-wider">Note</span>
    {children}
  </motion.div>
);

export const JeanLink = () => (
  <a href="https://jeanmemory.com" className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 transition-colors mx-1 text-sm font-medium border border-blue-800">
    Jean Memory 🧠
  </a>
);

export const InteractiveGraph = ({ data }: { data: any[] }) => (
  <div className="my-8 p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Focus Efficiency Index</h4>
    <div className="flex items-end gap-4 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end gap-2 group">
          <div className="text-center text-xs text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {d.value}%
          </div>
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: `${d.value}%` }}
            transition={{ duration: 1, delay: i * 0.2 }}
            className="w-full bg-lime-500/20 border-t-2 border-lime-500 rounded-t-sm group-hover:bg-lime-500/40 transition-colors"
          />
          <div className="text-center text-[10px] md:text-xs font-mono uppercase text-neutral-500 truncate">
            {d.name}
          </div>
        </div>
      ))}
    </div>
  </div>
);
