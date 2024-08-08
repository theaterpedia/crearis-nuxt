<template>
  <div class="columns" :class="[`columns-${gap}`, `columns-${align}`, { [`columns-${background}`]: background }]">
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
    type: String as PropType<'small' | 'medium' | 'fit'>,
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

  /**
   * The background color of the columns.
   * This allows to render the columns as a box.
   * If this is not provided, the columns will be transparent.
   */
  background: {
    type: String as PropType<'default' | 'muted' | 'accent'>,
  },
})
</script>

<style scoped>
.columns {
  display: flex;
}

.columns-default {
  --background: var(--card);
  --foreground: var(--card-foreground);
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
}

.columns-muted {
  --background: var(--muted);
  --foreground: var(--card-foreground);
  background-color: hsl(var(--muted));
  color: hsl(var(--card-foreground));
}

.columns-accent {
  --background: var(--accent);
  --foreground: var(--accent-foreground);
  --muted-foreground: var(--accent-foreground);
  --link: var(--primary);
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
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
