// src/scripts/analyze-themes.js
// Run this during build or manually to update src/data/corpus-analysis.json

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
require('dotenv').config({ path: '.env.local' });

const CONTENT_DIR = path.join(process.cwd(), 'src/content/writing');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/corpus-analysis.json');

// Simple rough token estimation (can be replaced with tiktoken/gpt-3-encoder if precision needed)
// English text averages ~4 chars per token
function countTokens(text) {
  return Math.ceil(text.length / 4);
}

async function analyzeCorpus() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY not found in .env.local');
    process.exit(1);
  }

  console.log('Reading corpus...');
  const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.mdx'));
  
  let totalWords = 0;
  let totalTokens = 0;
  let essays = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    const { data, content: body } = matter(content);
    
    // Word Count
    const wordCount = body.split(/\s+/).length;
    totalWords += wordCount;

    // Token Count
    const tokenCount = countTokens(body);
    totalTokens += tokenCount;
    
    essays.push({
      title: data.title,
      date: data.publishedAt,
      content: body.slice(0, 15000) // Much larger context for Gemini 1.5 Pro
    });
  }

  console.log(`Corpus stats: ${files.length} essays, ~${totalWords} words, ${totalTokens} tokens (calc).`);

  // Construct Prompt for Gemini
  const prompt = `
    You are a literary analyst observing the mind of Jonathan Politzki through his writing.
    
    Task:
    1. Write a "Corpus Summary": A single, insightful paragraph (approx 3-4 sentences) that summarizes the overarching narrative, philosophical stance, and intellectual journey of this writer based on the provided essays.
    2. Identify 5 "Latent Themes" that run through the work.
    3. For each theme, provide a "Score" (0-100) representing its intensity/prevalence.
    4. Provide a short description for each.

    Return ONLY valid JSON in this format:
    {
      "stats": {
        "total_essays": ${files.length},
        "total_words": ${totalWords},
        "total_tokens": ${totalTokens},
        "avg_words": ${Math.round(totalWords / files.length)}
      },
      "summary": "The summary paragraph...",
      "themes": [
        { "name": "Theme Name", "score": 85, "description": "Description..." }
      ]
    }

    ESSAYS:
    ${essays.map(e => `TITLE: ${e.title}\n${e.content}\n---`).join('\n')}
  `;

  console.log('Sending to Gemini (gemini-1.5-pro)...');

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const resultText = data.candidates[0].content.parts[0].text;
    
    // Ensure directory exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, resultText);
    console.log(`Analysis saved to ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('Analysis failed:', error);
  }
}

analyzeCorpus();
