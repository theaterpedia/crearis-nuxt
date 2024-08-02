<template>
  <div class="container">
    <Heading headline="Heading 1" overline="Overline"></Heading>
    <Heading headline="Heading 1" subline="Subline"></Heading>
    <Heading headline="Heading 1" subline="with Subline and Tags" tags="21.7 08:00-20:00" />
    <Heading headline="mobile-Heading 1" shortcode="B1" is-mobile overline="with Shortcode and Overline" />
    <Heading headline="Fancy-Heading 1" shortcode="B1" overline="with Shortcode and Overline" />
    <Heading is="h2" headline="Fancy-Heading 2" shortcode="B1" overline="with Shortcode and Overline" />
    <Heading is="h3" headline="Fancy-Heading 3" shortcode="B1" overline="with Shortcode and Overline" />
    <Heading is="h3" headline="Fancy-Heading 3" shortcode="B1" subline="with Shortcode and Subline" />
    <Heading headline="Heading 1" overline="Overline" />
    <Heading is="h2" headline="Heading 2" />
  </div>
</template>

<script lang="ts" setup>
import { Heading } from '@/index'
</script>

<style scoped>
.container {
  padding: 2rem;
}

.container > * + * {
  margin-top: 2rem;
}
</style>
