<template>
  <div class="banner" :class="{ 'banner-transparent': transparent }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  /**
   * Specifies whether the banner background is slightly transparent.
   */
  transparent: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.banner {
  --selection: var(--secondary);
  --selection-foreground: var(--secondary-foreground);
  padding: 1.5rem;
  background-color: hsl(var(--primary));
}

.banner-transparent {
  background-color: hsl(var(--primary) / 70%);
}

@media (max-width: 767px) {
  .banner {
    padding: 1rem;
  }
}
</style>
