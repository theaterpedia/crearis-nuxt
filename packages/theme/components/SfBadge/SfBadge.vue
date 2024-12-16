<script lang="ts" setup>
import { type PropType, computed } from 'vue'
import { SfBadgePlacement, SfBadgeVariant } from './types'

const props = defineProps({
  content: {
    type: [String, Number],
    default: '',
  },
  max: {
    type: Number,
    default: 99,
  },
  placement: {
    type: String as PropType<`${SfBadgePlacement}`>,
    default: SfBadgePlacement['top-right'],
  },
  variant: {
    type: String as PropType<`${SfBadgeVariant}`>,
    default: SfBadgeVariant.standard,
  },
})

const isDot = computed(() => props.variant === 'dot')
const displayValue = computed(() => {
  if (isDot.value) {
    return ''
  } else if (!Number.isNaN(props.content) && Number(props.content) > props.max) {
    return `${props.max}+`
  }
  return props.content
})
</script>

<template>
  <span
    data-testid="badge"
    :class="[
      'bg-secondary-700 absolute block rounded-xl px-1 py-0.5 text-[8px] font-medium leading-[8px] text-white',
      {
        'min-h-[12px] min-w-[12px]': !isDot,
        'h-[10px] w-[10px]': isDot,
        'right-0 top-0 -translate-x-0.5 translate-y-0.5': placement === 'top-right',
        'left-0 top-0 translate-x-0.5 translate-y-0.5': placement === 'top-left',
        'bottom-0 right-0 -translate-x-0.5 -translate-y-0.5': placement === 'bottom-right',
        'bottom-0 left-0 -translate-y-0.5 translate-x-0.5': placement === 'bottom-left',
      },
    ]"
  >
    {{ displayValue }}
  </span>
</template>
