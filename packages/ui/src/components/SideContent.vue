<template>
  <aside class="side-content" :class="`side-content-${placement}`">
    <slot />
  </aside>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

defineProps({
  /**
   * Specifies the placement of the side content.
   * 
   * - `right`: Side content appears on the right side (default)
   * - `left`: Side content appears on the left side
   * 
   * @default 'right'
   */
  placement: {
    type: String as PropType<'left' | 'right'>,
    default: 'right',
  },
})
</script>

<style scoped>
.side-content {
  width: 100%;
  flex-shrink: 0;
  background-color: var(--color-muted-bg);
}

/* Tablet: Shrink sidebars to 300px max */
@media (min-width: 1024px) and (max-width: 1279px) {
  .side-content {
    width: 18.75rem; /* 300px total width including padding */
    padding: 0 1rem;
    align-self: stretch;
  }
}

/* Desktop: Full sidebar width at 1280px+ */
@media (min-width: 1280px) {
  .side-content {
    width: 23.625rem; /* 378px content width */
    padding: 0 1rem; /* Only left-right padding: Total width: 23.625rem + 2rem padding = 25.625rem (410px) */
    align-self: stretch; /* Fill the entire available height */
  }
}

/* Mobile styling */
@media (max-width: 1023px) {
  .side-content {
    padding: 0 1.5rem; /* Only left-right padding to match Container */
  }
}

@media (max-width: 767px) {
  .side-content {
    padding: 0 1rem; /* Only left-right padding to match Container on smaller mobile */
  }
}

/* Placement: right is default */
.side-content-right {
  order: 2;
}

/* Placement: left should come before main content on desktop */
.side-content-left {
  order: 0;
}

/* On mobile: Left sidebar has lowest priority (comes last) */
@media (max-width: 1023px) {
  .side-content-right {
    order: 2; /* Right sidebar comes after main content */
  }
  
  .side-content-left {
    order: 3; /* Left sidebar comes last (lowest priority) */
  }
}
</style>
