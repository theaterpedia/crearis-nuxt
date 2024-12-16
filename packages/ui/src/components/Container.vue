<template>
  <component :is="is" class="container">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  /**
   * The HTML tag to render.
   *
   * @default 'div'
   */
  is: {
    type: String as PropType<'article' | 'div' | 'footer' | 'form' | 'header' | 'section'>,
    default: 'div',
  },
})
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 90rem; /* 1440px */
  margin-right: auto;
  margin-left: auto;
  padding-right: 2.75rem; /* 44px */
  padding-left: 2.75rem; /* 44px */
}

.container > * + * {
  margin-top: 1.75rem; /* 28px */
}

@media (max-width: 767px) {
  .container {
    padding-right: 1rem;
    padding-left: 1rem;
  }
}
</style>
