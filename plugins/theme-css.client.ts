export default defineNuxtPlugin(() => {
  // Only run on client side
  if (process.server) return
  
  const themeComposable = useTheme()
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

        }
      }
    })
  })
})