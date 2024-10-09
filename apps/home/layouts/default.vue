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
        <Hero :contentType="hero.content ? hero.content : 'text'" :imgTmp="image.src" :contentAlignY="hero.content_y" :contentWidth="hero.content_width"  :heightTmp="hero.height" :imgTmpAlignX="hero.image_focus_x" :imgTmpAlignY="hero.image_focus_y" v-if="hero">
          <Component :is="hero.content === 'banner' ? 'Banner' : 'div'" transparent>
            <Heading is="h1" :content="page.heading ? page.heading : page.title" v-if="page.heading || page.title"></Heading>
            <br v-if="(page.heading || page.title) && page.teaser"/>
            <MdBlock :htag="page.heading ? 'h3' : 'h1'" :content="page.teaser" v-if="page.teaser"/>
            <div v-if="hero.cta || hero.link">
              <ButtonTmp v-if="hero.cta" :to="hero.cta.link ? hero.cta.link : '#cta'" variant="plain" :size="hero.content_width === 'full' ? 'medium' : 'small' ">
                {{ hero.cta.title }}
              </ButtonTmp>
              <NuxtLink v-if="hero.link" :to="hero.link.link" :style="hero.content_width === 'full' ? 'font-weight:bold' : '' "  style="margin-left:2em;text-decoration:underline">
                {{ hero.link.title }}
              </NuxtLink>           
            </div>
          </Component>
        </Hero>
        <SectionContainer v-else>
          <Heading is="h1" :content="page.heading ? page.heading : page.title" v-if="page.heading || page.title"></Heading>
          <MdBlock :htag="page.heading ? 'h3' : 'h1'" :content="page.teaser" v-if="page.teaser"/>
        </SectionContainer>
      </slot>
      <slot />
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

const image = page.value.image ? page.value.image : {src: 'https://pruvious.com/uploads/dasei/banner.jpg', alt: 'DAS Ei'}
const hero = page.value.hero ? page.value.hero : undefined

const route = useRoute()
const mainMenu = useMainMenu()
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())

if (!mainMenu.value.initialized) {
  mainMenu.value.items = navigationToMenu(navigation.value!, route.path)
  mainMenu.value.initialized = true
}
</script>
