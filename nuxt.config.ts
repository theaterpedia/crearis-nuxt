// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-10-30',
  extends: ['./packages/theme'],
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/google-fonts',
    'nuxt-lazy-hydrate',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    'nuxt-viewport',
    'pruvious',
  ],
  googleFonts: {
    families: {
      'Lato': {
        wght: [400, 700],
        ital: [400, 700],
      },
      'Poppins': [500],
      'Red Hat Display': [400, 500, 700],
    },
  },
  build: {
    transpile: [
      'tslib',
      '@apollo/client',
      '@nuxtjs/i18n',
      '@apollo/client/core',
      '@crearis/odoo-sdk-api-client',
      'vue-toastification',
    ],
  },

  // sets the keys of the .env file that will be exposed to the client side
  runtimeConfig: {
    shouldByPassCacheQueryNames: ['LoadCartQuery', 'WishlistLoadQuery', 'GetAddressesQuery'],
    public: {
      odooBaseImageUrl: '',
      odooBaseUrl: '',
      currencySymbol: '€ ',
      currencySeparator: '.',
      currencyDecimal: ',',
      currencyPrecision: '2',
    },
  },
  // https://nuxt.com/docs/guide/going-further/experimental-features#asynccontext
  // fix for err: [nuxt] A composable that requires access to the Nuxt instance was called outside of a plugin, Nuxt hook, Nuxt middleware, or Vue setup function."
  experimental: {
    asyncContext: true,
  },
  tailwindcss: {
    viewer: true,
    cssPath: '~/assets/css/tailwind.css',
  },
  pruvious: {
    api: {
      routes: {
        'login.post': false,
        'logout.post': false,
        'logout-all.post': false,
        'logout-others.post': false,
        'renew-token.post': false,
      },
    },
    dashboard: {
      baseComponents: {
        misc: {
          QuickActions: './components/DashboardSyncMicrosoftCollections.vue',
        },
      },
    },
    standardMiddleware: {
      client: {
        auth: false,
      },
      server: {
        auth: false,
      },
    },
  },
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.json',
      },
      {
        code: 'de',
        file: 'de.json',
      },
    ],
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'lang',
    defaultLocale: 'de',
  },
})
