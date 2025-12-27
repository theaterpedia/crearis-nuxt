<script setup lang="ts">
/**
 * Theme Layer: Button wrapper
 * Re-exports Button from @crearis/ui for auto-import with Ui prefix
 */
import { Button } from '@crearis/ui'

defineProps<{
  size?: 'small' | 'medium'
  variant?: 'primary' | 'link' | 'plain'
}>()
</script>

<template>
  <Button :size="size" :variant="variant">
    <slot />
  </Button>
</template>
