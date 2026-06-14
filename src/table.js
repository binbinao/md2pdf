const fs = require('node:fs');
const path = require('node:path');

/**
 * Detect whether a markdown string contains a pipe-style table.
 * @param {string} markdown
 * @returns {boolean}
 */
function hasMarkdownTable(markdown) {
  const lines = markdown.split('\n');
  let pipeLines = 0;
  let hasSeparator = false;
  for (const line of lines) {
    if (/\|/.test(line)) pipeLines++;
    if (/^\s*\|?[\s:|-]+\|[\s:|-]+\|?\s*$/.test(line) && line.includes('-')) {
      hasSeparator = true;
    }
  }
  return pipeLines >= 2 && hasSeparator;
}

/**
 * Read the bundled table CSS.
 * @returns {string}
 */
function getTableCss() {
  return fs.readFileSync(path.join(__dirname, 'table.css'), 'utf8');
}

module.exports = { hasMarkdownTable, getTableCss };
