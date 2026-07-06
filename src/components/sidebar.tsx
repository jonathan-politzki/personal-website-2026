"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Home", href: "/" },
  { label: "Writing", href: "/writing" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-56 flex-col border-r border-rule bg-paper px-8 pt-10 md:flex">
        <Link href="/" className="mb-10 text-xl font-semibold text-ink">
          Jonathan Politzki
        </Link>
        <nav className="flex flex-col gap-4 text-[15px]">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive(item.href)
                  ? "-ml-4 border-l-2 border-accent pl-3.5 text-accent"
                  : "text-muted transition-colors hover:text-ink"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile header */}
      <header className="flex items-baseline justify-between border-b border-rule px-6 py-5 md:hidden">
        <Link href="/" className="text-lg font-semibold text-ink">
          Jonathan Politzki
        </Link>
        <nav className="flex gap-5 text-[15px]">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? "text-accent" : "text-muted"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
