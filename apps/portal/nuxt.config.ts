import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))
const isRootDir = !(currentDir.endsWith('apps/home'))

export default defineNuxtConfig({
  extends: [
    '@crearis/theme-main',
    '@crearis/data-main',
  ],

  typescript: {
    typeCheck: false,
  },

  i18n: {
    // if you are using custom path, default
    vueI18n: isRootDir ? './node_modules/@crearis/theme-main/i18n.config.ts' : '../../node_modules/@crearis/theme-main/i18n.config.ts',
  },

  modules: ['@nuxt/test-utils', 'nuxt-module-eslint-config'],

  eslintConfig: {
    setup: false, // <---
  },

  nitro: {
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
  // #TODO _05 enable-full-nitro-prerender
  // #TODO _05 html-validation modules: ['nuxt-hydration', '@nuxtjs/html-validator'],
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
})
