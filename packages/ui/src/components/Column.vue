<template>
  <div class="column" :class="[`column-${width}`, `column-${fill ? 'fill' : 'default'}`]">
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

  /**
   * Specifies whether to fill the entire column space with a cover image.
   * This option is only usable with a single child element, which must be an image.
   *
   * @default false
   */
  fill: {
    type: Boolean,
    default: false,
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

.column-default {
  padding-top: var(--column-padding);
  padding-bottom: var(--column-padding);
}

.column-default:first-child {
  padding-left: var(--column-padding);
}

.column-default:last-child {
  padding-right: var(--column-padding);
}

.column-fill {
  align-self: stretch;
}

.column-fill :deep() > p:only-child {
  height: 100%;
}

.column-fill :where(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 767px) {
  .column {
    width: 100%;
  }
}
</style>
