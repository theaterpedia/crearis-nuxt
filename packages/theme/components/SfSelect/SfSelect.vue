<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>
<script lang="ts" setup>
import { type PropType, computed } from 'vue'
import { SfSelectSize } from './types'
import { useDisclosure } from '../../composables/useDisclosure'
import { useFocusVisible } from '../../composables/useFocusVisible'

const props = defineProps({
  size: {
    type: String as PropType<`${SfSelectSize}`>,
    default: SfSelectSize.base,
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: '',
  },
  wrapperClassName: {
    type: String,
    default: '',
  },
})
const emit = defineEmits<{
  (event: 'update:modelValue', param: string): void
}>()

const { isOpen, close, open } = useDisclosure()
const { isFocusVisible } = useFocusVisible()

const modelProxy = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
</script>

<template>
  <span
    data-testid="select"
    :class="[
      'relative flex flex-col rounded-md',
      {
        'focus-within:outline-offset focus-within:outline': isFocusVisible,
      },
      wrapperClassName,
    ]"
  >
    <select
      v-bind="$attrs"
      v-model="modelProxy"
      :disabled="disabled"
      :required="required"
      @blur="close"
      @change="close"
      @click="open"
      @keydown.space="open"
      data-testid="select-input"
      :class="[
        'hover:ring-primary-700 focus:ring-primary-700 active:ring-primary-700 disabled:bg-disabled-100 disabled:text-disabled-900 disabled:ring-disabled-200 cursor-pointer appearance-none rounded-md bg-transparent pl-4 pr-3.5 text-neutral-900 outline-none ring-1 ring-inset ring-neutral-300 focus:ring-2 active:ring-2 disabled:cursor-not-allowed',
        {
          'py-1.5': size === SfSelectSize.sm,
          'py-2': size === SfSelectSize.base,
          'py-3 text-base': size === SfSelectSize.lg,
          '!ring-negative-700 ring-2': invalid && !disabled,
        },
      ]"
    >
      <option
        v-if="placeholder"
        data-testid="select-placeholder"
        disabled
        hidden
        value=""
        class="bg-neutral-300 text-sm"
        :class="[
          'bg-neutral-300 text-sm',
          {
            'text-base': size === SfSelectSize.lg,
          },
        ]"
      >
        {{ placeholder }}
      </option>
      <slot />
    </select>
    <slot name="chevron">
      <SfIconExpandMore
        :class="[
          'easy-in-out duration-0.5 pointer-events-none absolute right-4 top-1/3 -translate-y-1 transition',
          disabled ? 'text-disabled-500' : 'text-neutral-500',
          isOpen ? 'rotate-180' : '',
        ]"
      />
    </slot>
  </span>
</template>
