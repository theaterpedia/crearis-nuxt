<template>
  <Box>
    <Sidebar
      footerText="30 Jahre Theaterädagogik Bayern"
      logo="https://pruvious.com/uploads/logo-dasei.svg"
      logoAlt="DAS Ei"
      logoSmall="https://pruvious.com/uploads/logo-dasei-small.svg"
    >
      <MainMenu v-model:items="mainMenu.items" :currentPath="$route.path" />
    </Sidebar>

    <Main>
      <slot name="header">
        <Hero
          v-if="hero"
          :contentAlignY="hero.content_y"
          :contentType="hero.content ? hero.content : 'text'"
          :contentWidth="hero.content_width"
          :heightTmp="hero.height"
          :imgTmp="image.src"
          :imgTmpAlignX="hero.image_focus_x"
          :imgTmpAlignY="hero.image_focus_y"
        >
          <Component :is="hero.content === 'banner' ? 'Banner' : 'div'" transparent>
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
          <Heading
            v-if="page.heading || page.title"
            :content="page.heading ? page.heading : page.title"
            is="h1"
          ></Heading>
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

  <Footer>
    <p>© 2023 DAS Ei</p>

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

    <Prose>
      <p class="h3 primary"><strong>30 Jahre Theaterpädagogik in Bayern.</strong></p>
    </Prose>
  </Footer>
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components'
const { page } = useContent()

const image = page.value.image
  ? page.value.image
  : { src: 'https://pruvious.com/uploads/dasei/banner.jpg', alt: 'DAS Ei' }
const hero = page.value.hero ? page.value.hero : undefined
const details = page.value.details ? true : false

const route = useRoute()
const mainMenu = useMainMenu()
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())

if (!mainMenu.value.initialized) {
  mainMenu.value.items = navigationToMenu(navigation.value!, route.path)
  mainMenu.value.initialized = true
}
</script>
