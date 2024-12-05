<template>
  <Component :is="isSideNav ? 'Box' : 'div'" class="text-sm sm:text-base">
    <UiNavbarTop
      v-show="!isSideNav"
      :filled="y > scrollBreak"
      :hideLogo="route.path === '/' && y <= scrollBreak"
      :hideSearch="searchDisablend ? true : y <= scrollBreak"
      :class="route.path !== '/' ? 'bg-muted-base' : ''"
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
        <Hero
          v-if="showHero"
          :contentAlignY="page?.fields.contentAlignY"
          :contentType="page?.fields.phoneBanner ? 'banner' : 'text'"
          :contentWidth="page?.fields.isFullWidth ? 'full' : 'short'"
          :gradient_depth="page?.fields.gradientDepth"
          :gradient_type="page?.fields.gradientType"
          :heightTmp="page?.fields.heightTmp"
          :imgTmp="imgTmp"
          :imgTmpAlignX="page?.fields.imgTmpAlignX"
          :imgTmpAlignY="page?.fields.imgTmpAlignY"
        >
          <Component
            :card="page?.fields.phoneBanner && false"
            :is="page?.fields.inBanner ? 'Banner' : 'div'"
            transparent
          >
            <template v-if="route.path === '/'">
              <Logo extended />
            </template>
            <template v-else>
              <Heading v-if="heading" :content="heading" is="h1"></Heading>
              <br v-if="heading && teaser" />
              <MdBlock v-if="teaser" :content="teaser" htag="h3" />
              <div v-if="page?.fields.cta">
                <ButtonTmp
                  v-if="page?.fields.cta"
                  :size="page?.fields.isFullWidth ? 'medium' : 'small'"
                  :to="page?.fields.cta.link ? page?.fields.cta.link : '#cta'"
                  variant="plain"
                >
                  {{ page?.fields.cta.title }}
                </ButtonTmp>
                <NuxtLink
                  v-if="page?.fields.link"
                  :to="page?.fields.link.link"
                  style="margin-left: 2em; text-decoration: underline"
                  :style="page?.fields.isFullWidth ? 'font-weight:bold' : ''"
                >
                  {{ page?.fields.link.title }}
                </NuxtLink>
              </div>
            </template>
          </Component>
        </Hero>
        <SectionContainer v-else>
          <Heading :content="heading" is="h1" class="mt-14"></Heading>
          <MdBlock v-if="teaser" :content="teaser" htag="h3" />
        </SectionContainer>
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
  label: 'default',
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
  ],
})

const page = unref(usePage())
// const { blogLandingPage } = await getCollectionData('settings')

const searchDisablend = true

const heading = page?.fields.heading
const teaser = page?.fields.teaser ? page?.fields.teaser : 'Teasertext'
const imgTmp = page?.fields.imgTmp

const isSideNav: Boolean = false

const showHero = heading && imgTmp
const textShadow = 'text-shadow: 0.2rem 0.2rem 0.3rem hsla(110, 10%, 0%, 0.8);'

const scrollBreak = showHero
  ? page?.fields.heightTmp === 'full' || page?.fields.heightTmp === 'prominent'
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
  --color-base: var(--color-muted-base);
  --color-contrast: var(--color-card-contrast);
  background-color: hsl(var(--color-muted-base));
  color: hsl(var(--color-card-contrast));
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
