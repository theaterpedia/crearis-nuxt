<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, toRefs } from 'vue'
import { SfCounterSize } from './types'

const props = defineProps({
  size: {
    type: String as PropType<`${SfCounterSize}`>,
    default: SfCounterSize.base,
  },
  pill: {
    type: Boolean,
    default: false,
  },
})
const { size, pill } = toRefs(props)

const sizeClasses = computed(() => {
  switch (size?.value) {
    case SfCounterSize['3xs']:
      return ['text-3xs', { 'px-1': pill.value }]
    case SfCounterSize['2xs']:
      return ['text-2xs', { 'px-1.5': pill.value }]
    case SfCounterSize.xs:
      return ['text-xs', { 'px-2': pill.value }]
    case SfCounterSize.sm:
      return ['text-sm', { 'px-2.5': pill.value }]
    case SfCounterSize.lg:
      return ['text-lg', { 'px-3.5': pill.value }]
    default:
      return ['text-base', { 'px-3': pill.value }]
  }
})
</script>

<template>
  <span
    data-testid="counter"
    class="inline-flex items-center text-neutral-500 before:content-['('] after:content-[')']"
    :class="[
      sizeClasses,
      {
        'rounded-full py-0.5 font-medium ring-1 ring-inset ring-neutral-200 before:content-none after:content-none':
          pill,
      },
    ]"
  >
    <slot />
  </span>
</template>
