"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InterestCardProps {
  number: string;
  title: string;
  technical: React.ReactNode;
  simple: React.ReactNode;
  isTechnical: boolean;
}

function InterestCard({ number, title, technical, simple, isTechnical }: InterestCardProps) {
  return (
    <div className="border-t border-[#222] py-16 grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#444]">{number}</span>
        <h2 className="text-2xl font-light text-white mt-2">{title}</h2>
      </div>
      
      <div className="md:col-span-9 relative min-h-[160px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={isTechnical ? "tech" : "simple"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {isTechnical ? (
              <div className="font-mono text-sm text-[#888] leading-relaxed max-w-3xl space-y-4">
                {technical}
              </div>
            ) : (
              <div className="text-lg md:text-xl font-light text-[#ccc] leading-relaxed max-w-3xl space-y-4">
                {simple}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Interests() {
  const [isTechnical, setIsTechnical] = useState(true);

  return (
    <main className="min-h-screen pt-32 px-8 md:px-24 max-w-6xl mx-auto pb-32">
      
      {/* Header */}
      <header className="mb-32 flex flex-col md:flex-row justify-between items-start md:items-start gap-8">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-12">
            Research & Interests
          </h1>
          
          {/* Dynamic Intro */}
          <div className="min-h-[120px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={isTechnical ? "header-tech" : "header-simple"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isTechnical ? (
                  <p className="font-mono text-sm text-[#888] leading-relaxed">
                    AI models learn to understand the world by training on vast corpora of text. Since text is often a projection of our minds, these models have implicitly learned to understand us. My work focuses on leveraging these high-dimensional representations to understand humans not as data points, but as complex entities on the manifold.
                  </p>
                ) : (
                  <p className="text-lg md:text-xl text-[#ccc] font-light leading-relaxed">
                    Modern AI understands the world through text. Since text is often a projection of our minds, they understand us.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Global Toggle */}
        <div className="flex bg-[#111] rounded-sm p-1 border border-[#333] shrink-0">
          <button 
            onClick={() => setIsTechnical(false)}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors ${!isTechnical ? 'bg-[#333] text-white' : 'text-[#666] hover:text-[#aaa]'}`}
          >
            Simple
          </button>
          <button 
            onClick={() => setIsTechnical(true)}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors ${isTechnical ? 'bg-[#333] text-white' : 'text-[#666] hover:text-[#aaa]'}`}
          >
            Technical
          </button>
        </div>
      </header>

      {/* Historical Framing (Left/Right) - Dynamic Text */}
      <section className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-[#222] pt-16">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#444] mb-4 block">Historical Context</span>
          <h2 className="text-2xl font-light text-[#888] mb-4">Narrow, Predictive ML</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={isTechnical ? "narrow-tech" : "narrow-simple"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isTechnical ? (
                <p className="text-sm font-mono text-[#666] leading-relaxed">
                  Traditional systems were optimized for domain-specific tasks using sparse matrices and collaborative filtering. They modeled user behavior as discrete interactions (clicks/views) rather than semantic understanding, resulting in narrow intelligence incapable of out-of-domain generalization.
                </p>
              ) : (
                <p className="text-sm font-mono text-[#666] leading-relaxed">
                  Old systems were like calculators that only knew one thing. They knew you clicked on a shoe, so they showed you more shoes. They didn't know *who* you were, just what you did in that specific app.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#444] mb-4 block">Current Reality</span>
          <h2 className="text-2xl font-light text-white mb-4">Generalized Intelligence</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={isTechnical ? "gen-tech" : "gen-simple"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isTechnical ? (
                <p className="text-sm font-mono text-[#888] leading-relaxed">
                  Foundation models encode world knowledge into high-dimensional vector spaces. This allows for transfer learning and semantic triangulation—inferring latent user attributes from sparse, disparate inputs by leveraging the model's generalized understanding of human concepts.
                </p>
              ) : (
                <p className="text-sm font-mono text-[#888] leading-relaxed">
                  New AI models are like well-read assistants. They know enough about the world to take a few small clues about you and build a surprisingly accurate picture of who you are, even in areas they haven't explicitly seen.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Interest Sections */}
      <section className="space-y-0">
        
        {/* 1. Context */}
        <InterestCard 
          number="01 // Context"
          title="Context & Memory"
          isTechnical={isTechnical}
          simple={
            <>
              <p>
                The first way we use this is AI memory. This is the first time we can have a computer actually act on our behalf because it understands us through our history.
              </p>
              <p>
                We build systems that constantly learn from what you do and say. Unlike old systems, these can explain *why* they think you like something, helping you understand yourself better.
              </p>
            </>
          }
          technical={
            <>
              <p>
                Context acts as the prompt-layer representation of user identity. By engineering retrieval-augmented generation (RAG) pipelines that statefully encode, store, forget, and recall information, we enable agents to maintain persistent alignment with user intent.
              </p>
              <p>
                Crucially, generalized models can triangulate understanding from this unstructured context. They don't just store facts (SQL row: "likes_sushi=true"); they infer higher-order traits and preferences by analyzing the semantic relationships within the user's historical interaction trace.
              </p>
            </>
          }
        />

        {/* 2. Representation & Alignment */}
        <InterestCard 
          number="02 // Representation"
          title="Latent Representations"
          isTechnical={isTechnical}
          simple={
            <>
              <p>
                Computers don't think in words; they think in a complex map of ideas. I am interested in how we can translate a human being into this map.
              </p>
              <p>
                If we can map you onto this grid, we can do amazing things like finding people who are truly compatible with you, or helping different AI systems talk to each other so they all understand you in the same deep way.
              </p>
            </>
          }
          technical={
            <>
              <p>
                Context ultimately compiles into latent representations, embeddings in thousands of dimensions that capture features acting as our computational genetic code. Traditional embedding models are focused on capturing semantic similarity for document retrieval tasks, so they aren't trained to truly understand humans.
              </p>
              <p>
                We can build our own systems specifically for understanding human features. Beyond interpretation, the challenge is interoperability. This involves constructing shared geometric alignments and adapter layers to allow disjoint latent spaces to communicate, enabling universal matching and compatibility analysis across distinct model architectures.
              </p>
            </>
          }
        />

      </section>

    </main>
  );
}
