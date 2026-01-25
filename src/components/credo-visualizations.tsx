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

    // The "Outlier" Point
    const targetX = width * 0.85;
    const targetY = height * 0.2;

    let time = 0;

    const animate = () => {
      ctx.fillStyle = "#0d0d0d";
      ctx.fillRect(0, 0, width, height);
      time += 0.005;

      // 1. Draw "Known" Distribution (Fractal/Organic Cloud)
      // Re-implementing the perlin-noise-like blob layer to ensure it looks "fractal" and "in-distribution"
      const centerX = width * 0.25;
      const centerY = height * 0.75;
      const baseRadius = Math.min(width, height) * 0.25;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Draw multiple layers for depth/fractal feel
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const layerOffset = layer * 15;
        ctx.fillStyle = `rgba(100, 100, 100, ${0.05 + layer * 0.02})`;
        ctx.strokeStyle = `rgba(150, 150, 150, ${0.1 + layer * 0.05})`;
        ctx.lineWidth = 1;

        for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
          // Static noise based on angle (fractal edge)
          const n1 = Math.sin(angle * 7) * 10;
          const n2 = Math.cos(angle * 13) * 8;
          const n3 = Math.sin(angle * 29) * 4;
          const r = baseRadius - layerOffset + n1 + n2 + n3;
          
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);
          
          if (angle === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();

      // Label
      ctx.fillStyle = "#666";
      ctx.font = "10px monospace";
      ctx.fillText("KNOWN / LIKELY (IN-DISTRIBUTION)", 20, height - 20);

      // 2. Draw "Unknown" Point (Out of Distribution)
      ctx.fillStyle = "#fff";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#fff";
      ctx.beginPath();
      ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.fillText("UNKNOWN / UNLIKELY", targetX - 60, targetY + 20);

      // 3. Vector Arrow (The Focus)
      // Start from the edge of the cloud roughly pointing towards target
      const angleToTarget = Math.atan2(targetY - centerY, targetX - centerX);
      const startR = baseRadius + 15; // slightly outside blob
      const startX = centerX + startR * Math.cos(angleToTarget);
      const startY = centerY + startR * Math.sin(angleToTarget);
      
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      
      // Animate dash
      ctx.setLineDash([4, 6]); 
      ctx.lineDashOffset = -time * 30; 
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(targetX - 10, targetY + 5);
      ctx.stroke();
      ctx.setLineDash([]); 

      // Arrowhead
      const angle = Math.atan2((targetY + 5) - startY, (targetX - 10) - startX);
      ctx.beginPath();
      ctx.moveTo(targetX - 10, targetY + 5);
      ctx.lineTo(targetX - 10 - 10 * Math.cos(angle - Math.PI / 6), targetY + 5 - 10 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(targetX - 10 - 10 * Math.cos(angle + Math.PI / 6), targetY + 5 - 10 * Math.sin(angle + Math.PI / 6));
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

    // --- GEOMETRY ---
    // 1. Delta (Triangle) - TRUE EQUILATERAL
    // Side length s
    const s = Math.min(width, height) * 0.4;
    const h = s * Math.sqrt(3) / 2;
    const cx = 0.5 * width;
    const cy = 0.5 * height;
    
    // Centroid offsets: Top is 2/3 h from centroid? No, centroid divides median 2:1
    // Distance from center to vertex = s / sqrt(3)
    const rTri = s / Math.sqrt(3); 
    
    const triangle = [
      {x: cx, y: cy - rTri}, // Top
      {x: cx - s/2, y: cy + rTri/2}, // Bottom Left
      {x: cx + s/2, y: cy + rTri/2}, // Bottom Right
      {x: cx, y: cy - rTri} // Close
    ];

    // 2. Crystal (Perfect Geometric Structure)
    // Hexagon radius
    const rHex = s * 0.6;
    const crystal = [];
    // Outer Hexagon points
    for(let i=0; i<6; i++) {
        const angle = (i * 60 - 90) * Math.PI / 180;
        crystal.push({
            x: cx + rHex * Math.cos(angle),
            y: cy + rHex * Math.sin(angle)
        });
    }
    // Add Center
    crystal.push({x: cx, y: cy});

    let cycle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      cycle += 0.002; // Pace check
      if (cycle > 1) cycle = 0;

      let label = "";
      ctx.lineWidth = 1.5;

      // PHASE 1: STABLE TRIANGLE (0.0 - 0.2)
      if (cycle < 0.2) {
         ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
         ctx.beginPath();
         ctx.moveTo(triangle[0].x, triangle[0].y);
         for(let i=1; i<triangle.length; i++) ctx.lineTo(triangle[i].x, triangle[i].y);
         ctx.stroke();
         label = "ORIGIN // DELTA";
      }
      // PHASE 2: DECONSTRUCTION (0.2 - 0.5)
      else if (cycle < 0.5) {
         const p = (cycle - 0.2) * 3.33; // 0 to 1
         // Fade out
         ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 - p * 0.7})`;
         
         ctx.beginPath();
         for(let i=0; i<triangle.length-1; i++) {
             const p1 = triangle[i];
             const p2 = triangle[i+1];
             // Fragment center drifts
             const driftX = (Math.random()-0.5) * 50 * p;
             const driftY = p * 50; // Fall down
             
             // Draw the segment drifting away
             ctx.moveTo(p1.x + driftX, p1.y + driftY);
             ctx.lineTo(p2.x + driftX, p2.y + driftY);
         }
         ctx.stroke();
         label = "DECONSTRUCTION";
      }
      // PHASE 3: REBUILD (0.5 - 0.8)
      else if (cycle < 0.8) {
         const p = (cycle - 0.5) * 3.33; // 0 to 1
         ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + p * 0.8})`;
         
         // Particles assembling into crystal nodes
         crystal.forEach(pt => {
             // Start from scattered random positions
             const startX = pt.x + (Math.sin(pt.y) * 100);
             const startY = pt.y + 100;
             
             const currX = startX + (pt.x - startX) * p;
             const currY = startY + (pt.y - startY) * p;
             
             ctx.beginPath();
             ctx.arc(currX, currY, 2, 0, Math.PI*2);
             ctx.stroke();
         });
         label = "GROWTH THROUGH CHANGE";
      }
      // PHASE 4: STABLE CRYSTAL (0.8 - 1.0)
      else {
         ctx.strokeStyle = "rgba(255, 255, 255, 1)";
         ctx.beginPath();
         const center = crystal[6];
         // Hexagon loop
         ctx.moveTo(crystal[0].x, crystal[0].y);
         for(let i=1; i<6; i++) ctx.lineTo(crystal[i].x, crystal[i].y);
         ctx.lineTo(crystal[0].x, crystal[0].y);
         
         // Spokes
         for(let i=0; i<6; i++) {
             ctx.moveTo(crystal[i].x, crystal[i].y);
             ctx.lineTo(center.x, center.y);
         }
         ctx.stroke();
         label = "NEW ARCHITECTURE";
      }

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
