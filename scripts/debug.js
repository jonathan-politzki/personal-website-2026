const fs = require('fs');
const path = require('path');

const EXPORT_DIR = '/Users/jonathanpolitzki/Downloads/-fKXJvxrQ1uBeHO8hhpj8g';

try {
  const files = fs.readdirSync(EXPORT_DIR);
  console.log('Files:', files);
  fs.writeFileSync('debug.log', JSON.stringify(files));
} catch (e) {
  console.error(e);
  fs.writeFileSync('debug.log', e.message);
}
