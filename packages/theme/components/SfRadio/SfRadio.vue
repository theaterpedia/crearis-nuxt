<script lang="ts" setup>
import { computed, toRefs } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: '',
  },
  invalid: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const { modelValue } = toRefs(props)
const proxyChecked = computed({
  get: () => modelValue.value,
  set: (val) => {
    emit('update:modelValue', val)
  },
})
</script>
<template>
  <input
    v-model="proxyChecked"
    :disabled="disabled"
    :name="name"
    :value="value"
    type="radio"
    :class="[
      'focus-visible:outline-offset disabled:border-disabled-500 disabled:checked:border-disabled-500 disabled:checked:bg-disabled-500 h-5 w-5 cursor-pointer appearance-none rounded-full border-2 bg-clip-content p-[3px] focus-visible:outline disabled:cursor-not-allowed',
      invalid && !disabled
        ? 'border-negative-700 checked:bg-negative-700 hover:border-negative-800 hover:checked:bg-negative-800 active:border-negative-900 active:checked:bg-negative-900'
        : 'checked:border-primary-700 checked:bg-primary-700 hover:border-primary-700 hover:checked:border-primary-800 hover:checked:bg-primary-800 active:border-primary-900 active:checked:border-primary-900 active:checked:bg-primary-900 border-neutral-500',
    ]"
  />
</template>
