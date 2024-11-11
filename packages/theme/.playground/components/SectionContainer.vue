<template>
  <Section :background="background">
    <Container>
      <slot />
    </Container>
  </Section>
</template>

<script lang="ts" setup>
import { Container, Section } from '@crearis/ui'
defineProps({
  /**
   * The background color of the section.
   *
   * @default 'default'
   */
  background: {
    type: String as PropType<'default' | 'muted' | 'accent'>,
    default: 'default',
  },
})
</script>
