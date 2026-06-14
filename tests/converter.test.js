const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { convert } = require('../src/converter.js');

async function tmpFile(suffix, content) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'md2pdf-'));
  const file = path.join(dir, `test${suffix}`);
  await fs.writeFile(file, content);
  return { dir, file };
}

test('convert: produces a non-empty PDF for normal input', async () => {
  const { dir, file } = await tmpFile('.md', '# Hello\n\nThis is **bold** text.');
  const out = path.join(dir, 'out.pdf');
  await convert(file, out, { theme: 'github' });
  const buf = await fs.readFile(out);
  assert.ok(buf.length > 100);
  assert.equal(buf.slice(0, 4).toString(), '%PDF');
});

test('convert: accepts theme option without throwing', async () => {
  const { dir, file } = await tmpFile('.md', '# T\n\nbody');
  const out = path.join(dir, 'out.pdf');
  await convert(file, out, { theme: 'plain' });
  const stat = await fs.stat(out);
  assert.ok(stat.size > 0);
});

test('convert: throws on missing input file', async () => {
  await assert.rejects(
    () => convert('/nope/does-not-exist.md', '/tmp/x.pdf'),
    /not found|ENOENT/i
  );
});

test('convert: handles empty markdown gracefully', async () => {
  const { dir, file } = await tmpFile('.md', '');
  const out = path.join(dir, 'empty.pdf');
  await convert(file, out);
  const buf = await fs.readFile(out);
  assert.equal(buf.slice(0, 4).toString(), '%PDF');
});

test('convert: renders CJK content without throwing (smoke test)', async () => {
  // 验证：含 CJK 字符的 markdown 能被正常转换（不报错、PDF 头部正确）
  // 视觉验证（汉字是否显示）由用户打开 PDF 检查
  const { dir, file } = await tmpFile('.md', '# 中文标题\n\n这是一段**中文**段落。\n\n- 苹果\n- 香蕉');
  const out = path.join(dir, 'cjk.pdf');
  await convert(file, out);
  const buf = await fs.readFile(out);
  assert.equal(buf.slice(0, 4).toString(), '%PDF');
  assert.ok(buf.length > 1000, 'CJK PDF should have meaningful content');
});
