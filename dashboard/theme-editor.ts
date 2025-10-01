import { defineDashboardPage } from '#pruvious'

export default defineDashboardPage({
  path: 'theme-editor',
  vueComponent: './components/Dashboard/ThemeEditor.vue',
  icon: 'Palette',
  label: 'Theme Editor',
  capabilities: ['collection-settings-update'],
  priority: 5.5, // Place it after roles but before custom single-entry collections
})