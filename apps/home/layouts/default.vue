<template>
  <Box>
    <Sidebar
      theme="dasei"
      footerText="30 Jahre Theaterädagogik Bayern"
      logo="https://pruvious.com/uploads/logo-dasei.svg"
      logoAlt="DAS Ei"
      logoSmall="https://pruvious.com/uploads/logo-dasei-small.svg"
    >
      <MainMenu v-model:items="mainMenu.items" :linkComponent="NuxtLink" />
    </Sidebar>

    <Main>
      <slot name="header">
        <Hero
          v-if="hero"
          :contentAlignY="hero.content_y"
          :contentType="hero.content ? hero.content : 'text'"
          :contentWidth="hero.content_width"
          :gradient_depth="hero.gradientDepth ? hero.gradientDepth : undefined"
          :gradient_type="hero.gradientType"
          :heightTmp="hero.height"
          :imgTmp="image.src"
          :imgTmpAlignX="hero.image_focus_x"
          :imgTmpAlignY="hero.image_focus_y"
        >
          <Component
            :card="hero.content === 'banner' && page?._path?.startsWith('/agenda')"
            :is="hero.content === 'banner' ? 'Banner' : 'div'"
            transparent
          >
            <Heading
              v-if="page?.heading || page?.title"
              :content="page?.heading ? page.heading : page?.title"
              is="h1"
            ></Heading>
            <br v-if="(page?.heading || page?.title) && page?.teaser" />
            <MdBlock v-if="page?.teaser" :content="page.teaser" :htag="page?.heading ? 'h3' : 'h1'" />
            <div v-if="hero.cta || hero.link">
              <ButtonTmp
                v-if="hero.cta"
                :size="hero.content_width === 'full' ? 'medium' : 'small'"
                :to="hero.cta.link ? hero.cta.link : '#cta'"
                variant="plain"
              >
                {{ hero.cta.title }}
              </ButtonTmp>
              <NuxtLink
                v-if="hero.link"
                :to="hero.link.link"
                style="margin-left: 2em; text-decoration: underline"
                :style="hero.content_width === 'full' ? 'font-weight:bold' : ''"
              >
                {{ hero.link.title }}
              </NuxtLink>
            </div>
          </Component>
        </Hero>
        <SectionContainer v-else>
          <Heading
            v-if="page?.heading || page?.title"
            :content="page?.heading ? page.heading : page?.title"
            is="h1"
          ></Heading>
          <MdBlock v-if="page?.teaser" :content="page.teaser" :htag="page?.heading ? 'h3' : 'h1'" />
        </SectionContainer>
      </slot>
      <slot />
      <!-- NOTE: "Anmeldung und Konditionen" button removed - replaced by CheckoutSection CTA and hero anchor scrolling -->
      <PageBottom
        v-if="pageBottom"
        :anchorline="computedAnchorline"
        :anchor="pageBottom.anchor || 'pagebottom'"
        :effect="pageBottom.effect || 'appear'"
        :contentWidth="pageBottom.content_width || 'full'"
        :imgTmp="pageBottomImage"
        :imgTmpGravity="pageBottom.image_gravity || 'south'"
        :overlay="pageBottomOverlay"
        :claim="pageBottom.claim"
      >
        <ConsultingDialog
          v-if="pageBottom.consulting"
          :variant="pageBottom.consulting.variant || 'default'"
          :fancy="pageBottom.consulting.fancy || false"
          :title="pageBottom.consulting.title"
          :overline="pageBottom.consulting.overline"
          :description="pageBottom.consulting.description"
          :productRef="route.query.tab as string || undefined"
          :domainCode="pageBottom.consulting.domainCode"
          :callPhone="pageBottom.consulting.callPhone"
          :callLabel="pageBottom.consulting.callLabel"
          :email="pageBottom.consulting.email"
          :emailLabel="pageBottom.consulting.emailLabel"
          :categories="pageBottom.consulting.categories"
          :success="pageBottom.consulting.success"
        />
        <div v-else-if="pageBottom.heading || pageBottom.teaser">
          <Heading v-if="pageBottom.heading" :content="pageBottom.heading" is="h2" />
          <MdBlock v-if="pageBottom.teaser" :content="pageBottom.teaser" htag="p" />
        </div>
      </PageBottom>
    </Main>
  </Box>

  <FooterDasei />
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components'
import { PageBottom } from '@crearis/ui'
import { getoverlay } from '@crearis/theme/utils/BackgroundHelpers'
import { provide, computed } from 'vue'
const { page } = useContent()

const image = page.value?.image
  ? page.value.image
  : { src: 'https://pruvious.com/uploads/dasei/banner.jpg', alt: 'DAS Ei' }
const hero = page.value?.hero ? page.value.hero : undefined
const details = page.value?.details ? true : false
const pageBottom = page.value?.pageBottom ? page.value.pageBottom : undefined

// Provide hero image so PageBottom can inherit it if needed
provide('heroImage', image.src)

// Compute PageBottom image (inherit from hero or use explicit)
const pageBottomImage = computed(() => {
  if (!pageBottom) return undefined
  if (pageBottom.inherit_hero_image !== false) {
    return image.src
  }
  return pageBottom.image
})

// Compute PageBottom overlay
const pageBottomOverlay = computed(() => {
  if (!pageBottom) return undefined
  return getoverlay(pageBottom.gradient_type || 'none', pageBottom.gradient_depth || 0.8)
})

// Compute anchorline variant from YAML config
const computedAnchorline = computed(() => {
  if (!pageBottom) return 'accent'
  if (pageBottom.anchorline === undefined) return 'accent'
  if (pageBottom.anchorline === false) return false
  if (pageBottom.anchorline === true) return 'accent'
  return pageBottom.anchorline // 'accent' | 'primary' | 'default' | 'muted'
})

const route = useRoute()
// const hideFolders = ['/blog/', '/agenda/']
// .filter((item) => !hideFolders.includes(item.link!)) // filter out items that are in the hideFolders list

const mainMenu = useMainMenu()
// mainMenu.value.items = mainMenu.value.items.filter((item) => item.link !== '/blog/' && item.link !== '/agenda/')

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
}
</style>
