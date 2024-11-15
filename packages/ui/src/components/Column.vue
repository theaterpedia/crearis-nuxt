<template>
  <div
    class="column"
    :class="[
      `column-${width}`,
      rotation,
      sticky !== 'static' ? 'sticky ' + sticky : '',
      `rotate-${rotation}`,
      `column-${fill ? 'fill' : 'default'}`,
    ]"
  >
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
   * The rotation of the column.
   *
   * @default 'rotate-0'
   */
  rotation: {
    type: String as PropType<
      'rotate-0' | '-rotate-3' | '-rotate-2' | '-rotate-1' | 'rotate-1' | 'rotate-2' | 'rotate-3'
    >,
    default: 'rotate-0',
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

  /**
   * Specification to be written
   *
   * @default 'static'
   */
  sticky: {
    type: String as PropType<'static' | 'top-0' | 'top-20' | 'bottom-0' | 'bottom-20'>,
    default: 'static',
  },
})
</script>

<style scoped>
.-rotate-2 {
  rotate: -2deg;
}

.rotate-2 {
  rotate: 2deg;
}

.-rotate-1 {
  rotate: 1deg;
}

.rotate-1 {
  rotate: 1deg;
}

.-rotate-3 {
  rotate: -3deg;
}

.rotate-3 {
  rotate: 3deg;
}

.rotate-0 {
  rotate: 0deg;
}

:is(.column-auto, .column-1\/5, .column-1\/4) {
  min-width: 10rem;
}

:is(.column-1\/3, .column-2\/5) {
  min-width: 15rem;
}

:is(.column-1\/2, .column-3\/5, .column-2\/3, .column-3\/4, .column-5\/5) {
  min-width: 21.5rem;
}

.column-auto {
  flex: 1;
}

.column-1\/5 {
  width: 17.5%;
}

.column-1\/4 {
  width: 22.5%;
}

.column-1\/3 {
  width: calc(1 / 3 * 88%);
}

.column-1\/2 {
  width: calc(1 / 2 * 93%);
}

.column-2\/5 {
  width: 37%;
}

.column-2\/3 {
  width: calc(2 / 3 * 90%);
}

.column-3\/5 {
  width: 58%;
}

.column-3\/4 {
  width: 72.5%;
}

.column-4\/5 {
  width: 78.5%;
}

.column > * + * {
  margin-top: 1.75rem; /* 28px */
}

.sticky {
  position: sticky;
}

.top-0 {
  top: 0px;
}

.top-20 {
  top: 5rem;
}

.bottom-0 {
  bottom: 0px;
}

.bottom-20 {
  bottom: 5rem;
}

.column-default {
  padding-top: var(--column-padding);
  padding-bottom: var(--column-padding);
}

.column-default:first-child {
  /* siehe PageSection */
  /* padding-left: var(--column-padding); */
}

.column-default:last-child {
  /* siehe PageSection */
  /* padding-right: var(--column-padding); */
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
