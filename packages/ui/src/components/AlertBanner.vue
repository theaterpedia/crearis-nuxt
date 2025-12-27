<template>
  <div v-if="!dismissed" class="alert-banner" :class="`alert-banner-${alertType}`">
    <Container>
      <div class="alert-banner-content">
        <Prose>
          <slot />
        </Prose>
        <button class="alert-banner-close" @click="dismiss" aria-label="Close alert">
          <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
            ></path>
          </svg>
        </button>
      </div>
    </Container>
  </div>
</template>

<script lang="ts" setup>
import { ref, type PropType } from 'vue'
import Container from './Container.vue'
import Prose from './Prose.vue'

defineProps({
  /**
   * Defines the color theme of the alert banner.
   *
   * @default 'primary'
   */
  alertType: {
    type: String as PropType<'primary' | 'secondary' | 'muted' | 'accent' | 'positive' | 'negative' | 'warning'>,
    default: 'primary',
  },
})

const dismissed = ref(false)

function dismiss() {
  dismissed.value = true
}
</script>

<style scoped>
.alert-banner {
  position: relative;
  width: 100%;
  padding: 1rem 0;
  z-index: 100;
}

.alert-banner-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.alert-banner-content :deep(.prose) {
  flex: 1;
  margin: 0;
}

.alert-banner-content :deep(.prose p) {
  margin: 0;
}

.alert-banner-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
  transition-property: background-color, opacity;
  opacity: 0.7;
}

.alert-banner-close:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

.alert-banner-close svg {
  width: 1.5rem;
  height: 1.5rem;
}

/* Color Themes */
.alert-banner-primary {
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
}

.alert-banner-primary :deep(*) {
  --color-bg: var(--color-primary-bg);
  --color-contrast: var(--color-primary-contrast);
  --color-muted-contrast: var(--color-primary-contrast);
}

.alert-banner-secondary {
  background-color: var(--color-secondary-bg);
  color: var(--color-secondary-contrast);
}

.alert-banner-secondary :deep(*) {
  --color-bg: var(--color-secondary-bg);
  --color-contrast: var(--color-secondary-contrast);
  --color-muted-contrast: var(--color-secondary-contrast);
}

.alert-banner-muted {
  background-color: var(--color-muted-bg);
  color: var(--color-muted-contrast);
}

.alert-banner-muted :deep(*) {
  --color-bg: var(--color-muted-bg);
  --color-contrast: var(--color-muted-contrast);
  --color-muted-contrast: var(--color-muted-contrast);
}

.alert-banner-accent {
  background-color: var(--color-accent-bg);
  color: var(--color-accent-contrast);
}

.alert-banner-accent :deep(*) {
  --color-bg: var(--color-accent-bg);
  --color-contrast: var(--color-accent-contrast);
  --color-muted-contrast: var(--color-accent-contrast);
}

.alert-banner-positive {
  background-color: var(--color-positive-bg);
  color: var(--color-positive-contrast);
}

.alert-banner-positive :deep(*) {
  --color-bg: var(--color-positive-bg);
  --color-contrast: var(--color-positive-contrast);
  --color-muted-contrast: var(--color-positive-contrast);
}

.alert-banner-negative {
  background-color: var(--color-negative-bg);
  color: var(--color-negative-contrast);
}

.alert-banner-negative :deep(*) {
  --color-bg: var(--color-negative-bg);
  --color-contrast: var(--color-negative-contrast);
  --color-muted-contrast: var(--color-negative-contrast);
}

.alert-banner-warning {
  background-color: var(--color-warning-bg);
  color: var(--color-warning-contrast);
}

.alert-banner-warning :deep(*) {
  --color-bg: var(--color-warning-bg);
  --color-contrast: var(--color-warning-contrast);
  --color-muted-contrast: var(--color-warning-contrast);
}

@media (max-width: 767px) {
  .alert-banner {
    padding: 0.75rem 0;
  }

  .alert-banner-content :deep(.prose) {
    font-size: 0.875rem;
  }
}
</style>
