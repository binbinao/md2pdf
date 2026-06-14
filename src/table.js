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
 * Detect whether a markdown string contains a mermaid code block.
 * Mermaid uses ```mermaid fenced code blocks.
 * @param {string} markdown
 * @returns {boolean}
 */
function hasMermaid(markdown) {
  return /```mermaid\b/i.test(markdown);
}

/**
 * Read the bundled table CSS.
 * @returns {string}
 */
function getTableCss() {
  return fs.readFileSync(path.join(__dirname, 'table.css'), 'utf8');
}

/**
 * Return an inline script that loads mermaid.js from CDN and initializes
 * it to auto-render all ```mermaid blocks in the page. This script is
 * injected into md-to-pdf's page via the `script` field.
 * @returns {string}
 */
function getMermaidScript() {
  return `(() => {
    if (document.querySelector('pre code.language-mermaid') || document.querySelector('.mermaid')) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
      s.onload = () => {
        window.mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });
      };
      document.head.appendChild(s);
    }
  })();`;
}

module.exports = { hasMarkdownTable, hasMermaid, getTableCss, getMermaidScript };
