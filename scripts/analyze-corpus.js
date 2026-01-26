const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(process.cwd(), 'src/content/writing');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/corpus-analysis.json');
const API_KEY = 'AIzaSyAJ2rvTsjyPE651ysAVKab3Ixi1zZAqPpg'; // Hardcoded for migration script

async function analyzeCorpus() {
  console.log('Reading corpus...');
  if (!fs.existsSync(CONTENT_DIR)) {
      console.error('Content dir not found');
      return;
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.mdx'));
  
  let totalWords = 0;
  let essays = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    const { data, content: body } = matter(content);
    const wordCount = body.split(/\s+/).length;
    totalWords += wordCount;
    
    essays.push({
      title: data.title,
      date: data.publishedAt,
      content: body.slice(0, 2000) // Truncate to save tokens/time
    });
  }

  console.log(`Corpus stats: ${files.length} essays, ~${totalWords} words.`);

  // Construct Prompt for Gemini
  const prompt = `
    You are a literary analyst tasked with analyzing the entire writing corpus of Jonathan Politzki.
    
    Goal: Fulfill Rick Rubin's prophecy: "Latent ideas and emotions hiding in deeper layers of the psyche may find their way into our lyric scenes and canvases."

    Task:
    1. Analyze the following essays.
    2. Identify 5 "Latent Themes" that run through the work—deep psychological or philosophical undercurrents.
    3. Quantify the prevalence of each theme (0-100%).
    4. Provide a short, cryptic/poetic description for each.

    Return ONLY valid JSON in this format:
    {
      "stats": {
        "total_essays": ${files.length},
        "total_words": ${totalWords},
        "avg_words": ${Math.round(totalWords / files.length)}
      },
      "themes": [
        { "name": "Theme Name", "score": 85, "description": "Description..." }
      ]
    }

    ESSAYS:
    ${essays.map(e => `TITLE: ${e.title}\nDATE: ${e.date}\n${e.content}\n---`).join('\n')}
  `;

  console.log('Sending to Gemini (gemini-1.5-pro)...');

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`, {
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
    console.log("Received response from Gemini.");
    
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
