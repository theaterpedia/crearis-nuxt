<script setup lang="ts">
/**
 * Theme Layer: AlertBanner wrapper
 * Re-exports AlertBanner from @crearis/ui for auto-import with Ui prefix
 */
import { AlertBanner } from '@crearis/ui'

defineProps<{
  alertType?: 'info' | 'positive' | 'secondary' | 'warning' | 'negative'
}>()
</script>

<template>
  <AlertBanner :alertType="alertType">
    <slot />
  </AlertBanner>
</template>
