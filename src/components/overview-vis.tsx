"use client";

import React, { useEffect, useRef } from "react";

export function OverviewVis() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    let time = 0;

    const animate = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);
      time += 0.01;

      const centerX = width / 2;
      
      // 1. DATA POINTS (Top)
      // Scattered points falling into order
      const topY = height * 0.2;
      const spread = width * 0.6;
      
      ctx.fillStyle = "#fff";
      for(let i=0; i<20; i++) {
          const xOffset = Math.sin(i * 123 + time) * 20; // Subtle jitter
          const x = centerX + (i/19 - 0.5) * spread + xOffset;
          const y = topY + Math.cos(i * 45 + time * 2) * 10;
          
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI*2);
          ctx.fill();

          // Connections down to Framework
          if (Math.random() > 0.95) {
             ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
             ctx.beginPath();
             ctx.moveTo(x, y);
             ctx.lineTo(centerX, height * 0.5);
             ctx.stroke();
          }
      }

      // Arrow Down 1
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, topY + 30);
      ctx.lineTo(centerX, height * 0.4);
      ctx.stroke();

      // 2. FRAMEWORK (Middle)
      // Connected Geometric Structure
      const midY = height * 0.5;
      const size = 60;
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX, midY - size); // Top
      ctx.lineTo(centerX - size, midY); // Left
      ctx.lineTo(centerX, midY + size); // Bottom
      ctx.lineTo(centerX + size, midY); // Right
      ctx.lineTo(centerX, midY - size); // Close
      // Cross
      ctx.moveTo(centerX - size, midY);
      ctx.lineTo(centerX + size, midY);
      ctx.moveTo(centerX, midY - size);
      ctx.lineTo(centerX, midY + size);
      ctx.stroke();

      // Pulse
      const pulse = Math.sin(time * 2) * 5;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + Math.sin(time)*0.1})`;
      ctx.beginPath();
      ctx.arc(centerX, midY, size + 10 + pulse, 0, Math.PI*2);
      ctx.stroke();

      // Arrow Down 2
      ctx.strokeStyle = "#444";
      ctx.beginPath();
      ctx.moveTo(centerX, midY + size + 20);
      ctx.lineTo(centerX, height * 0.8);
      ctx.stroke();

      // 3. TEXT OUTPUT (Bottom)
      // Streaming lines of "text" going down/left/right
      const botY = height * 0.85;
      
      ctx.fillStyle = "#666";
      for(let i=0; i<5; i++) {
          // Center stream
          const w = 100 + Math.sin(time + i)*20;
          ctx.fillRect(centerX - w/2, botY + i * 12, w, 2);
          
          // Left stream
          ctx.fillRect(centerX - 150 - i*10, botY + i * 12 + 20, 60, 2);
          
          // Right stream
          ctx.fillRect(centerX + 100 + i*10, botY + i * 12 + 20, 60, 2);
      }

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    const handleResize = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full bg-[#0a0a0a]" />;
}
