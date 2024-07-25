import { addComponentsDir, addImportsSources, createResolver, defineNuxtModule } from '@nuxt/kit'
import fs from 'node:fs'

export interface DaseiUINuxtOptions {
  /**
   * Determines whether to import DAS Ei UI styles.
   *
   * @default true
   */
  styles?: boolean
}

export default defineNuxtModule<DaseiUINuxtOptions>({
  meta: {
    name: 'Das Ei UI',
    configKey: 'daseiUI',
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
        from: '@dasei/ui',
        imports: fs.readdirSync(composables).map((file) => file.split('.')[0]),
        priority: -1,
      })
    }

    if (options.styles) {
      nuxt.options.css.push('@dasei/ui/styles')
    }
  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    daseiUI?: DaseiUINuxtOptions
  }

  interface NuxtOptions {
    daseiUI?: DaseiUINuxtOptions
  }
}
