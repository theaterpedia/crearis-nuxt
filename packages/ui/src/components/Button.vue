<template>
  <component :is="is" class="button" :class="[`button-${size}`, `button-${variant}`]">
    <span class="button-inner">
      <slot />
    </span>
  </component>
</template>

<script lang="ts" setup>
import type { Component, PropType } from 'vue'

defineProps({
  /**
   * A dynamic component or an HTML tag to render.
   * This is useful when rendering `<RouterLink>` or `<NuxtLink>` components.
   *
   * @default 'button'
   */
  is: {
    type: [Object, String] as PropType<'a' | 'button' | 'span' | Component>,
    default: 'button',
  },

  /**
   * The color variant of the button.
   *
   * @default 'primary'
   */
  variant: {
    type: String as PropType<'primary' | 'plain' | 'link'>,
    default: 'primary',
  },

  /**
   * The size of the button.
   *
   * @default 'medium'
   */
  size: {
    type: String as PropType<'small' | 'medium'>,
    default: 'medium',
  },
})
</script>

<style>
.button {
  flex-shrink: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  overflow: hidden;
  border: none;
  font-weight: 500;
  white-space: nowrap;
  text-decoration: none;
  transition: var(--transition);
  transition-property: background-color, color;
}

.button-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.button-primary:hover {
  background-color: hsl(var(--primary) / 70%);
}

.button-plain {
  background-color: hsl(var(--card-foreground));
  color: hsl(var(--card));
}

.button-plain:hover {
  background-color: hsl(var(--card-foreground) / 70%);
}

.button-link {
  color: hsl(var(--primary));
}

.button-link:hover {
  background-color: hsl(var(--card-foreground) / 30%);
}

.button-small {
  height: 2em;
  padding: 0 0.75em;
  font-size: 1em;
}

.button-medium {
  height: 2.5em;
  padding: 0 1.75em;
  font-size: 1.125em;
}

.button:disabled {
  pointer-events: none;
  opacity: 0.5;
}

.button-inner {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
