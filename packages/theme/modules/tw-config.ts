import { defineNuxtModule, addTemplate } from '@nuxt/kit'

export default defineNuxtModule({
  setup(options, nuxt) {
    nuxt.hook('tailwindcss:config', function (tailwindConfig) {
      tailwindConfig.theme.colors.blue = '#fff'
    })
  },
})
