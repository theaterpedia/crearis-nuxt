<script setup lang="ts">
/**
 * Theme Layer: Prose wrapper
 * Re-exports Prose from @crearis/ui for auto-import with Ui prefix
 */
import { Prose } from '@crearis/ui'
</script>

<template>
  <Prose>
    <slot />
  </Prose>
</template>
