import { sharedThemeState } from '~/packages/theme/composables/sharedThemeState'

export default defineNuxtPlugin(() => {
  // Only run on client side
  if (process.server) return
  
  const themeComposable = useTheme()
  const colorMode = useColorMode()
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
        // Theme is disabled - using default CSS from root
        // But still need to set --color-inverted for dark/light toggle
        const invertedValue = colorMode.value === 'dark' ? '1' : '0'
        
        useHead({
          htmlAttrs: {
            'data-theme': 'fallback',
            style: `--color-inverted: ${invertedValue};`,
          },
        })
        
        if (!hasInitiallyLoaded) {
          sharedThemeState.loaded.value = true
          hasInitiallyLoaded = true
          console.log('🎨 Theme Plugin: Using fallback theme, --color-inverted set to:', invertedValue)
        }
      }
    })
  })
})