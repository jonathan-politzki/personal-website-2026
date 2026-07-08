#!/usr/bin/env node
/**
 * Import new Substack posts into src/content/writing/ as MDX.
 *
 * Usage:
 *   npm run import:substack             # import posts missing locally
 *   npm run import:substack -- --dry-run
 *   npm run import:substack -- --force <slug>   # re-import one post, overwriting local edits
 *
 * By default a post whose slug already exists locally is SKIPPED, so local
 * edits are never clobbered. The Substack RSS feed only carries the ~20 most
 * recent posts; older posts are already migrated and live only in this repo.
 */

import fs from 'node:fs';
import path from 'node:path';

const FEED_URL = 'https://jonathanpolitzki.substack.com/feed';
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'writing');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const forceIdx = args.indexOf('--force');
const forceSlugs = forceIdx === -1 ? [] : args.slice(forceIdx + 1).filter((a) => !a.startsWith('--'));

// --- tiny helpers ----------------------------------------------------------

function cdata(block, tag) {
  const m = block.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
  return m ? m[1].trim() : '';
}

function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

// Escape characters that MDX would treat as JSX/expressions in plain text.
function mdxSafe(s) {
  return s.replace(/{/g, '\\{').replace(/}/g, '\\}').replace(/<(?=[a-zA-Z/!])/g, '\\<');
}

// --- Substack HTML -> Markdown ----------------------------------------------

function htmlToMarkdown(html) {
  let s = html;

  // Drop Substack widgets: subscribe forms, share/comment buttons, embeds' chrome.
  s = s.replace(/<div class="subscription-widget-wrap[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '');
  s = s.replace(/<p class="button-wrapper"[\s\S]*?<\/p>/g, '');
  s = s.replace(/<div class="embedded-post-wrap[\s\S]*?<\/div>\s*<\/div>/g, '');

  // Images: Substack wraps them in captioned-image-container figures.
  s = s.replace(/<div class="captioned-image-container">[\s\S]*?<img[^>]*\bsrc="([^"]+)"[^>]*>[\s\S]*?<\/div>/g,
    (_, src) => `\n\n![](${src})\n\n`);
  s = s.replace(/<img[^>]*\bsrc="([^"]+)"[^>]*>/g, (_, src) => `\n\n![](${src})\n\n`);

  // Inline elements.
  s = s.replace(/<a[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) => `[${text}](${href})`);
  s = s.replace(/<(strong|b)>([\s\S]*?)<\/\1>/g, '**$2**');
  s = s.replace(/<(em|i)>([\s\S]*?)<\/\1>/g, '_$2_');
  s = s.replace(/<(s|del)>([\s\S]*?)<\/\1>/g, '~~$2~~');
  s = s.replace(/<code>([\s\S]*?)<\/code>/g, '`$1`');
  s = s.replace(/<span[^>]*>|<\/span>/g, '');
  s = s.replace(/<br\s*\/?>/g, '\n');

  // Block elements.
  s = s.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g, (_, n, text) => `\n\n${'#'.repeat(Number(n))} ${text}\n\n`);
  s = s.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, (_, code) => `\n\n\`\`\`\n${code.replace(/`/g, '')}\n\`\`\`\n\n`);
  s = s.replace(/<(blockquote|div class="pullquote")[^>]*>([\s\S]*?)<\/(?:blockquote|div)>/g,
    (_, __, inner) => '\n\n' + inner.replace(/<\/?p[^>]*>/g, '\n').trim().split(/\n+/).map((l) => `> ${l.trim()}`).join('\n') + '\n\n');
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (_, text) => `- ${text.replace(/<\/?p[^>]*>/g, '').trim()}\n`);
  s = s.replace(/<\/?(ul|ol)[^>]*>/g, '\n');
  s = s.replace(/<hr[^>]*\/?>/g, '\n\n---\n\n');
  s = s.replace(/<\/?p[^>]*>/g, (m) => (m.startsWith('</') ? '\n\n' : ''));

  // Anything left (figure/picture/source/div wrappers) gets stripped.
  s = s.replace(/<\/?[a-zA-Z][^>]*>/g, '');

  s = decodeEntities(s);

  // Drop the Substack subscribe boilerplate paragraph.
  s = s.replace(/^Thanks for reading[^\n]*Subscribe[^\n]*$/gim, '');

  // Collapse excess blank lines, tidy per-line whitespace.
  s = s.split('\n').map((l) => l.trimEnd()).join('\n').replace(/\n{3,}/g, '\n\n').trim();

  return mdxSafe(s);
}

// --- main --------------------------------------------------------------------

const res = await fetch(FEED_URL);
if (!res.ok) {
  console.error(`Failed to fetch feed: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const xml = await res.text();
const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);

if (items.length === 0) {
  console.error('No items found in feed — has the feed format changed?');
  process.exit(1);
}

let created = 0;
let skipped = 0;

for (const item of items) {
  const link = cdata(item, 'link') || (item.match(/<link>([^<]+)<\/link>/) || [])[1] || '';
  const slugMatch = link.match(/\/p\/([^/?#]+)/);
  if (!slugMatch) continue;
  const slug = slugMatch[1];
  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  const exists = fs.existsSync(file);

  if (exists && !forceSlugs.includes(slug)) {
    skipped++;
    continue;
  }

  const title = decodeEntities(cdata(item, 'title'));
  const summary = decodeEntities(cdata(item, 'description'));
  const pubDate = cdata(item, 'pubDate');
  const publishedAt = new Date(pubDate).toISOString().slice(0, 10);
  const html = cdata(item, 'content:encoded');
  const body = htmlToMarkdown(html);

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `publishedAt: "${publishedAt}"`,
    `summary: ${JSON.stringify(summary)}`,
    'tags: ["substack"]',
    'type: "essay"',
    '---',
  ].join('\n');

  const out = `${frontmatter}\n\n${body}\n`;

  if (dryRun) {
    console.log(`[dry-run] would ${exists ? 'overwrite' : 'create'} ${path.relative(process.cwd(), file)} (${title})`);
  } else {
    fs.writeFileSync(file, out);
    console.log(`${exists ? 'overwrote' : 'created'}  src/content/writing/${slug}.mdx  (${title}, ${publishedAt})`);
  }
  created++;
}

console.log(`\n${created} imported, ${skipped} already present (left untouched).`);
if (forceSlugs.length) {
  const missing = forceSlugs.filter((s) => !fs.existsSync(path.join(CONTENT_DIR, `${s}.mdx`)));
  for (const s of missing) console.warn(`note: --force slug "${s}" was not found in the feed (feed only has ~20 newest posts).`);
}
