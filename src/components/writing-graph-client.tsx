"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { format, eachYearOfInterval, startOfYear } from "date-fns";

interface PostAttributes {
  technicality: number;
  abstraction: number;
  futurism: number;
  personal: number;
  optimism: number;
  density: number;
}

interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  attributes?: PostAttributes;
  pca?: { x: number; y: number }; // Pre-computed PCA coordinates
  cluster?: number; // Pre-computed Cluster ID
  clusterLabel?: string; // Pre-computed Cluster Label
  metadata?: any;
}

type ViewMode = "TEMPORAL" | "SEMANTIC" | "SCATTER";

export default function WritingGraph({ posts }: { posts: Post[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("TEMPORAL");
  
  // Default selections
  const [xAxis, setXAxis] = useState<keyof PostAttributes | "date">("date");
  const [yAxis, setYAxis] = useState<keyof PostAttributes>("technicality");
  
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  
  // Hovered Cluster State (for Semantic View)
  const [hoveredCluster, setHoveredCluster] = useState<number | null>(null);

  // Available attributes for dropdowns
  const attributes: (keyof PostAttributes)[] = [
    "technicality", 
    "abstraction", 
    "futurism", 
    "personal", 
    "optimism", 
    "density"
  ];

  // Helper for Date Axis
  const dateRange = useMemo(() => {
    const dates = posts.map(p => new Date(p.date).getTime()).filter(d => !isNaN(d));
    const min = Math.min(...dates);
    const max = Math.max(...dates);
    return { min, max, span: max - min || 1 };
  }, [posts]);

  // Generate Year Ticks
  const yearTicks = useMemo(() => {
    if (viewMode !== "TEMPORAL") return [];
    try {
        const start = new Date(dateRange.min);
        const end = new Date(dateRange.max);
        const years = eachYearOfInterval({ start: startOfYear(start), end });
        return years.map(date => {
            const time = date.getTime();
            const pct = ((time - dateRange.min) / dateRange.span) * 100;
            return { label: format(date, "yyyy"), x: pct };
        });
    } catch (e) {
        return [];
    }
  }, [dateRange, viewMode]);

  // Cluster Centers (for labeling in Semantic View)
  const clusters = useMemo(() => {
    if (viewMode !== "SEMANTIC") return [];
    
    const groups: Record<number, { xSum: number, ySum: number, count: number, label: string }> = {};
    
    posts.forEach(p => {
        if (p.cluster !== undefined && p.pca) {
            if (!groups[p.cluster]) {
                groups[p.cluster] = { xSum: 0, ySum: 0, count: 0, label: p.clusterLabel || `Cluster ${p.cluster}` };
            }
            groups[p.cluster].xSum += p.pca.x;
            groups[p.cluster].ySum += p.pca.y;
            groups[p.cluster].count++;
        }
    });

    return Object.entries(groups).map(([id, data]) => ({
        id: parseInt(id),
        x: data.xSum / data.count,
        y: data.ySum / data.count,
        label: data.label,
        count: data.count
    }));
  }, [posts, viewMode]);

  const graphData = useMemo(() => {
    return posts.map((post) => {
      let x = 0;
      let y = 0;
      
      const attrs = post.attributes || { 
        technicality: 0.5, abstraction: 0.5, futurism: 0.5, 
        personal: 0.5, optimism: 0.5, density: 0.5 
      };

      if (viewMode === "TEMPORAL") {
        // X is always Date
        const date = new Date(post.date).getTime();
        x = ((date - dateRange.min) / dateRange.span) * 100;
        
        // Y is selected attribute
        y = attrs[yAxis] * 100;
      
      } else if (viewMode === "SEMANTIC") {
        // Use pre-computed PCA coordinates if available
        if (post.pca) {
            x = post.pca.x;
            y = post.pca.y;
        } else {
            // Fallback (shouldn't happen)
            x = 50;
            y = 50;
        }

      } else if (viewMode === "SCATTER") {
        // Custom X and Y
        if (xAxis === "date") {
           const date = new Date(post.date).getTime();
           x = ((date - dateRange.min) / dateRange.span) * 100;
        } else {
           x = attrs[xAxis as keyof PostAttributes] * 100;
        }
        
        y = attrs[yAxis] * 100;
      }

      // Clamp to ensure visibility
      x = Math.max(2, Math.min(98, x));
      y = Math.max(2, Math.min(98, y));

      return { ...post, x, y };
    });
  }, [posts, viewMode, xAxis, yAxis, dateRange]);

  // Determine node color based on state
  const getNodeColor = (node: Post, isHovered: boolean) => {
    if (isHovered) return "bg-white border-white scale-150 z-50";
    
    if (viewMode === "SEMANTIC") {
        if (hoveredCluster !== null && node.cluster === hoveredCluster) {
            return "bg-white border-white z-40"; // Highlight entire cluster
        }
        if (hoveredCluster !== null && node.cluster !== hoveredCluster) {
            return "bg-[#333] border-[#333] opacity-30"; // Dim others
        }
        // Default cluster coloring (subtle)
        // We use inline styles for dynamic colors in real app, but here let's stick to monochrome/grayscale for the 'noir' vibe
        // unless we want to introduce color. Let's keep it 'noir' but use brightness.
        // Actually, let's map clusters to shades of grey/white to keep aesthetic
        return "bg-[#666] border-black/50 hover:bg-[#999]";
    }
    
    return "bg-[#555] border-black/50 hover:bg-[#888]";
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex font-mono">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#222] hidden md:flex flex-col fixed top-0 bottom-0 left-0 pt-32 pb-8 px-6 bg-[#0a0a0a] z-10">
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-4">Writing Engine</h2>
          <nav className="flex flex-col gap-3 text-sm text-[#888]">
            <Link href="/writing" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Overview</Link>
            <Link href="/writing/read" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Library</Link>
            <Link href="/writing/graph" className="text-white border-l-2 border-white pl-3 -ml-3">The Graph</Link>
            <Link href="/writing/dashboard" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Dashboard</Link>
            <Link href="/writing/chat" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Chat</Link>
            <Link href="/writing/compare" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Laboratory</Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Controls Header */}
        <header className="pt-32 px-8 pb-8 border-b border-[#222] flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 bg-[#0a0a0a] z-10">
          <div>
            <h1 className="text-4xl font-light text-white mb-2 tracking-tight">The Graph</h1>
            <p className="text-[#666] text-xs uppercase tracking-widest">Mapping the corpus: {posts.length} Nodes</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
            
            {/* View Mode Toggles */}
            <div className="flex bg-[#111] p-1 rounded-sm border border-[#333]">
              {(["TEMPORAL", "SEMANTIC", "SCATTER"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-1 text-[10px] uppercase tracking-widest transition-all ${
                    viewMode === mode 
                      ? "bg-white text-black font-bold" 
                      : "text-[#666] hover:text-white"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Dynamic Axis Controls */}
            <div className="flex gap-4 text-sm">
              {/* X Axis Control - Only for Custom */}
              {viewMode === "SCATTER" && (
                <div className="flex flex-col gap-1">
                  <label className="text-[#444] uppercase text-[10px] tracking-widest">X-Axis</label>
                  <select
                    value={xAxis}
                    onChange={(e) => setXAxis(e.target.value as any)}
                    className="bg-[#111] text-[#ccc] border border-[#333] px-2 py-1 outline-none focus:border-white transition-colors min-w-[120px] text-xs"
                  >
                    <option value="date">Date</option>
                    {attributes.map(attr => (
                      <option key={attr} value={attr}>{attr}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Y Axis Control - For Temporal & Custom */}
              {(viewMode === "TEMPORAL" || viewMode === "SCATTER") && (
                <div className="flex flex-col gap-1">
                  <label className="text-[#444] uppercase text-[10px] tracking-widest">Y-Axis</label>
                  <select
                    value={yAxis}
                    onChange={(e) => setYAxis(e.target.value as keyof PostAttributes)}
                    className="bg-[#111] text-[#ccc] border border-[#333] px-2 py-1 outline-none focus:border-white transition-colors min-w-[120px] text-xs"
                  >
                    {attributes.map(attr => (
                      <option key={attr} value={attr}>{attr}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Graph Area */}
        <div className="flex-1 relative bg-[#0d0d0d] min-h-[500px] overflow-hidden">
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ 
              backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
              backgroundSize: '100px 100px',
              backgroundPosition: 'center'
            }}
          />

          {/* Temporal Axis Lines (Vertical Years) */}
          {viewMode === "TEMPORAL" && yearTicks.map(tick => (
             <div 
               key={tick.label} 
               className="absolute top-12 bottom-12 border-l border-[#222] border-dashed pointer-events-none"
               style={{ left: `${tick.x}%` }}
             >
               <div className="absolute top-full mt-4 text-[10px] text-[#444] -translate-x-1/2">
                 {tick.label}
               </div>
             </div>
          ))}

          {/* Cluster Labels (Semantic View Only) */}
          {viewMode === "SEMANTIC" && clusters.map(cluster => (
             <motion.div
                key={cluster.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-0 transition-opacity duration-300
                    ${hoveredCluster === cluster.id ? 'opacity-100' : 'opacity-30'}
                `}
                style={{ left: `${cluster.x}%`, top: `${100 - cluster.y}%` }}
             >
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666] whitespace-nowrap border border-[#333] px-2 py-1 bg-[#0a0a0a]/80 backdrop-blur-sm rounded-full">
                    {cluster.label}
                </div>
             </motion.div>
          ))}

          {/* Axis Labels on the Graph Background */}
          <div className="absolute inset-8 pointer-events-none">
            {/* Y Axis Label */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-[#444] uppercase tracking-[0.2em] origin-left translate-x-[-100%] whitespace-nowrap">
               {viewMode === "SEMANTIC" ? "Principal Component 2" : yAxis}
            </div>
            
            {/* X Axis Label */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-[#444] uppercase tracking-[0.2em] translate-y-[100%] pt-4 whitespace-nowrap">
               {viewMode === "SEMANTIC" ? "Principal Component 1" : (viewMode === "TEMPORAL" ? "Time" : xAxis)}
            </div>
          </div>

          {/* The Nodes */}
          <div className="absolute inset-12">
            {graphData.map((node) => {
                const isHovered = hoveredPost === node.slug;
                const nodeClass = getNodeColor(node, isHovered);

                return (
                  <Link href={`/writing/${node.slug}`} key={node.slug}>
                    <motion.div
                      layout
                      className={`absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full cursor-pointer border transition-colors duration-300 ${nodeClass}`}
                      style={{
                        left: `${node.x}%`,
                        top: `${100 - node.y}%`
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: isHovered ? 1.5 : 1, left: `${node.x}%`, top: `${100 - node.y}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        mass: 0.8
                      }}
                      onMouseEnter={() => {
                          setHoveredPost(node.slug);
                          if (node.cluster !== undefined) setHoveredCluster(node.cluster);
                      }}
                      onMouseLeave={() => {
                          setHoveredPost(null);
                          setHoveredCluster(null);
                      }}
                    >
                      {/* Tooltip - positioned dynamically based on node location */}
                      <div
                        className={`absolute w-max max-w-[250px] bg-[#0a0a0a] border border-[#333] p-4 pointer-events-none transition-all duration-200 shadow-2xl
                          ${hoveredPost === node.slug ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                          // Position tooltip based on where node is on graph
                          // If node is in top 30% of graph (y > 70), show below; otherwise above
                          ...(node.y > 70
                            ? { top: '100%', marginTop: '12px' }
                            : { bottom: '100%', marginBottom: '12px' }
                          ),
                          // Horizontal positioning: shift left/right if near edges
                          left: node.x < 15 ? '0' : node.x > 85 ? 'auto' : '50%',
                          right: node.x > 85 ? '0' : 'auto',
                          transform: node.x < 15 || node.x > 85 ? 'none' : 'translateX(-50%)',
                          zIndex: 9999,
                        }}
                      >
                        <p className="text-xs font-bold text-white mb-1 leading-tight">{node.title}</p>
                        <p className="text-[10px] text-[#666] mb-3">{node.date}</p>
                        
                        {node.clusterLabel && viewMode === "SEMANTIC" && (
                            <div className="mb-3">
                                <span className="text-[9px] uppercase tracking-widest text-[#888] border border-[#333] px-1.5 py-0.5 rounded">
                                    {node.clusterLabel}
                                </span>
                            </div>
                        )}

                        {/* Mini Stats in Tooltip */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {node.attributes && Object.entries(node.attributes).slice(0, 6).map(([key, val]) => (
                            <div key={key} className="flex justify-between items-center text-[9px] text-[#888] gap-2">
                               <span className="uppercase tracking-wider opacity-70">{key.slice(0,4)}</span>
                               <div className="w-12 h-1 bg-[#222] rounded-full overflow-hidden">
                                 <div className="h-full bg-[#666]" style={{ width: `${val * 100}%` }} />
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
