<template>
  <PruviousBase>
    <div class="scrollbar-thin overflow-auto">
      <!-- Two Column Layout -->
      <div class="flex min-h-screen w-full gap-6">
        <!-- Left Column - Hero Section -->
        <div class="flex flex-col flex-shrink min-w-0" :style="getCssVars(true)">
          <Hero
            :imgTmp="imgUrl"
            :overlay="getoverlay('left-bottom', 0.5)"
            contentType="banner"
            contentWidth="short"
            heightTmp="medium"
            imgTmpAlignX="cover"
            imgTmpAlignY="top"
            class="relative h-full"
            style="max-height: 30rem; max-width: 35rem"
          >
            <banner transparent>
              <Heading :content="heroHeading" is="h2" :style="[{'font-family': theme.font}]" />
              <p v-html="theme.description" class="text-sm font-light" :style="[{'font-family': theme.font}]"></p>

              <!-- Theme Color Demo Buttons -->
              <div class="flex gap-3 mt-4">
                <div 
                  class="px-4 py-2 rounded-md font-medium text-sm cursor-default"
                  :style="[
                    {'font-family': theme.font}, 
                    {'background-color': `oklch(${theme.baseColors.primary})`},
                    {'color': `oklch(${theme.baseColors.primary.replace(/[\d.]+%/, '15%')})`}
                  ]"
                >
                  Primary
                </div>
                
                <div 
                  class="px-4 py-2 rounded-md font-medium text-sm border cursor-default"
                  :style="[
                    {'font-family': theme.font}, 
                    {'border-color': `oklch(${theme.baseColors.secondary})`},
                    {'color': `oklch(${theme.baseColors.secondary})`},
                    {'background-color': 'transparent'}
                  ]"
                >
                  Secondary
                </div>
              </div>
            </banner>
          </Hero>
          
          <!-- Enhanced Color Display - Below Hero -->
          <div class="mt-4 flex flex-col gap-2">
            <template v-for="color in getThemeColors(theme)" :key="color.name">
              <div class="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-2 border border-gray-200 rounded-md shadow-sm">
                <span class="text-xs font-medium text-gray-700 capitalize min-w-[60px]" :style="[{'font-family': theme.font}]">{{ color.displayName }}</span>
                <div class="relative">
                  <div 
                    class="w-5 h-5 border-2 border-gray-300 shadow-sm rounded" 
                    :style="{ backgroundColor: `oklch(${color.value.replace('.001', '')})` }"
                  ></div>
                  <!-- Pin Icon for pinned colors -->
                  <div 
                    v-if="color.isPinned" 
                    class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center border border-gray-300 shadow-sm"
                    title="Pinned color (not affected by inversion)"
                  >
                    <svg class="w-2 h-2 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Right Column - Gallery and Configuration -->
        <div class="flex flex-col flex-1 h-screen min-w-[30rem]">
          <!-- Header Section -->
          <div class="p-6 border-b border-gray-200 bg-white">
            <!-- Main Title -->
            <h1 class="text-2xl font-bold text-gray-900 mb-2" :style="[{'font-family': theme.font}]">
              {{ showGallery ? 'Theme Gallery' : 'Theme Configuration' }}
            </h1>
            
            <!-- Theme Name -->
            <h2 class="text-lg font-medium text-gray-700 mb-3" :style="[{'font-family': theme.font}]">
              {{ theme.heading.replace(/\*\*/g, '') }}
            </h2>
            
            <!-- Description -->
            <div class="text-sm text-gray-600 mb-4 leading-relaxed" :style="[{'font-family': theme.font}]">
              <p v-if="showGallery" class="mb-1">
                Select and preview different themes for your website.
              </p>
              <p v-if="showGallery" class="mb-1">
                Choose a theme to customize or apply it directly to your site.
              </p>
              <p v-if="showConfiguration" class="mb-1">
                Customize colors, typography, and visual elements for the selected theme.
              </p>
              <p v-if="showConfiguration" class="mb-1">
                Changes are {{ autoUpdate ? 'automatically applied' : 'saved when you click Update' }} to the preview.
              </p>
              <div class="flex items-center justify-between mt-3">
                <p class="text-xs text-gray-500">
                  Current mode: {{ currentMode.charAt(0).toUpperCase() + currentMode.slice(1) }}
                </p>
                
                <!-- Config Mode Auto-Update Controls -->
                <div v-if="showConfiguration" class="flex items-center gap-3">
                  <label class="flex items-center gap-2 text-sm text-gray-600">
                    <input 
                      v-model="autoUpdate" 
                      type="checkbox" 
                      class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Auto-update preview</span>
                  </label>
                  
                  <!-- Manual Update Button - only show when auto is disabled -->
                  <CrearisButton 
                    v-if="!autoUpdate"
                    @click="manualUpdate()" 
                    size="small" 
                    variant="plain"
                    class="text-sm px-3 py-1 h-8"
                    :style="[{'font-family': theme.font}]"
                  >
                    Update Preview
                  </CrearisButton>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex gap-3">
              <CrearisButton 
                @click="handlePrimaryAction()" 
                size="medium" 
                variant="primary" 
                :style="[{'font-family': theme.font}]"
              >
                {{ primaryButtonConfig.label }}
              </CrearisButton>
              
              <CrearisButton 
                @click="handleSecondaryAction()" 
                size="medium" 
                variant="plain" 
                :style="[{'font-family': theme.font}]"
              >
                {{ secondaryButtonConfig.label }}
              </CrearisButton>
            </div>
          </div>

          <!-- Status Messages -->
          <div v-if="statusMessage" class="mx-4 mt-4">
            <div 
              :class="[
                'p-4 rounded-md text-sm border',
                statusType === 'success' 
                  ? 'bg-green-50 text-green-800 border-green-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              ]"
            >
              {{ statusMessage }}
            </div>
          </div>

          <!-- Theme Gallery - Only show in default and preview modes -->
          <div v-if="showGallery" class="flex-1 p-4">
            <!-- Loading state -->
            <div v-if="!isInitialized || !themesLoaded" class="flex items-center justify-center p-8">
              <div class="text-gray-500">Loading themes...</div>
            </div>
            
            <!-- Theme Gallery -->
            <CardsGallery v-else :key="`gallery-${galleryKey}`">
              <!-- make the style isolated -->
              <CardHero
                v-for="theme in availableThemes"
                :imgTmp="theme.imgUrl"
                :key="theme.id"
                :overlay="getoverlay('left-bottom', 0.5)"
                contentAlignY="bottom"
                contentType="banner"
                contentWidth="short"
                heightTmp="mini"
                imgTmpAlignX="cover"
                imgTmpAlignY="top"
                class="shadow-lg relative cursor-pointer"
                :style="[getThemeVars(theme.id)]"
                @click="handlePreviewClick(theme.id)"
                >
                <Heading :content="theme.heading" is="h3" class="p-4" :style="'font-family: ' + theme.font" />
                
                <!-- Enhanced 5-Color Preview Squares - Right Edge -->
                <div class="absolute bottom-0 right-0 flex flex-col gap-1">
                  <template v-for="color in getThemeColors(theme)" :key="color.name">
                    <div class="relative">
                      <div 
                        class="w-4 h-4 shadow-lg" 
                        :style="{ backgroundColor: `oklch(${color.value.replace('.001', '')})` }"
                      ></div>
                      <!-- Pin Icon for pinned colors -->
                      <div 
                        v-if="color.isPinned" 
                        class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center border border-white/70 shadow-md"
                        title="Pinned color"
                      >
                        <svg class="w-1.5 h-1.5 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </template>
                </div>
              </CardHero>
            </CardsGallery>
            
            <div class="mt-4">
              <CrearisButton 
                @click="updateTheme()" 
                size="medium" 
                variant="primary" 
                :style="[
                  {'font-family': theme.font}, 
                  {'--color-inverted': theme.inverted ? '0' : '1'}
                ]"
              >
                Update Website
              </CrearisButton>
            </div>
          </div>

          <!-- Theme Configuration - Only show in config mode -->
          <div v-if="showConfiguration" class="flex-1 p-4 overflow-hidden">
            <!-- Native Pruvious Dashboard Tabs -->
            <div class="h-full flex flex-col">
              <!-- Tab Navigation -->
              <div class="relative flex items-end px-4 pt-4 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gray-200">
                <span v-for="(tab, i) of configTabs" :key="tab.id" class="relative flex overflow-hidden pb-px">
                  <button
                    :title="tab.label"
                    @click="activeConfigTab = tab.id"
                    type="button"
                    class="flex h-9 items-center gap-2 overflow-hidden border-r border-t px-3 text-sm transition"
                    :class="{
                      'cursor-default bg-white border-gray-200 text-gray-900': activeConfigTab === tab.id,
                      'text-gray-400 hocus:text-primary-700 bg-gray-50 border-gray-300': activeConfigTab !== tab.id,
                      'rounded-tl-md border-l': i === 0,
                      'rounded-tr-md': i === configTabs.length - 1,
                    }"
                  >
                    <span class="truncate">{{ tab.label }}</span>
                  </button>

                  <span
                    v-if="activeConfigTab === tab.id"
                    class="absolute bottom-0 right-px h-px bg-white"
                    :class="{
                      'left-px': i === 0,
                      'left-0': i > 0,
                    }"
                  ></span>
                </span>
              </div>

              <!-- Tab Content -->
              <div class="flex-1 bg-white border border-gray-200 border-t-0 p-4 overflow-auto">
                <!-- Demo Tab -->
                <div v-if="activeConfigTab === 'demo'">
                  <Heading content="**Demo** Components and Examples" is="h2" :style="[{'font-family': theme.font}]" />
                  <div class="mt-4 space-y-4">
                    <div class="flex gap-2">
                      <CrearisButton size="medium" variant="primary" :style="[{'font-family': theme.font}, {'--color-inverted': theme.inverted ? '0' : '1'}]">Primary Button</CrearisButton>
                      <CrearisButton size="medium" variant="plain" :style="[{'font-family': theme.font}, {'--color-inverted': theme.inverted ? '0' : '1'}]">Secondary Button</CrearisButton>
                    </div>
                    <p :style="[{'font-family': theme.font}]">This shows how the current theme affects UI components.</p>
                  </div>
                </div>

                <!-- Colors Tab -->
                <div v-if="activeConfigTab === 'colors'">
                  <ColorPalette v-model:baseColors="baseColors" v-model:colormap="colormap" v-model:inverted="inverted" />
                </div>

                <!-- Elements Tab -->
                <div v-if="activeConfigTab === 'elements'">
                  <Heading content="**Elemente** Linien, Abstände, Ring etc." is="h2" :style="[{'font-family': theme.font}]" />
                </div>

                <!-- Typography Tab -->
                <div v-if="activeConfigTab === 'typography'">
                  <Heading content="**Typographie** Head-Font, Basis-Font, Fette, Range" is="h2" :style="[{'font-family': theme.font}]" />
                  <div class="mt-4 space-y-2 text-sm">
                    <p :style="[{'font-family': theme.font}]">• Head font selection and weight ranges</p>
                    <p :style="[{'font-family': theme.font}]">• Base font selection and weight ranges</p>
                  </div>
                </div>

                <!-- Export Tab -->
                <div v-if="activeConfigTab === 'export'">
                  <ThemeExporter :tsVars="getTsVars()" :themeConfig="getConfigJson()" :themeId="theme.id" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PruviousBase>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeMount, onUpdated } from 'vue'
import { dashboardMiscComponent, selectFieldComponent } from '#pruvious/dashboard'
import { useTheme } from '@crearis/theme/composables/useTheme'
import { getoverlay } from '@crearis/theme/utils/BackgroundHelpers'
import ColorPalette from '@crearis/theme/components/ColorPalette.vue'
import ThemeExporter from '@crearis/theme/components/ThemeExporter.vue'
import Heading from '@crearis/theme/components/Heading.vue'
import CardsGallery from '@crearis/theme/components/CardsGallery.vue'

// Import UI components directly from packages
import CrearisButton from '~/packages/ui/src/components/Button.vue'
import Hero from '~/packages/ui/src/components/Hero.vue'
import Banner from '~/packages/ui/src/components/Banner.vue'
import CardHero from '~/packages/ui/src/components/CardHero.vue'
import { getCollectionData } from '#pruvious/client'

// Import UI styles to ensure fonts are loaded
import '@crearis/ui/styles'

// Pruvious Dashboard Components
const PruviousBase = dashboardMiscComponent.Base()
const ThemeSelectField = selectFieldComponent()

// Theme composable
const { baseColors, getCssVars, loadTheme, getThemeVars, getTsVars, getConfigJson, colormap, inverted, theme, themes, updateTheme } = useTheme()

const imgUrl = ref(
  'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
)

// Dashboard-specific state for theme management
const selectedThemeId = ref<string | null>(theme.value.id.toString())
const isInitialized = ref(false)
const galleryKey = ref(0) // Force re-render key for gallery

// Sync selectedThemeId with current theme
watch(() => theme.value.id, (newId) => {
  selectedThemeId.value = newId.toString()
})

// Theme selection handler
const handleThemeSelection = (themeId: string | null) => {
  if (themeId) {
    const numericId = parseInt(themeId)
    if (!isNaN(numericId)) {
      handlePreviewClick(numericId)
    }
  }
}

// Dashboard-specific state
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')
const isSaving = ref(false)
const activeTab = ref('colors')
const activeConfigTab = ref('colors')
const originalSettings = ref<any>(null)

// Config tabs
const configTabs = [
  { id: 'colors', label: 'Colors' },
  { id: 'demo', label: 'Demo' },
  { id: 'elements', label: 'Elements' },
  { id: 'typography', label: 'Typography' },
  { id: 'export', label: 'Export' },
]

// Helper function to check if a color is pinned
const isColorPinned = (colorValue: string) => {
  return colorValue.endsWith('.001')
}

// Define the color order for display
const colorOrder = ['primary', 'secondary', 'warning', 'positive', 'negative'] as const

// Get theme colors in order with pinned status
const getThemeColors = (themeData: any) => {
  return colorOrder.map(colorKey => ({
    name: colorKey,
    value: themeData.baseColors[colorKey],
    isPinned: isColorPinned(themeData.baseColors[colorKey]),
    displayName: colorKey.charAt(0).toUpperCase() + colorKey.slice(1)
  }))
}

// Mode state management
type ThemeMode = 'default' | 'preview' | 'config'
const currentMode = ref<ThemeMode>('default')
const defaultTheme = ref(0)
const autoUpdate = ref(true)

// Load settings from Pruvious collection
const loadSettings = async () => {
  try {
    const settings = await getCollectionData('settings')
    if (settings && Array.isArray(settings) && settings.length > 0) {
      const settingsRecord = settings[0] // Get first settings record
      defaultTheme.value = settingsRecord.theme || 0
      loadTheme(defaultTheme.value)
      
      // Parse theme config if exists
      if (settingsRecord.themeConfig) {
        try {
          const themeConfig = JSON.parse(settingsRecord.themeConfig)
          // Apply theme config to current theme
          if (themeConfig.baseColors) {
            Object.assign(baseColors, themeConfig.baseColors)
          }
          if (themeConfig.colormap) {
            Object.assign(colormap.value, themeConfig.colormap)
          }
          if (typeof themeConfig.inverted === 'boolean') {
            inverted.value = themeConfig.inverted
          }
        } catch (e) {
          console.warn('Failed to parse theme config:', e)
        }
      }
      
      // Store original settings for comparison using the same format as save/export
      originalSettings.value = {
        theme: settingsRecord.theme,
        themeConfig: settingsRecord.themeConfig || getConfigJson(),
        baseColors: JSON.parse(JSON.stringify(baseColors)),
        colormap: JSON.parse(JSON.stringify(colormap.value)),
        inverted: inverted.value
      }
    } else {
      // No settings found, initialize with defaults
      console.log('No settings found, using defaults')
      defaultTheme.value = 0
      loadTheme(defaultTheme.value)
      originalSettings.value = {
        theme: 0,
        themeConfig: getConfigJson(),
        baseColors: JSON.parse(JSON.stringify(baseColors)),
        colormap: JSON.parse(JSON.stringify(colormap.value)),
        inverted: inverted.value
      }
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
    // Don't show error immediately, just use defaults
    console.log('Using default settings due to error')
    defaultTheme.value = 0
    loadTheme(defaultTheme.value)
    originalSettings.value = {
      theme: 0,
      themeConfig: getConfigJson(),
      baseColors: JSON.parse(JSON.stringify(baseColors)),
      colormap: JSON.parse(JSON.stringify(colormap.value)),
      inverted: inverted.value
    }
  }
  
  // Mark as initialized and force gallery refresh
  await nextTick()
  isInitialized.value = true
  galleryKey.value++
}

// Force gallery refresh when themes change
const forceGalleryRefresh = async () => {
  await nextTick()
  galleryKey.value++
}

// Button configurations
const primaryButtonConfig = computed(() => {
  switch (currentMode.value) {
    case 'default':
      return { label: 'Reset', action: 'reset' }
    case 'preview':
      return { label: 'Save', action: 'save' }
    case 'config':
      return { label: 'Save', action: 'save' }
  }
})

const secondaryButtonConfig = computed(() => {
  switch (currentMode.value) {
    case 'default':
      return { label: 'Edit', action: 'edit' }
    case 'preview':
      return { label: 'Edit', action: 'edit' }
    case 'config':
      return { label: 'Cancel', action: 'cancel' }
  }
})

// Abstract event handlers
const handlePrimaryAction = () => {
  const action = primaryButtonConfig.value.action
  switch (action) {
    case 'reset':
      performReset()
      break
    case 'save':
      performSave()
      break
  }
}

const handleSecondaryAction = () => {
  const action = secondaryButtonConfig.value.action
  switch (action) {
    case 'edit':
      performEdit()
      break
    case 'cancel':
      performCancel()
      break
  }
}

// Action functions
const performReset = async () => {
  if (originalSettings.value) {
    Object.assign(baseColors, originalSettings.value.baseColors)
    Object.assign(colormap, originalSettings.value.colormap)
    inverted.value = originalSettings.value.inverted
    loadTheme(originalSettings.value.theme)
    showStatus('Theme reset to original settings', 'success')
  }
}

const performEdit = () => {
  if (currentMode.value === 'preview') {
    currentMode.value = 'config'
  }
}

const performCancel = () => {
  if (confirm('Änderungen verwerfen?')) {
    // Reset to original or current saved state
    if (originalSettings.value) {
      Object.assign(baseColors, originalSettings.value.baseColors)
      Object.assign(colormap, originalSettings.value.colormap)
      inverted.value = originalSettings.value.inverted
    }
    
    // Return to appropriate mode
    if (theme.value.id === defaultTheme.value) {
      currentMode.value = 'default'
    } else {
      currentMode.value = 'preview'
    }
  }
}

const performSave = async () => {
  isSaving.value = true
  statusMessage.value = ''
  
  try {
    // Use getConfigJson() to get the correct config data (same as export tab)
    const currentConfig = getConfigJson()
    console.log('Current config from getConfigJson():', currentConfig)
    console.log('Original config:', originalSettings.value?.themeConfig)
    
    // Normalize both configs by parsing and re-stringifying to handle whitespace differences
    const normalizeConfig = (config: string) => {
      try {
        if (!config || config === '{}') return '{}'
        return JSON.stringify(JSON.parse(config), null, 2)
      } catch {
        return config || '{}'
      }
    }
    
    const normalizedCurrent = normalizeConfig(currentConfig)
    const normalizedOriginal = normalizeConfig(originalSettings.value?.themeConfig || '{}')
    
    const hasChanges = originalSettings.value && (
      normalizedCurrent !== normalizedOriginal ||
      theme.value.id !== originalSettings.value.theme
    )
    
    console.log('Has changes:', hasChanges)
    console.log('Normalized current:', normalizedCurrent)
    console.log('Normalized original:', normalizedOriginal)
    
    if (hasChanges) {
      console.log('Saving theme config:', {
        themeId: theme.value.id,
        config: currentConfig
      })
      
      // Save using the same format as export
      const response = await $fetch('/api/settings', {
        method: 'PATCH',
        body: {
          themeId: theme.value.id,
          themeConfig: currentConfig
        }
      }) as { success: boolean; record?: any }
      
      if (response.success) {
        // Update original settings with the actual saved data
        originalSettings.value = {
          theme: theme.value.id,
          themeConfig: currentConfig,
          baseColors: JSON.parse(JSON.stringify(baseColors)),
          colormap: JSON.parse(JSON.stringify(colormap.value)),
          inverted: inverted.value
        }
        
        showStatus('Theme settings saved successfully!', 'success')
        
        // Return to appropriate mode
        if (theme.value.id === defaultTheme.value) {
          currentMode.value = 'default'
        } else {
          currentMode.value = 'preview'
        }
      } else {
        throw new Error('Save operation failed')
      }
    } else {
      showStatus('No changes to save', 'success')
    }
  } catch (error) {
    console.error('Failed to save theme settings:', error)
    showStatus('Failed to save theme settings', 'error')
  } finally {
    isSaving.value = false
  }
}

// Handle preview card clicks
const handlePreviewClick = async (themeId: number) => {
  loadTheme(themeId)
  if (themeId === defaultTheme.value) {
    currentMode.value = 'default'
  } else {
    currentMode.value = 'preview'
  }
  // Ensure gallery stays reactive after theme change
  await nextTick()
  await forceGalleryRefresh()
}

// Computed hero heading with AKTIV prefix for default mode
const heroHeading = computed(() => {
  if (currentMode.value === 'default') {
    return `ACTIVE: ${theme.value.heading}`
  }
  return theme.value.heading
})

// Visibility computed properties
const showGallery = computed(() => {
  return currentMode.value === 'default' || currentMode.value === 'preview'
})

const showConfiguration = computed(() => {
  return currentMode.value === 'config'
})

// Reactive themes getter to ensure proper reactivity
const availableThemes = computed(() => {
  return themes || []
})

// Check if themes are loaded
const themesLoaded = computed(() => {
  return availableThemes.value.length > 0
})

// Auto-update watcher for config changes
watch(
  [baseColors, colormap, inverted],
  () => {
    if (autoUpdate.value && currentMode.value === 'config') {
      // Trigger theme update to reflect changes immediately
      updateTheme()
    }
  },
  { deep: true }
)

// Manual update function for when auto is disabled
const manualUpdate = () => {
  // Trigger theme update manually
  updateTheme()
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

// Watch for themes changes to refresh gallery
watch(() => themes, async (newThemes, oldThemes) => {
  if (isInitialized.value && newThemes && newThemes.length > 0) {
    console.log('Themes updated, refreshing gallery...', newThemes.length)
    await forceGalleryRefresh()
  }
}, { deep: true, immediate: false })

// Watch for themes array length changes specifically
watch(() => themes?.length, async (newLength) => {
  if (isInitialized.value && newLength && newLength > 0) {
    console.log('Themes length changed:', newLength)
    await forceGalleryRefresh()
  }
})

// Watch for theme.value changes
watch(() => theme.value, async () => {
  if (isInitialized.value) {
    selectedThemeId.value = theme.value.id.toString()
    await forceGalleryRefresh()
  }
}, { deep: true })

// Initialize component with proper timing
onBeforeMount(async () => {
  // Ensure themes are loaded before mounting
  await nextTick()
})

onMounted(async () => {
  console.log('ThemeEditor mounted, loading settings...')
  await loadSettings()
  
  // Additional safety measures for programmatic navigation
  setTimeout(async () => {
    if (themes && themes.length > 0) {
      console.log('Delayed gallery refresh with', themes.length, 'themes')
      await forceGalleryRefresh()
    }
  }, 100)
  
  // Extra fallback for slow loading
  setTimeout(async () => {
    if (themes && themes.length > 0 && !isInitialized.value) {
      console.log('Fallback initialization')
      isInitialized.value = true
      await forceGalleryRefresh()
    }
  }, 500)
})

onUpdated(async () => {
  // Ensure gallery is refreshed after any updates
  if (isInitialized.value && themes.length > 0) {
    await nextTick()
  }
})
</script>

<style>
/* Import external fonts */
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

/* Force theme fonts in dashboard environment with !important */
* {
  font-family: var(--font, 'MonaspaceNeon', sans-serif) !important;
}

/* Specific overrides for common elements */
.pruvious-ui-button,
button {
  font-family: var(--font, 'MonaspaceNeon', sans-serif) !important;
}

h1,
h2, 
h3,
h4,
h5,
h6 {
  font-family: var(--headings, var(--font), 'MonaspaceNeon', sans-serif) !important;
}

/* Banner and heading specific overrides */
banner,
banner * {
  font-family: var(--font, 'MonaspaceNeon', sans-serif) !important;
}

/* Override any Pruvious dashboard styles */
.dashboard-content,
.dashboard-content *,
.pruvious-dashboard *,
.pruvious-dashboard {
  font-family: inherit !important;
}
</style>

<style scoped>
.trigger {
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
}
.trigger[data-state='active'] {
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
}
</style>