<template>
  <SfIconBase :size="size" data-testid="info" viewBox="0 0 24 24">
    <path d="M13.25 8a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM11 16a1 1 0 1 0 2 0v-4a1 1 0 1 0-2 0v4Z" />
    <path
      clip-rule="evenodd"
      d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12Zm2 0c0 4.41 3.59 8 8 8s8-3.59 8-8-3.59-8-8-8-8 3.59-8 8Z"
      fill-rule="evenodd"
    />
  </SfIconBase>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'
import { SfIconSize } from './types'

defineProps({
  size: {
    type: String as PropType<`${SfIconSize}`>,
    default: SfIconSize.base,
  },
})
</script>
