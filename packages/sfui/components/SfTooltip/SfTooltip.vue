<script lang="ts" setup>
import { type PropType, toRefs } from 'vue'
import type { Middleware } from '@floating-ui/vue'
import { useTooltip } from '../../composables/useTooltip'
import { type SfPopoverPlacement, type SfPopoverStrategy } from '../../utils/PopoverTypes'

const props = defineProps({
  placement: {
    type: String as PropType<`${SfPopoverPlacement}` | undefined>,
    default: undefined,
  },
  middleware: {
    type: Array as PropType<Middleware[] | undefined>,
    default: undefined,
  },
  strategy: {
    type: String as PropType<`${SfPopoverStrategy}` | undefined>,
    default: undefined,
  },
  showArrow: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: true,
  },
})

const { placement, middleware, strategy } = toRefs(props)
const { isOpen, triggerProps, tooltipProps, arrowProps } = useTooltip({ placement, middleware, strategy })
</script>
<template>
  <span v-bind="triggerProps" data-testid="tooltip">
    <slot />
    <div
      v-if="label && isOpen"
      v-bind="tooltipProps"
      role="tooltip"
      class="w-max max-w-[360px] rounded-md bg-black px-2 py-1.5 text-xs text-white drop-shadow"
    >
      {{ label }}
      <span v-if="showArrow" v-bind="arrowProps" class="rotate-45 bg-black" />
    </div>
  </span>
</template>
