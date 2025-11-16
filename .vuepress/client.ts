// @vuepress/plugin-catalog Needs client.ts
import { defineClientConfig } from 'vuepress/client'
import { defineCatalogInfoGetter } from '@vuepress/plugin-catalog/client'

export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    defineCatalogInfoGetter((meta) => (typeof meta.title === 'string' ? { title: meta.title } : null))
  },
})
