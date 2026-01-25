"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Heading = {
  id: string;
  text: string;
  level: number;
};

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
    setActiveId(id);
  };

  return (
    <nav className="hidden lg:block w-64 sticky top-12 h-[calc(100vh-6rem)] overflow-y-auto pl-4 border-l border-neutral-800">
      <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6">Table of Contents</h4>
      <ul className="space-y-3">
        {headings.map((heading) => (
          <li 
            key={heading.id} 
            style={{ paddingLeft: (heading.level - 2) * 12 }}
          >
            <a 
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block text-sm transition-colors duration-200 ${
                activeId === heading.id 
                  ? 'text-lime-400 font-medium' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
