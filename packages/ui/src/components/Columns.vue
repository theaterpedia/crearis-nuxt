<template>
  <div class="columns" :class="[`columns-${gap}`]">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  /**
   * The gap between columns.
   *
   * @default 'medium'
   */
  gap: {
    type: String as PropType<'small' | 'medium'>,
    default: 'medium',
  },
})
</script>

<style scoped>
.columns {
  display: flex;
}

.columns-small {
  gap: 1.75rem; /* 28px */
}

.columns-medium {
  gap: 3.5rem; /* 56px */
}

@media (max-width: 1023px) {
  .columns {
    flex-direction: column;
    gap: 1.75rem; /* 28px */
  }
}
</style>
