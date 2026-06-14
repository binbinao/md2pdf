# md2pdf Agent Constitution

> 这是给 CodeBuddy Agent 看的"项目宪法"。Agent 接到本仓任务时必须先读本文件。
> 人工开发者也建议读——它定义了本仓的规范。

## 1. 项目简介

md2pdf 是一个把 Markdown 转 PDF 的 CLI 工具，约 200 行 Node.js 代码，
目标用户是写技术文档的开发者。仓内同时是 Agentic Engineering 5 件套的实验样本。

## 2. 架构概览

- `bin/md2pdf.js`：CLI 入口
- `src/cli.js`：参数解析（minimist）
- `src/converter.js`：核心转换逻辑（封装 md-to-pdf）
- `src/table.js`：表格检测 + CSS 注入
- `src/table.css`：表格样式
- `tests/`：`node:test` 风格

依赖流向：`bin → cli → converter → (table.js) → md-to-pdf`

## 3. 编码规范

- CommonJS（`require` / `module.exports`），与本仓 `bin/` 入口保持一致
- 函数必须有 JSDoc 注释
- 错误必须抛出带 message 的 Error，不用字符串
- 异步函数返回 Promise，不用回调
- 缩进 2 空格
- 字符串优先用单引号

## 3.1 字体与 CJK 渲染

- `src/converter.js` 的 `BASE_CSS` 注入了跨平台 CJK 字体栈（macOS / Windows / Linux）
- 使用 `!important` 覆盖 `md-to-pdf` 默认的 `Open Sans`（不含 CJK）
- **依赖系统字体**：运行本工具的机器需安装 PingFang SC / Microsoft YaHei / Noto Sans CJK SC 之一
- 字体栈的顺序就是回退顺序：macOS 优先 → Windows 优先 → Linux 优先
- 修改 BASE_CSS 后必须跑 `tests/table.test.js` 的 "BASE_CSS contains cross-platform CJK font stack" 测试

## 4. 禁止事项

- ❌ 不要引入新依赖，除非 PR 明确说明理由
- ❌ 不要改 `package.json` 的 `bin` 字段
- ❌ 不要直接 commit 到 main，必须走 PR
- ❌ 不要在 commit message 里用 "WIP" / "fix" / "update" 这种含糊词
- ❌ 不要修改 `package.json` 的 `engines.node`

## 5. 测试约定

- 用 `node:test`，不用 jest/mocha
- 转换类函数必须覆盖：正常输入 / 空文件 / 超大文件 / 非 Markdown 输入
- 跑测试：`npm test`，所有用例必须绿
- 测试文件命名：`<module>.test.js`，放在 `tests/` 下
- 用 `node:assert/strict`，不要用 `assert` 浅断言

## 6. 协作流程

- 一个 PR 解决一个 issue
- PR 必须引用 issue 编号：`Closes #123`
- reviewer 通过后才能 merge
- merge 后必须 close 源 issue 并写说明
- commit message 遵循 Conventional Commits：`feat:` / `fix:` / `docs:` / `refactor:` / `test:` / `chore:`
- Hook 失败不阻塞但要把错误反馈给 Agent，Agent 自我修复
