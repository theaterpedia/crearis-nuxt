<template>
  <SfIconBase :size="size" data-testid="expand-less" viewBox="0 0 24 24">
    <path
      d="M17 15a.998.998 0 0 1-1.41 0l-3.885-3.875L7.82 15a.998.998 0 0 1-1.41-1.412l4.588-4.587a1 1 0 0 1 1.414 0L17 13.589A.998.998 0 0 1 17 15Z"
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
