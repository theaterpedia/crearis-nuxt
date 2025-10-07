<template>
  <Component :is="isSideNav ? 'Box' : 'div'" class="text-sm sm:text-base">
    <UiNavbarTop
      v-show="!isSideNav"
      :filled="y > scrollBreak"
      :hideLogo="route.path === '/' && y <= scrollBreak"
      :hideSearch="searchDisablend ? true : y <= scrollBreak"
      :class="route.path !== '/' ? 'bg-muted-bg' : ''"
    >
      <NuxtLink to="/konferenz" class="mr-2 flex-1" :style="textShadow">Konferenz</NuxtLink>
      <NuxtLink to="/sondierung" class="flex-1" :style="textShadow">Sondierung</NuxtLink>
    </UiNavbarTop>
    <Sidebar
      v-show="isSideNav"
      footerText="30 Jahre Theaterädagogik Bayern"
      logo="https://pruvious.com/uploads/logo-dasei.svg"
      logoAlt="DAS Ei"
      logoSmall="https://pruvious.com/uploads/logo-dasei-small.svg"
    >
      <!-- MainMenu v-model:items="mainMenu.items" / -->
    </Sidebar>

    <Main class="tl:px-8 ph:px-0 mx-auto max-w-screen-2xl px-12">
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
      <slot />
    </Main>
  </Component>
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components'
import { ref } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { defineLayout } from '#pruvious'
import { usePage } from '#pruvious/client'

defineLayout({
  label: 'post',
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

const page = usePage()
// const { blogLandingPage } = await getCollectionData('settings')

// Theme is handled by the theme-css.client.ts plugin
const themeKey = ref(0) // Keep for potential layout updates

const searchDisablend = true

// const author = page.value?.fields.author ? page.value?.fields.author : 'kein Autor angegeben'
// const heading = page.value?.fields.heading || page.value?.fields.title || 'Post ohne Titel'
// const teaser = page.value?.fields.teaserText ? page.value?.fields.teaserText : 'Teasertext'
const imgTmp = page.value?.fields.imgTmp

const isSideNav: Boolean = false
const searchDisabled = true

const showHeader = page.value?.fields?.imgTmp && page.value?.fields?.headerType !== 'simple'
const textShadow = 'text-shadow: 0.2rem 0.2rem 0.3rem hsla(110, 10%, 0%, 0.8);'

const scrollBreak = showHeader
  ? page.value?.fields.headerSize === 'full' || page.value?.fields.headerSize === 'prominent'
    ? 400
    : 250
  : 80
const y = ref(useWindowScroll().y)

const route = useRoute()
const mainMenu = undefined // TODO: Reactivate useMainMenu() (from dasei.eu)
</script>

<style scoped>
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
