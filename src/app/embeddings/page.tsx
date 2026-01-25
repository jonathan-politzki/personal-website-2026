"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Text, Environment, Stars, Sparkles, OrbitControls } from "@react-three/drei";
import { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// --- DATA: Authentic writings + Mock embedding coordinates ---
// In a real app, these coordinates would come from OpenAI's text-embedding-3-small or similar, 
// reduced to 3D via PCA/t-SNE. Here we manually place them to represent semantic clusters.

const WRITINGS = [
  // Cluster 1: Core Philosophy / Laws
  { 
    id: "hfot", 
    title: "Politzki's Law", 
    date: "2024-03-15",
    desc: "Human focus is Earth's most misallocated resource.",
    position: [0, 1.5, 0], 
    color: "#a3e635" // Lime
  },
  { 
    id: "embeddings", 
    title: "General Personal Embeddings", 
    date: "2024-01-20",
    desc: "Mapping mind complexity into computational space.",
    position: [1.2, 0.8, 0.5], 
    color: "#60a5fa" // Blue
  },
  
  // Cluster 2: AI Memory & Jean
  { 
    id: "ai-memory", 
    title: "AI Memory Research", 
    date: "2024-05-10",
    desc: "A comprehensive review of the memory frontier.",
    position: [-1.5, 0, 1], 
    color: "#c084fc" // Purple
  },
  { 
    id: "building-jean", 
    title: "Building Jean Memory", 
    date: "2024-06-01",
    desc: "The universal gas station for user understanding.",
    position: [-1.8, -0.5, 1.2], 
    color: "#c084fc" 
  },
  
  // Cluster 3: Ventures & Strategy
  { 
    id: "irreverent", 
    title: "Irreverent Capital", 
    date: "2023-11-05",
    desc: "Solving unaddressed societal problems.",
    position: [1.5, -1.2, -0.5], 
    color: "#f472b6" // Pink
  },
  { 
    id: "quant", 
    title: "Quant & Strategy", 
    date: "2023-08-15",
    desc: "Reflections from the trading floor.",
    position: [2.0, -1.5, -0.8], 
    color: "#f472b6"
  },

  // Outliers / Future
  {
    id: "future",
    title: "The Next Era",
    date: "2025-01-01",
    desc: "Predictions for the post-AI world.",
    position: [0, -2, 2],
    color: "#ffffff"
  }
];

// Sort by date for the temporal connection line
const SORTED_WRITINGS = [...WRITINGS].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

function ConnectionLine() {
  const points = useMemo(() => {
    return SORTED_WRITINGS.map(w => new THREE.Vector3(...w.position));
  }, []);

  const lineGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points);
    // Create more points for a smooth curve
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
  }, [points]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="#333" transparent opacity={0.3} linewidth={1} />
    </line>
  );
}

function Node({ data, isSelected, onClick, onHover }) {
  const meshRef = useRef(null);
  const textRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Subtle floating animation
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = data.position[1] + Math.sin(t + data.position[0]) * 0.05;
    
    // Rotate slightly
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    meshRef.current.rotation.z = Math.cos(t * 0.2) * 0.1;
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    onHover(data);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(null);
    document.body.style.cursor = "auto";
  };

  return (
    <group position={[data.position[0], 0, data.position[2]]}> 
      {/* We apply Y in useFrame for animation, but initial pos needs to be set */}
      
      {/* The glowing orb */}
      <mesh 
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(data); }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        position={[0, data.position[1], 0]} // Local position
      >
        <sphereGeometry args={[isSelected ? 0.15 : hovered ? 0.12 : 0.08, 32, 32]} />
        <meshStandardMaterial 
          color={data.color} 
          emissive={data.color}
          emissiveIntensity={isSelected ? 2 : hovered ? 1 : 0.5}
          toneMapped={false}
        />
        <pointLight color={data.color} intensity={isSelected ? 1 : 0} distance={1} decay={2} />
      </mesh>

      {/* Label (always facing camera) */}
      {(hovered || isSelected) && (
        <Html position={[0, data.position[1] + 0.3, 0]} center distanceFactor={10}>
          <div className="pointer-events-none whitespace-nowrap bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 text-xs font-mono tracking-widest uppercase">
            {data.title}
          </div>
        </Html>
      )}
    </group>
  );
}

function CameraController({ selectedNode }) {
  const { camera } = useThree();
  const vec = new THREE.Vector3();

  useFrame(() => {
    if (selectedNode) {
      // Smoothly move camera to focus on selected node
      const targetPos = new THREE.Vector3(...selectedNode.position);
      // Offset slightly to see it clearly
      targetPos.z += 2;
      targetPos.y += 0.5;
      targetPos.x += 0.5;
      
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(new THREE.Vector3(...selectedNode.position));
    } else {
      // Idle movement
      // camera.position.lerp(new THREE.Vector3(0, 0, 6), 0.02);
      // camera.lookAt(0, 0, 0);
    }
  });
  return null;
}

function Scene({ onNodeSelect, selectedNode, onNodeHover }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={10} size={1} speed={0.4} opacity={0.5} color="#444" />
      
      <ConnectionLine />
      <OrbitControls enableZoom={true} enablePan={true} autoRotate={!selectedNode} autoRotateSpeed={0.5} />

      {WRITINGS.map((writing) => (
        <Node 
          key={writing.id} 
          data={writing} 
          isSelected={selectedNode?.id === writing.id}
          onClick={onNodeSelect}
          onHover={onNodeHover}
        />
      ))}
      
      <CameraController selectedNode={selectedNode} />
    </>
  );
}

export default function EmbeddingsPage() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Clear selection when clicking background
  const handleBackgroundClick = () => setSelectedNode(null);

  return (
    <main className="h-screen w-screen bg-black text-white relative">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} onPointerMissed={handleBackgroundClick}>
          <Scene 
            onNodeSelect={setSelectedNode} 
            selectedNode={selectedNode} 
            onNodeHover={setHoveredNode}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none p-8 flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div>
            <Link href="/" className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-2">
               <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Latent Space</h1>
            <p className="text-neutral-500 font-mono text-sm">Semantic Mapping of Thoughts</p>
          </div>
        </div>

        {/* Selected Node Details Panel */}
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-12 left-8 md:left-auto md:right-12 w-full md:w-96 pointer-events-auto"
          >
            <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedNode.color }} />
                 <span className="text-xs font-mono text-neutral-400 uppercase">{selectedNode.date}</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{selectedNode.title}</h2>
              <p className="text-neutral-300 leading-relaxed mb-6">
                {selectedNode.desc}
              </p>
              <div className="flex gap-3">
                <a 
                  href="https://jonathanpolitzki.substack.com" 
                  target="_blank"
                  className="flex-1 bg-white text-black py-2 rounded-lg text-center text-sm font-bold hover:bg-neutral-200 transition-colors"
                >
                  Read Article
                </a>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="px-4 py-2 border border-neutral-700 rounded-lg text-sm hover:bg-neutral-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions / Footer */}
        {!selectedNode && (
           <div className="text-center md:text-left pointer-events-auto">
             <div className="inline-block text-xs font-mono text-neutral-600 border border-neutral-900 bg-neutral-950/50 px-3 py-1 rounded-full">
               Drag to rotate • Scroll to zoom • Click nodes to explore
             </div>
           </div>
        )}
      </div>
    </main>
  );
}
