<template>
  <Hero :overlay="getoverlay(gradient_type, gradient_depth)">
    <ContentSlot />
  </Hero>
</template>

<script lang="ts" setup>
import { Hero } from '@crearis-nuxt/ui'
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
})

const getoverlay = (gradient: string, depth: number) => {
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
  return gradient && gradient !== 'none'
    ? gradient !== 'full'
      ? `linear-gradient(${deg}, rgba(255, 193, 7, ${depth}) 18%, rgba(255, 255, 255, 0.62) 50%, rgba(255, 255, 255, 0.10) 81%)`
      : ''
    : ''
}
</script>
