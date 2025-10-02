<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core'
// import { colorVars } from 'theme';
import { useToggle } from '@vueuse/core'
import { Container } from '@crearis/ui'
import { computed, ref, watch } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { sharedThemeState } from '../../composables/sharedThemeState'

const props = defineProps<{
  filled?: boolean
  extended?: boolean
  hideLogo?: boolean
  hideSearch?: boolean
  hideLinksOnMobile?: boolean
}>()

const navigation = [{ title: 'home', _path: '/' }]

// we setup a ref that keeps track of the current valid inverted (color mode)
// and initialize the app with the default-value of the theme
// @ts-expect-error
const colorMode = useColorMode()
// const isInverted = ref(colorMode.value == 'dark' ? '1' : '0')
// const isSepia = ref(false)

const themeComposable = useTheme()

// Direct toggle function that changes theme state - colorMode will follow
const toggleDark = () => {
  // Toggle the theme's inverted state directly
  const currentInverted = themeComposable.inverted.value
  themeComposable.setInverted(!currentInverted)
  console.log('🌓 NavbarTop: Toggled theme inverted:', !currentInverted)
}

// Sync colorMode with theme state when theme loads or changes
watch([() => sharedThemeState.loaded.value, () => themeComposable.inverted.value], 
  ([loaded, inverted]) => {
    if (loaded && themeComposable.isEnabled()) {
      const newColorMode = inverted ? 'dark' : 'light'
      if (colorMode.value !== newColorMode) {
        console.log('🌓 NavbarTop: Syncing colorMode to theme state - inverted:', inverted, '→ colorMode:', newColorMode)
        colorMode.value = newColorMode
      }
    }
  }, 
  { immediate: true }
)
// make a toggle out of it
// const toggleSepia = useToggle(isSepia)

// Don't automatically toggle on mount - this was causing route change issues
// toggleDark(!isDark.value) // align isDark and isInverted

const scrollBreak = 80
const y = ref(useWindowScroll().y)

// const topbar = ref(!props.extended && y.value > 80)
// console.log('topbar', topbar)
</script>

<template>
  <div>
  <Container
    is="header"
    class="justify-between fixed inset-x-0 top-0 z-50 flex h-14 items-center md:pt-2.5 lg:justify-start"
    :style="[
      { 'background': props.filled && (y > scrollBreak && props.extended) ? 'var(--color-muted-bg)' : !props.filled || (y <= scrollBreak && props.extended) ? 'transparent' : 'inherit' },
      { 'color': props.filled && (y > scrollBreak && props.extended) ? 'var(--color-primary-bg)' : 'inherit' }
    ]"    
    :class="[
      {
        'max-w-screen-3xl mx-auto md:-top-12 md:mt-6 md:h-28 lg:mt-10':
          y <= scrollBreak && props.extended,
      },
      { 'md:-top-4 md:h-20': y > scrollBreak || !props.extended },
    ]"
  >
    <div
      class="ph:px-0 ph:-ml-2 sticky top-0 mx-auto flex w-full items-center justify-between gap-[clamp(1rem,3vw,3rem)] px-3 py-6 md:h-[60px] md:justify-normal md:px-5"
    >
      <NuxtLink to="/" class="flex-grow">
        <Logo
          :extended="y <= scrollBreak && props.extended"
          :filled="filled"
          :hideLogo="hideLogo"
          :hideSearch="hideSearch"
          logoSize="sm"
        />
      </NuxtLink>
      <!-- Links Section -->
      <nav
        aria-label="SF Navigation"
        class="flex-nowrap items-center justify-end gap-x-4 md:ml-10 lg:flex"
        :style="[
          { 'color': props.filled && !(y <= scrollBreak && props.extended) ? 'var(--color-primary-bg)' : !props.filled || (y <= scrollBreak && props.extended) ? 'var(--color-secondary-bg)' : 'inherit' }
        ]"
        :class="[{
          hidden: hideLinksOnMobile
        }]"
      >
        <NuxtLink
          v-for="link of navigation"
          v-show="link.title !== 'home' && link.title !== 'Dev'"
          :key="link._path"
          :to="link._path"
        >
          {{ link.title }}
        </NuxtLink>
        <slot />

                <NuxtLink @click="toggleDark()" style="position: relative; display: inline-block;">
          <SfIconBase
            class="fill-neutral-900"
          >
            <!-- Dark/Night icon - show when inverted (dark mode) -->
            <!-- Dark/Night icon - show when inverted (dark mode) -->
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              style="opacity: var(--color-inverted, 0);"
            >
              <title>weather-night</title>
              <path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" />
            </svg>
            <!-- Light/Sunny icon - show when not inverted (light mode) -->
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
              style="opacity: calc(1 - var(--color-inverted, 0)); position: absolute; top: 0; left: 0;"
            >
              <title>weather-sunny</title>
              <path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.21C5.26,14 5.53,14.78 5.94,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.06,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z" />
            </svg>
          </SfIconBase>
        </NuxtLink>
        <NuxtLink to="/theme">Theming</NuxtLink>        
        <!-- <NuxtLink @click="toggleSepia()">
          sepia
        </NuxtLink> -->     
      </nav>
    </div>
  </Container>
</div>
</template>
