<script lang="ts" setup>
import type { InputHTMLAttributes, PropType } from 'vue'
import { computed, toRefs } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Array, Boolean] as PropType<InputHTMLAttributes['checked']>,
    default: false,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', param: InputHTMLAttributes['checked']): void
}>()

const { modelValue } = toRefs(props)

const proxyChecked = computed({
  get: () => modelValue?.value,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <input
    v-model="proxyChecked"
    data-testid="checkbox"
    type="checkbox"
    class="checked:bg-checked-checkbox-current checked:text-primary-700 indeterminate:bg-indeterminate-checkbox-current indeterminate:text-primary-700 hover:indeterminate:text-primary-800 enabled:checked:text-primary-700 enabled:indeterminate:text-primary-700 enabled:hover:border-primary-800 enabled:hover:checked:text-primary-800 enabled:hover:indeterminate:text-primary-800 enabled:focus-visible:outline-offset enabled:active:border-primary-900 enabled:active:checked:text-primary-900 h-[18px] min-w-[18px] cursor-pointer appearance-none rounded-sm border-2 border-current text-gray-500 hover:text-gray-300 enabled:focus-visible:outline disabled:cursor-not-allowed disabled:text-gray-300"
    :class="{
      'border-negative-700 enabled:hover:border-negative-800 enabled:active:border-negative-900 indeterminate:bg-none':
        invalid,
    }"
  />
</template>
