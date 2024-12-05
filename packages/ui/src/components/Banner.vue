<template>
  <div
    :class="{
      'banner': !card,
      'banner-transparent': transparent && !card,
      'card-transparent': transparent && card,
      'card': card,
    }"
  >
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

  /**
   * for usage outside of pageHero (cards ...)
   */
  card: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.banner {
  --selection: var(--color-secondary-base);
  --selection-foreground: var(--color-secondary-contrast);
  padding: 1.5rem;
  background-color: hsl(var(--color-primary-base));
}

.card {
  --selection: var(--color-primary-base);
  --selection-foreground: var(--color-primary-contrast);
  padding: 1.5rem;
  background-color: hsl(var(--color-base));
}

.banner-transparent {
  background-color: hsl(var(--primary) / 70%);
}

.card-transparent {
  background-color: hsl(var(--color-base) / 70%);
}

@media (max-width: 767px) {
  .banner {
    padding: 1rem;
  }
}
</style>
