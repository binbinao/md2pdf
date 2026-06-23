const { test } = require('node:test');
const assert = require('node:assert/strict');
const { hasMarkdownTable, hasMermaid, getTableCss, getMermaidScript } = require('../src/table.js');

test('hasMarkdownTable: detects a standard pipe table', () => {
  const md = '| a | b |\n| --- | --- |\n| 1 | 2 |\n| 3 | 4 |';
  assert.equal(hasMarkdownTable(md), true);
});

test('hasMarkdownTable: detects alignment colons in separator', () => {
  const md = '| L | C | R |\n|:---|:---:|---:|\n| a | b | c |';
  assert.equal(hasMarkdownTable(md), true);
});

test('hasMarkdownTable: returns false for plain prose', () => {
  const md = '# Title\n\nJust text. No table.\nMaybe a | pipe.';
  assert.equal(hasMarkdownTable(md), false);
});

test('hasMarkdownTable: returns false for single-line pipe', () => {
  assert.equal(hasMarkdownTable('| one | two |'), false);
});

test('getTableCss: returns non-empty CSS with table rules', () => {
  const css = getTableCss();
  assert.ok(css.length > 50);
  assert.match(css, /table\s*\{/);
  assert.match(css, /border-collapse/);
});

test('converter: BASE_CSS contains cross-platform CJK font stack', () => {
  // 通过读 converter.js 源码，验证内联的 BASE_CSS 含有主要 CJK 字体
  // 跨平台覆盖：macOS (PingFang SC / Hiragino Sans GB)、Windows (Microsoft YaHei)、Linux (Noto Sans CJK SC)
  const src = require('node:fs').readFileSync(
    require('node:path').join(__dirname, '../src/converter.js'),
    'utf8',
  );
  assert.match(src, /PingFang SC/, 'should include macOS CJK font');
  assert.match(src, /Microsoft YaHei/, 'should include Windows CJK font');
  assert.match(src, /Noto Sans CJK SC/, 'should include Linux CJK font');
  assert.match(src, /!important/, 'font-family needs !important to override md-to-pdf default');
});

test('hasMermaid: detects mermaid fenced code block', () => {
  const md = '```mermaid\ngraph TD\nA-->B\n```';
  assert.equal(hasMermaid(md), true);
});

test('hasMermaid: is case-insensitive on the language tag', () => {
  assert.equal(hasMermaid('```MERMAID\nA-->B\n```'), true);
  assert.equal(hasMermaid('```Mermaid\nA-->B\n```'), true);
});

test('hasMermaid: returns false for plain code blocks', () => {
  assert.equal(hasMermaid('```js\nconst x = 1;\n```'), false);
  assert.equal(hasMermaid('```\nplain text\n```'), false);
  assert.equal(hasMermaid('no code blocks at all'), false);
});

test('getMermaidScript: returns a non-empty IIFE string with CDN URL', () => {
  const script = getMermaidScript();
  assert.ok(script.length > 50, 'script should have meaningful content');
  assert.match(script, /mermaid\.min\.js/, 'should reference mermaid CDN');
  assert.match(script, /mermaid\.initialize/, 'should call mermaid.initialize');
  assert.match(script, /document\.head/, 'should inject into head');
});

test('cli: --quiet suppresses success output', () => {
  const { execFileSync } = require('node:child_process');
  const path = require('node:path');
  const fs = require('node:fs');

  // 用最简单的 markdown 做输入（跟 CI smoke test 同一思路，避免复杂内容导致超时）
  const input = '/tmp/test-quiet-input.md';
  const output = '/tmp/test-quiet.pdf';
  fs.writeFileSync(input, '# Quiet test\n\nHello world.\n');

  // 清理可能残留的旧文件
  try {
    fs.unlinkSync(output);
  } catch {}

  const stdout = execFileSync(
    'node',
    [path.resolve(__dirname, '../bin/md2pdf.js'), input, '-o', output, '-q'],
    { encoding: 'utf8', timeout: 30000 },
  );

  // quiet 模式不应打印成功消息
  assert.ok(!stdout.includes('✅ PDF written'), 'quiet mode should not print success message');
  // 但 PDF 应该确实生成了
  assert.ok(fs.existsSync(output), 'PDF should still be created in quiet mode');

  // 清理
  try {
    fs.unlinkSync(input);
  } catch {}
  try {
    fs.unlinkSync(output);
  } catch {}
});
