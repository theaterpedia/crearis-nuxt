<template>
  <div class="box" :class="{ 'box-centered': layout === 'centered' }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  /**
   * Specifies the layout of the box.
   *
   * @default 'centered'
   */
  layout: {
    type: String as PropType<'centered' | 'full-width'>,
    default: 'centered',
  },
})
</script>

<style scoped>
.box {
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.box-centered {
  max-width: 90rem; /* 1440px */
  margin: 0 auto;
}

@media (max-width: 1023px) {
  .box-centered {
    flex-direction: column;
  }
}
</style>
