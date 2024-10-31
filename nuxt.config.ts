// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-30',
  devtools: { enabled: true },
  modules: ['@nuxtjs/google-fonts', 'nuxt-lazy-hydrate', '@nuxt/image', '@nuxtjs/tailwindcss', 'pruvious'],
  googleFonts: {
    families: {
      Lato: {
        wght: [400, 700],
        ital: [400, 700],
      },
      Poppins: [500],
    },
  },
  build: {
    transpile: ['tslib', '@apollo/client', '@apollo/client/core', '@crearis/odoo-sdk-api-client', 'vue-toastification'],
  },

  // sets the keys of the .env file that will be exposed to the client side
  runtimeConfig: {
    shouldByPassCacheQueryNames: ['LoadCartQuery', 'WishlistLoadQuery', 'GetAddressesQuery'],
    public: {
      odooBaseImageUrl: '',
      odooBaseUrl: '',
      currencySymbol: '',
      currencySeparator: '',
      currencyDecimal: '',
      currencyPrecision: '',
    },
  },
  // https://nuxt.com/docs/guide/going-further/experimental-features#asynccontext
  // fix for err: [nuxt] A composable that requires access to the Nuxt instance was called outside of a plugin, Nuxt hook, Nuxt middleware, or Vue setup function."
  experimental: {
    asyncContext: true,
  },
})
