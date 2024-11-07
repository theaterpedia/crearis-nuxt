import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2024-07-25',
  devtools: { enabled: false },
  tailwindcss: {
    viewer: false,
    cssPath: join(currentDir, './assets/css/index.css'),
  },
})