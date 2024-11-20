<template>
  <div
    class="columns"
    :class="[
      `columns-${gap}`,
      `columns-${align}`,
      `columns-${background ?? 'transparent'}`,
      wrap ? 'columns-wrap' : null,
      stackReverse ? 'columns-stack-reverse' : null,
    ]"
  >
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

  /**
   * Whether to wrap the columns.
   *
   * @default true
   */
  wrap: {
    type: Boolean,
    default: true,
  },

  /**
   * Specifies whether to reverse the stacking order of the column on smaller screens.
   */
  stackReverse: {
    type: Boolean,
    default: false,
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
  --column-padding: 0;
  display: flex;
}

.columns-default {
  --background: var(--card-base);
  --foreground: var(--card-foreground);
  background-color: hsl(var(--card-base));
  color: hsl(var(--card-foreground));
}

.columns-muted {
  --background: var(--muted-base);
  --foreground: var(--card-foreground);
  background-color: hsl(var(--muted-base));
  color: hsl(var(--card-foreground));
}

.columns-accent {
  --background: var(--accent-base);
  --foreground: var(--accent-foreground);
  --muted-foreground: var(--accent-foreground);
  --link: var(--primary-base);
  background-color: hsl(var(--accent-base));
  color: hsl(var(--accent-foreground));
}

.columns-small {
  gap: 1.75rem; /* 28px */
}

.columns-small:not(.columns-transparent) {
  --column-padding: 1.75rem; /* 28px */
}

.columns-medium {
  gap: 3.5rem; /* 56px */
}

.columns-medium:not(.columns-transparent) {
  --column-padding: 3.5rem; /* 56px */
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

.columns-wrap {
  flex-wrap: wrap;
}

@media (max-width: 767px) {
  .columns {
    flex-direction: column;
    gap: 1.75rem; /* 28px */
  }

  .columns-stack-reverse {
    flex-direction: column-reverse;
  }
}
</style>
