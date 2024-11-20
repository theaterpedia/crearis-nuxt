<template>
  <Box>
    <Sidebar
      footerText="30 Jahre Theaterädagogik Bayern"
      logo="https://pruvious.com/uploads/logo-dasei.svg"
      logoAlt="DAS Ei"
      logoSmall="https://pruvious.com/uploads/logo-dasei-small.svg"
    >
      <MainMenu v-model:items="mainMenu.items" />
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
            :card="hero.content === 'banner' && page._path?.startsWith('/agenda')"
            :is="hero.content === 'banner' ? 'Banner' : 'div'"
            transparent
          >
            <Heading
              v-if="page.heading || page.title"
              :content="page.heading ? page.heading : page.title"
              is="h1"
            ></Heading>
            <br v-if="(page.heading || page.title) && page.teaser" />
            <MdBlock v-if="page.teaser" :content="page.teaser" :htag="page.heading ? 'h3' : 'h1'" />
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
          <Heading :content="content" is="h1"></Heading>
          <MdBlock v-if="page.teaser" :content="page.teaser" :htag="page.heading ? 'h3' : 'h1'" />
        </SectionContainer>
      </slot>
      <slot />
      <ButtonTmp
        v-if="details"
        :to="{ path: '/details', props: route.path, query: { src: route.path } }"
        id="cta"
        style="margin-top: 3em"
      >
        Anmeldung und Konditionen
      </ButtonTmp>
    </Main>
  </Box>
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components'

const image = { src: 'https://pruvious.com/uploads/dasei/banner.jpg', alt: 'DAS Ei' }
const page = { heading: 'test heading', title: 'test title', teaser: 'test teaser', _path: '/dasei' }
const content = '## headline for heading \nTest for Teaser'
const hero = undefined
const details = false

const route = useRoute()
const mainMenu = useMainMenu()
</script>

<style scoped>
:deep() .footnotes {
  /* merged from ui/section + section-muted + ui/container */
  position: relative;
  z-index: 1;
  padding-top: 1.75rem; /* 28px */
  padding-bottom: 1.75rem; /* 28px */
  transform: translate3d(0, 0, 0); /* Fixes z-index in Safari */
  --background: var(--muted-base);
  --foreground: var(--card-foreground);
  background-color: hsl(var(--muted-base));
  color: hsl(var(--card-foreground));
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
