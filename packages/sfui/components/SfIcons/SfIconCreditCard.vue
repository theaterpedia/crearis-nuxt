<template>
  <SfIconBase :size="size" viewBox="0 0 24 24" data-testid="credit-card"
    ><path
      d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2Zm0 14H4v-6h16v6Zm0-10H4V6h16v2Z"
  /></SfIconBase>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import { SfIconSize } from './types';
import { SfIconBase } from '../SfIconBase';

defineProps({
  size: {
    type: String as PropType<`${SfIconSize}`>,
    default: SfIconSize.base,
  },
});
</script>
