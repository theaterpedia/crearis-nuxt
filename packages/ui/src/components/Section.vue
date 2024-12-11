<template>
  <component :is="is" class="section" :class="[`section-${background}`, overlap ? 'overlap' : '']">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  /**
   * The HTML tag to render.
   *
   * @default 'section'
   */
  is: {
    type: String as PropType<'article' | 'div' | 'footer' | 'form' | 'header' | 'section'>,
    default: 'section',
  },

  /**
   * The background color of the section.
   *
   * @default 'default'
   */
  background: {
    type: String as PropType<'default' | 'muted' | 'accent'>,
    default: 'default',
  },
  /**
   * adds padding to the bottom
   *
   * @default false
   */
  overlap: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.section {
  position: relative;
  z-index: 1;
  padding-top: 1.75rem; /* 28px */
  padding-bottom: 1.75rem; /* 28px */
  transform: translate3d(0, 0, 0); /* Fixes z-index in Safari */
}

.section-default {
  --color-base: var(--color-card-base);
  --color-contrast: var(--color-card-contrast);
  background-color: var(--color-card-base);
  color: var(--color-card-contrast);
}

.section-muted {
  --color-base: var(--color-muted-base);
  --color-contrast: var(--color-card-contrast);
  background-color: var(--color-muted-base);
  color: var(--color-card-contrast);
}

.section-accent {
  --color-base: var(--color-accent-base);
  --color-contrast: var(--color-accent-contrast);
  --color-muted-contrast: var(--color-accent-contrast);
  --link: var(--color-primary-base);
  background-color: var(--color-accent-base);
  color: var(--color-accent-contrast);
}

.overlap {
  padding-bottom: 2.75rem; /* 44px */
}
</style>
