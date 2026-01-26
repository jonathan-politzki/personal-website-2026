const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// This script would be run at build time or manually to generate the embedding index
// It parses the MDX files in src/content/writing, chunks them, and prepares them for embedding.

const CONTENT_DIR = path.join(process.cwd(), 'src/content/writing');
const OUTPUT_FILE = path.join(process.cwd(), 'src/content/index.json');

function buildIndex() {
  const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.mdx'));
  const chunks = [];

  files.forEach(file => {
    const filePath = path.join(CONTENT_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Simple chunking by paragraph for now
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    
    paragraphs.forEach((p, i) => {
      chunks.push({
        id: `${file}-${i}`,
        text: p,
        metadata: {
          source: data.title,
          date: data.publishedAt,
          slug: file.replace('.mdx', '')
        }
      });
    });
  });

  // In a real app, we would now:
  // 1. Send 'chunks' to an embedding API (e.g. Gemini)
  // 2. Store the vectors + metadata in a vector DB or local file
  
  console.log(`Parsed ${files.length} files into ${chunks.length} text chunks.`);
  // fs.writeFileSync(OUTPUT_FILE, JSON.stringify(chunks, null, 2));
}

buildIndex();
