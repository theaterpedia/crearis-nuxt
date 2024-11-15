<script lang="ts">
const sizeClasses = {
  [SfProgressSize.xs]: 'h-4 w-4 ring-2',
  [SfProgressSize.sm]: 'h-5 w-5 ring-2',
  [SfProgressSize.base]: 'h-6 w-6 ring-2',
  [SfProgressSize.lg]: 'h-8 w-8 ring-2',
  [SfProgressSize.xl]: 'h-10 w-10 ring-2',
  [SfProgressSize['2xl']]: 'h-14 w-14 ring-[3px]',
  [SfProgressSize['3xl']]: 'h-24 w-24 ring-4',
  [SfProgressSize['4xl']]: 'h-48 w-48 ring-8',
}
const strokeSizeClass = {
  [SfProgressSize.xs]: 'stroke-[10px]',
  [SfProgressSize.sm]: 'stroke-[8px]',
  [SfProgressSize.base]: 'stroke-[6px]',
  [SfProgressSize.lg]: 'stroke-[4px]',
  [SfProgressSize.xl]: 'stroke-[3px]',
  [SfProgressSize['2xl']]: 'stroke-[3px]',
  [SfProgressSize['3xl']]: 'stroke-2',
  [SfProgressSize['4xl']]: 'stroke-2',
}
</script>

<script lang="ts" setup>
import { computed, toRefs, type PropType } from 'vue'
import { SfProgressSize } from './types'

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  size: {
    type: String as PropType<`${SfProgressSize}`>,
    default: SfProgressSize.base,
  },
  ariaLabel: {
    type: String,
    default: 'Progress element',
  },
})
const { value } = toRefs(props)

const strokeDasharray = computed(() => `${(value.value / 100) * 151}, 150`)
</script>

<template>
  <svg
    :aria-label="ariaLabel"
    :aria-valuenow="value"
    :stroke-dasharray="strokeDasharray"
    aria-valuemax="100"
    aria-valuemin="0"
    data-testid="progress"
    role="progressbar"
    viewBox="25 25 50 50"
    class="text-primary-700 inline-block rounded-full text-sm ring-inset ring-neutral-300 transition-[stroke-dasharray] duration-500 ease-in-out"
    :class="sizeClasses[size]"
  >
    <circle
      cx="50"
      cy="50"
      r="24"
      class="-rotate-30 origin-bottom-right fill-none stroke-current"
      :class="strokeSizeClass[size]"
    />
    <slot />
  </svg>
</template>
