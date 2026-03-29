<template>
  <button
    class="product-variant-card"
    :class="[
      { active: isActive },
      sublineClass
    ]"
    type="button"
    @click="$emit('select')"
  >
    <div class="card-top">
      <span class="shortcode">{{ shortcode }}</span>
    </div>
    <div class="card-separator"></div>
    <div class="card-bottom">
      <span class="subline" :style="sublineStyle">{{ subline }}</span>
      <span v-if="price" class="price">{{ price }}</span>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

/**
 * ProductVariantCard - Mini-card for variant selection in checkout
 *
 * Design: 16:9 aspect ratio, 66/33 vertical split
 * - Top 66%: Primary fill (active) or neutral-100 (inactive), BIG shortcode
 * - Yellow 2px separator line
 * - Bottom 33%: White background, smaller subline + optional price
 *
 * Responsive subline handling:
 * - >18 chars: 16:8 aspect ratio, condensed font, minimal padding
 * - >24 chars: additional 20% font size reduction
 */

const props = defineProps({
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

// Determine subline length class for responsive styling
const sublineClass = computed(() => {
  const len = props.subline.length
  if (len > 24) return 'subline-long'
  if (len > 20) return 'subline-medium'
  return ''
})

// Inline style for font-size when subline is long
const sublineStyle = computed(() => {
  if (props.subline.length > 24) {
    return { fontSize: '0.7rem' }
  }
  return {}
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
  padding: 0.25rem 0.125rem;
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

/* Medium subline (>20 chars): wider card, condensed font */
.product-variant-card.subline-medium {
  aspect-ratio: 16 / 8;
}

.product-variant-card.subline-medium .subline {
  font-stretch: condensed;
  letter-spacing: -0.02em;
}

/* Long subline (>24 chars): same as medium + smaller font */
.product-variant-card.subline-long {
  aspect-ratio: 16 / 8;
}

.product-variant-card.subline-long .subline {
  font-stretch: condensed;
  letter-spacing: -0.02em;
}

/* Mobile: scale down ~25-30%, use 16:10 aspect ratio */
@media (max-width: 767px) {
  .product-variant-card {
    min-width: 100px;
    aspect-ratio: 16 / 10;
  }

  .shortcode {
    font-size: 1.1rem;
  }

  .subline {
    font-size: 0.7rem;
  }

  .price {
    font-size: 0.6rem;
  }

  .card-separator {
    height: 1.5px;
  }

  /* Medium subline on mobile: keep same as base mobile */
  .product-variant-card.subline-medium {
    aspect-ratio: 16 / 10;
  }

  /* Long subline on mobile: constrain width to force 2-line wrap */
  .product-variant-card.subline-long {
    aspect-ratio: 16 / 10;
    max-width: 115px;
  }

  .product-variant-card.subline-long .card-top {
    flex: 1; /* 50% */
  }

  .product-variant-card.subline-long .card-bottom {
    flex: 1; /* 50% */
    padding-top: 0;
    padding-bottom: 0;
  }

  .product-variant-card.subline-long .subline {
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-size: 0.65rem !important; /* Override inline style, ~7% smaller */
    line-height: 1.1;
    width: 100%; /* Force width constraint so text wraps */
  }
}
</style>
