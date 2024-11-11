<script lang="ts">
const variantClasses = {
  [SfLinkVariant.primary]:
    'text-primary-700 underline hover:text-primary-800 active:text-primary-900 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm',
  [SfLinkVariant.secondary]:
    'underline hover:text-primary-800 active:text-primary-900 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm',
}
</script>

<script lang="ts" setup>
import type { PropType, ConcreteComponent } from 'vue'
import { SfLinkVariant } from './types'

defineProps({
  tag: {
    type: [String, Object] as PropType<string | ConcreteComponent>,
    default: 'a',
  },
  variant: {
    type: String as PropType<`${SfLinkVariant}`>,
    default: SfLinkVariant.primary,
  },
})
</script>

<template>
  <component
    :is="tag"
    data-testid="link"
    :class="['focus-visible:outline-offset focus-visible:rounded-sm focus-visible:outline', variantClasses[variant]]"
  >
    <slot />
  </component>
</template>
