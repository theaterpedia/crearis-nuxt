<template>
  <Box>
    <Sidebar
      footerText="30 Jahre Theaterädagogik Bayern"
      logo="https://pruvious.com/uploads/logo-dasei.svg"
      logoAlt="DAS Ei"
      logoSmall="https://pruvious.com/uploads/logo-dasei-small.svg"
    >
      <MainMenu v-model:items="mainMenuItems" />
    </Sidebar>

    <Main style="background-color:white">
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
import type { MainMenuParentItem } from '@crearis-nuxt/ui'

const mainMenuItems: Ref<MainMenuParentItem[]> = ref([
  {
    label: 'Ausbildung Theaterpädagogik',
    children: [
      { label: 'Einstiege ins Theaterspiel', link: '/ausbildung-theaterpaedagogik/einstiege_complex' },
      { label: 'Grundlagen Theaterpädagogik (BuT)', link: '#' },
      { label: 'Profil Performance & Interkulturelles Theater', link: '#' },
      {
        label: 'Aufbaustufe Theaterpädagogogik',
        children: [
          { label: 'Item 1', link: '#' },
          { label: 'Item 2', link: '#' },
        ],
      },
    ],
  },
  {
    label: 'Team & Institut',
    children: [],
  },
])
</script>
