import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { colorVars } from './theme'

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
    fallback: colorVars['inverted'] === '1' ? 'dark' : 'light',
    preference: colorVars['inverted'] === '1' ? 'dark' : 'light',
    // Disable persistence so theme system controls dark/light mode
    storageKey: false, // Disables localStorage persistence
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
  },
  sourcemap: true,
  experimental: {
    asyncContext: true,
  },
})
