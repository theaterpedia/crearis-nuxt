<template>
  <Component :is="isSideNav ? 'Box' : 'div'" class="text-sm sm:text-base">
    <UiNavbarTop
      v-show="!isSideNav"
      :filled="y > scrollBreak"
      :key="themeKey" 
      :hideLogo="route.path === '/' && y <= scrollBreak"
      :hideSearch="searchDisabled ? true : y <= scrollBreak"
      :class="route.path !== '/' ? 'bg-muted-bg' : ''"
    >
      <NuxtLink to="/konferenz" class="mr-2 flex-1" :style="textShadow">Konferenz</NuxtLink>
      <NuxtLink to="/sondierung" class="flex-1" :style="textShadow">Sondierung</NuxtLink>
    </UiNavbarTop>    
    -->

    <!-- Top Navigation -->
    <div class="topnav-wrapper" 
      :class="{ 'fullwidth-padded': fullwidthMode && fullwidthPadding && wideTopnav }"
      v-show="!isSideNav"
      >
      <UiTopNav :items="mainMenuItems" :scrollStyle="scrollStyle" :wide="wideTopnav">
        <!-- TODO: Add menu items from Sidebar/MainMenu here -->
        <!-- HARDCODED: Replace with dynamic navigation actions -->
        <template #actions>
          <UiToggleMenu 
            v-model="siteLayout" 
            :toggleOptions="layoutToggleOptions"
            :arrayOptions="layoutArrayOptions"
            header="Layout Options"
            @update:arrayOption="handleArrayOptionUpdate"
          />
        </template>
      </UiTopNav>
    </div>

    <Sidebar
      v-show="isSideNav"
      footerText="30 Jahre Theaterpädagogik Bayern"
      logo="https://pruvious.com/uploads/logo-dasei.svg"
      logoAlt="DAS Ei"
      logoSmall="https://pruvious.com/uploads/logo-dasei-small.svg"
    >
      <!-- MainMenu v-model:items="mainMenu.items" / -->
    </Sidebar>

    <!-- Header/Hero Section -->
    <div class="header-wrapper" :class="{ 'fullwidth-padded': fullwidthMode && fullwidthPadding && wideHeader }">
      <header class="page-header" :class="{ 'page-header-boxed': !wideHeader }">
        <!-- PRUVIOUS: Original slot header relocated here -->
        <slot name="header">
          <Header
            :headerType="page?.fields?.headerType"
            :headerSize="page?.fields?.headerSize || 'mini'"        
            :formatOptions="page?.fields?.formatOptions"
            :showLogoBanner="route.path === '/' && y <= scrollBreak"
            :searchDisabled="searchDisabled"
            :heading="page?.title"
            :teaserText="page?.fields?.teaserText"
            :imgTmp="page?.fields?.imgTmp"
            :cta="page?.fields?.cta"
            :link="page?.fields?.link"
          />
        </slot>
      </header>
    </div>

    <!-- 2-Column Layout Container (Main + Aside) -->
    <UiBox :layout="wideContent ? 'full-width' : 'centered'" :fullwidthPadding="fullwidthMode && fullwidthPadding">
      <!-- Left Side Content (only for fullThree layout) -->
      <UiSideContent v-if="showLeftSidebar" placement="left">
        <UiSection>
          <!-- HARDCODED: Replace with dynamic left sidebar content -->
          <UiProse>
            <h3><strong>Navigation</strong></h3>
            <ul>
              <li><a href="#">Link 1</a></li>
              <li><a href="#">Link 2</a></li>
              <li><a href="#">Link 3</a></li>
            </ul>
          </UiProse>
        </UiSection>
      </UiSideContent>

      <!-- Main Content -->
      <main class="main-content">
        <!-- PRUVIOUS: Main slot content -->
        <slot />
      </main>

      <!-- Right Side Content (conditionally displayed) -->
      <UiSideContent v-if="showRightSidebar" placement="right">
        <!-- HARDCODED: Replace with dynamic right sidebar content -->
        <!-- CardHero Section -->
        <UiSection>
          <UiCardHero
            heightTmp="medium"
            imgTmp="https://24ai.tech/en/wp-content/uploads/sites/3/2023/10/01_product_1_sdelat-kvadratnym-5-scaled.jpg"
          >
            <UiProse>
              <h3><strong>Aktuelles</strong></h3>
              <p>Entdecke unsere neuesten Programme und Workshops.</p>
              <UiButton size="small" variant="plain">Mehr erfahren</UiButton>
            </UiProse>
          </UiCardHero>
        </UiSection>

        <!-- Timeline Section -->
        <UiSection>
          <UiTimeline>
            <li>
              <mark>31. März</mark>
              <div>
                <UiProse>
                  <h4><strong>Aktueller Status</strong></h4>
                  <p>Grafisches Design und Proof-of-Concept abgeschlossen.</p>
                </UiProse>
              </div>
            </li>
            <li>
              <mark>31. Mai</mark>
              <div>
                <UiProse>
                  <h4><strong>Relaunch</strong></h4>
                  <p>Neuprogrammierung basierend auf neuem Code.</p>
                </UiProse>
              </div>
            </li>
            <li>
              <mark>1. Juni</mark>
              <div>
                <UiProse>
                  <h4><strong>Beta-Testing</strong></h4>
                  <p>Private Previews und Testing-Phase.</p>
                </UiProse>
              </div>
            </li>
          </UiTimeline>
        </UiSection>
      </UiSideContent>
    </UiBox>

    <!-- Bottom Content (conditionally displayed) -->
    <div v-show="showBottom" class="bottom-wrapper" :class="{ 'fullwidth-padded': fullwidthMode && fullwidthPadding && bottomWide }">
      <div class="bottom-content" :class="{ 'bottom-content-boxed': !bottomWide }">
        <!-- HARDCODED: Replace with dynamic bottom content -->
        <UiSection background="accent">
          <UiContainer>
            <UiProse>
              <h2><strong>Bottom Content Area</strong></h2>
              <p>This area can be used for additional content sections.</p>
            </UiProse>
          </UiContainer>
        </UiSection>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-wrapper" :class="{ 'fullwidth-padded': fullwidthMode && fullwidthPadding && footerWide }">
      <footer class="page-footer" :class="{ 'page-footer-boxed': !footerWide }">
        <!-- HARDCODED: Replace with dynamic footer content -->
        <UiFooter>
          <p>© 2023 DAS Ei - Theaterpädagogik Bayern</p>
          <ul>
            <li><a href="#">Datenschutzerklärung</a></li>
            <li><a href="#">Impressum</a></li>
            <li><a href="#">Kontakt</a></li>
          </ul>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Ausbildung</a></li>
            <li><a href="#">Institut</a></li>
            <li><a href="#">AGB</a></li>
          </ul>
          <UiProse>
            <p class="h3 primary"><strong>30 Jahre Theaterpädagogik in Bayern.</strong></p>
          </UiProse>
        </UiFooter>
      </footer>
    </div>
  </Component>
</template>

<script lang="ts" setup>
import { ref, computed, watch, shallowRef, type Ref, type ShallowRef } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { defineLayout } from '#pruvious'
import { usePage } from '#pruvious/client'

defineLayout({
  label: 'fulldefault',
  allowedBlocks: [
    'HeaderCtaImage',
    'HeaderScroll',
    'HeaderText',
    'PageColumns',
    'PageDisplay',
    'PageLogin',
    'PageSection',
    'PageSlider',
    'PageSubnavigation',
    'VarConstruction',
    'VarImage',
    'VarProse',
    'VarVideo',
    'SubColumns',
    'SubColumn',
    'SubPostIt',
    'ThemeGallery',
  ],
  allowedRootBlocks: [
    'HeaderCtaImage',
    'HeaderScroll',
    'HeaderText',
    'PageColumns',
    'PageDisplay',
    'PageLogin',
    'PageSection',
    'PageSlider',
    'PageSubnavigation',
    'VarConstruction',  
    'VarImage',
    'VarProse',
    'VarVideo',
    'ThemeGallery',
  ],
})

const page = unref(usePage())
// const { blogLandingPage } = await getCollectionData('settings')

// PRUVIOUS: Original logic preserved
// const textShadow = 'text-shadow: 0.2rem 0.2rem 0.3rem hsla(110, 10%, 0%, 0.8);'
const themeKey = ref(0) // Keep for potential layout updates
const searchDisabled = true
const showHeader = page.value?.fields?.imgTmp && page.value?.fields?.headerType !== 'simple'
const scrollBreak = showHeader
  ? page.value?.fields.headerSize === 'full' || page.value?.fields.headerSize === 'prominent'
    ? 400
    : 250
  : 80
const y = ref(useWindowScroll().y)

// NEW LAYOUT SYSTEM: Page Props - imported from settings
const showAside = ref(pageSettings.showAside)
const showBottom = ref(pageSettings.showBottom)
const alertBanner = ref(pageSettings.alertBanner)

// NEW LAYOUT SYSTEM: Site Layout - imported from settings
const siteLayout = ref<SiteLayout>(layoutSettings.siteLayout)

// NEW LAYOUT SYSTEM: Base Layout Props - imported from settings
const baseWideHeader = ref(layoutSettings.baseWideHeader)
const baseWideTopnav = ref(layoutSettings.baseWideTopnav)
const baseWideContent = ref(layoutSettings.baseWideContent)
const baseBottomWide = ref(layoutSettings.baseBottomWide)
const baseFooterWide = ref(layoutSettings.baseFooterWide)
const fullwidthPadding = ref(layoutSettings.fullwidthPadding)
const backgroundColor = ref(layoutSettings.backgroundColor)

// NEW LAYOUT SYSTEM: Navbar behavior options - imported from settings
const scrollStyle = ref(navbarSettings.scrollStyle)
const navbarSticky = ref(navbarSettings.navbarSticky)
const navbarReappear = ref(navbarSettings.navbarReappear)

// NEW LAYOUT SYSTEM: Computed - Is fullwidth mode active?
const fullwidthMode = computed(() => {
  return siteLayout.value === 'fullTwo' || 
         siteLayout.value === 'fullThree' || 
         siteLayout.value === 'sidebar' || 
         siteLayout.value === 'fullSidebar'
})

// NEW LAYOUT SYSTEM: Computed Layout Props based on siteLayout
const wideHeader = computed(() => {
  if (siteLayout.value === 'fullTwo' || siteLayout.value === 'fullThree') return true
  return baseWideHeader.value
})

const wideTopnav = computed(() => {
  if (siteLayout.value === 'fullTwo' || siteLayout.value === 'fullThree') return true
  return baseWideTopnav.value
})

const wideContent = computed(() => {
  if (siteLayout.value === 'fullTwo' || siteLayout.value === 'fullThree') return true
  return baseWideContent.value
})

const bottomWide = computed(() => {
  if (siteLayout.value === 'fullTwo' || siteLayout.value === 'fullThree') return true
  return baseBottomWide.value
})

const footerWide = computed(() => {
  if (siteLayout.value === 'fullTwo' || siteLayout.value === 'fullThree') return true
  return baseFooterWide.value
})

const isSideNav = computed(() => {
  if (siteLayout.value === 'sidebar' || siteLayout.value === 'fullSidebar') return true
  return false
})

// NEW LAYOUT SYSTEM: Show left sidebar only for fullThree layout
const showLeftSidebar = computed(() => siteLayout.value === 'fullThree')

// NEW LAYOUT SYSTEM: Show right sidebar for default, fullTwo, and fullThree layouts (when showAside is true)
const showRightSidebar = computed(() => {
  if (siteLayout.value === 'sidebar' || siteLayout.value === 'fullSidebar') return false
  return showAside.value
})

// NEW LAYOUT SYSTEM: Watch navbar options and sync with scrollStyle
watch([navbarSticky, navbarReappear], ([sticky, reappear]) => {
  if (sticky) {
    scrollStyle.value = 'overlay'
  } else if (reappear) {
    scrollStyle.value = 'overlay_reappear'
  } else {
    scrollStyle.value = 'simple'
  }
}, { immediate: true })

// NEW LAYOUT SYSTEM: Navigation menu items - imported from settings
const mainMenuItems: Ref<TopnavParentItem[]> = ref(mainMenuItemsConfig)

// NEW LAYOUT SYSTEM: Layout Toggle Options - imported from settings
// Use shallowRef to avoid making icon objects reactive (prevents Vue warning)
const layoutToggleOptions: ShallowRef<ToggleOption[]> = shallowRef(layoutToggleOptionsConfig)

// NEW LAYOUT SYSTEM: Array options - computed() that derives state from individual refs
const layoutArrayOptions = computed<ArrayOption[]>(() => [
  {
    text: 'Fullwidth Padding',
    state: fullwidthPadding.value,
  },
  {
    text: 'Navbar Sticky',
    state: navbarSticky.value,
  },
  {
    text: 'Navbar Reappear',
    state: navbarReappear.value,
  },
])

// NEW LAYOUT SYSTEM: Handle toggle updates from array options
function handleArrayOptionUpdate(option: ArrayOption, newState: boolean) {
  if (option.text === 'Fullwidth Padding') {
    fullwidthPadding.value = newState
  }
  else if (option.text === 'Navbar Sticky') {
    navbarSticky.value = newState
    if (newState) {
      navbarReappear.value = false
    }
  }
  else if (option.text === 'Navbar Reappear') {
    navbarReappear.value = newState
    if (newState) {
      navbarSticky.value = false
    }
  }
}
</script>

<style scoped>
/* NEW LAYOUT SYSTEM: Page wrapper and background colors */
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-bg-default {
  background-color: var(--color-bg);
}

.page-bg-primary {
  background-color: var(--color-primary-bg);
}

.page-bg-secondary {
  background-color: var(--color-secondary-bg);
}

.page-bg-muted {
  background-color: var(--color-muted-bg);
}

.page-bg-accent {
  background-color: var(--color-accent-bg);
}

.page-bg-positive {
  background-color: var(--color-positive-bg);
}

.page-bg-negative {
  background-color: var(--color-negative-bg);
}

.page-bg-warning {
  background-color: var(--color-warning-bg);
}

/* NEW LAYOUT SYSTEM: Header */
.page-header {
  width: 100%;
}

.page-header-boxed {
  max-width: 90rem; /* 1440px - matches Box centered */
  margin: 0 auto;
}

/* NEW LAYOUT SYSTEM: Main Content */
.main-content {
  flex: 1;
  width: 100%;
  order: 1; /* Main content always in the middle */
}

/* NEW LAYOUT SYSTEM: Fullwidth Padding - applies to wrappers in fullwidth mode */
.fullwidth-padded {
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 1024px) {
  .fullwidth-padded {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* NEW LAYOUT SYSTEM: Bottom Content */
.bottom-content {
  width: 100%;
}

.bottom-content-boxed {
  max-width: 90rem; /* 1440px - matches Box centered */
  margin: 0 auto;
}

/* NEW LAYOUT SYSTEM: Footer */
.page-footer {
  width: 100%;
}

.page-footer-boxed {
  max-width: 90rem; /* 1440px - matches Box centered */
  margin: 0 auto;
}

/* PRUVIOUS: Original footnotes styles preserved */
:deep() .footnotes {
  /* merged from ui/section + section-muted + ui/container */
  position: relative;
  z-index: 1;
  padding-top: 1.75rem; /* 28px */
  padding-bottom: 1.75rem; /* 28px */
  transform: translate3d(0, 0, 0); /* Fixes z-index in Safari */
  --color-bg: var(--color-muted-bg);
  --color-contrast: var(--color-card-contrast);
  background-color: var(--color-muted-bg);
  color: var(--color-card-contrast);
  width: 100%;
  max-width: 90rem; /* 1440px */
  margin-right: auto;
  margin-left: auto;
  padding-right: 1.75rem; /* 28px */
  padding-left: 1.75rem; /* 28px */
}

:deep() .footnotes > ol {
  /* merged from ui/section + section-muted + ui/container */
  list-style: decimal;
  font-size: 0.9em;
  margin-bottom: 0.5rem;
  max-width: 52rem; /* from prose */
}

:deep() .footnotes > ol > li {
  /* merged from ui/section + section-muted + ui/container */
  list-style: decimal;
  font-size: 0.92em;
  margin-bottom: 0.5rem;
}

:deep() .footnotes > ol {
  /* merged from ui/section + section-muted + ui/container */
  margin-left: 1.6rem;
}

@media (max-width: 767px) {
  :deep() .footnotes {
    padding-right: 1rem;
    padding-left: 1rem;
  }
  :deep() .columns:has(.column-1\/5) {
    flex-direction: row;
    border: black 4px;
    gap: 1.2rem; /* 8px */
  }
}
</style>
