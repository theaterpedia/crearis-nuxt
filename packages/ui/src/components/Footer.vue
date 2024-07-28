<template>
  <div class="footer">
    <div class="footer-inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.footer {
  --background: var(--accent);
  --foreground: var(--accent-foreground);
  --muted-foreground: var(--accent-foreground);
  --link: var(--primary);
  width: 100%;
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
}

.footer-inner {
  max-width: 90rem; /* 1440px */
  margin: 0 auto;
  padding: 1.75rem; /* 28px */
}
</style>
