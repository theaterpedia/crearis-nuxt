<template>
  <Section :background="background" :class="{ 'section-narrow': narrow }">
    <Container v-if="!narrow">
      <ContentSlot />
    </Container>
    <div v-else class="narrow-container">
      <ContentSlot />
    </div>
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
   * Reduces vertical padding for tighter stacking (e.g., timeline cards).
   * Also removes Container wrapper since parent provides horizontal containment.
   *
   * @default false
   */
  narrow: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.section-narrow {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.narrow-container {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
