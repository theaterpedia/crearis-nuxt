<template>
  <SfIconBase :size="size" data-testid="indeterminate-check-box" viewBox="0 0 24 24">
    <path
      clip-rule="evenodd"
      d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm14 7a1 1 0 0 1-1 1H8a1 1 0 1 1 0-2h8a1 1 0 0 1 1 1Z"
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
