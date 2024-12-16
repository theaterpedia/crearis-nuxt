import { addComponentsDir, addImportsSources, createResolver, defineNuxtModule } from '@nuxt/kit'
import fs from 'node:fs'

export interface CrearisUINuxtOptions {
  /**
   * Determines whether to import Crearis UI styles.
   *
   * @default true
   */
  styles?: boolean
}

export default defineNuxtModule<CrearisUINuxtOptions>({
  meta: {
    name: 'Crearis UI',
    configKey: 'crearisUI',
  },
  defaults: {
    styles: true,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const composables = resolve('./composables')

    addComponentsDir({
      path: resolve('./components'),
    })

    if (fs.existsSync(composables)) {
      addImportsSources({
        from: '@crearis/ui',
        imports: fs.readdirSync(composables).map((file) => file.split('.')[0]),
        priority: -1,
      })
    }

    if (options.styles) {
      nuxt.options.css.push('@crearis/ui/styles')
    }
  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    crearisUI?: CrearisUINuxtOptions
  }

  interface NuxtOptions {
    crearisUI?: CrearisUINuxtOptions
  }
}
