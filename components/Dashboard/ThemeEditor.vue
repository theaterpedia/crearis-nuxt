<template>
  <PruviousBase>
    <div class="scrollbar-thin overflow-auto">
      <!-- Dashboard wrapper with theme styles -->
      <div :style="getCssVars(true)">
        <!-- Hero Header Section -->
        <Hero
          :imgTmp="imgUrl"
          :overlay="getoverlay('left-bottom', 0.5)"
          contentType="banner"
          contentWidth="short"
          heightTmp="small"
          imgTmpAlignX="cover"
          imgTmpAlignY="top"
          class="relative"
        >
          <banner transparent>
            <Heading :content="heroHeading" is="h2" :style="[{'font-family': theme.font}]" />
            <p v-html="theme.description" class="text-sm font-light" :style="[{'font-family': theme.font}]"></p>

            <div class="flex gap-3 mt-4">
              <CrearisButton 
                @click="handlePrimaryAction()" 
                size="medium" 
                variant="primary" 
                :style="[{'font-family': theme.font}, {'--color-inverted': theme.inverted ? '0' : '1'}]"
              >
                {{ primaryButtonConfig.label }}
              </CrearisButton>
              
              <CrearisButton 
                @click="handleSecondaryAction()" 
                size="medium" 
                variant="plain" 
                :style="[{'font-family': theme.font}, {'--color-inverted': theme.inverted ? '0' : '1'}]"
              >
                {{ secondaryButtonConfig.label }}
              </CrearisButton>
            </div>
            
            <!-- Mode Indicator -->
            <div class="mt-2 text-xs text-white/60 font-medium">
              Mode: {{ currentMode.charAt(0).toUpperCase() + currentMode.slice(1) }}
              
              <!-- Config Mode Auto-Update Controls -->
              <template v-if="currentMode === 'config'">
                <div class="flex items-center gap-2 mt-2">
                  <label class="flex items-center gap-1 text-xs">
                    <input 
                      v-model="autoUpdate" 
                      type="checkbox" 
                      class="w-3 h-3 rounded border border-white/30 bg-black/20"
                    />
                    <span class="text-white/80">auto</span>
                  </label>
                  
                  <!-- Manual Update Button - only show when auto is disabled -->
                  <CrearisButton 
                    v-if="!autoUpdate"
                    @click="manualUpdate()" 
                    size="small" 
                    variant="plain"
                    class="text-xs px-2 py-1 min-h-0 h-6"
                    :style="[{'font-family': theme.font}, {'--color-inverted': theme.inverted ? '0' : '1'}]"
                  >
                    Update
                  </CrearisButton>
                </div>
              </template>
            </div>
          </banner>
          
          <!-- Enhanced Color Display - Right Edge -->
          <div class="absolute top-4 right-0 flex flex-col gap-2">
            <template v-for="color in getThemeColors(theme)" :key="color.name">
              <div class="flex items-center gap-2 bg-black/30 backdrop-blur px-3 py-2 border border-white/10">
                <span class="text-xs font-medium text-white/80 capitalize min-w-[60px]">{{ color.displayName }}</span>
                <div class="relative">
                  <div 
                    class="w-5 h-5 border-2 border-white/30 shadow-sm" 
                    :style="{ backgroundColor: `oklch(${color.value.replace('.001', '')})` }"
                  ></div>
                  <!-- Pin Icon for pinned colors -->
                  <div 
                    v-if="color.isPinned" 
                    class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center border border-white/50 shadow-sm"
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
        </Hero>
        
        
        <!-- Themes Gallery - Only show in default and preview modes -->
        <SectionContainer v-if="showGallery" background="muted">
          <CardsGallery>
            <CardHero
              v-for="themeItem in themes"
              :imgTmp="themeItem.imgUrl"
              :key="themeItem.id"
              :overlay="getoverlay('left-bottom', 0.5)"
              contentAlignY="bottom"
              contentType="banner"
              contentWidth="short"
              heightTmp="mini"
              imgTmpAlignX="cover"
              imgTmpAlignY="top"
              class="shadow-lg relative"
              :style="[getThemeVars(themeItem.id)]"
              >
              <Heading :content="themeItem.heading" is="h3" class="p-4" :style="[{'font-family': themeItem.font}]" />
              
              <!-- Enhanced 5-Color Preview Dots - Right Edge -->
              <div class="absolute bottom-0 right-0 flex flex-col gap-1">
                <template v-for="color in getThemeColors(themeItem)" :key="color.name">
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

              <CrearisButton @click="handlePreviewClick(themeItem.id)" size="small" :style="[{'font-family': themeItem.font}, {'--color-inverted': themeItem.inverted ? '0' : '1'},{ 'isolation': 'isolate' }]">
                Vorschau
              </CrearisButton>
            </CardHero>
          </CardsGallery>
          <CrearisButton @click="manualUpdate()" size="medium" variant="primary" :style="[{'font-family': theme.font}, {'--color-inverted': theme.inverted ? '0' : '1'}]">
            Update Website
          </CrearisButton>
        </SectionContainer>

        
        <!-- Theme Configuration - Only show in config mode -->
        <SectionContainer v-if="showConfiguration" background="default">
          <!-- Status Messages -->
          <div v-if="statusMessage" class="mb-6">
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
          
          <TabsRoot default-value="colors" orientation="vertical">
            <TabsList aria-label="tabs example" class="gap-4">
              <TabsTrigger value="demo" class="trigger">Demo</TabsTrigger>
              <TabsTrigger value="colors" class="trigger">Colors</TabsTrigger>
              <TabsTrigger value="elements" class="trigger">Elemente</TabsTrigger>
              <TabsTrigger value="typography" class="trigger">Typographie</TabsTrigger>
              <TabsTrigger value="docs" class="trigger">Docs</TabsTrigger>
              <TabsTrigger value="export" class="trigger">Export</TabsTrigger>
            </TabsList>
            <TabsContent value="demo" class="p-4">
              <Heading content="**Demo**Components and Examples" is="h2" :style="[{'font-family': theme.font}]" />
              <div class="mt-4 space-y-4">
                <div class="flex gap-2">
                  <CrearisButton size="medium" variant="primary" :style="[{'font-family': theme.font}, {'--color-inverted': theme.inverted ? '0' : '1'}]">Primary Button</CrearisButton>
                  <CrearisButton size="medium" variant="plain" :style="[{'font-family': theme.font}, {'--color-inverted': theme.inverted ? '0' : '1'}]">Secondary Button</CrearisButton>
                </div>
                <p :style="[{'font-family': theme.font}]">This shows how the current theme affects UI components.</p>
              </div>
            </TabsContent>
            <TabsContent value="colors" class="p-4">
              <ColorPalette v-model:baseColors="baseColors" v-model:colormap="colormap" v-model:inverted="inverted" />
            </TabsContent>
            <TabsContent value="elements" class="p-4">
              <Heading content="**Elemente**Linien, Abstände, Ring etc." is="h2" :style="[{'font-family': theme.font}]" />
            </TabsContent>
            <TabsContent value="typography" class="p-4">
              <Heading content="**Typographie**Head-Font, Basis-Font, Fette, Range" is="h2" :style="[{'font-family': theme.font}]" />
              <div class="mt-4 space-y-2 text-sm">
                <p :style="[{'font-family': theme.font}]">• Head font selection and weight ranges</p>
                <p :style="[{'font-family': theme.font}]">• Base font selection and weight ranges</p>
              </div>
            </TabsContent>
            <TabsContent value="docs" class="p-4">
              <Heading content="**Dokmentation**" is="h2" :style="[{'font-family': theme.font}]" />
            </TabsContent>
            <TabsContent value="export" class="p-4">
              <ThemeExporter :tsVars="getTsVars()" :themeConfig="getConfigJson()" :themeId="theme.id" />
            </TabsContent>
          </TabsRoot>
        </SectionContainer>
      </div>
    </div>
  </PruviousBase>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Button as CrearisButton, CardHero, Hero, Banner } from '@crearis/ui'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import { useTheme } from '@crearis/theme/composables/useTheme'
import { getoverlay } from '@crearis/theme/utils/BackgroundHelpers'
import ColorPalette from '@crearis/theme/components/ColorPalette.vue'
import ThemeExporter from '@crearis/theme/components/ThemeExporter.vue'
import SectionContainer from '@crearis/theme/components/SectionContainer.vue'
import CardsGallery from '@crearis/theme/components/CardsGallery.vue'
import Heading from '@crearis/theme/components/Heading.vue'
import { getCollectionData } from '#pruvious/client'

// Import UI styles to ensure fonts are loaded
import '@crearis/ui/styles'

// Theme composable
const { baseColors, getCssVars, loadTheme, getThemeVars, getTsVars, getConfigJson, colormap, inverted, theme, themes, updateTheme } = useTheme()

const imgUrl = ref(
  'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
)

// Dashboard-specific state
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')
const isSaving = ref(false)
const activeTab = ref('colors')
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
      
      // Store original settings for comparison
      originalSettings.value = {
        theme: settingsRecord.theme,
        themeConfig: settingsRecord.themeConfig,
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
        themeConfig: null,
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
      themeConfig: null,
      baseColors: JSON.parse(JSON.stringify(baseColors)),
      colormap: JSON.parse(JSON.stringify(colormap.value)),
      inverted: inverted.value
    }
  }
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
    // Determine what has changed
    const currentConfig = {
      baseColors: baseColors,
      colormap: colormap.value,
      inverted: inverted.value
    }
    
    const hasChanges = originalSettings.value && (
      JSON.stringify(currentConfig.baseColors) !== JSON.stringify(originalSettings.value.baseColors) ||
      JSON.stringify(currentConfig.colormap) !== JSON.stringify(originalSettings.value.colormap) ||
      currentConfig.inverted !== originalSettings.value.inverted ||
      theme.value.id !== originalSettings.value.theme
    )
    
    if (hasChanges) {
      // Save only the changed settings
      const response = await $fetch('/api/settings', {
        method: 'PATCH',
        body: {
          themeId: theme.value.id,
          themeConfig: JSON.stringify(currentConfig)
        }
      }) as { success: boolean; record?: any }
      
      if (response.success) {
        // Update original settings
        originalSettings.value = {
          theme: theme.value.id,
          themeConfig: JSON.stringify(currentConfig),
          baseColors: JSON.parse(JSON.stringify(currentConfig.baseColors)),
          colormap: JSON.parse(JSON.stringify(currentConfig.colormap)),
          inverted: currentConfig.inverted
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
const handlePreviewClick = (themeId: number) => {
  loadTheme(themeId)
  if (themeId === defaultTheme.value) {
    currentMode.value = 'default'
  } else {
    currentMode.value = 'preview'
  }
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

// Initialize component
onMounted(() => {
  loadSettings()
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