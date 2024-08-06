export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  extends: ['@crearis-nuxt/theme'],
  imports: { transform: { exclude: [/\/packages\/ui\//] } },
  modules: ['@nuxt/content', '@nuxt/image'],
  routeRules: { '/': { prerender: true } },
})
