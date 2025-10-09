<script setup lang="ts">
/**
 * Theme Layer: SideContent wrapper
 * Re-exports SideContent from @crearis/ui for auto-import with Ui prefix
 */
import { SideContent } from '@crearis/ui'

defineProps<{
  placement?: 'left' | 'right'
}>()
</script>

<template>
  <SideContent :placement="placement">
    <slot />
  </SideContent>
</template>
