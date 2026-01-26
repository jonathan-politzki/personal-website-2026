#!/usr/bin/env node
/**
 * Generate Corpus Analysis - Single Prompt Approach
 *
 * Instead of 55 API calls, we send ALL essays in ONE prompt
 * and ask Gemini to return structured analysis.
 *
 * Run: node scripts/generate-corpus-analysis.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';
const CONTENT_DIR = path.join(process.cwd(), 'src/content/writing');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/corpus-analysis.json');
const SUMMARIES_FILE = path.join(process.cwd(), 'src/data/essay-summaries.json');

function countWords(text) {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

async function callGemini(prompt) {
  console.log(`Sending prompt (${estimateTokens(prompt).toLocaleString()} estimated tokens)...`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 16384,
          temperature: 0.3
        }
      })
    }
  );

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function main() {
  if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY not set');
    process.exit(1);
  }

  console.log('📚 Reading essays...\n');

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
      tokens,
      // Keep first 1500 chars for summary generation (saves tokens)
      excerpt: content.slice(0, 1500)
    });
  }

  // Sort by date (oldest first for evolution analysis)
  essays.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  console.log(`Found ${essays.length} essays`);
  console.log(`Total: ${totalWords.toLocaleString()} words, ~${totalTokens.toLocaleString()} tokens\n`);

  // Build condensed corpus for analysis
  const corpusText = essays.map((e, i) =>
    `[${i + 1}] "${e.title}" (${e.date}, ${e.words} words)\n${e.excerpt}...`
  ).join('\n\n---\n\n');

  const prompt = `Analyze this essay corpus (${essays.length} essays, ${essays[0]?.date} to ${essays[essays.length-1]?.date}).

Return JSON with:

1. "summary": 2-3 sentences. Be direct and objective. No flowery language. Just describe what topics he writes about and how his focus has shifted over time. Example tone: "Writes mostly about X, Y, Z. Earlier work focused on A, later shifted to B."

2. "themes": Array of 5 recurring themes with "name", "score" (1-100), "description" (one plain sentence)

3. "essay_summaries": Array of ${essays.length} objects with "slug" and "summary" (1 sentence each, factual)

Slugs: ${essays.map(e => e.slug).join(', ')}

===CORPUS===
${corpusText}
===END===

Return ONLY valid JSON:`;

  console.log('🔮 Generating analysis (this may take a minute)...\n');

  try {
    const response = await callGemini(prompt);

    // Parse JSON from response
    let analysis;
    try {
      // Strip markdown code blocks if present
      let cleanResponse = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      // Try to extract JSON object
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(cleanResponse);
      }
    } catch (e) {
      console.error('Failed to parse JSON response:', e.message);
      console.error('Raw response (first 1000 chars):', response.slice(0, 1000));

      // Try to salvage what we can
      console.log('\nAttempting to salvage partial response...');
      const summaryMatch = response.match(/"summary":\s*"([^"]+)"/);
      if (summaryMatch) {
        analysis = {
          summary: summaryMatch[1],
          themes: [],
          essay_summaries: []
        };
        console.log('Salvaged summary.');
      } else {
        process.exit(1);
      }
    }

    // Save corpus analysis
    const stats = {
      total_essays: essays.length,
      total_words: totalWords,
      total_tokens: totalTokens,
      avg_words: Math.round(totalWords / essays.length),
      date_range: {
        earliest: essays[0]?.date,
        latest: essays[essays.length - 1]?.date
      }
    };

    const corpusOutput = {
      generated_at: new Date().toISOString(),
      stats,
      summary: analysis.summary,
      themes: analysis.themes || []
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(corpusOutput, null, 2));
    console.log(`📊 Saved corpus analysis to ${OUTPUT_FILE}`);

    // Save essay summaries
    const essaySummaries = essays.map((essay, i) => ({
      slug: essay.slug,
      title: essay.title,
      date: essay.date,
      words: essay.words,
      tokens: essay.tokens,
      summary: analysis.essay_summaries?.[i]?.summary || 'Summary not generated.'
    }));

    fs.writeFileSync(SUMMARIES_FILE, JSON.stringify(essaySummaries, null, 2));
    console.log(`📝 Saved ${essaySummaries.length} essay summaries to ${SUMMARIES_FILE}`);

    console.log('\n✅ Done!');
    console.log(`\nCorpus Summary:\n${analysis.summary}`);

  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

main();
