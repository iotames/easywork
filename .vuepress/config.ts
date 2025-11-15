import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { markdownChartPlugin } from '@vuepress/plugin-markdown-chart'

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme(),
  // base默认值为 '/'
  base: '/easywork/',
  lang: 'zh-CN',
  title: "沙滩星空的博客",
  description: "金于沙里得，玉向石中求。个人博客主要是工作和学习的备忘笔记，包含开发与运维的提效脚本工具。",
  plugins: [
    markdownChartPlugin({
      // 启用 Mermaid
      mermaid: true,
    }),
  ]
})
