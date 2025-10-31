import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "沙滩星空的博客",
  description: "金于沙里得，玉向石中求。个人博客主要是工作和学习的备忘笔记，包含开发与运维的提效脚本工具。",
  // 关键配置：设置源目录为当前目录
  srcDir: '.',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记分类', link: '/README' }
    ],
    sidebar: [
      {
        text: '目录',
        items: [
          { text: '首页', link: '/' },
          { text: '备份工具', link: '/backup/README' },
          { text: '配置相关', link: '/config/README' },
          // 继续添加其他目录...
        ]
      }
    ],
  // // 设置重定向，将根路径重定向到 README
  // async transformHtml(html, id, context) {
  //   if (id.endsWith('/index.html')) {
  //     return html.replace(
  //       '<head>',
  //       `<head><meta http-equiv="refresh" content="0;url=/README">`
  //     )
  //   }
  // },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
