<template>
  <div :class="{ 'banner': !card, 'banner-transparent': transparent && !card, 'card-transparent': transparent && card, 'card': card,  }">
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

  card: {
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

.card {
  --selection: var(--primary);
  --selection-foreground: var(--primary-foreground);
  padding: 1.5rem;
  background-color: hsl(var(--background));
}

.banner-transparent {
  background-color: hsl(var(--primary) / 70%);
}

.card-transparent {
  background-color: hsl(var(--background) / 70%);
}

@media (max-width: 767px) {
  .banner {
    padding: 1rem;
  }
}
</style>
