<script lang="ts" setup>
import { ClassProp } from '../../../utils'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  summaryClass: ClassProp,
})

defineEmits<{
  (event: 'update:modelValue', open: boolean): void
}>()
</script>

<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
<!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
<template>
  <details :open="modelValue" data-testid="accordion-item">
    <summary
      @click.prevent="$emit('update:modelValue', !modelValue)"
      :class="[
        summaryClass,
        'cursor-pointer list-none focus-visible:rounded-sm focus-visible:outline focus-visible:outline-offset [&::-webkit-details-marker]:hidden',
      ]"
    >
      <slot name="summary" />
    </summary>
    <slot />
  </details>
</template>
