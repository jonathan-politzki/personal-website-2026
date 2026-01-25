"use client";

import React, { useEffect, useRef } from "react";

export function OutOfDistributionVis() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Cellular Automata State (1D CA spread into 2D or just a grid CA)
    // Let's do a simple 2D Game of Life-ish texture for the "Known"
    const gridSize = 4;
    const cols = Math.ceil(width / gridSize);
    const rows = Math.ceil(height / gridSize);
    let grid = new Array(cols * rows).fill(0).map(() => Math.random() > 0.8 ? 1 : 0);

    // The "Outlier" Point (Static target)
    const targetX = width * 0.85;
    const targetY = height * 0.2;

    let time = 0;

    const animate = () => {
      // Clear
      ctx.fillStyle = "#0d0d0d";
      ctx.fillRect(0, 0, width, height);
      
      time++;

      // 1. Draw "Known / Likely" (Cellular Automata Blob)
      // Confine it to the bottom-left area
      ctx.fillStyle = "rgba(100, 100, 100, 0.3)";
      
      // Evolve CA slightly
      if (time % 5 === 0) {
        const newGrid = [...grid];
        for (let i = 0; i < grid.length; i++) {
           const x = i % cols;
           const y = Math.floor(i / cols);
           
           // Bias towards bottom-left
           const distToOrigin = Math.hypot(x, y - rows);
           const bias = distToOrigin < Math.min(cols, rows) * 0.8 ? 0.6 : 0.1;
           
           if (Math.random() < 0.05) {
             newGrid[i] = Math.random() < bias ? 1 : 0;
           }
        }
        grid = newGrid;
      }

      for (let i = 0; i < grid.length; i++) {
        if (grid[i]) {
          const x = (i % cols) * gridSize;
          const y = Math.floor(i / cols) * gridSize;
          
          // Only draw if within a "fractal" radius
          const cx = width * 0.3;
          const cy = height * 0.7;
          const r = width * 0.35;
          const d = Math.hypot(x - cx, y - cy);
          
          if (d < r + Math.sin(x * 0.1) * 20) {
             ctx.fillRect(x, y, gridSize - 1, gridSize - 1);
          }
        }
      }

      // Label "Known / Likely"
      ctx.fillStyle = "#666";
      ctx.font = "10px monospace";
      ctx.fillText("KNOWN / LIKELY", width * 0.2, height * 0.8);

      // 2. Draw "Unknown / Unlikely" (The Point)
      ctx.fillStyle = "#fff";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#fff";
      ctx.beginPath();
      ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label "Unknown / Unlikely"
      ctx.fillText("UNKNOWN / UNLIKELY", targetX - 50, targetY + 20);

      // 3. Draw The Arrow (Vector of Focus)
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      
      // Calculate edge of the known blob
      const startX = width * 0.4;
      const startY = height * 0.6;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(targetX - 10, targetY + 5);
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2((targetY + 5) - startY, (targetX - 10) - startX);
      ctx.beginPath();
      ctx.moveTo(targetX - 10, targetY + 5);
      ctx.lineTo(targetX - 10 - 10 * Math.cos(angle - Math.PI / 6), targetY + 5 - 10 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(targetX - 10 - 10 * Math.cos(angle + Math.PI / 6), targetY + 5 - 10 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = "#fff";
      ctx.fill();

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full bg-[#0d0d0d] border border-[#222]" />;
}

export function StructureBreakdownVis() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // --- GEOMETRY DATA ---
    // Small House (Simple)
    const smallHouse = [
      {x: 0.3, y: 0.8}, {x: 0.3, y: 0.5}, // Left Wall
      {x: 0.7, y: 0.8}, {x: 0.7, y: 0.5}, // Right Wall
      {x: 0.3, y: 0.5}, {x: 0.5, y: 0.3}, // Roof Left
      {x: 0.7, y: 0.5}, {x: 0.5, y: 0.3}, // Roof Right
      {x: 0.3, y: 0.8}, {x: 0.7, y: 0.8}, // Floor
    ];

    // Large Castle (Complex)
    const largeCastle = [
      {x: 0.2, y: 0.8}, {x: 0.2, y: 0.4}, // Tower 1 Left
      {x: 0.3, y: 0.8}, {x: 0.3, y: 0.4}, // Tower 1 Right
      {x: 0.2, y: 0.4}, {x: 0.25, y: 0.3}, {x: 0.3, y: 0.4}, // Tower 1 Roof
      
      {x: 0.7, y: 0.8}, {x: 0.7, y: 0.4}, // Tower 2 Left
      {x: 0.8, y: 0.8}, {x: 0.8, y: 0.4}, // Tower 2 Right
      {x: 0.7, y: 0.4}, {x: 0.75, y: 0.3}, {x: 0.8, y: 0.4}, // Tower 2 Roof

      {x: 0.3, y: 0.6}, {x: 0.7, y: 0.6}, // Bridge
      {x: 0.4, y: 0.6}, {x: 0.4, y: 0.5}, {x: 0.6, y: 0.5}, {x: 0.6, y: 0.6}, // Keep
      {x: 0.2, y: 0.8}, {x: 0.8, y: 0.8}, // Floor
    ];

    let cycle = 0; // 0 to 1

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      cycle += 0.003; // Slower cycle
      if (cycle > 1) cycle = 0;

      const phase = cycle < 0.4 ? 'small' : cycle < 0.6 ? 'breakdown' : 'large';
      
      ctx.lineWidth = 2;

      let pointsToDraw: {x: number, y: number}[] = [];
      let label = "";

      if (phase === 'small') {
        pointsToDraw = smallHouse;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        label = "OLD STRUCTURE";
      } else if (phase === 'breakdown') {
        // Transition / Explosion
        const p = (cycle - 0.4) * 5; // 0 to 1 during breakdown
        pointsToDraw = smallHouse.map(pt => ({
           x: pt.x + (Math.random() - 0.5) * p * 0.5,
           y: pt.y + (Math.random() - 0.5) * p * 0.5 + p * 0.2 // Fall down
        }));
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 - p * 0.5})`; // Fade out
        label = "DECONSTRUCTION";
      } else {
        // Rebuild into Castle
        const p = (cycle - 0.6) * 2.5; // 0 to 1 build up
        // Lerp from messy to clean castle
        pointsToDraw = largeCastle.map(pt => {
           // Start from scattered position (simulated) to target
           const scatterX = pt.x + (Math.random()-0.5) * (1-p) * 0.2;
           const scatterY = pt.y + (Math.random()-0.5) * (1-p) * 0.2;
           return {x: scatterX, y: scatterY};
        });
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + p * 0.7})`; // Fade in
        label = "NEW ARCHITECTURE";
      }

      // Draw Lines
      ctx.beginPath();
      for (let i = 0; i < pointsToDraw.length; i+=2) {
         if (i+1 < pointsToDraw.length) {
            ctx.moveTo(pointsToDraw[i].x * width, pointsToDraw[i].y * height);
            ctx.lineTo(pointsToDraw[i+1].x * width, pointsToDraw[i+1].y * height);
         }
      }
      ctx.stroke();

      // Label
      ctx.fillStyle = "#666";
      ctx.font = "10px monospace";
      ctx.fillText(label, 20, 20);

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full bg-[#0d0d0d] border border-[#222]" />;
}
