<template>
  <div class="slide swiper-slide">
    <div class="slide-inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.slide {
  --color-bg: var(--color-primary-bg);
  --color-contrast: var(--color-primary-contrast);
  --color-muted-contrast: var(--color-primary-contrast);
  --link: var(--color-primary-contrast);
  --selection: var(--color-secondary-bg);
  --selection-foreground: var(--color-secondary-contrast);
  width: 100%;
  padding: 0 4.5rem;
}

.slide:not(:last-child) {
  margin-right: 1.75rem; /* 28px */
}

.slide-inner {
  padding: 1.125rem; /* 18px */
  background-color: var(--color-primary-bg);
  pointer-events: auto;
}

@media (max-width: 1023px) {
  .slide {
    padding: 0;
  }
}
</style>
