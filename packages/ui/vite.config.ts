import libAssets from '@laynezh/vite-plugin-lib-assets'
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        styles: 'src/styles.ts',
        ...Object.fromEntries(
          fs.readdirSync('src/components').map((component) => [component, `src/components/${component}`]),
        ),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        assetFileNames: 'css/[name][extname]',
        chunkFileNames: 'chunks/[name].[hash].js',
        entryFileNames: ({ name }) => `${name.replace(/\.vue$/, '')}.js`,
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    libAssets({
      outputPath: 'fonts',
      name: '[name].[ext]',
    }),
    viteStaticCopy({
      targets: [
        { src: 'src/assets/css/*', dest: 'css' },
        { src: 'src/assets/fonts/*', dest: 'fonts' },
        { src: 'src/components/*', dest: 'components' },
        { src: 'src/composables/*', dest: 'composables' },
        { src: 'src/nuxt.ts', dest: '' },
      ],
    }),
    libInjectCss(),
    {
      name: 'clean-tsbuildinfo',
      buildEnd: () => {
        const file = 'node_modules/.tmp/tsconfig.build.tsbuildinfo'

        if (fs.existsSync(file)) {
          fs.rmSync(file)
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
