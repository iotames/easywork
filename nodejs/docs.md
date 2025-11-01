## vuepress

- 官网 https://vuepress.vuejs.org/
- 快速上手：https://vuepress.vuejs.org/zh/guide/getting-started.html

### 安装项目依赖

```bash
# 初始化项目 pnpm init （可省略。最新版本的pnpm，执行pnpm add命令，若找不到package.json文件，会自动创建）
# 安装 vuepress 和 vue
pnpm add -D vuepress@next vue
# 安装打包工具和主题
pnpm add -D @vuepress/bundler-vite@next @vuepress/theme-default@next
# Preprocessor dependency "sass-embedded" not found. Did you install it? Try `pnpm add -D sass-embedded`.
pnpm add -D sass-embedded
```

### 配置文件

1. 项目在根目录。配置文件为：`.vuepress/config.js` 或 `.vuepress/config.ts`
2. 项目在 `docs` 子目录。配置文件为：`docs/.vuepress/config.js` 或 `docs/.vuepress/config.ts`

`config.js`:

```js
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme(),
  lang: 'zh-CN',
  title: '你好， VuePress ！',
  description: '这是我的第一个 VuePress 站点',  
})
```

`package.json`:
项目在根目录(如使用`npx`命令代替`npm run`可以不用添加`scripts`配置)：
```json
{
  "scripts": {
    "docs:dev": "vuepress dev",
    "docs:build": "vuepress build"
  }
}
```

项目在 `docs` 子目录(如使用`npx`命令代替`npm run`可以不用添加`scripts`配置)：
```json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

常见命令：

```bash
# 启动开发服务器
npm run docs:dev
# 或者直接使用原始命令
npx vuepress dev
# 如果Markdown文件在docs子目录下，则添加docs参数
npx vuepress dev docs

# 构建你的网站
pnpm docs:build
# 或者直接使用原始命令
npx vuepress build
# 如果Markdown文件在docs子目录下，则添加docs参数
npx vuepress build docs
```

示例 `.gitignore` 文件

```
# VuePress 默认临时文件目录
.vuepress/.temp
# VuePress 默认缓存目录
.vuepress/.cache
# VuePress 默认构建生成的静态文件目录
.vuepress/dist
```


## vitepress

- 官网 https://vitejs.cn/vitepress/

```bash
npm add -D vitepress
npx vitepress init
# 如果npm run docs:dev 命令报错，使用 npx 命令替代
# 官方文档的示例脚本命令是针对当VitePress站点位于docs子目录的情况。对于用户的情况，VitePress站点在根目录，所以脚本命令不应该包含docs。
npx vitepress dev
```

```bash
npm run docs:dev

> docs:dev
> vitepress dev

'vitepress' 不是内部或外部命令，也不是可运行的程序
或批处理文件。
```
