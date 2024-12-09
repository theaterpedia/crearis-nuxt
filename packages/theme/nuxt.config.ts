import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2024-07-25',
  devtools: { enabled: false },
  modules: ['@crearis/ui/nuxt', '@nuxtjs/tailwindcss'],
  crearisUI: { styles: true },
  tailwindcss: {
    viewer: true,
    cssPath: join(currentDir, './assets/css/tailwind.css'),
  },
  sourcemap: true,
  experimental: {
    asyncContext: true,
  },
})
