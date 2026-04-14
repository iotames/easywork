import path from 'node:path'  // 确保引入 path 模块
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
    // 判断当前页面是否是文件夹的"索引页"（README.md）
    // page.path 如果是 /foo/ 则代表它是 /foo/README.md
    const isFolderIndex = page.path.endsWith('/')
    // 从页面 Frontmatter 中读取 order，如果没有则尝试其他来源（如文件名）
    const order = page.frontmatter.order

    let catalogTitle = page.title

    if (!catalogTitle) {
      // 提取文件或文件夹名
      const filePath = page.filePathRelative || page.filePath || ''
      const baseName = path.basename(filePath, '.md')
      
      if (isFolderIndex) {
        // 文件夹索引页：如果 README.md 没有标题，则使用父文件夹名
        catalogTitle = path.basename(path.dirname(filePath)) || baseName
      } else {
        // 普通 md 文件：如果没有标题，则使用文件名（去掉 .md 后缀）
        catalogTitle = baseName
      }
    }

    // 最后设置 routeMeta，确保 catalogTitle 非空
    page.routeMeta = {
      title: catalogTitle || '未命名文档',
      order: order || 9,
    }
  },
  plugins: [
    // TODO catalogPlugin 配置没有生效
    catalogPlugin({
      // 排除一些不需要生成目录页的文件夹
      exclude: ['/\.vuepress/', '/node_modules/'],
      // 目录层级深度
      level: 3,
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
