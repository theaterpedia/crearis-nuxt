<script setup lang="ts">
/**
 * Theme Layer: Box wrapper
 * Re-exports Box from @crearis/ui for auto-import with Ui prefix
 */
import { Box } from '@crearis/ui'

defineProps<{
  layout?: 'centered' | 'full-width'
  fullwidthPadding?: boolean
}>()
</script>

<template>
  <Box :layout="layout" :fullwidthPadding="fullwidthPadding">
    <slot />
  </Box>
</template>
