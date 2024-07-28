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
  padding-right: 1.75rem; /* 28px */
  padding-left: 1.75rem; /* 28px */
}
</style>
