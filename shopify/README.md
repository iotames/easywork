---
title: Shopify
---

## 介绍

`Shopify` 是全球领先的统一商务操作系统，为各种规模的商家提供从开店、营销、支付到物流的一站式基础设施。

以核心 `巨石系统`（集中处理商品、订单、支付等关键事务）为主体，外围搭配可插拔的微服务（如搜索、图片处理）和第三方App生态，底层依靠云原生基础设施（Kubernetes、MySQL分片、Redis缓存、CDN加速）来支撑全球高并发流量的混合架构。


## 开发

```bash
npm install -g @shopify/cli @shopify/theme

shopify auth login

# da3523-61 是shopify的店铺名，如下所示：
# https://admin.shopify.com/store/da3523-61/themes
# https://admin.shopify.com/store/da3523-61/themes/165803753745
shopify theme pull --store=da3523-61.myshopify.com

# 执行本地调试。
# 执行命令后，按 t键。开启本地链接：http://127.0.0.1:9292
# shopify theme dev --store da3523-61.myshopify.com
shopify theme dev

# 对代码进行静态分析
shopify theme check

# 将本地文件推送到一个 未发布 的主题，用于最终预览
# 推送为未发布主题，安全地进行最终验证
# shopify theme push --unpublished --theme="My Theme Backup"
# 在 Shopify 后台的 “在线商店 > 模板” 中，找到你刚才推送的主题，手动点击“发布 (Publish)”按钮将其设为线上正式主题。你也可以使用命令行直接发布，但手动操作更可控。
shopify theme push

# 指定的主题设为店铺的 线上主站 (Live) 主题。
shopify theme publish

# Git提交代码
# git add .
# git commit -m "feat: 添加xxx自定义页面"
# git push origin main
```

- 环境管理 (Environments)：为了在不同店铺（如 dev, staging, production）之间切换，可以配置环境变量文件，使用 shopify theme dev --environment=staging 等命令指定环境。

- CI/CD 集成：可将上述 CLI 命令集成到你的 CI/CD 工作流（如 GitHub Actions）中。例如，当代码被推送到 main 分支时，自动触发 shopify theme push 进行部署，实现更专业的自动化发布流程。

