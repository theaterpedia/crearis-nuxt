<script setup lang="ts">
/**
 * Theme Layer: Container wrapper
 * Re-exports Container from @crearis/ui for auto-import with Ui prefix
 */
import { Container } from '@crearis/ui'
</script>

<template>
  <Container>
    <slot />
  </Container>
</template>
