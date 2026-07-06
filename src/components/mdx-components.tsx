"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const Note = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="my-6 rounded-r-lg border-l-4 border-rule bg-[#f2f1ec] p-4 font-mono text-sm text-muted"
  >
    <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">Note</span>
    {children}
  </motion.div>
);

export const JeanLink = () => (
  <a
    href="https://jeanmemory.com"
    className="mx-1 inline-flex items-center rounded border border-rule bg-[#f2f1ec] px-1.5 py-0.5 text-sm font-medium text-ink transition-colors hover:border-ink"
  >
    Jean Memory 🧠
  </a>
);

export const InteractiveGraph = ({ data }: { data: { name: string; value: number }[] }) => (
  <div className="my-8 rounded-xl border border-rule bg-[#f2f1ec] p-6">
    <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">Focus Efficiency Index</h4>
    <div className="flex h-32 items-end gap-4">
      {data.map((d, i) => (
        <div key={i} className="group flex flex-1 flex-col justify-end gap-2">
          <div className="text-center text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100">
            {d.value}%
          </div>
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: `${d.value}%` }}
            transition={{ duration: 1, delay: i * 0.2 }}
            className="w-full rounded-t-sm border-t-2 border-ink bg-ink/10 transition-colors group-hover:bg-ink/20"
          />
          <div className="truncate text-center font-mono text-[10px] uppercase text-muted md:text-xs">
            {d.name}
          </div>
        </div>
      ))}
    </div>
  </div>
);
