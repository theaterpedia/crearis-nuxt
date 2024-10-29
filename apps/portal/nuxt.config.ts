import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))
const isRootDir = !currentDir.endsWith('apps/portal')

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  extends: ['@crearis/theme', '@crearis/data'],
  imports: { transform: { exclude: [/\/packages\/ui\//] } },
  modules: [
    // '@nuxt/content',
    '@nuxt/image',
    'nuxt-lazy-hydrate',
    '@nuxtjs/i18n',
  ],
  routeRules: { '/': { prerender: false } },

  // TODO: Remove this workaround (may cause issues with vitest?)
  hooks: {
    close: () => {
      // @see https://github.com/nuxt/cli/issues/169#issuecomment-1729300497
      // Workaround for https://github.com/nuxt/cli/issues/169
      process.exit(0)
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      cssnano:
        process.env.NODE_ENV === 'production'
          ? { preset: ['default', { discardComments: { removeAll: true } }] }
          : false, // disable cssnano when not in production
    },
  },

  typescript: {
    typeCheck: false,
  },

  build: {
    transpile: ['vue-sonner'],
  },

  image: {
    dir: '../../node_modules/@crearis/theme/public',
    screens: {
      '4xl': 1920,
      '3xl': 1536,
      '2xl': 1366,
      'xl': 1280,
      'lg': 1024,
      'md': 768,
      'sm': 640,
      'xs': 376,
      '2xs': 360,
    },
    providers: {
      odooProvider: {
        name: 'odooProvider',
        provider: '@crearis/data/providers/odoo-provider.ts',
      },
    },
  },

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
    lazy: true,
    langDir: './lang',
    defaultLocale: 'de',
  },

  nitro: {
    plugins: ['plugins/content.ts'],
    prerender: {
      ignore: [
        '/product/',
        '/category',
        '/cart',
        '/checkout',
        '/search',
        '/my-account',
        '/order/success',
        '/order/failed',
        '/my-account/personal-data',
        '/my-account/billing-details',
        '/my-account/shipping-details',
        '/my-account/my-orders',
        '/my-account/returns',
        '/reset-password',
        '/reset-password-success',
        '/set-new-password',
        '/login',
        '/signup',
      ],
    },
  },
})
