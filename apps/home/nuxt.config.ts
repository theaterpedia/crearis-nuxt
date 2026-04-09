export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  app: {
    head: {
      htmlAttrs: { lang: 'de' },
      meta: [
        { property: 'og:site_name', content: 'DAS Ei — Theaterpädagogisches Institut Bayern' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'de_DE' },
        { property: 'og:image', content: 'https://res.cloudinary.com/little-papillon/image/upload/c_crop,h_1750,w_2450/c_scale,h_630,w_1200/v1676759847/dasei/aus0_home1.jpg' },
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'canonical', href: 'https://dasei.eu' },
      ],
    },
  },
  content: {
    documentDriven: true,
    navigation: { fields: ['navtitle'] },
  },
  devtools: { enabled: true },
  extends: ['@crearis/theme'],
  imports: { transform: { exclude: [/\/packages\/ui\//] } },
  modules: ['@nuxt/content', '@nuxt/image', 'nuxt-viewport'],
  routeRules: { '/': { prerender: true } },
  runtimeConfig: {
    // Server-side only config
    // parseVerbose: undefined = auto (dev: true, prod: false)
    // parseVerbose: true = always verbose
    // parseVerbose: false = always quiet
    parseVerbose: false,
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

