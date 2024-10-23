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

    <Main style="background-color: white">
      <slot />
    </Main>
  </Box>

  <FooterDasei />
</template>

<script lang="ts" setup>
const mainMenu = useMainMenu()
</script>
