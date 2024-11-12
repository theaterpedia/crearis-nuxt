<template>
  <div class="footer">
    <Container>
      <div class="footer-inner">
        <slot />
      </div>
    </Container>
  </div>
</template>

<script lang="ts" setup>
import Container from './Container.vue'
</script>

<style scoped>
.footer {
  --background: var(--accent-base);
  --foreground: var(--accent-foreground);
  --muted-foreground: var(--accent-foreground);
  --link: var(--primary-base);
  width: 100%;
  background-color: hsl(var(--accent-base));
  color: hsl(var(--accent-foreground));
}

.footer-inner {
  display: flex;
  padding: 1.75rem 0; /* 28px */
  gap: 1rem;
  font-size: 0.875rem;
}

.footer-inner > :deep() * {
  flex: 1;
}

.footer-inner > :deep() :first-child:not(:last-child) {
  max-width: 16.375rem; /* 262px */
}

.footer-inner > :deep() ul {
  max-width: 16.25rem; /* 260px */
}

.footer-inner > :deep() ul li + li {
  margin-top: 0.375rem;
}

.footer-inner > :deep() ul li a {
  transition: var(--transition);
  transition-property: color;
}

.footer-inner > :deep() ul li a:hover,
.footer-inner > :deep() ul li a:focus {
  color: hsl(var(--link));
}

.footer-inner > :deep() :last-child:not(:first-child) {
  text-align: right;
}

@media (max-width: 767px) {
  .footer-inner {
    flex-direction: column;
    gap: 1.75rem;
    padding: 1rem 0;
  }

  .footer-inner > :deep() :last-child:not(:first-child) {
    text-align: left;
  }
}
</style>
