import { sharedThemeState } from '~/packages/theme/composables/sharedThemeState'

export default defineNuxtPlugin(() => {
  // Only run on client side
  if (process.server) return
  
  const themeComposable = useTheme()
  let hasInitiallyLoaded = false
  
  // Use nextTick to wait for hydration to complete before setting up reactivity
  nextTick(() => {
    // Simple reactive CSS application
    watchEffect(() => {
      if (themeComposable.isEnabled()) {
        const cssString = themeComposable.getCurrentCssString()
        if (cssString) {
          
          useHead({
            htmlAttrs: {
              'data-theme': 'dynamic',
              style: cssString,
            },
          })
          
          // Mark theme as loaded only on the first successful CSS application
          if (!hasInitiallyLoaded) {
            nextTick(() => {
              sharedThemeState.loaded.value = true
              hasInitiallyLoaded = true
              console.log('🎨 Theme Plugin: Initial CSS applied, theme marked as loaded')
            })
          }

        }
      } else {
        // Reset loaded flag when theme is disabled
        sharedThemeState.loaded.value = false
        hasInitiallyLoaded = false
      }
    })
  })
})