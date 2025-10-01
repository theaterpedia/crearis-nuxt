<script lang="ts" setup>
import { ref, resolveComponent, computed, watch } from 'vue'
import { Button, CardHero } from '@crearis/ui'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
import { useTheme } from '../composables/useTheme'
import { getoverlay } from '@crearis/theme/utils/BackgroundHelpers'

import ColorPalette from '@crearis/theme/components/ColorPalette.vue'

definePageMeta({
  layout: false,
})

const { baseColors, getCssVars, loadTheme, getThemeVars, getTsVars, getConfigJson, colormap, inverted, theme, themes, updateTheme  } = useTheme()
const imgUrl = ref(
  'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
)

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
const performReset = () => {
  // Reset theme to default state
  console.log('Resetting theme...')
  // Add reset logic here
}

const performEdit = () => {
  // Switch to config mode for editing (only from preview mode)
  if (currentMode.value === 'preview') {
    console.log('Switching to config mode...')
    currentMode.value = 'config'
  }
}

const performCancel = () => {
  // Cancel changes with confirmation and return to previous mode
  if (confirm('Änderungen verwerfen?')) {
    console.log('Canceling changes...')
    // Return to preview or default mode based on current theme
    if (theme.value.id === defaultTheme.value) {
      currentMode.value = 'default'
    } else {
      currentMode.value = 'preview'
    }
  }
}

const performSave = () => {
  // Save current theme changes and exit config mode
  console.log('Saving theme...')
  updateTheme()
  // Return to preview or default mode based on current theme
  if (theme.value.id === defaultTheme.value) {
    currentMode.value = 'default'
  } else {
    currentMode.value = 'preview'
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
    return `AKTIV: ${theme.value.heading}`
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
      updateTheme()
    }
  },
  { deep: true }
)

// Manual update function for when auto is disabled
const manualUpdate = () => {
  updateTheme()
}

const NuxtLink = resolveComponent('NuxtLink')

// BEGIN: not used
const email = 'email'
const side = ref('side')
const isLoading = false
const isAuthenticated = false
const handleLogin = async () => {
  /* await login({ email: email.value, password: password.value }) */
}

const handleLogout = async () => {
  /* await logout() */
}
// END: not used
</script>

<template>
  <div :style="getCssVars(true)">
    <NuxtLayout
      name="default"
      style="background-color: var(--color-bg); color: var(--color-contrast)"
    >
      <template #header>
        <Hero
          :imgTmp="imgUrl"
          :overlay="getoverlay('left-bottom', 0.5)"
          contentType="banner"
          contentWidth="short"
          heightTmp="small"
          imgTmpAlignX="cover"
          imgTmpAlignY="top"
        >
          <banner transparent>
            <Heading :content="heroHeading" is="h2" />
            <p v-html="theme.description" class="text-sm font-light"></p>

            <div class="flex gap-3 mt-4">
              <Button 
                @click="handlePrimaryAction()" 
                size="medium" 
                variant="primary" 
                :style="'font-family: ' + theme.font"
              >
                {{ primaryButtonConfig.label }}
              </Button>
              
              <Button 
                @click="handleSecondaryAction()" 
                size="medium" 
                variant="plain" 
                :style="'font-family: ' + theme.font"
              >
                {{ secondaryButtonConfig.label }}
              </Button>
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
                  <Button 
                    v-if="!autoUpdate"
                    @click="manualUpdate()" 
                    size="small" 
                    variant="plain"
                    class="text-xs px-2 py-1 min-h-0 h-6"
                    :style="'font-family: ' + theme.font"
                  >
                    Update
                  </Button>
                </div>
              </template>
            </div>
          </banner>
          
          <!-- Enhanced Color Display - Right Edge -->
          <div class="absolute top-4 right-0 flex flex-col gap-2">
            <template v-for="color in getThemeColors(theme)" :key="color.name">
              <div class="flex items-center gap-2 bg-black/30 backdrop-blur rounded-full px-3 py-2 border border-white/10">
                <span class="text-xs font-medium text-white/80 capitalize min-w-[60px]">{{ color.displayName }}</span>
                <div class="relative">
                  <div 
                    class="w-5 h-5 rounded-full border-2 border-white/30 shadow-sm" 
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
      </template>
      
      <!-- Themes Gallery - Only show in default and preview modes -->
      <SectionContainer v-if="showGallery" background="muted">
        <CardsGallery>
          <!-- make the style isolated -->
          <CardHero
            v-for="theme in themes"
            :imgTmp="theme.imgUrl"
            :key="theme.id"
            :overlay="getoverlay('left-bottom', 0.5)"
            contentAlignY="bottom"
            contentType="banner"
            contentWidth="short"
            heightTmp="mini"
            imgTmpAlignX="cover"
            imgTmpAlignY="top"
            class="shadow-lg relative"
            :style="[getThemeVars(theme.id)]"
            >
            <Heading :content="theme.heading" is="h3" class="p-4" :style="'font-family: ' + theme.font" />
            
            <!-- Enhanced 5-Color Preview Dots - Right Edge -->
            <div class="absolute bottom-0 right-0 flex flex-col gap-1">
              <template v-for="color in getThemeColors(theme)" :key="color.name">
                <div class="relative">
                  <div 
                    class="w-4 h-4 rounded-full shadow-lg" 
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

            <Button @click="handlePreviewClick(theme.id)" size="small" :style="[{'font-family': theme.font}, {'--color-inverted': theme.inverted ? '0' : '1'},{ 'isolation': 'isolate' }]">
              Vorschau
            </Button>
          </CardHero>
        </CardsGallery>
        <Button @click="updateTheme()" size="medium" variant="primary" :style="[{'font-family': theme.font}, {'--color-inverted': theme.inverted ? '0' : '1'}]">
          Update Website
        </Button>
      </SectionContainer>

      <!-- Theme Configuration - Only show in config mode -->
      <SectionContainer v-if="showConfiguration" background="default">
        <TabsRoot default-value="tab1" orientation="vertical">
          <TabsList aria-label="tabs example" class="gap-4">
            <TabsTrigger value="demo" class="trigger">Demo</TabsTrigger>
            <TabsTrigger value="colors" class="trigger">Colors</TabsTrigger>
            <TabsTrigger value="elements" class="trigger">Elemente</TabsTrigger>
            <TabsTrigger value="typography" class="trigger">Typographie</TabsTrigger>
            <TabsTrigger value="docs" class="trigger">Docs</TabsTrigger>
            <TabsTrigger value="export" class="trigger">Export</TabsTrigger>
          </TabsList>
          <TabsContent value="demo" class="p-4">
            <h2 class="bg-primary-bg">
              DEMO
              <span class="text-primary-700">(mit primary-bg)</span>
            </h2>
            <Prose>
              <li>Event-Cards</li>
              <li>Check-Out-Sektion</li>
              <li>Blog-Post</li>
            </Prose>
            <form
              @submit.prevent="handleLogin"
              class="flex flex-col gap-4 rounded-md border-neutral-200 md:border md:p-6"
            >
              <label>
                <UiFormLabel>Layout</UiFormLabel>
                <SfSelect>
                  <option value="side">Side-Nav wide</option>
                  <option value="top">Top-Nav wide</option>
                </SfSelect>
              </label>
              <label>
                <UiFormLabel>form.emailLabel</UiFormLabel>
                <SfInput v-model="email" autocomplete="email" name="email" required type="email" />
              </label>

              <label class="mt-2 flex items-center gap-2">
                <SfCheckbox v-model="side" name="side" />
                Layout: Side-Nav?
              </label>

              <SfButton :disabled="isLoading" type="submit" class="mt-2">
                <SfLoaderCircular v-if="isLoading" size="base" class="flex items-center justify-center" />
                <span v-else>auth.login.submitLabel</span>
              </SfButton>
              <SfButton
                v-show="isAuthenticated"
                :is="NuxtLink"
                @click="handleLogout()"
                data-testid="logout-page-reset-button"
                variant="tertiary"
              >
                Logout
              </SfButton>
              <SfButton :is="NuxtLink" data-testid="login-page-reset-button" to="/reset-password" variant="tertiary">
                auth.login.forgotPasswordLabel
              </SfButton>
            </form>
            <div class="bg-primary-300 text-primary-400 w-full p-4 invert md:p-6">hallo hans</div>
            <UiAlert
              variant="neutral"
              class="typography-text-base bg-primary-600 mt-6 w-full !justify-start p-4 md:p-6"
            >
              <SfLink :is="NuxtLink" data-testid="login-page-signup-button" to="signup" variant="primary">
                auth.login.createAccountLinkLabel
              </SfLink>
            </UiAlert>
          </TabsContent>
          <TabsContent value="colors" class="p-4">
            <ColorPalette v-model:baseColors="baseColors" v-model:colormap="colormap" v-model:inverted="inverted" />
          </TabsContent>
          <TabsContent value="elements" class="p-4">
            <Heading content="**Elemente**Linien, Abstände, Ring etc." is="h2" />
          </TabsContent>
          <TabsContent value="typography" class="p-4">
            <Heading content="**Typographie**Head-Font, Basis-Font, Fette, Range" is="h2" />
            <Prose>
              <ul>
                <li>head-font als dropdown + basis-fette + range</li>
                <li>basis-font als dropdown + basis-fette + range</li>
              </ul>
            </Prose>
          </TabsContent>
          <TabsContent value="docs" class="p-4">
            <Heading content="**Dokmentation**" is="h2" />
          </TabsContent>
          <TabsContent value="export" class="p-4">
            <ThemeExporter :tsVars="getTsVars()" :themeConfig="getConfigJson()" :themeId="theme.id" />
          </TabsContent>
        </TabsRoot>
      </SectionContainer>
    </NuxtLayout>
  </div>
</template>

<style scoped>
.invert {
  --color-inverted: '1';
}
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
