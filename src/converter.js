const fs = require('node:fs/promises');
const path = require('node:path');
const mdToPdf = require('md-to-pdf').default;
const { hasMarkdownTable, hasMermaid, getTableCss, getMermaidScript } = require('./table.js');

/**
 * Base CSS always injected into every PDF. Provides a cross-platform
 * CJK font stack so Chinese / Japanese / Korean characters render
 * correctly. !important is used to override md-to-pdf's default
 * `font-family: 'Open Sans', sans-serif` which has no CJK glyphs.
 */
const BASE_CSS = `body, p, div, li, td, th, h1, h2, h3, h4, h5, h6,
blockquote, pre, table, tr, dd, dt, span, a {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Helvetica Neue", Arial,
    "PingFang SC", "Hiragino Sans GB", "STHeiti", "Heiti SC",
    "Microsoft YaHei", "微软雅黑",
    "WenQuanYi Micro Hei", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN",
    sans-serif !important;
}
code, pre code, kbd, samp {
  font-family: ui-monospace, "SF Mono", Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace !important;
}
`;

/**
 * Convert a markdown file to PDF.
 * @param {string} inputPath Absolute path to input .md
 * @param {string} outputPath Absolute path to output .pdf
 * @param {{theme?: string}} [options]
 * @returns {Promise<{filename: string|undefined, content: Buffer}>}
 */
async function convert(inputPath, outputPath, options = {}) {
  try {
    await fs.access(inputPath);
  } catch {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const inputContent = await fs.readFile(inputPath, 'utf8');
  const basedir = path.dirname(inputPath);
  const tableCss = hasMarkdownTable(inputContent) ? getTableCss() : '';
  const css = tableCss ? `${BASE_CSS}\n${tableCss}` : BASE_CSS;
  const scripts = hasMermaid(inputContent) ? [{ content: getMermaidScript() }] : [];

  const config = {
    dest: outputPath,
    basedir,
    css,
    script: scripts,
    pdf_options: { format: 'A4' },
    document_title: options.theme ? `md2pdf [${options.theme}]` : 'md2pdf',
  };

  const result = await mdToPdf({ path: inputPath }, config);
  return { filename: result.filename, content: result.content };
}

module.exports = { convert, BASE_CSS };
