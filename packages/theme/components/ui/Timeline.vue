<script setup lang="ts">
/**
 * Theme Layer: Timeline wrapper
 * Re-exports Timeline from @crearis/ui for auto-import with Ui prefix
 */
import { Timeline } from '@crearis/ui'
</script>

<template>
  <Timeline>
    <slot />
  </Timeline>
</template>
