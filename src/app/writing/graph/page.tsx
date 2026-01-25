"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function WritingGraph() {
  const [xAxis, setXAxis] = useState("Temporal");
  const [yAxis, setYAxis] = useState("Contextual");

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col">
      
      {/* Controls Header */}
      <header className="pt-24 px-8 pb-8 border-b border-[#222] flex justify-between items-end">
        <div>
           <h1 className="text-4xl font-light text-white mb-2">The Graph</h1>
           <p className="text-[#666] font-mono text-sm">High-Dimensionality Clustering</p>
        </div>
        
        {/* Axis Selectors */}
        <div className="flex gap-8 text-sm font-mono">
           <div className="flex flex-col gap-1">
             <label className="text-[#444] uppercase text-[10px]">X-Axis</label>
             <select 
               value={xAxis} 
               onChange={(e) => setXAxis(e.target.value)}
               className="bg-[#111] text-[#ccc] border border-[#333] px-2 py-1 outline-none"
             >
               <option>Temporal</option>
               <option>Complexity</option>
               <option>Sentiment</option>
             </select>
           </div>
           <div className="flex flex-col gap-1">
             <label className="text-[#444] uppercase text-[10px]">Y-Axis</label>
             <select 
               value={yAxis} 
               onChange={(e) => setYAxis(e.target.value)}
               className="bg-[#111] text-[#ccc] border border-[#333] px-2 py-1 outline-none"
             >
               <option>Contextual</option>
               <option>Technicality</option>
               <option>Abstraction</option>
             </select>
           </div>
        </div>
      </header>

      {/* Graph Area */}
      <div className="flex-1 relative overflow-hidden bg-[#0d0d0d]">
         {/* Grid Background */}
         <div className="absolute inset-0 opacity-20" 
              style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '100px 100px' }} 
         />
         
         {/* Mock Nodes */}
         {[...Array(20)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute w-2 h-2 bg-white rounded-full cursor-pointer hover:scale-150 hover:bg-blue-400 transition-all"
             initial={{ x: 0, y: 0, opacity: 0 }}
             animate={{ 
               x: Math.random() * 1000, 
               y: Math.random() * 600,
               opacity: 1
             }}
             transition={{ duration: 1, delay: i * 0.05 }}
           >
             <div className="absolute top-4 left-1/2 -translate-x-1/2 w-max opacity-0 hover:opacity-100 text-[10px] bg-black border border-[#333] px-2 py-1 text-white pointer-events-none">
               Essay Title {i + 1}
             </div>
           </motion.div>
         ))}

         {/* Connections (Mock) */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <line x1="100" y1="100" x2="400" y2="300" stroke="white" strokeWidth="1" />
            <line x1="400" y1="300" x2="600" y2="200" stroke="white" strokeWidth="1" />
            <line x1="600" y1="200" x2="800" y2="500" stroke="white" strokeWidth="1" />
         </svg>
      </div>

    </main>
  );
}
