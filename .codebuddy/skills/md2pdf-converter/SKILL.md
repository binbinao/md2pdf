---
name: md2pdf-converter
description: |
  把 md2pdf 仓内的 Markdown 文件批量转 PDF。适用于：
  - 维护者发布新版本时的 release notes 转 PDF
  - 用户请求"给我一份 PDF 版的 README"
  - 自动化发版流水线中的文档归档
triggers:
  - "转 PDF"
  - "转成 PDF"
  - "convert to pdf"
  - "md2pdf 批量转换"
input:
  - name: files
    type: string[]
    description: 要转换的 Markdown 文件路径列表
output:
  - name: pdfs
    type: string[]
    description: 生成的 PDF 路径列表
---

# md2pdf-converter Skill

## 用途
批量把 Markdown 转成 PDF，输出到 `dist/pdf/` 目录。

## 步骤
1. 校验输入文件存在
2. 依次执行 `md2pdf <file> --out dist/pdf/`
3. 汇总结果，返回成功 / 失败清单

## 脚本
```bash
bash scripts/convert.sh
```

## 示例
调用本 Skill："把 README.md 和 CHANGELOG.md 转成 PDF"

## 注意
- 转换大文件（> 10MB）需要 30 秒以上，Agent 应主动提示
- 失败的文件不要阻塞其他文件，继续转换
