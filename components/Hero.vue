<template>
  <Hero :overlay="getoverlay(gradient_type, gradient_depth, backgroundCorrection)">
    <slot />
  </Hero>
</template>

<script lang="ts" setup>
import { Hero } from '@crearis/ui'
import { type PropType } from 'vue'

const props = defineProps({
  /**
   * Defines the height of the hero.
   *
   * @default 'none'
   */
  gradient_type: {
    type: String as PropType<'top' | 'left-top' | 'left' | 'left-bottom' | 'bottom' | 'none' | 'full'>,
    default: 'none',
  },
  /**
   * Defines the intensity of the gradient 0.00-1.00.
   *
   * @default 1.00
   */
  gradient_depth: {
    type: Number,
    default: 0.8,
  },
  /**
   * Background correction level for better text readability.
   * 0 or 'none': No correction
   * 1: Light correction (20% inverted color)
   * 2: Strong correction (40% inverted color)
   *
   * @default 'none'
   */
  backgroundCorrection: {
    type: [String, Number] as PropType<'none' | 0 | 1 | 2>,
    default: 'none',
  },
})

/**
 * Helper function to get the background correction color overlay
 */
const getCorrectionOverlay = (correction: 'none' | 0 | 1 | 2) => {
  return correction === 'none' || correction === 0
    ? ''
    : correction === 1
      ? 'linear-gradient(to bottom, oklch(from var(--color-bg) l c h / 0.2), oklch(from var(--color-bg) l c h / 0.2))'
      : correction === 2
        ? 'linear-gradient(to bottom, oklch(from var(--color-bg) l c h / 0.4), oklch(from var(--color-bg) l c h / 0.4))'
        : '' 
}

const getoverlay = (gradient: string, depth: number, correction: 'none' | 0 | 1 | 2) => {
  const deg =
    gradient && gradient !== 'none'
      ? gradient == 'left'
        ? '90deg'
        : gradient == 'left-bottom'
          ? '60deg'
          : gradient == 'left-top'
            ? '120deg'
            : gradient == 'right'
              ? '270deg'
              : gradient == 'bottom'
                ? '10deg'
                : gradient == 'top'
                  ? '170deg'
                  : ''
      : ''
  
  const gradientOverlay =
    gradient && gradient !== 'none'
      ? gradient !== 'full'
        ? `linear-gradient(${deg}, rgba(255, 193, 7, ${depth}) 18%, rgba(255, 255, 255, 0.62) 50%, rgba(255, 255, 255, 0.10) 81%)`
        : ''
      : ''
  
  const correctionOverlay = getCorrectionOverlay(correction)
  
  // Return ternary: if both exist, combine them; otherwise return whichever exists
  /* return gradientOverlay && correctionOverlay
    ? `${gradientOverlay}, ${correctionOverlay}`
    : gradientOverlay || correctionOverlay */
  return correctionOverlay
}
</script>
