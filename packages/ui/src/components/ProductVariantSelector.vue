<template>
  <div class="product-variant-selector">
    <div class="selector-scroll">
      <ProductVariantCard
        v-for="variant in variants"
        :key="variant.src"
        :shortcode="variant.shortcode"
        :subline="variant.subline"
        :price="variant.price"
        :is-active="modelValue === variant.src"
        @select="$emit('update:modelValue', variant.src)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import ProductVariantCard from './ProductVariantCard.vue'

/**
 * ProductVariantSelector - Horizontal scrolling variant selector for checkout
 *
 * Contains multiple ProductVariantCard components in a horizontally scrollable container.
 * Uses v-model pattern for selected variant.
 */

export interface ProductVariant {
  /** Variant shortcode (e.g., "M18W") */
  shortcode: string
  /** Variant label (e.g., "München") */
  subline: string
  /** Content source path (used as unique identifier) */
  src: string
  /** Optional price display */
  price?: string
}

defineProps({
  /**
   * Array of variant objects to display
   */
  variants: {
    type: Array as PropType<ProductVariant[]>,
    required: true,
  },
  /**
   * Currently selected variant src (v-model)
   */
  modelValue: {
    type: String,
    default: '',
  },
})

defineEmits<{
  /**
   * Emitted when a variant is selected
   */
  'update:modelValue': [src: string]
}>()
</script>

<style scoped>
.product-variant-selector {
  width: 100%;
  overflow: hidden;
}

.selector-scroll {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--color-muted-bg) transparent;
}

.selector-scroll::-webkit-scrollbar {
  height: 6px;
}

.selector-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.selector-scroll::-webkit-scrollbar-thumb {
  background: var(--color-muted-bg);
  border-radius: 3px;
}

.selector-scroll > * {
  flex-shrink: 0;
  scroll-snap-align: start;
}

/* Mobile: tighter gap */
@media (max-width: 767px) {
  .selector-scroll {
    gap: 0.5rem;
  }
}
</style>
