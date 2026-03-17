<template>
  <button
    class="product-variant-card"
    :class="{ active: isActive }"
    type="button"
    @click="$emit('select')"
  >
    <div class="card-top">
      <span class="shortcode">{{ shortcode }}</span>
    </div>
    <div class="card-separator"></div>
    <div class="card-bottom">
      <span class="subline">{{ subline }}</span>
      <span v-if="price" class="price">{{ price }}</span>
    </div>
  </button>
</template>

<script lang="ts" setup>
/**
 * ProductVariantCard - Mini-card for variant selection in checkout
 *
 * Design: 16:9 aspect ratio, 66/33 vertical split
 * - Top 66%: Primary fill (active) or neutral-100 (inactive), BIG shortcode
 * - Yellow 2px separator line
 * - Bottom 33%: White background, smaller subline + optional price
 */

defineProps({
  /**
   * The variant shortcode (e.g., "M18W")
   * Displayed prominently in the top section
   */
  shortcode: {
    type: String,
    required: true,
  },
  /**
   * The variant label/subline (e.g., "München")
   * Displayed in the bottom section
   */
  subline: {
    type: String,
    required: true,
  },
  /**
   * Whether this variant is currently selected
   * Controls active styling (primary fill, border)
   */
  isActive: {
    type: Boolean,
    default: false,
  },
  /**
   * Optional price display (e.g., "1.234,00 €")
   */
  price: {
    type: String,
    default: undefined,
  },
})

defineEmits<{
  /**
   * Emitted when the card is clicked
   */
  select: []
}>()
</script>

<style scoped>
.product-variant-card {
  display: flex;
  flex-direction: column;
  min-width: 140px;
  aspect-ratio: 16 / 9;
  border: 1px solid var(--color-border);
  border-radius: 0;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  background: transparent;
  padding: 0;
  font-family: inherit;
}

.product-variant-card:hover:not(.active) {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-variant-card.active {
  border: 2px solid var(--color-primary-base);
  box-shadow: none;
}

.card-top {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-muted-bg);
  transition: background 0.2s ease;
}

.product-variant-card.active .card-top {
  background: var(--color-primary-base);
}

.shortcode {
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-contrast);
  letter-spacing: 0.05em;
}

.card-separator {
  height: 2px;
  background: var(--color-primary-base);
  flex-shrink: 0;
}

.card-bottom {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-card-bg);
  padding: 0.25rem 0.5rem;
  gap: 0.125rem;
}

.subline {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-contrast);
  text-align: center;
  line-height: 1.2;
}

.price {
  font-size: 0.75rem;
  color: var(--color-dimmed);
}
</style>
