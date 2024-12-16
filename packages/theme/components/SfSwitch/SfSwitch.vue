<script lang="ts" setup>
import { type InputHTMLAttributes, type PropType, toRefs, computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Array, Boolean] as PropType<InputHTMLAttributes['checked']>,
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

const { modelValue } = toRefs(props)
const emit = defineEmits<{
  (event: 'update:modelValue', param: InputHTMLAttributes['checked']): void
}>()

const switchRef = ref()
const proxyChecked = computed({
  get: () => modelValue?.value,
  set: (value) => emit('update:modelValue', value),
})
</script>

<!-- switchRef?.checked is used instead of model because model is value collection of multiple inputs, we need to have this one input check value -->
<template>
  <input
    v-model="proxyChecked"
    :aria-checked="switchRef?.checked"
    :value="value"
    data-testid="switch"
    ref="switchRef"
    role="switch"
    type="checkbox"
    :class="[
      `checked:border-primary-700 checked:bg-primary-700 hover:border-primary-800 hover:before:bg-primary-800 hover:checked:border-primary-800 hover:checked:bg-primary-800 focus-visible:outline-offset active:border-primary-800 active:before:bg-primary-800 relative h-5 min-w-[36px] cursor-pointer appearance-none rounded-full border-2 border-gray-500 bg-transparent duration-300 ease-in-out before:absolute before:bottom-0 before:left-0 before:top-0 before:my-auto before:ml-0.5 before:h-3.5 before:w-3.5 before:rounded-full before:bg-gray-500 before:transition-all before:duration-300 before:ease-in-out checked:bg-none checked:before:left-1/2 checked:before:ml-0 checked:before:mr-0.5 checked:before:bg-white hover:before:checked:bg-white focus-visible:outline disabled:cursor-not-allowed disabled:border-gray-500/50 disabled:before:bg-gray-500/50 checked:disabled:border-0 checked:disabled:bg-gray-500/50 checked:disabled:before:bg-white`,
      {
        'border-negative-700 before:bg-negative-900 hover:border-negative-800 active:border-negative-900': invalid,
      },
    ]"
  />
</template>
