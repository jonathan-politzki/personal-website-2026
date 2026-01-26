"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, Bot, BookOpen } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; slug: string; score: number }[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello. I have read all 55 essays in the corpus. What would you like to know about my writing?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.content,
        sources: data.sources
      }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: "I encountered an error accessing the corpus. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex font-mono text-sm">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#222] hidden md:flex flex-col fixed top-0 bottom-0 left-0 pt-32 pb-8 px-6 bg-[#0a0a0a] z-10">
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-4">Writing Engine</h2>
          <nav className="flex flex-col gap-3 text-[#888]">
            <Link href="/writing" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Overview</Link>
            <Link href="/writing/read" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Library</Link>
            <Link href="/writing/graph" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">The Graph</Link>
            <Link href="/writing/dashboard" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Dashboard</Link>
            <Link href="/writing/chat" className="text-white border-l-2 border-white pl-3 -ml-3">Chat</Link>
            <Link href="/writing/compare" className="hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200">Laboratory</Link>
          </nav>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen max-h-screen relative">
        
        {/* Header */}
        <header className="h-16 border-b border-[#222] flex items-center justify-between px-8 bg-[#0a0a0a] z-10 shrink-0">
          <div className="flex items-center gap-2 text-[#666]">
            <Sparkles className="w-4 h-4" />
            <span className="uppercase tracking-widest text-xs">Corpus Intelligence</span>
          </div>
          <div className="text-[#444] text-[10px] uppercase tracking-widest">
            Model: Gemini-2.0-Flash // Store: Local
          </div>
        </header>

        {/* Messages */}
        <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex gap-4 max-w-3xl ${msg.role === "assistant" ? "" : "ml-auto flex-row-reverse"}`}
            >
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border ${
                msg.role === "assistant" ? "bg-[#111] border-[#333] text-white" : "bg-white border-white text-black"
              }`}>
                {msg.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              
              <div className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`p-4 rounded-sm border leading-relaxed ${
                    msg.role === "assistant" 
                    ? "bg-[#0d0d0d] border-[#222] text-[#ccc]" 
                    : "bg-[#222] border-[#333] text-white"
                }`}>
                    {msg.content}
                </div>

                {/* Sources / Citations */}
                {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {msg.sources.map((source, idx) => (
                            <Link 
                                key={idx} 
                                href={`/writing/${source.slug}`}
                                className="flex items-center gap-1 text-[10px] uppercase tracking-widest bg-[#111] border border-[#222] px-2 py-1 text-[#666] hover:text-white hover:border-[#444] transition-colors"
                            >
                                <BookOpen className="w-3 h-3" />
                                {source.title}
                            </Link>
                        ))}
                    </div>
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 max-w-3xl"
            >
                <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center border bg-[#111] border-[#333] text-white">
                    <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1 h-8">
                    <div className="w-1 h-1 bg-[#444] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1 h-1 bg-[#444] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1 h-1 bg-[#444] rounded-full animate-bounce" />
                </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 border-t border-[#222] bg-[#0a0a0a]">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the essays..."
              className="w-full bg-[#0d0d0d] border border-[#333] text-white px-4 py-4 pr-12 outline-none focus:border-white transition-colors placeholder:text-[#444]"
            />
            <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#666] hover:text-white disabled:opacity-50 disabled:hover:text-[#666] transition-colors"
            >
                <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
