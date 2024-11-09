<script lang="ts">
export default {
  inheritAttrs: false,
}
const getSizeClasses = {
  [SfInputSize.sm]: ' h-[32px]',
  [SfInputSize.base]: 'h-[40px]',
  [SfInputSize.lg]: 'h-[48px]',
}
</script>

<script lang="ts" setup>
import type { PropType, ConcreteComponent } from 'vue'
import { computed, ref, toRefs } from 'vue'
import { SfInputSize } from '@storefront-ui/shared'
import { useFocusVisible } from '../../composables/useFocusVisible'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  wrapperTag: {
    type: [String, Object] as PropType<string | ConcreteComponent>,
    default: 'span',
  },
  size: {
    type: String as PropType<`${SfInputSize}`>,
    default: SfInputSize.base,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  wrapperClass: {
    type: [String, Object],
    default: '',
  },
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number): void
}>()
const { modelValue, invalid } = toRefs(props)
const { isFocusVisible } = useFocusVisible({ isTextInput: true })

/*
Internal state has been implemented due to useFocusVisible and how it works. Main reason is that
it captures native HTMLElement.prototype.focus method. It makes value disappear under certain circumstances,
so it's important to keep it here, or to always pass modelValue to the component.
*/
const internalState = ref<string | number>()
const inputValue = computed({
  get: () => modelValue.value ?? internalState.value,
  set: (value) => {
    emit('update:modelValue', value)
    internalState.value = value
  },
})
</script>

<template>
  <component
    :is="wrapperTag"
    data-testid="input"
    :class="[
      'flex items-center gap-2 rounded-md bg-white px-4 text-neutral-500 ring-1 focus-within:caret-primary-700 focus-within:ring-2 focus-within:ring-primary-700 hover:ring-primary-700 active:caret-primary-700 active:ring-2 active:ring-primary-700',
      {
        'ring-2 ring-negative-700': invalid,
        'ring-1 ring-neutral-200': !invalid,
        'focus-within:outline focus-within:outline-offset': isFocusVisible,
      },
      getSizeClasses[size],
      wrapperClass,
    ]"
  >
    <slot name="prefix" />
    <input
      v-bind="$attrs"
      v-model="inputValue"
      :size="1"
      data-testid="input-field"
      class="w-full min-w-[80px] appearance-none text-base text-neutral-900 outline-none read-only:bg-transparent disabled:cursor-not-allowed disabled:bg-transparent"
    />
    <slot name="suffix" />
  </component>
</template>
