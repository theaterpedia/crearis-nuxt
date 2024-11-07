<script lang="ts">
const sizeClasses = {
  [SfLoaderLinearSize.minimal]: 'h-1',
  [SfLoaderSize.xs]: 'h-4',
  [SfLoaderSize.sm]: 'h-5',
  [SfLoaderSize.base]: 'h-6',
  [SfLoaderSize.lg]: 'h-7',
  [SfLoaderSize.xl]: 'h-10',
  [SfLoaderSize['2xl']]: 'h-14',
  [SfLoaderSize['3xl']]: 'h-24',
  [SfLoaderSize['4xl']]: 'h-48',
}
</script>

<script lang="ts" setup>
import { type PropType } from 'vue'
import { SfLoaderLinearSize, SfLoaderSize } from './types'

defineProps({
  size: {
    type: String as PropType<`${SfLoaderLinearSize | SfLoaderSize}`>,
    default: SfLoaderSize.base,
  },
  ariaLabel: {
    type: String,
    default: 'loading',
  },
})
</script>

<template>
  <span
    :aria-label="ariaLabel"
    aria-live="polite"
    data-testid="loader-linear"
    class="relative inline-block overflow-hidden bg-neutral-300 text-primary-700 after:absolute after:block after:h-full after:w-2.5 after:animate-line after:bg-current"
    :class="sizeClasses[size]"
  />
</template>
