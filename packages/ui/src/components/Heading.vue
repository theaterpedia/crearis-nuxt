<template>
  <component :is="is" class="heading">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  /**
   * The heading tag to render.
   *
   * @default 'h1'
   */
  is: {
    type: String as PropType<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>,
    default: 'h1',
  },
})
</script>

<style scoped>
.heading {
  /* Add your styles here */
}

.heading :deep() em {
  /* Add your styles here */
}

.heading :deep() mark {
  /* Add your styles here */
}

.heading :deep() strong {
  /* Add your styles here */
}
</style>
