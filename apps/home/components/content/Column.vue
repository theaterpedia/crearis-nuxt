<template>
  <Column :fill="fill === 'true'">
    <ContentSlot />
  </Column>
</template>

<script lang="ts" setup>
import { Column } from '@crearis-nuxt/ui'

defineProps({
  /**
   * The color variant of the button.
   *
   * @default 'false'
   */
  fill: {
    type: String as PropType<'false' | 'true'>,
    default: 'false',
  },
})
</script>
