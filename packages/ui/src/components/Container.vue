<template>
  <component :is="is" class="section">
    <slot />
  </component>
</template>

<script lang="ts" setup>
/* This component controls setting up sections
it can be used to render a div or section
it provides props to control things like border, background, flex and parallax-behavior */

import type { PropType } from 'vue'

defineProps({
  /**
   * The structure tag to render.
   *
   * @default 'section'
   */
  is: {
    type: [Object, String] as PropType<'section' | 'article' | 'header' | 'footer' | 'form' | 'div'>,
    default: 'section',
  },
})
</script>

<style scoped>
.section {
  /* Add your styles here */
}

.section :deep() a {
  /* optionally render first and second links inside the slot as cta-buttons: primary and secondary */
}

</style>
