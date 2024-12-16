<template>
  <div
    v-if="visible"
    data-testid="overlay"
    class="fixed bottom-0 left-0 right-0 top-0 z-50 h-full w-full bg-neutral-500/50"
  >
    <slot />
  </div>
</template>
<script lang="ts" setup>
export interface OverlayProps {
  visible?: boolean
}

defineProps<OverlayProps>()
</script>
