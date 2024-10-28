<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>
<script lang="ts" setup>
import { SfModal } from '@crearis/vue'

const props = defineProps<{
  modelValue?: boolean
  tag?: string
  disableClickAway?: boolean
  disableEsc?: boolean
}>()
</script>

<template>
  <div>
    <h2>Modal</h2>
      <slot />
  </div>
</template>
