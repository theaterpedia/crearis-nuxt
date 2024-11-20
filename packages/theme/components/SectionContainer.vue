<template>
  <Section :background="background" :overlap="overlap">
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
  /**
   * The background color of the section.
   *
   * @default false
   */
  overlap: {
    type: Boolean,
    default: false,
  },
})
</script>
