<template>
  <div class="columns" :class="[`columns-${gap}`, `columns-${align}`]">
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

  /**
   * The vertical alignment of the columns.
   *
   * @default 'top'
   */
  align: {
    type: String as PropType<'top' | 'center' | 'bottom'>,
    default: 'top',
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

.columns-top {
  align-items: flex-start;
}

.columns-center {
  align-items: center;
}

.columns-bottom {
  align-items: flex-end;
}

@media (max-width: 767px) {
  .columns {
    flex-direction: column;
    gap: 1.75rem; /* 28px */
  }
}
</style>
