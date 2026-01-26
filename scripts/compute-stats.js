#!/usr/bin/env node
/**
 * Compute corpus stats (no API calls needed)
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(process.cwd(), 'src/content/writing');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/corpus-analysis.json');

function countWords(text) {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.mdx'));
const essays = [];

let totalWords = 0;
let totalTokens = 0;

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  const words = countWords(content);
  const tokens = estimateTokens(content);

  totalWords += words;
  totalTokens += tokens;

  essays.push({
    slug: file.replace('.mdx', ''),
    title: data.title || file,
    date: data.publishedAt || 'unknown',
    words,
    tokens
  });
}

essays.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

const stats = {
  total_essays: essays.length,
  total_words: totalWords,
  total_tokens: totalTokens,
  avg_words: Math.round(totalWords / essays.length),
  date_range: {
    earliest: essays[essays.length - 1]?.date,
    latest: essays[0]?.date
  }
};

// Read existing file to preserve summary/themes if they exist
let existing = {};
try {
  existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
} catch (e) {}

const output = {
  ...existing,
  generated_at: new Date().toISOString(),
  stats,
  // Keep existing summary/themes if no new ones
  summary: existing.summary || "Summary pending generation.",
  themes: existing.themes || []
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

console.log('✅ Stats computed:');
console.log(`   Essays: ${stats.total_essays}`);
console.log(`   Words: ${stats.total_words.toLocaleString()}`);
console.log(`   Tokens: ${stats.total_tokens.toLocaleString()}`);
console.log(`   Avg words/essay: ${stats.avg_words}`);
console.log(`   Date range: ${stats.date_range.earliest} → ${stats.date_range.latest}`);
console.log(`\nSaved to ${OUTPUT_FILE}`);
