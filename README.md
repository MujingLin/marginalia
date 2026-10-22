# Marginalia

一个以互动为入口的 Mobile-First 个人学习 Web App，包含：

- Today 每日学习入口与视觉主题
- TED 主题英语双语精读
- 延世初级框架韩语课程
- 互动概念微课与知识拓展
- 零基础股票学习路径
- 本地收藏、笔记、进度与复习队列

## 本地运行

```bash
npm install
npm run dev
```

## 检查与构建

```bash
npm test
npm run build
```

GitHub Pages 由 `.github/workflows/deploy.yml` 自动构建并发布。网站支持添加到 iOS / Android 主屏幕，并使用浏览器本地存储保留个人学习数据。
