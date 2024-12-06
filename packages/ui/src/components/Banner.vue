<template>
  <div
    :class="{
      banner: !card,
      transparent: transparent,
      card: card,
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
  background-color: oklch(var(--color-primary-base));
}

.banner.transparent {
  background-color: oklch(var(--color-primary-base) / 70%);
}

.card {
  --selection: var(--color-primary-base);
  --selection-foreground: var(--color-primary-contrast);
  padding: 1.5rem;
  background-color: oklch(var(--color-base));
}

.card.transparent {
  background-color: oklch(var(--color-base) / 70%);
}

@media (max-width: 767px) {
  .banner {
    padding: 1rem;
  }
}
</style>
