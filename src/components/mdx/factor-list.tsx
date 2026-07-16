import type { ReactNode } from 'react';

// A Substack-style pull-out box for lists of short terms with longer notes.
// Each row shows just the term; hovering (or tapping, via focus) unfolds the note.
export function FactorList({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="not-prose my-10 rounded-sm border border-[#e0e0e0] bg-white px-6 py-5 sm:px-8">
      {title && (
        <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-[#f0f0ee] pb-3">
          <span className="font-[family-name:var(--font-geist-mono),monospace] text-xs uppercase tracking-widest text-[#888]">
            {title}
          </span>
          <span className="font-[family-name:var(--font-geist-mono),monospace] text-[10px] uppercase tracking-widest text-[#bbb]">
            hover to read
          </span>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export function Factor({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div
      tabIndex={0}
      className="group cursor-default border-b border-[#f0f0ee] py-2.5 outline-none last:border-b-0"
    >
      <div className="flex items-baseline gap-3">
        <span
          aria-hidden
          className="font-[family-name:var(--font-geist-mono),monospace] text-xs text-[#ccc] transition-colors duration-200 group-focus-within:text-[#1a1a1a] group-hover:text-[#1a1a1a]"
        >
          —
        </span>
        <span className="font-medium text-[#1a1a1a]">{name}</span>
      </div>
      <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 group-hover:grid-rows-[1fr] group-hover:opacity-100">
        <div className="overflow-hidden">
          <p className="pl-[26px] pt-1.5 text-[15px] font-light leading-relaxed text-[#555]">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
