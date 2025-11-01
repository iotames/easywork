// .vitepress/plugins/readme-router.js
import { existsSync } from 'fs'
import { join } from 'path'

export default function ReadmeRouterPlugin() {
  return {
    name: 'readme-router',
    
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) {
          next()
          return
        }

        try {
          // 只处理路径部分，不涉及域名
          const urlPath = req.url.split('?')[0] // 移除查询参数
          
          // 处理根路径
          if (urlPath === '/') {
            if (existsSync(join(process.cwd(), 'README.md'))) {
              req.url = '/README.md' + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '')
            }
          }
          // 处理目录路径（以/结尾）
          else if (urlPath.endsWith('/') && urlPath !== '/') {
            const dirPath = urlPath.replace(/\/$/, '')
            const readmePath = join(process.cwd(), dirPath, 'README.md')
            
            if (existsSync(readmePath)) {
              const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''
              req.url = `${dirPath}/README.md${queryString}`
            }
          }
          // 处理直接访问目录名（没有斜杠）的情况 - 内部重定向
          else if (!urlPath.includes('.') && !urlPath.endsWith('/') && urlPath !== '/') {
            const potentialReadme = join(process.cwd(), urlPath, 'README.md')
            if (existsSync(potentialReadme)) {
              // 内部重写，不发送HTTP重定向
              const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''
              req.url = `${urlPath}/README.md${queryString}`
            }
          }
        } catch (error) {
          console.error('ReadmeRouterPlugin error:', error)
        }
        
        next()
      })
    }
  }
}