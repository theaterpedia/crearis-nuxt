<template>
  <div class="box" :class="{ 
    'box-centered': layout === 'centered',
    'box-fullwidth-padding': layout === 'full-width' && fullwidthPadding
  }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  /**
   * Specifies the layout of the box.
   *
   * @default 'centered'
   */
  layout: {
    type: String as PropType<'centered' | 'full-width'>,
    default: 'centered',
  },
  /**
   * Controls whether padding is applied in full-width mode.
   * Only applies when layout is 'full-width'.
   *
   * @default true
   */
  fullwidthPadding: {
    type: Boolean,
    default: true,
  },
})
</script>

<style scoped>
.box {
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.box-centered {
  max-width: 90rem; /* 1440px */
  margin: 0 auto;
}

/* Full-width layout padding (only when enabled) */
.box-fullwidth-padding {
  padding: 0 1rem;
}

@media (min-width: 1024px) {
  .box-fullwidth-padding {
    padding: 0 2rem;
  }
}

@media (max-width: 1023px) {
  .box-centered {
    flex-direction: column;
  }
}
</style>
