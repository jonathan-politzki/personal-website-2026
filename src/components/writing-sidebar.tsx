"use client";

import Link from "next/link";

interface WritingSidebarProps {
  currentPage: "overview" | "library" | "graph" | "dashboard" | "chat" | "laboratory";
  footer?: React.ReactNode;
}

export default function WritingSidebar({ currentPage, footer }: WritingSidebarProps) {
  const links = [
    { href: "/writing", label: "Overview", key: "overview" },
    { href: "/writing/read", label: "Library", key: "library" },
    { href: "/writing/graph", label: "The Graph", key: "graph" },
    { href: "/writing/dashboard", label: "Dashboard", key: "dashboard" },
    { href: "/writing/chat", label: "Chat", key: "chat" },
    { href: "/writing/compare", label: "Laboratory", key: "laboratory" },
  ];

  return (
    <aside className="w-64 border-r border-[#222] hidden md:flex flex-col fixed top-0 bottom-0 left-0 pt-32 pb-8 px-6 bg-[#0a0a0a] z-10">
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#666] mb-4">Writing Engine</h2>
        <nav className="flex flex-col gap-3 font-mono text-sm text-[#888]">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={
                currentPage === link.key
                  ? "text-white border-l-2 border-white pl-3 -ml-3"
                  : "hover:text-white transition-colors hover:pl-2 hover:border-l-2 hover:border-[#333] -ml-3 pl-3 duration-200"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {footer && (
        <div className="mt-auto pt-8 border-t border-[#222]">
          {footer}
        </div>
      )}
    </aside>
  );
}
