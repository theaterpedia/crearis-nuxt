// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-11-11',
  extends: '../nuxt.config.ts',
  modules: ['@nuxt/image', 'nuxt-viewport'],
})
