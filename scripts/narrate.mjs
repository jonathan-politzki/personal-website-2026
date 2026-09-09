#!/usr/bin/env node
/**
 * Generate narrated audio for essays with OpenAI TTS.
 *
 *   npm run narrate            # generate anything missing
 *   npm run narrate -- --dry   # print the narration text and cost, call nothing
 *   npm run narrate -- boldness --force
 *
 * Only the essays listed in NARRATION get audio. The prose is stripped down to
 * what should actually be spoken first: images, code, math, tables, raw URLs and
 * markdown syntax are dropped, so the reading never recites notation or links.
 * Chunks are synthesized separately (the API caps input at 4096 characters) and
 * stitched back together with ffmpeg.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const ROOT = path.join(import.meta.dirname, '..');
const CONTENT = path.join(ROOT, 'src/content/writing');
const OUT_DIR = path.join(ROOT, 'public/audio');
const MANIFEST = path.join(ROOT, 'src/content/narration.json');

// Essays to narrate. `stopBefore` is a line-anchored regex: everything from that
// line on is left unread.
const NARRATION = [
  { slug: 'everything-i-know-now' },
  { slug: 'culture' },
  { slug: 'general-personal-embeddings' },
  { slug: 'politzkis-law' },
  { slug: 'the-irreverent-act', stopBefore: '^\\*\\*Formalized Logic\\*\\*\\s*$' },
  { slug: 'boldness' },
  { slug: 'self-reliance' },
  { slug: 'invention' },
  { slug: 'state-of-ai' },
];

const MODEL = 'gpt-4o-mini-tts';
const VOICE = 'echo';
const INSTRUCTIONS = [
  'Read this as a documentary narrator reading an essay aloud: unhurried,',
  'thinking through the argument rather than reciting it.',
  'Vary your pitch across sentences and lean on the words that carry the point.',
  'Pause at paragraph breaks and let a strong sentence land before moving on.',
  'Warm and plainspoken, never breathless and never flat.',
].join(' ');

const MAX_CHUNK = 3500; // API limit is 4096; leave headroom.
const CONCURRENCY = 4;
const BITRATE = '40k'; // mono speech — ~0.3 MB per minute

/** MDX -> the prose a narrator should actually say. */
export function toNarrationText(mdx, { stopBefore } = {}) {
  let s = mdx.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');

  if (stopBefore) {
    const match = new RegExp(stopBefore, 'm').exec(s);
    if (!match) throw new Error(`stopBefore /${stopBefore}/ never matched`);
    s = s.slice(0, match.index);
  }

  // Structured non-prose, dropped whole.
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/^```[\s\S]*?^```\s*$/gm, '');
  s = s.replace(/^\s*\$\$[\s\S]*?\$\$\s*$/gm, '');
  s = s.replace(/\$[^$\n]+\$/g, '');
  s = s.replace(/\\\[[\s\S]*?\\\]/g, '');
  s = s.replace(/\\\([\s\S]*?\\\)/g, '');
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  s = s.replace(/^\s*\|.*\|\s*$/gm, '');
  s = s.replace(/^\s*(?:[-*_]\s*){3,}$/gm, '');
  s = s.replace(/\[\^[^\]]+\]/g, '');
  s = s.replace(/^\s*\[[^\]]+\]:\s*\S+.*$/gm, '');

  // Components: keep the words, drop the markup.
  s = s.replace(/<FactorList[^>]*title="([^"]*)"[^>]*>/g, '$1.\n\n');
  s = s.replace(/<Factor[^>]*name="([^"]*)"[^>]*>([\s\S]*?)<\/Factor>/g, '$1 — $2\n');
  s = s.replace(/<\/?[A-Za-z][^>]*>/g, '');

  // Inline markdown: keep the text, drop the punctuation around it.
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  s = s.replace(/^\s*>\s?/gm, '');
  s = s.replace(/^(#{1,6})\s+(.*?)\s*#*\s*$/gm, (_, __, text) => `${text.replace(/[.?!:]$/, '')}.`);
  s = s.replace(/`([^`]*)`/g, '$1');
  s = s.replace(/(\*\*|__)(.*?)\1/gs, '$2');
  s = s.replace(/(?<![A-Za-z0-9])[*_](\S[^*_]*?\S|\S)[*_](?![A-Za-z0-9])/g, '$1');
  s = s.replace(/~~(.*?)~~/g, '$1');
  s = s.replace(/^[ \t]*(?:[-*+]|\d+[.)])\s+/gm, '\n');
  s = s.replace(/<?https?:\/\/\S+>?/g, '');
  s = s.replace(/\\([\\`*_{}[\]()#+\-.!>~|])/g, '$1');

  return s
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    // Drop leftovers that carry no words (stray punctuation from a removed image)
    // and the Substack call-to-action the imports left behind.
    .filter((p) => /[A-Za-z]/.test(p))
    .filter((p) => !/^Thanks for reading .*Subscribe for free/.test(p))
    // A trailing stop keeps the voice from running one line into the next.
    .map((p) => (/[.!?:;,"'”’)\]]$/.test(p) ? p : `${p}.`))
    .join('\n\n');
}

/** Split into API-sized pieces, preferring paragraph then sentence breaks. */
function chunk(text) {
  const pieces = [];
  let current = '';

  const push = (part) => {
    if (current && current.length + part.length + 2 > MAX_CHUNK) {
      pieces.push(current);
      current = '';
    }
    current = current ? `${current}\n\n${part}` : part;
  };

  for (const para of text.split('\n\n')) {
    if (para.length <= MAX_CHUNK) {
      push(para);
      continue;
    }
    let sentences = '';
    for (const sentence of para.match(/[^.!?]+[.!?]*\s*/g) ?? [para]) {
      if (sentences.length + sentence.length > MAX_CHUNK) {
        push(sentences.trim());
        sentences = '';
      }
      sentences += sentence;
    }
    if (sentences.trim()) push(sentences.trim());
  }
  if (current) pieces.push(current);
  return pieces;
}

function loadEnv() {
  if (process.env.OPENAI_API_KEY) return;
  const envFile = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envFile)) return;
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

async function speak(input, attempt = 1) {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      voice: VOICE,
      input,
      instructions: INSTRUCTIONS,
      response_format: 'mp3',
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      return speak(input, attempt + 1);
    }
    throw new Error(`TTS ${res.status}: ${body.slice(0, 300)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i], i);
      }
    }),
  );
  return results;
}

function duration(file) {
  const out = execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1', file,
  ]);
  return Math.round(parseFloat(out.toString()));
}

async function narrate(entry) {
  const source = path.join(CONTENT, `${entry.slug}.mdx`);
  const text = toNarrationText(fs.readFileSync(source, 'utf8'), entry);
  const parts = chunk(text);
  console.log(`  ${parts.length} chunks, ${text.length.toLocaleString()} characters`);

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `narrate-${entry.slug}-`));
  try {
    const files = await mapWithConcurrency(parts, CONCURRENCY, async (part, i) => {
      const file = path.join(tmp, `${String(i).padStart(3, '0')}.mp3`);
      fs.writeFileSync(file, await speak(part));
      process.stdout.write(`  ·`);
      return file;
    });
    process.stdout.write('\n');

    const list = path.join(tmp, 'list.txt');
    fs.writeFileSync(list, files.map((f) => `file '${f}'`).join('\n'));

    fs.mkdirSync(OUT_DIR, { recursive: true });
    const out = path.join(OUT_DIR, `${entry.slug}.mp3`);
    execFileSync('ffmpeg', [
      '-y', '-loglevel', 'error',
      '-f', 'concat', '-safe', '0', '-i', list,
      '-c:a', 'libmp3lame', '-b:a', BITRATE, '-ac', '1', '-ar', '24000',
      out,
    ]);
    return { out, seconds: duration(out) };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  const force = args.includes('--force');
  const only = args.filter((a) => !a.startsWith('--'));

  const manifest = fs.existsSync(MANIFEST)
    ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
    : {};

  const queue = NARRATION.filter((e) => (only.length ? only.includes(e.slug) : true))
    .filter((e) => force || only.length || !fs.existsSync(path.join(OUT_DIR, `${e.slug}.mp3`)));

  if (dry) {
    let total = 0;
    for (const entry of NARRATION) {
      const text = toNarrationText(fs.readFileSync(path.join(CONTENT, `${entry.slug}.mdx`), 'utf8'), entry);
      total += text.length;
      console.log(`\n===== ${entry.slug} (${text.length.toLocaleString()} chars, ${chunk(text).length} chunks)\n`);
      console.log(text.slice(0, 1200));
    }
    console.log(`\nTotal ${total.toLocaleString()} characters ≈ ${Math.round(total / 900)} minutes of audio.`);
    return;
  }

  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set (put it in .env.local)');
  if (!queue.length) return console.log('Nothing to narrate. Pass --force to regenerate.');

  for (const entry of queue) {
    console.log(`\n${entry.slug}`);
    const { out, seconds } = await narrate(entry);
    manifest[entry.slug] = {
      seconds,
      minutes: Math.max(1, Math.round(seconds / 60)),
      ...(entry.stopBefore ? { partial: true } : {}),
    };
    console.log(`  → ${path.relative(ROOT, out)} · ${Math.round(seconds / 60)} min · ${(fs.statSync(out).size / 1e6).toFixed(1)} MB`);
    fs.writeFileSync(MANIFEST, `${JSON.stringify(sortKeys(manifest), null, 2)}\n`);
  }
}

const sortKeys = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));

// Only run when invoked directly — toNarrationText is imported by the tests.
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  loadEnv();
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
