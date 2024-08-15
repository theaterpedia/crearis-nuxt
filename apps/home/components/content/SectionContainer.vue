<template>
  <Section :background="background">
    <Container>
      <ContentSlot />
    </Container>
  </Section>
</template>

<script lang="ts" setup>
import { Container, Section } from '@crearis-nuxt/ui'
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
