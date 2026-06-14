#!/usr/bin/env node
const { cli } = require('../src/cli.js');

cli(process.argv.slice(2)).catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
