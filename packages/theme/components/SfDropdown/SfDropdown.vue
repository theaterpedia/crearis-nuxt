<script lang="ts" setup>
import { type PropType, toRefs } from 'vue'
import type { Middleware } from '@floating-ui/vue'
import { type SfPopoverPlacement, type SfPopoverStrategy } from '../../utils/PopoverTypes'
import { useDropdown } from '../../composables/useDropdown'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
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
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { modelValue, placement, middleware, strategy } = toRefs(props)
const {
  referenceRef,
  floatingRef,
  style: dropdownStyle,
} = useDropdown({
  isOpen: modelValue,
  placement,
  middleware,
  strategy,
  onClose: () => emit('update:modelValue', false),
})
</script>
<template>
  <div data-testid="dropdown" ref="referenceRef" class="w-max">
    <slot name="trigger" />
    <div
      v-if="modelValue"
      :aria-hidden="!modelValue || undefined"
      data-testid="dropdown-content"
      ref="floatingRef"
      :style="dropdownStyle"
    >
      <slot />
    </div>
  </div>
</template>
