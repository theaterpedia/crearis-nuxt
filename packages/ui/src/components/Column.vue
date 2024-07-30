<template>
  <div class="column" :class="[`column-${width}`]">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  /**
   * The width of the column.
   * On tablet and mobile, the column will take up the full width.
   *
   * @default 'auto'
   */
  width: {
    type: String as PropType<'1/5' | '1/4' | '1/3' | '1/2' | '2/5' | '2/3' | '3/5' | '3/4' | '4/5' | 'auto'>,
    default: 'auto',
  },
})
</script>

<style scoped>
.column-auto {
  flex: 1;
}

.column-1\/5 {
  width: 20%;
}

.column-1\/4 {
  width: 25%;
}

.column-1\/3 {
  width: calc(1 / 3 * 100%);
}

.column-1\/2 {
  width: 50%;
}

.column-2\/5 {
  width: 40%;
}

.column-2\/3 {
  width: calc(2 / 3 * 100%);
}

.column-3\/5 {
  width: 60%;
}

.column-3\/4 {
  width: 75%;
}

.column-4\/5 {
  width: 80%;
}

.column > * + * {
  margin-top: 1.75rem; /* 28px */
}

@media (max-width: 1023px) {
  .column {
    width: 100%;
  }
}
</style>
