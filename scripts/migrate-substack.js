const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const TurndownService = require('turndown');

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

// Custom rules for Substack specific elements
turndownService.addRule('pullquote', {
  filter: function (node) {
    return node.classList.contains('pullquote');
  },
  replacement: function (content) {
    return '\n> ' + content + '\n';
  }
});

turndownService.addRule('captioned-image', {
  filter: function (node) {
    return node.classList.contains('captioned-image-container');
  },
  replacement: function (content, node) {
    const img = node.querySelector('img');
    const href = img ? img.getAttribute('src') : '';
    const alt = img ? img.getAttribute('alt') || '' : '';
    return href ? `\n![${alt}](${href})\n` : '';
  }
});

turndownService.addRule('buttons', {
  filter: function (node) {
    return node.classList.contains('button-wrapper') || node.classList.contains('subscription-widget-wrap');
  },
  replacement: function () {
    return '';
  }
});

const EXPORT_DIR = '/Users/jonathanpolitzki/Downloads/-fKXJvxrQ1uBeHO8hhpj8g';
const POSTS_CSV = path.join(EXPORT_DIR, 'posts.csv');
const POSTS_DIR = path.join(EXPORT_DIR, 'posts');
const OUTPUT_DIR = path.join(process.cwd(), 'src/content/writing');

async function migrate() {
  try {
    console.log(`Checking for CSV at: ${POSTS_CSV}`);
    if (!fs.existsSync(POSTS_CSV)) {
      console.error(`posts.csv not found`);
      return;
    }

    const csvContent = fs.readFileSync(POSTS_CSV, 'utf8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    console.log(`Found ${records.length} records in CSV.`);

    let count = 0;

    for (const record of records) {
      // DEBUG: Print status of first few records to see why they might be skipped
      // if (count < 5) console.log(`Checking ${record.post_id}: published=${record.is_published}`);

      if (record.is_published !== 'true') {
          continue;
      }

      const filenameStem = record.post_id; 
      const htmlFilename = `${filenameStem}.html`;
      const htmlPath = path.join(POSTS_DIR, htmlFilename);

      if (!fs.existsSync(htmlPath)) {
        console.warn(`HTML file not found for: ${htmlFilename}`);
        continue;
      }

      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      let markdown = turndownService.turndown(htmlContent);
      markdown = markdown.replace(/\n{3,}/g, '\n\n');

      const date = new Date(record.post_date).toISOString().split('T')[0];
      const title = (record.title || '').replace(/"/g, '\\"');
      const summary = (record.subtitle || '').replace(/"/g, '\\"');
      
      // Better slug logic: split by first dot, join rest
      const parts = filenameStem.split('.');
      let slug = parts.length > 1 ? parts.slice(1).join('.') : filenameStem;
      
      // Fallback if slug is empty or weird
      if (!slug || slug.trim() === '') {
          slug = `post-${record.post_id}`;
      }

      const fileContent = `---
title: "${title}"
publishedAt: "${date}"
summary: "${summary}"
tags: ["substack"]
type: "essay"
---

${markdown}
`;

      const outputPath = path.join(OUTPUT_DIR, `${slug}.mdx`);
      fs.writeFileSync(outputPath, fileContent);
      // console.log(`Migrated: ${slug}`);
      count++;
    }

    console.log(`\nSuccessfully migrated ${count} posts.`);
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrate();
