<template>
  <div class="product-summary-box">
    <div class="product-summary-content">
      <div class="product-summary-header">
        <span v-if="overline" class="product-summary-overline">{{ overline }}</span>
        <h3 class="product-summary-title">{{ title }}</h3>
      </div>

      <div v-if="kosten" class="product-summary-kosten" v-html="kosten"></div>
      
      <slot />
    </div>

    <div class="product-summary-actions">
      <button
        v-if="ctaLabel"
        type="button"
        @click="$emit('cta-click')"
        class="product-summary-cta"
      >
        {{ ctaLabel }}
      </button>
      
      <a
        v-if="secondaryLabel && secondaryHref"
        :href="secondaryHref"
        class="product-summary-secondary"
        @click="$emit('secondary-click', $event)"
      >
        {{ secondaryLabel }}
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  /**
   * Optional overline text above the title.
   */
  overline: {
    type: String,
  },

  /**
   * Main title for the summary box.
   *
   * @default 'Kosten & Konditionen'
   */
  title: {
    type: String,
    default: 'Kosten & Konditionen',
  },

  /**
   * HTML content for the Kosten section (rendered from markdown).
   */
  kosten: {
    type: String,
  },

  /**
   * Label for the primary CTA button.
   *
   * @default 'Jetzt buchen'
   */
  ctaLabel: {
    type: String,
    default: 'Jetzt buchen',
  },

  /**
   * Label for the secondary link.
   */
  secondaryLabel: {
    type: String,
  },

  /**
   * Href for the secondary link.
   */
  secondaryHref: {
    type: String,
  },
})

defineEmits<{
  'cta-click': []
  'secondary-click': [event: MouseEvent]
}>()
</script>

<style scoped>
.product-summary-box {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  padding: 1.5rem;
  background-color: var(--color-bg);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px oklch(from var(--color-contrast) l c h / 10%);
}

.product-summary-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-summary-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-summary-overline {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: oklch(from var(--color-contrast) l c h / 60%);
}

.product-summary-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-contrast);
}

.product-summary-kosten {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-contrast);
}

.product-summary-kosten :deep(h3),
.product-summary-kosten :deep(h4) {
  margin: 0.75rem 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
}

.product-summary-kosten :deep(h3):first-child,
.product-summary-kosten :deep(h4):first-child {
  margin-top: 0;
}

.product-summary-kosten :deep(ul) {
  margin: 0;
  padding-left: 1.25rem;
}

.product-summary-kosten :deep(li) {
  margin-bottom: 0.25rem;
}

.product-summary-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 0.75rem;
}

.product-summary-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 10rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  transition-property: background-color, box-shadow;
}

.product-summary-cta:hover {
  background-color: oklch(from var(--color-primary-bg) calc(l - 0.05) c h);
}

.product-summary-cta:focus {
  outline: none;
  box-shadow: 0 0 0 0.125rem var(--color-ring);
}

.product-summary-secondary {
  font-size: 0.875rem;
  color: var(--color-primary-bg);
  text-decoration: underline;
  text-underline-offset: 0.125rem;
  transition: var(--transition);
  transition-property: color;
}

.product-summary-secondary:hover {
  color: oklch(from var(--color-primary-bg) calc(l - 0.1) c h);
}

@media (max-width: 767px) {
  .product-summary-box {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .product-summary-actions {
    align-items: stretch;
  }

  .product-summary-cta {
    width: 100%;
  }
}
</style>
