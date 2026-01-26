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

    // --- CONFIGURATION ---
    // The "Map" (Known Distribution) covers most of the screen
    const centerX = width * 0.4;
    const centerY = height * 0.6;
    const baseRadius = Math.min(width, height) * 0.45; // Much larger

    // The "Outlier" Point (Unlikely Truth)
    // Closer to the edge of the known, not miles away
    const targetAngle = -Math.PI / 4; // Top-Right direction
    const distFromCenter = baseRadius + 60; // Just outside the fractal edge
    const targetX = centerX + distFromCenter * Math.cos(targetAngle);
    const targetY = centerY + distFromCenter * Math.sin(targetAngle);

    let time = 0;

    const animate = () => {
      ctx.fillStyle = "#0d0d0d";
      ctx.fillRect(0, 0, width, height);
      time += 0.005;

      // 1. Draw "Known" Distribution (Large Fractal Cloud)
      ctx.save();
      ctx.translate(centerX, centerY);

      // Draw multiple layers for depth
      for (let layer = 0; layer < 4; layer++) {
        ctx.beginPath();
        const layerOffset = layer * 10;
        ctx.fillStyle = `rgba(100, 100, 100, ${0.03 + layer * 0.01})`; // Very faint
        ctx.strokeStyle = `rgba(150, 150, 150, ${0.05 + layer * 0.02})`;
        ctx.lineWidth = 1;

        for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
          // Static noise based on angle (fractal edge)
          const n1 = Math.sin(angle * 7) * 15;
          const n2 = Math.cos(angle * 13) * 10;
          const n3 = Math.sin(angle * 29) * 5;
          // Add gentle breathing to the whole mass
          const breath = Math.sin(time + layer) * 2;
          
          const r = baseRadius - layerOffset + n1 + n2 + n3 + breath;
          
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

      // Label for Known
      ctx.fillStyle = "#444";
      ctx.font = "10px monospace";
      ctx.fillText("KNOWN DISTRIBUTION", 20, height - 20);

      // 2. Draw "Unknown" Point (Close Outlier)
      ctx.fillStyle = "#fff";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#fff";
      ctx.beginPath();
      ctx.arc(targetX, targetY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label for Unknown
      ctx.fillStyle = "#fff";
      ctx.fillText("UNLIKELY TRUTH", targetX + 10, targetY + 4);

      // 3. Vector Arrow (Short, bridge the gap)
      // Find the edge point on the fractal closest to target
      const noiseAtAngle = Math.sin(targetAngle * 7) * 15 + Math.cos(targetAngle * 13) * 10;
      const edgeR = baseRadius + noiseAtAngle;
      const startX = centerX + edgeR * Math.cos(targetAngle);
      const startY = centerY + edgeR * Math.sin(targetAngle);
      
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(targetX - 8, targetY); // Stop just before dot
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(targetY - startY, targetX - startX);
      ctx.beginPath();
      ctx.moveTo(targetX - 8, targetY);
      ctx.lineTo(targetX - 8 - 6 * Math.cos(angle - Math.PI / 6), targetY - 6 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(targetX - 8 - 6 * Math.cos(angle + Math.PI / 6), targetY - 6 * Math.sin(angle + Math.PI / 6));
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
    const crystal: { x: number; y: number }[] = [];
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
