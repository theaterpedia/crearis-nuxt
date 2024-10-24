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
  <UiOverlay :visible="modelValue">
    <SfModal v-bind="{ ...$attrs, ...props }" class="md:max-h-[min(calc(100vh-32px),100%)]">
      <slot />
    </SfModal>
  </UiOverlay>
</template>
