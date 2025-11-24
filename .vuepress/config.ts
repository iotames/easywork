import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
// import { hopeTheme } from "vuepress-theme-hope";
import { defineUserConfig } from 'vuepress'
import { catalogPlugin } from '@vuepress/plugin-catalog'
import { markdownChartPlugin } from '@vuepress/plugin-markdown-chart'
import { slimsearchPlugin } from '@vuepress/plugin-slimsearch'

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme(),
  // theme: hopeTheme({sidebar: "structure"}),
  // base默认值为 '/'
  base: '/easywork/',
  lang: 'zh-CN',
  title: "沙滩星空的博客",
  description: "金于沙里得，玉向石中求。个人博客主要是工作和学习的备忘笔记，包含开发与运维的提效脚本工具。",
  // @vuepress/plugin-catalog Need extendsPage
  extendsPage: (page) => {
    page.routeMeta = {
      title: page.title
    }
  },
  plugins: [
    // TODO catalogPlugin 配置没有生效
    catalogPlugin({
      // 排除一些不需要生成目录页的文件夹
      exclude: ['/\.vuepress/', '/node_modules/'],
      // 目录层级深度
      level: 2,
      // 不显示索引编号
      index: false,
    }),
    slimsearchPlugin({
      indexContent: true,
      suggestion: true,
      searchDelay: 500,
    }),
    markdownChartPlugin({
      // 启用 Mermaid
      mermaid: true,
    }),
  ]
})
