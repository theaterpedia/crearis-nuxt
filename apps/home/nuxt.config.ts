export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  content: { documentDriven: true },
  devtools: { enabled: true },
  extends: ['@crearis-nuxt/theme'],
  imports: { transform: { exclude: [/\/packages\/ui\//] } },
  modules: ['@nuxt/content', '@nuxt/image', 'nuxt-viewport'],
  routeRules: { '/': { prerender: true } },
  nitro: { plugins: ['plugins/content.ts'] },
})
