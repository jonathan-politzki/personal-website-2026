import narration from '@/content/narration.json';

export type Narration = {
  seconds: number;
  minutes: number;
  /** True when the reading stops partway through the essay. */
  partial?: boolean;
};

// Written by scripts/narrate.mjs — a post gets a Listen button only once its
// audio actually exists in public/audio.
const entries = narration as Record<string, Narration>;

export function getNarration(slug: string): Narration | undefined {
  return entries[slug];
}

export const narratedSlugs = new Set(Object.keys(entries));
