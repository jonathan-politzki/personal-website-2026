"use client";

import React, { useEffect, useRef } from "react";

export default function FrontierVis() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const points: { x: number; y: number; vx: number; vy: number; type: 'core' | 'outlier' }[] = [];
    const numCore = 800;
    const numOutlier = 15;

    // Initialize Core (The "Map" / Fractal-like structure)
    // We'll create a Mandelbrot-ish or just a noisy cluster layout
    for (let i = 0; i < numCore; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Distribution that clusters in the center but has "arms" (fractal-like feel)
      const r = Math.pow(Math.random(), 2) * (Math.min(width, height) * 0.25); 
      // Add some "arms"
      const armOffset = Math.sin(angle * 5) * 20; 
      
      points.push({
        x: width / 2 + (r + armOffset) * Math.cos(angle),
        y: height / 2 + (r + armOffset) * Math.sin(angle),
        vx: 0,
        vy: 0,
        type: 'core'
      });
    }

    // Initialize Outliers (The "Uncharted")
    for (let i = 0; i < numOutlier; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        type: 'outlier'
      });
    }

    let time = 0;

    const animate = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);
      
      time += 0.01;

      // Draw Connection Lines for Core (The Structure)
      ctx.strokeStyle = "rgba(50, 50, 50, 0.1)";
      ctx.beginPath();
      for (let i = 0; i < numCore; i += 2) {
        if (i + 1 < numCore) {
           const p1 = points[i];
           const p2 = points[i+1];
           const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
           if (dist < 30) {
             ctx.moveTo(p1.x, p1.y);
             ctx.lineTo(p2.x, p2.y);
           }
        }
      }
      ctx.stroke();

      // Draw Points
      points.forEach(p => {
        if (p.type === 'core') {
          // Slight jitter for core points
          const noise = Math.sin(time + p.x * 0.01) * 0.5;
          ctx.fillStyle = "rgba(100, 100, 100, 0.3)";
          ctx.fillRect(p.x + noise, p.y + noise, 1, 1);
        } else {
          // Outliers move and glow
          p.x += p.vx;
          p.y += p.vy;

          // Wrap around screen
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Draw Outlier (The "Focus")
          ctx.fillStyle = "#fff";
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Draw faint connection back to core if close enough (The "Bridge")
          const distToCenter = Math.hypot(p.x - width/2, p.y - height/2);
          if (distToCenter < width * 0.4 && distToCenter > width * 0.2) {
             ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
             ctx.beginPath();
             ctx.moveTo(p.x, p.y);
             ctx.lineTo(width/2, height/2);
             ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-screen"
    />
  );
}
