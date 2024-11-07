<script lang="ts">
const getSizeClasses = {
  [SfTextareaSize.sm]: ' h-[56px] py-[6px] pl-4 pr-3',
  [SfTextareaSize.base]: 'h-[64px] py-2 pl-4 pr-3',
  [SfTextareaSize.lg]: 'h-[72px], p-3 pl-4',
}
</script>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, toRefs } from 'vue'
import { SfTextareaSize } from './types'
import { useFocusVisible } from '../../composables/useFocusVisible'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  size: {
    type: String as PropType<`${SfTextareaSize}`>,
    default: SfTextareaSize.base,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number): void
}>()
const { modelValue } = toRefs(props)
const { isFocusVisible } = useFocusVisible({ isTextInput: true })

const textareaValue = computed({
  get: () => modelValue?.value,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <textarea
    v-model="textareaValue"
    data-testid="textarea"
    :class="[
      'rounded-md bg-white px-4 text-neutral-900 outline-none ring-inset hover:ring-primary-800 focus:caret-primary-700 focus:ring-2 focus:ring-primary-700 active:caret-primary-700 active:ring-2 active:ring-primary-700',
      {
        'ring-2 ring-negative-700': invalid,
        'ring-1 ring-neutral-200': !invalid,
        'focus:outline focus:outline-offset': isFocusVisible,
      },
      getSizeClasses[size],
    ]"
  />
</template>
