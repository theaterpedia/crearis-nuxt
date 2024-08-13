<template>
  <div class="container">
    <Heading headline="Heading 1" overline="Overline"></Heading>
    <Heading headline="Heading 1" subline="Subline"></Heading>
    <Heading headline="Heading 1" subline="with Subline and Tags" tags="21.7 08:00-20:00" />
    <Heading headline="mobile-Heading 1" is-mobile overline="with Shortcode and Overline" shortcode="B1" />
    <Heading headline="Fancy-Heading 1" overline="with Shortcode and Overline" shortcode="B1" />
    <Heading headline="Fancy-Heading 2" is="h2" overline="with Shortcode and Overline" shortcode="B1" />
    <Heading headline="Fancy-Heading 3" is="h3" overline="with Shortcode and Overline" shortcode="B1" />
    <Heading headline="Fancy-Heading 3" is="h3" shortcode="B1" subline="with Shortcode and Subline" />
    <Heading headline="Heading 1" overline="Overline" />
    <Heading headline="Heading 2" is="h2" />
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
