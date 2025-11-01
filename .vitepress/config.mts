import { defineConfig } from 'vitepress'
// TODO 添加的自定义ReadmeRouterPlugin插件有BUG待修复
// import ReadmeRouterPlugin from './plugins/readme-router'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "沙滩星空的博客",
  description: "金于沙里得，玉向石中求。个人博客主要是工作和学习的备忘笔记，包含开发与运维的提效脚本工具。",

  // 关键配置：cleanUrls为false（默认值）。改为true去掉html后缀。
  cleanUrls: true,

  // 关键配置：设置源目录为当前目录
  srcDir: '.',

  vite: {
    // plugins: [ReadmeRouterPlugin()],
    resolve: {
      alias: {
        // 处理根目录的索引页
        '/index.md': '/README.md'
      }
    }
  },

  // // TODO 使用路由重定向 这些配置都无效。
  // rewrites: {
  //   'index.md': 'README.md',
  //   ':dir/index.md': ':dir/README.md',
  //   '/clang/index.md': '/clang/README',
  //   ':dir1/:dir2/index.md': ':dir1/:dir2/README.md'
  // },

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
          { text: 'C语言开发', link: '/clang/README' },
          { text: '桌面工具', link: '/desktop/README' },
          { text: 'DevOps', link: '/devops/README' },
          { text: 'Docker', link: '/docker/README' },
          { text: 'Git管理', link: '/git/README' },
          // 继续添加其他目录...
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
