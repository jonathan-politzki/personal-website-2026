"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, useSpring } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Springs for the visualization reaction
  const jitterX = useSpring(0, { stiffness: 300, damping: 20 });
  const jitterY = useSpring(0, { stiffness: 300, damping: 20 });
  const noiseIntensity = useSpring(0, { stiffness: 200, damping: 10 });

  // Generate random values only once per mount to avoid hydration mismatch
  const scanlines = useMemo(() => Array.from({ length: 60 }).map(() => ({
    width: Math.random() * 80 + 20,
    marginLeft: Math.random() * 40,
    xOffset: Math.random() * 50 - 25,
    duration: 0.1 + Math.random() * 0.2
  })), []);

  const vectors = useMemo(() => Array.from({ length: 15 }).map(() => ({
    top: Math.random() * 100,
    right: Math.random() * 50,
    width: Math.random() * 200 + 50,
    rotate: Math.random() * 180,
    duration: 0.5 + Math.random(),
    delay: Math.random() * 2
  })), []);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      const y = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1

      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // The right side of the screen triggers more intensity
      const isRightSide = x > 0;
      
      jitterX.set(x * 20); // Stronger movement
      jitterY.set(y * 20);
      noiseIntensity.set(isRightSide ? 1 : 0.2); // More noise when on the right
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [jitterX, jitterY, noiseIntensity]);

  return (
    <main className="min-h-screen relative flex items-center justify-center p-8 md:p-16 overflow-hidden bg-[#050505]">
      
      {/* Paper Texture Overlay */}
      <div className="paper-texture" />

      {/* --- RIGHT SIDE VISUALIZATION (Explicitly positioned) --- */}
      <div className="absolute top-0 right-0 bottom-0 w-1/2 overflow-hidden pointer-events-none z-0">
        
        {/* User Photo - Faded Background Layer */}
        <div className="absolute inset-0 z-[-1] opacity-30 mix-blend-screen">
            <Image 
                src="/hero-bg.png" 
                alt="Visualization Background" 
                fill
                className="object-cover translate-x-16"
                priority
            />
            {/* Gradient Overlay to fade it into the blackness at the bottom/left */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#050505]/20 to-[#050505]" />
        </div>

        {/* The "Storm" Container */}
        {isMounted && (
          <motion.div 
            className="relative w-full h-full"
            style={{ x: jitterX, y: jitterY }}
          >
             {/* Dense "Scanline" Cloud */}
             <div className="absolute inset-0 flex flex-col justify-center opacity-40 mix-blend-screen">
               {scanlines.map((line, i) => (
                 <motion.div
                   key={`line-${i}`}
                   className="w-full bg-white h-[1px] my-[2px] opacity-20"
                   style={{ 
                     width: `${line.width}%`,
                     marginLeft: `${line.marginLeft}%`
                   }}
                   animate={{
                     x: [0, line.xOffset, 0],
                     opacity: [0.1, 0.4, 0.1]
                   }}
                   transition={{
                     duration: line.duration,
                     repeat: Infinity,
                     repeatType: "reverse",
                     ease: "linear"
                   }}
                 />
               ))}
             </div>

             {/* "Crackling" Vectors */}
             {vectors.map((vec, i) => (
                <motion.div
                  key={`vector-${i}`}
                  className="absolute bg-white/60 h-[2px]"
                  style={{
                    top: `${vec.top}%`,
                    right: `${vec.right}%`,
                    width: `${vec.width}px`,
                    rotate: `${vec.rotate}deg`
                  }}
                  animate={{
                     opacity: [0, 1, 0],
                     pathLength: [0, 1],
                     scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: vec.duration,
                    repeat: Infinity,
                    repeatDelay: vec.delay
                  }}
                />
             ))}

             {/* Top "Glitch" Cap */}
             <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-white/5 to-transparent mix-blend-overlay" />
          </motion.div>
        )}
        
        {/* Vignette to blend it into the black background on the left edge of this container */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl relative z-20">
        
        {/* Left: Content */}
        <div className="flex flex-col justify-center space-y-8">
          
          {/* Textual Overview */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="font-[family-name:var(--font-type)] text-lg md:text-xl text-[#ccc] max-w-lg leading-loose"
          >
            <p className="mb-8">
              My name is Jonathan Alexander Politzki.
            </p>
            <p className="mb-8">
              I am interested in ideas and engineering the future that should exist.
            </p>
            <p>
              Across my website you will find my <strong className="text-white font-normal bg-white/10 px-1">guiding creed</strong>, my <strong className="text-white font-normal bg-white/10 px-1">writing</strong> as a form of mapping the world, and my <strong className="text-white font-normal bg-white/10 px-1">work</strong> that is the instantiation of my beliefs in the marketplace.
            </p>
          </motion.div>

        </div>

      </div>
    </main>
  );
}
