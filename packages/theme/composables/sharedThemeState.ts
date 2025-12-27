import { ref } from 'vue'

// Shared state that all useTheme instances will reference
export const sharedThemeState = {
  cssColorVars: ref<string[]>([]),
  cssFontVars: ref<string[]>([]),
  enabled: ref(false),
  themeId: ref(0),
  loaded: ref(false), // Flag to indicate when theme CSS has been applied
}

