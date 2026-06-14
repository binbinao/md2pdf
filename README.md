# md2pdf

把 Markdown 文件转成 PDF 的 CLI 工具，约 200 行 Node.js 代码。

## 快速开始

```bash
npm install
npm link
md2pdf README.md
```

## 命令

```bash
md2pdf <input.md> [output.pdf] [--theme=github]
```

参数：

- `<input.md>`：必填，输入的 markdown 文件
- `[output.pdf]`：可选，输出 PDF 路径，默认同目录同名 `.pdf`
- `--theme`：可选，`github`（默认）/ `plain` / `academic`

## 输出示例

`examples/sample.md` → `examples/sample.pdf`

## 开发

```bash
npm test              # 跑 node:test
node bin/md2pdf.js examples/sample.md --theme=github
```

## 字体与 CJK 渲染

`md2pdf` 内置跨平台 CJK 字体栈（macOS 的 PingFang SC、Windows 的 Microsoft YaHei、Linux 的 Noto Sans CJK SC），能正确渲染中文 / 日文 / 韩文。

**前置条件**：运行本工具的机器需要安装上述字体之一：

- **macOS**：自带 PingFang SC / Hiragino Sans GB，**开箱即用** ✓
- **Windows**：自带 Microsoft YaHei，**开箱即用** ✓
- **Linux**（含 CI / Docker）：需要 `apt install fonts-noto-cjk` 或 `fc-cache` 装 Noto Sans CJK

字体栈在 `src/converter.js` 的 `BASE_CSS` 常量里。运行时不联网下载字体，PDF 体积会随嵌入的字符集增长（中文 PDF 通常比纯英文大 3-5 倍）。

## 项目结构

```
bin/md2pdf.js     CLI 入口
src/cli.js        参数解析
src/converter.js  核心转换
src/table.js      表格检测 + CSS 注入
src/table.css     表格样式
tests/            node:test 测试
examples/         示例 markdown
```

## Agentic Engineering 5 件套

本仓库同时是 Agentic Engineering 的实验样本。配齐了：

- **Profile** — `.codebuddy/AGENT.md`
- **Subagents** — `.codebuddy/agents/{planner,coder,reviewer,tester,docs-writer}.md`
- **Skills** — `.codebuddy/skills/md2pdf-converter/`
- **MCP** — `.mcp.json`（filesystem / github / shell）
- **Hooks** — `.codebuddy/hooks/{pre-commit,post-commit,pre-push,on-pr,on-issue}.sh`
- **Loops** — `.codebuddy/loops/{issue-intake,pr-review,release}.toml`

详细设计参考：父仓 `docs/writing/2026-06-14-agentic-engineering-best-practices-final.md`。

## License

MIT
