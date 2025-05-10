import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2024-07-25',
  devtools: { enabled: false },
  modules: ['@crearis/ui/nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  crearisUI: { styles: true },
  tailwindcss: {
    viewer: true,
    cssPath: join(currentDir, './assets/css/tailwind.css'),
  },
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
    storageKey: 'color-mode',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
  },
  sourcemap: true,
  experimental: {
    asyncContext: true,
  },
})
