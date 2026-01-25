try {
  const { parse } = require('csv-parse/sync');
  console.log('csv-parse/sync loaded successfully');
} catch (e) {
  console.error('Failed to load csv-parse/sync:', e.message);
}
