<template>
  <Footer :hideClaim="hideClaim">
    <p>© 2026 DAS Ei</p>

    <ul>
      <li><NuxtLink to="/impressum">Impressum</NuxtLink></li>
      <li><NuxtLink to="/kontakt">Kontakt</NuxtLink></li>
      <li><NuxtLink to="/datenschutz">Datenschutzererklärung</NuxtLink></li>
      <li><NuxtLink to="/agb">AGB</NuxtLink></li>
    </ul>

    <ul>
      <li><NuxtLink to="/">Home</NuxtLink></li>
      <li><NuxtLink to="/ausbildung-theaterpaedagogik">Ausbildung Theaterpädagogik</NuxtLink></li>
      <li><NuxtLink to="/agenda">Workshops & Projekte</NuxtLink></li>
      <li><NuxtLink to="/blog">Blog</NuxtLink></li>
      <li><NuxtLink to="/institut">Institut</NuxtLink></li>
    </ul>

    <template #claim>
      <Prose>
        <p class="h3 primary"><strong>30 Jahre Theaterpädagogik in Bayern.</strong></p>
      </Prose>
    </template>
  </Footer>
</template>

<script lang="ts" setup>
defineProps({
  /**
   * Hide the footer claim when PageBottom already shows a claim.
   */
  hideClaim: {
    type: Boolean,
    default: false,
  },
})
</script>
