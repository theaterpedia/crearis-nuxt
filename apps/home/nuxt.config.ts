export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  content: { documentDriven: true },
  devtools: { enabled: true },
  extends: ['@crearis/theme'],
  imports: { transform: { exclude: [/\/packages\/ui\//] } },
  modules: ['@nuxt/content', '@nuxt/image', 'nuxt-viewport'],
  routeRules: { '/': { prerender: true } },
  runtimeConfig: {
    public: {
      // Odoo GraphQL endpoint for checkout
      // Hardcoded fallback ensures checkout works even if env var not set at build time
      odooGraphqlUrl: process.env.NUXT_PUBLIC_ODOO_GRAPHQL_URL || 'https://service.dasei.eu/graphql/vsf',
    },
  },
  nitro: {
    plugins: ['plugins/content.ts'],
    prerender: {
      crawlLinks: true,
      routes: ['/blog', '/agenda'],
      ignore: ['/api', '/details', '/cart'],
    },
  },
})

