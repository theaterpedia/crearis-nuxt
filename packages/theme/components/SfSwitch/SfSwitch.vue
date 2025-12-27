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
    class="switch-input relative h-5 min-w-[36px] cursor-pointer appearance-none rounded-full border-2 bg-transparent duration-300 ease-in-out before:absolute before:bottom-0 before:left-0 before:top-0 before:my-auto before:ml-0.5 before:h-3.5 before:w-3.5 before:rounded-full before:transition-all before:duration-300 before:ease-in-out checked:bg-none checked:before:left-1/2 checked:before:ml-0 checked:before:mr-0.5 focus-visible:outline-offset focus-visible:outline disabled:cursor-not-allowed"
    :style="{
      borderColor: invalid ? 'var(--color-negative-bg)' : 'var(--color-ring)',
      '--switch-checked-bg': 'var(--color-primary-bg)',
      '--switch-checked-border': 'var(--color-primary-bg)',
      '--switch-thumb-bg': 'var(--color-ring)',
      '--switch-thumb-checked-bg': 'var(--color-bg)',
      '--switch-disabled-opacity': '0.5',
    }"
  />
</template>

<style scoped>
.switch-input::before {
  background-color: var(--switch-thumb-bg);
}
.switch-input:checked::before {
  background-color: var(--switch-thumb-checked-bg);
}
.switch-input:checked {
  background-color: var(--switch-checked-bg);
  border-color: var(--switch-checked-border);
}
.switch-input:disabled {
  opacity: var(--switch-disabled-opacity);
}
.switch-input:checked:disabled {
  border-width: 0;
}
</style>
