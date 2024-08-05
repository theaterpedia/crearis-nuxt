<template>
  <component :is="is" class="section" :class="[`section-${background}`]">
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
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
}

.section-muted {
  background-color: hsl(var(--muted));
  color: hsl(var(--card-foreground));
}

.section-accent {
  --foreground: var(--accent-foreground);
  --muted-foreground: var(--accent-foreground);
  --link: var(--primary);
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}
</style>
