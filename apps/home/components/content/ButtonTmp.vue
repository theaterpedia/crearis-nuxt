<template>
  <Button :is="is" :to="computedTo" :size="size" :variant="variant">
    <ContentSlot unwrap="p" />
  </Button>
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components'
import { Button } from '@crearis/ui'
import { inject, computed } from 'vue'
import type { ComputedRef } from 'vue'

const detailsLink = inject<ComputedRef<string>>('detailsLink')

const props = defineProps({
  /**
   * A dynamic component or an HTML tag to render.
   * This is useful when rendering `<RouterLink>` or `<NuxtLink>` components.
   *
   * @default NuxtLink
   */
  is: {
    type: [Object, String] as PropType<'a' | 'button' | 'span' | Component>,
    default: NuxtLink,
  },

  /**
   * The link target. When toDetails is true, this is ignored.
   */
  to: {
    type: String,
  },

  /**
   * When true, uses the computed details/checkout link from layout.
   * Links to #buchen if present, otherwise /details?src={path}
   *
   * @default false
   */
  toDetails: {
    type: Boolean,
    default: false,
  },

  /**
   * The color variant of the button.
   *
   * @default 'primary'
   */
  variant: {
    type: String as PropType<'primary' | 'plain'>,
    default: 'primary',
  },

  /**
   * The size of the button.
   *
   * @default 'medium'
   */
  size: {
    type: String as PropType<'small' | 'medium'>,
    default: 'medium',
  },
})

// Use injected detailsLink when toDetails is true, otherwise use to prop
const computedTo = computed(() => {
  if (props.toDetails && detailsLink?.value) {
    return detailsLink.value
  }
  return props.to
})
</script>
