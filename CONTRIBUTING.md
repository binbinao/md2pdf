# 贡献指南

## 提 issue

- 标题格式：`[Feature] xxx` / `[Bug] xxx` / `[Docs] xxx`
- 正文必须包含：复现步骤 / 期望行为 / 实际行为 / 截图（如适用）
- 若希望 Agent 自动处理，issue 请打 `auto-handle` label

## 提 PR

- 一个 PR 解决一个 issue
- commit message 遵循 Conventional Commits
- 必须包含测试用例
- PR 标题必须包含 `Closes #<issue-number>`

## 开发

```bash
npm install
npm test
node bin/md2pdf.js examples/sample.md
```
