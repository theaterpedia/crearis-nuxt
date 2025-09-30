<template>
  <div 
    class="min-h-screen page-container px-4"
  >
    <!-- Dashboard Header -->
    <div 
      class="shadow page-header" 
      :class="{ 'header-inverted': !pageIsLight }"
    >
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center gap-3">
            <span class="text-2xl" :title="`Mode: ${pageMode}`">{{ modeIcon }}</span>
            <h1 class="text-2xl font-bold page-title">Theme Configuration</h1>
          </div>
          
          <!-- Action Buttons in Header -->
          <div class="flex items-center space-x-3">
            <!-- Left group: Reset, Configure -->
            <div class="flex items-center space-x-2">
              <button 
                @click="resetToDefault"
                :disabled="isLoading"
                class="inline-flex items-center px-3 py-2 border shadow-sm text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors hover:opacity-80"
                :style="{
                  'border-color': 'var(--color-negative-bg)',
                  'color': 'var(--color-negative-contrast)', 
                  'background-color': 'var(--color-bg)'
                }"
              >
                <svg class="-ml-1 mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
                {{ isLoading ? 'Loading...' : 'Reset' }}
              </button>
              
              <button 
                v-if="showConfigureButton"
                @click="toggleConfigure"
                class="inline-flex items-center px-3 py-2 border shadow-sm text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors hover:opacity-80"
                :style="pageMode === 'patch' 
                  ? {
                      'border-color': 'var(--color-negative-bg)',
                      'color': 'var(--color-negative-contrast)', 
                      'background-color': 'var(--color-bg)'
                    }
                  : {
                      'border-color': 'var(--color-primary-bg)',
                      'color': 'var(--color-primary-contrast)', 
                      'background-color': 'var(--color-bg)'
                    }"
              >
                <svg class="-ml-1 mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path v-if="pageMode === 'patch'" fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  <path v-else fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
                {{ configureButtonText }}
              </button>
            </div>

            <!-- Separator -->
            <div class="h-6 w-px" :style="{ 'background-color': 'var(--color-border)' }"></div>

            <!-- Right group: Save button -->
            <button 
              @click="saveThemeSettings"
              :disabled="isSaving || !hasChanges"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              :style="{
                'background-color': 'var(--color-positive-bg)',
                'color': 'var(--color-positive-contrast)',
                'border-color': 'var(--color-positive-bg)'
              }"
            >
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>

            <!-- Back link -->
            <NuxtLink 
              to="/api/collections/settings" 
              class="text-sm hover:opacity-80 transition-opacity ml-4"
              :style="{ 'color': 'var(--color-contrast)' }"
            >
              ← Back to Settings
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Theme Card - visible in patch mode -->
    <div 
      v-if="pageMode === 'patch' && currentPreviewTheme" 
      class="fixed top-4 left-4 z-50 floating-theme-card"
    >
      <CardHero
        :key="`floating-${currentPreviewTheme.id}`"
        :imgTmp="currentPreviewTheme.imgUrl"
        :overlay="currentPreviewOverlay"
        contentAlignY="bottom"
        contentType="banner"
        contentWidth="short"
        heightTmp="mini"
        imgTmpAlignX="cover"
        imgTmpAlignY="top"
        class="shadow-2xl border-2 border-yellow-400"
        :style="[
          getThemeVars(currentPreviewTheme.id),
          {
            'background-color': currentPreviewTheme.id === 0 ? 'var(--color-bg, #1f2937)' : 'var(--color-bg, #ffffff)',
            'color': currentPreviewTheme.id === 0 ? 'var(--color-contrast, #f9fafb)' : 'var(--color-contrast, #111827)',
            '--color-inverted': currentPreviewTheme.id === 0 ? '1' : '0'
          }
        ]"
      >
          <div class="flex items-center justify-between mb-2">
            <Heading 
              :content="currentPreviewTheme.heading" 
              is="h3" 
              class="mb-2 text-sm font-bold"
              :class="`theme-heading-${currentPreviewTheme.id === 0 ? 'dark' : 'light'}`"
              :style="`
                font-family: ${currentPreviewTheme.headings} !important;
                color: ${currentPreviewTheme.id === 0 ? 'var(--color-contrast, #f9fafb)' : 'var(--color-contrast, #111827)'} !important;
              `" 
            />
            <span class="text-xs px-2 py-1 rounded-full bg-yellow-400 text-yellow-900 font-medium">
              Editing
            </span>
          </div>
          
          <!-- Theme Preview Colors -->
          <div class="flex gap-1 mb-2">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: `oklch(${currentPreviewTheme.baseColors.primary})` }"></div>
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: `oklch(${currentPreviewTheme.baseColors.secondary})` }"></div>
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: `oklch(${currentPreviewTheme.baseColors.positive})` }"></div>
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: `oklch(${currentPreviewTheme.baseColors.warning})` }"></div>
          </div>
      </CardHero>
    </div>

    <!-- Main Content -->
        <div 
          class="overflow-hidden shadow rounded-lg main-panel" 

        >            
            <!-- Header Section with Gallery Title and Status Display -->
            <div class="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 px-6">
              <div class="flex-1">
                <Heading is="h2" class="mb-4 page-heading" :content="currentPreviewTheme?.heading || 'Theme Gallery'" />
              </div>
              
              <!-- Status Display - positioned top-right -->
              <div class="flex-shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <!-- Current Theme Card -->
                <div 
                  class="p-3 rounded-lg border status-card status-card-compact" 
                  :class="{ 
                    'status-card-inverted': shouldInvertCard,
                    'status-card-muted': false
                  }"
                >
                  <h3 class="font-medium mb-1 status-label text-xs">Current</h3>
                  <p class="text-lg font-bold status-value">{{ currentSettings?.theme || 0 }}</p>
                </div>
                
                <!-- Preview Theme Card -->
                <div 
                  class="p-3 rounded-lg border status-card status-card-compact" 
                  :class="{ 
                    'status-card-inverted': shouldInvertCard,
                    'status-card-muted': isPreviewSameAsCurrent
                  }"

                >
                  <h3 class="font-medium mb-1 status-label text-xs">Preview</h3>
                  <p class="text-lg font-bold status-value" :class="{ 'preview-active': previewThemeId !== null }">
                    {{ previewThemeId !== null ? previewThemeId : 'None' }}
                  </p>
                  <button 
                    v-if="previewThemeId !== null"
                    @click="resetPreview"
                    class="text-xs mt-1 hover:underline reset-button"
                  >
                    Reset
                  </button>
                </div>
                
                <!-- Mode Card -->
                <div 
                  class="p-3 rounded-lg border status-card status-card-compact" 
                  :class="{ 
                    'status-card-inverted': shouldInvertCard,
                    'status-card-muted': isModeNotPatch
                  }"

                >
                  <h3 class="font-medium mb-1 status-label text-xs">Mode</h3>
                  <p class="text-lg font-bold status-value" :class="{
                    'mode-default': pageMode === 'default',
                    'mode-preview': pageMode === 'preview', 
                    'mode-patch': pageMode === 'patch'
                  }">
                    {{ pageMode.charAt(0).toUpperCase() + pageMode.slice(1) }}
                  </p>
                </div>
                
                <!-- Updated Card - only show when not in patch mode -->
                <div 
                  v-if="showUpdatedCard"
                  class="p-3 rounded-lg border status-card status-card-compact" 
                  :class="{ 
                    'status-card-inverted': shouldInvertCard,
                    'status-card-muted': isUpdatedNever
                  }"

                >
                  <h3 class="font-medium mb-1 status-label text-xs">Updated</h3>
                  <p class="text-xs opacity-75 status-text">{{ updatedDisplayText }}</p>
                </div>
              </div>
            </div>

            <!-- Theme Preview Gallery -->
            <div v-if="showGallery" class="m-8">
              <CardsGallery>
                <!-- Add a var --color-contrast to style and set it to black. If theme is inverted, set it to white -->
                <CardHero
                  v-for="themeOption in rThemes"
                  :key="themeOption.id"
                  :imgTmp="themeOption.imgUrl"
                  :overlay="getoverlay('left-top', 0.9)"
                  contentAlignY="bottom"
                  contentType="banner"
                  contentWidth="short"
                  heightTmp="mini"
                  imgTmpAlignX="cover"
                  imgTmpAlignY="top"
                  :class="{
                    'current-theme-card': currentSettings?.theme === themeOption.id,
                    'preview-theme-card': previewThemeId === themeOption.id,
                    'shadow-lg': true,
                    'p-2': true
                  }"
                  :style="[
                    getThemeVars(themeOption.id),
                    { '--color-contrast': (themeOption.inverted) ? 'oklch(95% 0.02 0)' : 'oklch(15% 0.02 0)' },
                    { 'color': (themeOption.inverted) ? 'oklch(95% 0.02 0)' : 'oklch(15% 0.02 0)' },
                    { 'font-family': `${themeOption.font} !important` },
                    { 'isolation': 'isolate' }, // Prevent theme variable inheritance from parent
                    // Add current theme frame
                    currentSettings?.theme === themeOption.id ? {
                      'border': '2px solid var(--color-primary-400, #60a5fa)',
                      'box-shadow': '0 0 0 1px var(--color-primary-200, #bfdbfe)'
                    } : {},
                    // Add preview theme frame with secondary color
                    previewThemeId === themeOption.id ? {
                      'border': `3px solid oklch(${themeOption.baseColors.secondary})`,
                      'box-shadow': `0 0 0 2px oklch(${themeOption.baseColors.secondary}), 0 8px 25px -5px rgba(0, 0, 0, 0.25)`,
                      'transform': 'scale(1.02)',
                      'z-index': '10'
                    } : {}
                  ]"
                >
                    <Heading 
                      :content="themeOption.heading" 
                      is="h3" 
                      class="mb-2" 
                    />
                    <p 
                      class="text-xs mb-3" 
                      v-html="themeOption.description"
                      :style="[
                        getThemeVars(themeOption.id),

                        { '--color-contrast': (themeOption.inverted) ? 'oklch(95% 0.02 0)' : 'oklch(15% 0.02 0)' }
                      ]"                      
                    ></p>
                    
                    <!-- Theme Preview Colors -->
                    <div class="flex gap-1 mb-3">
                      <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: `oklch(${themeOption.baseColors.primary})` }"></div>
                      <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: `oklch(${themeOption.baseColors.secondary})` }"></div>
                      <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: `oklch(${themeOption.baseColors.positive})` }"></div>
                      <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: `oklch(${themeOption.baseColors.warning})` }"></div>
                    </div>
                    
                    <Button 
                      @click="previewTheme(themeOption.id)" 
                      size="small" 
                      variant="primary" 
                      class="theme-button"
                      :style="`
                        font-family: ${themeOption.font} !important;
                        background-color: oklch(${themeOption.baseColors.primary}) !important;
                        border-color: oklch(${themeOption.baseColors.primary}) !important;
                        --color-primary: oklch(${themeOption.baseColors.primary}) !important;
                      `"
                    >
                      {{ themeOption.id === currentSettings?.theme ? 'Aktuell' : 'Vorschau' }}
                    </Button>
                </CardHero>
              </CardsGallery>
            </div>

            <!-- Theme Editor -->
            <div v-if="showThemeEditor" class="border-2 border-dashed rounded-lg py-6 px-2 sm:px-4 editor-panel">
              <h2 class="text-lg font-medium mb-4 page-heading">Visual Theme Editor</h2>
              <div v-if="isThemeReady">
              </div>
              <div v-else class="flex items-center justify-center py-12">
                <div class="text-center">
                  <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p class="text-sm loading-text mt-2">Loading theme editor...</p>
                </div>
              </div>
            </div>



            <!-- Status Messages -->
            <div v-if="statusMessage" class="mt-6">
              <div 
                :class="[
                  'rounded-md p-4',
                  statusType === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                ]"
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg v-if="statusType === 'success'" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p :class="statusType === 'success' ? 'text-green-800' : 'text-red-800'" class="text-sm font-medium">
                      {{ statusMessage }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

        </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import ThemeEditor from '@crearis/theme/components/ThemeEditor.vue'
import CardsGallery from '@crearis/theme/components/CardsGallery.vue'
import Heading from '@crearis/theme/components/Heading.vue'
import Button from '~/packages/ui/src/components/Button.vue'
import CardHero from '~/packages/ui/src/components/CardHero.vue'
import { useTheme } from '@crearis/theme/composables/useTheme'
import { getoverlay } from '@crearis/theme/utils/BackgroundHelpers'

// SEO
definePageMeta({
  title: 'Theme Configuration | Pruvious Dashboard',
  layout: false
})

// Theme composable
const { loadTheme, updateTheme, baseColors, colormap, inverted, themes, theme, getThemeVars } = useTheme()

// Watch for theme property changes and trigger updates
watch([baseColors, colormap, inverted], () => {
  console.log('Theme properties changed, triggering update')
  updateTheme()
}, { deep: true })

// Component state - initialize with safe defaults
const currentSettings = ref({ 
  theme: 0, 
  themeConfig: '' 
})

// Debug logging
console.log('🔧 currentSettings initialized:', currentSettings.value)
const newThemeId = ref<number>(0)
const newThemeConfig = ref<string>('')
const isLoading = ref(false)
const isSaving = ref(false)

// Page mode state: "default", "preview", "patch"
const pageMode = ref<'default' | 'preview' | 'patch'>('default')
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')
const lastUpdated = ref<string>('')
const isThemeReady = ref(false)
const themeKey = ref(0)
const previewThemeId = ref<number | null>(null)

// Track configured theme that has unsaved patches
const configuredThemeId = ref<number | null>(null)

// Template reference for ThemeEditor
const themeEditorRef = ref<InstanceType<typeof ThemeEditor> | null>(null)

// Theme property tracking
const currentBaseColors = ref<any>(null)
const currentColormap = ref<any>(null)
const currentInverted = ref<boolean>(false)

// Computed
const hasChanges = computed(() => {
  return newThemeId.value !== currentSettings.value.theme || 
         newThemeConfig.value !== currentSettings.value.themeConfig
})

// Compute the current page theme based on preview or current theme
const currentPageThemeId = computed(() => {
  return previewThemeId.value !== null ? previewThemeId.value : currentSettings.value.theme
})

// Compute whether the page should use inverted (dark) styling
const pageIsLight = computed(() => {
  const themeId = currentPageThemeId.value
  const currentTheme = themes.find(t => t.id === themeId)
  return !currentTheme?.inverted || true
})


// Compute rendered themes with their CSS variables
const rThemes = computed(() => {
  return themes.map(theme => ({
    ...theme,
    vars: getThemeVars(theme.id)
  }))
})

// Computed properties for conditional visibility
const showGallery = computed(() => pageMode.value !== 'patch')
const showThemeEditor = computed(() => pageMode.value === 'patch')
const showConfigureButton = computed(() => pageMode.value === 'preview' || pageMode.value === 'patch')

// Computed properties for mode display
const modeIcon = computed(() => {
  switch (pageMode.value) {
    case 'default': return '🏠'
    case 'preview': return '👁️'
    case 'patch': return '⚙️'
    default: return '🏠'
  }
})

const configureButtonText = computed(() => {
  return pageMode.value === 'patch' ? 'Cancel' : 'Configure'
})

// Computed property for the currently previewed theme
const currentPreviewTheme = computed(() => {
  if (previewThemeId.value !== null) {
    return rThemes.value.find(t => t.id === previewThemeId.value) || null
  }
  return null
})

// Temporary static value to debug rendering issue
const shouldInvertCard = ref(true)

// Computed properties for muted state logic
const isPreviewSameAsCurrent = computed(() => {
  return previewThemeId.value !== null && previewThemeId.value === currentSettings.value.theme
})

const isModeNotPatch = computed(() => {
  return pageMode.value !== 'patch'
})

const isUpdatedNever = computed(() => {
  // If we have a configured theme with unsaved patches, show it instead of "Never"
  if (configuredThemeId.value !== null) {
    return false
  }
  return !lastUpdated.value || lastUpdated.value === '' || lastUpdated.value.toLowerCase().includes('never')
})

// Computed for the updated display text
const updatedDisplayText = computed(() => {
  if (configuredThemeId.value !== null) {
    return `Theme ${configuredThemeId.value} (unsaved)`
  }
  return lastUpdated.value ? lastUpdated.value.split(' ')[0] : 'Never'
})

// Computed for whether to show the updated card
const showUpdatedCard = computed(() => {
  return pageMode.value !== 'patch'
})

// Computed for checking if there are unsaved patches
const hasUnsavedPatches = computed(() => {
  return configuredThemeId.value !== null
})

// Temporary simple function to test - no reactive dependencies
const getCardStyle = (isMuted: boolean) => {
  const baseStyle = {
    'background-color': 'var(--color-bg)',
    'border-color': 'var(--color-border)',
    'color': 'var(--color-contrast)'
  }
  
  if (isMuted) {
    return {
      ...baseStyle,
      'opacity': '0.5'
    }
  }
  
  return baseStyle
}

const currentPreviewOverlay = computed(() => {
  if (currentPreviewTheme.value) {
    return "linear-gradient(150deg, Oklch(" + currentPreviewTheme.value.baseColors.primary + ") 18%, rgba(255, 255, 255, 0.62) 61%, rgba(255, 255, 255, 0.84) 81%)"
  }
  return 'none'
})

// Note: Preview functionality is now handled by ThemeEditor component via themeId prop

// Keep the original loadCurrentSettings for backward compatibility (now uses resetToDefault)
const loadCurrentSettings = async () => {
  await resetToDefault()
}

// Handle theme changes from ThemeConfigurator
const handleThemeIdChange = (themeId: number) => {
  newThemeId.value = themeId
}

const handleThemeConfigChange = (config: string) => {
  newThemeConfig.value = config
}

// Handle theme property changes from ThemeEditor
const handleBaseColorsChange = (baseColors: any) => {
  currentBaseColors.value = baseColors
  console.log('Base colors updated:', baseColors)
}

const handleColormapChange = (colormap: any) => {
  currentColormap.value = colormap
  console.log('Colormap updated:', colormap)
}

const handleInvertedChange = (inverted: boolean) => {
  currentInverted.value = inverted
  console.log('Inverted updated:', inverted)
}

// Confirmation function for unsaved changes
const confirmUnsavedChanges = (actionName: string): boolean => {
  if (hasUnsavedPatches.value) {
    return confirm(`You have unsaved configuration changes for theme ${configuredThemeId.value}. ${actionName} will discard these changes. Continue?`)
  }
  return true
}

// Clear configured theme state
const clearConfiguredTheme = () => {
  configuredThemeId.value = null
  // Also reset ThemeEditor initialization so it will initialize properly next time
  if (themeEditorRef.value) {
    themeEditorRef.value.resetInitialization()
  }
}

// Preview theme function - only affects page content, not gallery cards
const previewTheme = (themeId: number) => {
  // Check for unsaved changes before changing preview
  if (!confirmUnsavedChanges('Changing preview theme')) {
    return
  }

  // Clear configured theme state when changing preview
  clearConfiguredTheme()
  
  // Set preview theme (affects page content only)
  previewThemeId.value = themeId
  // Update our local state for potential saving
  newThemeId.value = themeId
  // Switch to preview mode
  pageMode.value = 'preview'
  loadTheme(themeId) // Use loadTheme for page-level theming
  // Show feedback
  showStatus(`Previewing theme ${themeId}. Click "Configure" to edit or "Reset" to return.`, 'success')
}

// Reset preview to current saved theme
const resetPreview = () => {
  // Check for unsaved changes before resetting
  if (!confirmUnsavedChanges('Resetting preview')) {
    return
  }
  
  // Clear configured theme state when resetting
  clearConfiguredTheme()
  
  previewThemeId.value = null
  newThemeId.value = currentSettings.value.theme
  loadTheme(currentSettings.value.theme) // Reset page-level theme
  // Switch to default mode
  pageMode.value = 'default'
  showStatus('Preview reset to current saved theme', 'success')
}

// Toggle configure mode
const toggleConfigure = () => {
  if (pageMode.value === 'preview') {
    const wasNeverConfigured = configuredThemeId.value === null
    
    pageMode.value = 'patch'
    // Set the configured theme ID when entering patch mode
    configuredThemeId.value = previewThemeId.value || currentSettings.value.theme
    
    // If entering from "never" state, reset ThemeEditor initialization
    // This will cause it to initialize with the activeThemeId
    if (wasNeverConfigured && themeEditorRef.value) {
      themeEditorRef.value.resetInitialization()
      console.log('Entering patch mode from never configured state - ThemeEditor will initialize')
    } else {
      console.log('Re-entering patch mode for already configured theme - ThemeEditor will not re-initialize')
    }
    
    showStatus('Entering configuration mode', 'success')
  } else if (pageMode.value === 'patch') {
    // Check for unsaved changes before exiting patch mode
    if (!confirmUnsavedChanges('Exiting configuration mode')) {
      return
    }
    pageMode.value = 'preview'
    // Keep configuredThemeId to show unsaved state in Updated card
    showStatus('Exiting configuration mode', 'success')
  }
}

// Save theme settings
const saveThemeSettings = async () => {
  if (!hasChanges.value) return
  
  isSaving.value = true
  statusMessage.value = ''
  
  try {
    const response = await $fetch('/api/settings', {
      method: 'PATCH',
      body: {
        themeId: newThemeId.value,
        themeConfig: newThemeConfig.value
      }
    }) as any
    
    if (response.success) {
      currentSettings.value.theme = newThemeId.value
      currentSettings.value.themeConfig = newThemeConfig.value
      lastUpdated.value = new Date().toLocaleString()
      
      // Clear configured theme state when saving
      clearConfiguredTheme()
      
      showStatus('Theme configuration saved successfully!', 'success')
    } else {
      throw new Error('Save operation failed')
    }
  } catch (error) {
    console.error('Failed to save theme settings:', error)
    showStatus('Failed to save theme settings', 'error')
  } finally {
    isSaving.value = false
  }
}

// Reset to default theme with reload functionality
const resetToDefault = async () => {
  // Check for unsaved changes before resetting
  if (!confirmUnsavedChanges('Resetting to default theme')) {
    return
  }
  
  isLoading.value = true
  statusMessage.value = ''
  
  try {
    // Clear configured theme state when resetting
    clearConfiguredTheme()
    
    // First load current settings from API (reload functionality)
    const response = await $fetch('/api/collections/settings') as any
    if (response && response.record) {
      currentSettings.value = {
        theme: response.record.theme || 0,
        themeConfig: response.record.themeConfig || ''
      }
      lastUpdated.value = new Date().toLocaleString()
    }
    
    // Then reset to default theme
    newThemeId.value = 0
    newThemeConfig.value = ''
    
    // Re-initialize theme configurator
    isThemeReady.value = false
    await nextTick()
    
    // Give theme configurator time to reinitialize
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Force re-render with new key and mark as ready
    themeKey.value++
    await nextTick()
    isThemeReady.value = true
    
    showStatus('Settings reloaded and reset to default theme (remember to save)', 'success')
  } catch (error) {
    console.error('Failed to reset with reload:', error)
    showStatus('Failed to reload settings and reset theme', 'error')
  } finally {
    isLoading.value = false
  }
}

// Show status message
const showStatus = (message: string, type: 'success' | 'error') => {
  statusMessage.value = message
  statusType.value = type
  
  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
  }
}

// Initialize theme configurator properly
const initializeTheme = async () => {
  // Ensure we're on client side
  if (process.server) return
  
  // Wait for proper hydration
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Load current settings first
  await loadCurrentSettings()
  
  // Give theme configurator time to initialize
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Mark theme as ready
  isThemeReady.value = true
  
  // Force re-render with new key if needed
  themeKey.value++
}

// Watch for route changes to reinitialize
const route = useRoute()
watch(() => route.path, async (newPath) => {
  if (newPath === '/dashboard/theme-config') {
    isThemeReady.value = false
    await initializeTheme()
  }
}, { immediate: false })

// Initialize
onMounted(async () => {
  await initializeTheme()
})
</script>

<style scoped>
/* Floating theme card in patch mode */
.floating-theme-card {
  animation: slideInFromLeft 0.4s ease-out;
  backdrop-filter: blur(8px);
  border-radius: 0.5rem;
  width: 400px;
  max-width: 400px;
  transform: scale(0.8);
  transform-origin: top left;
}

.floating-theme-card:hover {
  transform: scale(0.85) !important;
  transform-origin: top left;
  transition: transform 0.2s ease-in-out;
}

/* Floating card animations */
@keyframes slideInFromLeft {
  from {
    transform: translateX(-100%) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(0.8);
    opacity: 1;
  }
}

/* Enhanced styling for floating card */
:deep(.floating-theme-card .card-hero) {
  border-radius: 0.5rem;
  overflow: hidden;
  width: 100% !important;
  max-width: 100% !important;
}

:deep(.floating-theme-card .p-3) {
  padding: 0.75rem !important;
}

/* Ensure the floating card container sizes properly */
:deep(.floating-theme-card) {
  display: block !important;
  width: 400px !important;
}

/* Theme card frame styling */
:deep(.current-theme-card) {
  border: 2px solid var(--color-primary-400, #60a5fa) !important;
  box-shadow: 0 0 0 1px var(--color-primary-200, #bfdbfe) !important;
  transition: all 0.3s ease-in-out;
}

:deep(.preview-theme-card) {
  transform: scale(1.02) !important;
  z-index: 10 !important;
  transition: all 0.3s ease-in-out;
  position: relative;
}

/* Ensure preview card stays on top */
:deep(.preview-theme-card:hover) {
  transform: scale(1.03) !important;
}

/* Hover effects for gallery cards */
:deep(.card-hero:hover) {
  transform: scale(1.01);
  transition: transform 0.2s ease-in-out;
}

:deep(.preview-theme-card:hover) {
  transform: scale(1.03) !important;
}

/* Page-level theme styling - responds to previewed theme */

.page-header {
  background-color: var(--color-bg, white);
  transition: all 0.3s ease-in-out;
}

.page-header.header-inverted {
  background-color: var(--color-bg, #1f2937);
}

.page-title {
  color: var(--color-contrast, #111827);
}

.page-inverted .page-title {
  color: var(--color-contrast, #f9fafb);
}

.page-link {
  color: var(--color-contrast-muted, #6b7280);
}

.page-inverted .page-link {
  color: var(--color-contrast-muted, #d1d5db);
}

.main-panel {
  background-color: var(--color-bg, white);
  transition: all 0.3s ease-in-out;
}

.main-panel.panel-inverted {
  background-color: var(--color-bg, #1f2937);
}

.gallery-section {
  transition: all 0.3s ease-in-out;
}

.gallery-section.gallery-inverted {
  background-color: var(--color-accent-bg, #374151);
  padding: 1rem;
  border-radius: 0.5rem;
}

.page-heading {
  color: var(--color-contrast, #111827);
}

.page-inverted .page-heading {
  color: var(--color-contrast, #f9fafb);
}

/* Status cards */
.status-card {
  background-color: var(--color-bg, white);
  border-color: var(--color-border, #e5e7eb);
  transition: all 0.3s ease-in-out;
}

.status-card.status-card-inverted {
  background-color: var(--color-accent-bg, #374151);
  border-color: var(--color-border, #4b5563);
}

.status-label {
  color: var(--color-contrast, #111827);
}

.status-card-inverted .status-label {
  color: var(--color-contrast, #f9fafb);
}

.status-value {
  color: var(--color-primary-600, #2563eb);
}

.status-card-inverted .status-value {
  color: var(--color-primary-400, #60a5fa);
}

.status-value.preview-active {
  color: var(--color-warning-600, #d97706);
}

.status-card-inverted .status-value.preview-active {
  color: var(--color-warning-400, #fbbf24);
}

.status-success {
  color: var(--color-positive-600, #059669);
}

.status-card-inverted .status-success {
  color: var(--color-positive-400, #34d399);
}

.status-text {
  color: var(--color-contrast, #111827);
}

.status-card-inverted .status-text {
  color: var(--color-contrast, #f9fafb);
}

.reset-button {
  color: var(--color-warning-600, #d97706);
}

.status-card-inverted .reset-button {
  color: var(--color-warning-400, #fbbf24);
}

/* Mode status styling */
.mode-default {
  color: var(--color-primary-600, #2563eb);
}

.status-card-inverted .mode-default {
  color: var(--color-primary-400, #60a5fa);
}

.mode-preview {
  color: var(--color-warning-600, #d97706);
}

.status-card-inverted .mode-preview {
  color: var(--color-warning-400, #fbbf24);
}

.mode-patch {
  color: var(--color-positive-600, #059669);
}

.status-card-inverted .mode-patch {
  color: var(--color-positive-400, #34d399);
}

/* Compact status cards */
.status-card-compact {
  min-width: 120px;
}

.status-card-compact .status-label {
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.status-card-compact .status-value {
  font-size: 1.125rem;
  line-height: 1.25;
}

/* Editor panel */
.editor-panel {
  border-color: var(--color-border, #e5e7eb);
  background-color: var(--color-bg, white);
  transition: all 0.3s ease-in-out;
}

.editor-panel.editor-panel-inverted {
  border-color: var(--color-border, #4b5563);
  background-color: var(--color-accent-bg, #374151);
}

.loading-text {
  color: var(--color-contrast-muted, #6b7280);
}

.page-inverted .loading-text {
  color: var(--color-contrast-muted, #d1d5db);
}


/* Current theme card - subtle frame with reduced contrast */
:deep(.current-theme-card) {
  border: 2px solid rgba(59, 130, 246, 0.3) !important;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2), 
              0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

:deep(.theme-inverted .p-4) {
  background-color: var(--color-accent-bg, #374151) !important;
  color: var(--color-accent-contrast, #f9fafb) !important;
  border-radius: 0.375rem;
}

:deep(.theme-inverted h3) {
  color: var(--color-contrast, #f9fafb) !important;
}


:deep(:not(.theme-inverted) .p-4) {
  background-color: var(--color-bg, #ffffff) !important;
  color: var(--color-contrast, #111827) !important;
}
/* Theme button styling - ensures each button uses its own theme colors */
:deep(.theme-button) {
  /* Prevent inheritance from page-level theme changes */
  all: unset !important;
  /* Restore button base styling */
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0.5rem 1rem !important;
  border-radius: 0.375rem !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  cursor: pointer !important;
  transition: all 0.2s ease-in-out !important;
  border: 1px solid !important;
  /* Isolate from any parent theme variables */
  isolation: isolate !important;
}

/* Dark theme buttons - maintain dark appearance regardless of page theme */
:deep(.theme-button-dark) {
  /* Force dark theme button styling */
  --color-inverted: 1 !important;
  background: var(--color-primary) !important;
  color: oklch(95% 0.02 0) !important; /* Light text for dark buttons */
}

/* Light theme buttons - maintain light appearance regardless of page theme */
:deep(.theme-button-light) {
  /* Force light theme button styling */
  --color-inverted: 0 !important;
  background: var(--color-primary) !important;
  color: oklch(15% 0.02 0) !important; /* Dark text for light buttons */
}

:deep(.theme-button:hover) {
  opacity: 0.9 !important;
  transform: translateY(-1px) !important;
}

/* Ensure button text contrast is maintained */
:deep(.theme-button-dark:hover) {
  color: oklch(95% 0.02 0) !important;
}

:deep(.theme-button-light:hover) {
  color: oklch(15% 0.02 0) !important;
}

/* Hover effects for gallery cards */
:deep(.card-hero:hover) {
  transform: scale(1.01);
  transition: transform 0.2s ease-in-out;
}

/* Preview cards will handle hover scaling through their dynamic styles */
</style>