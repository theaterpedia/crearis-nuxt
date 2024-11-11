<script lang="ts">
const sizeClasses = {
  [SfChipSize.sm]: 'text-sm py-1.5 gap-1.5',
  [SfChipSize.base]: 'text-base py-2 gap-2',
}
</script>
<script lang="ts" setup>
import { type PropType, type InputHTMLAttributes } from 'vue'
import { toRefs, computed } from 'vue'
import { useSlotsRef, useId } from '../../utils'
import { SfChipSize } from './types'

const props = defineProps({
  size: {
    type: String as PropType<`${SfChipSize}`>,
    default: SfChipSize.base,
  },
  modelValue: {
    type: [String, Array, Boolean] as PropType<InputHTMLAttributes['checked']>,
    default: false,
  },
  inputProps: {
    type: Object as PropType<InputHTMLAttributes>,
    default: null,
  },
  square: {
    type: Boolean,
    default: false,
  },
})

const { size, square, modelValue } = toRefs(props)
const emit = defineEmits<{
  (event: 'update:modelValue', param: InputHTMLAttributes['checked']): void
}>()
const slots = useSlotsRef()
const inputId = useId()

const onSelected = computed({
  get: () => modelValue?.value,
  set: (value) => emit('update:modelValue', value),
})

const paddingForSize = computed(() => {
  switch (size.value) {
    case SfChipSize.sm:
      return square.value ? 'px-1.5' : [slots.value.prefix ? 'pl-1.5' : 'pl-3', slots.value.suffix ? 'pr-1.5' : 'pr-3']
    default:
      return square.value ? 'px-2' : [slots.value.prefix ? 'pl-2' : 'pl-4', slots.value.suffix ? 'pr-2' : 'pr-4']
  }
})
</script>

<template>
  <input
    v-bind="inputProps"
    v-model="onSelected"
    :id="inputId"
    type="checkbox"
    class="peer absolute w-0 appearance-none outline-none"
  />
  <label
    v-bind="$attrs"
    :for="inputId"
    data-testid="chip"
    :class="[
      'outline-secondary-600 hover:bg-primary-100 active:bg-primary-200 peer-next-checked:ring-2 peer-next-checked:ring-primary-700 peer-next-checked:hover:ring-primary-700 peer-next-checked:active:ring-primary-700 peer-next-hover:ring-primary-200 peer-next-focus-visible:outline peer-next-active:ring-primary-300 peer-next-disabled:cursor-not-allowed peer-next-disabled:bg-disabled-100 peer-next-disabled:opacity-50 peer-next-disabled:ring-1 peer-next-disabled:ring-disabled-200 peer-next-disabled:hover:ring-disabled-200 inline-flex cursor-pointer items-center justify-center rounded-full outline-offset-2 ring-1 ring-inset ring-neutral-200 transition duration-300',
      sizeClasses[size],
      paddingForSize,
    ]"
  >
    <slot v-if="$slots.prefix" name="prefix" />
    <slot />
    <slot v-if="$slots.suffix" name="suffix" />
  </label>
</template>
