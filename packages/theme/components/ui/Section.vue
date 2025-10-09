<script setup lang="ts">
/**
 * Theme Layer: Section wrapper
 * Re-exports Section from @crearis/ui for auto-import with Ui prefix
 */
import { Section } from '@crearis/ui'

defineProps<{
  background?: 'default' | 'muted' | 'primary' | 'secondary' | 'accent' | 'positive' | 'negative' | 'warning'
}>()
</script>

<template>
  <Section :background="background">
    <slot />
  </Section>
</template>
