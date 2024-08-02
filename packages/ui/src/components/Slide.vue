<template>
  <div class="slide swiper-slide">
    <div class="slide-inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.slide {
  --background: var(--primary);
  --foreground: var(--primary-foreground);
  --muted-foreground: var(--primary-foreground);
  --link: var(--primary-foreground);
  --selection: var(--secondary);
  --selection-foreground: var(--secondary-foreground);
  width: 100%;
  padding: 0 4.5rem;
}

.slide:not(:last-child) {
  margin-right: 1.75rem; /* 28px */
}

.slide-inner {
  padding: 1.125rem; /* 18px */
  background-color: hsl(var(--primary));
  pointer-events: auto;
}

@media (max-width: 1023px) {
  .slide {
    padding: 0;
  }
}
</style>
