<template>
  <Section :background="background" :class="{ 'section-narrow': narrow, 'section-flush': flush }">
    <Container v-if="!narrow && !flush">
      <ContentSlot />
    </Container>
    <div v-else-if="narrow" class="narrow-container">
      <ContentSlot />
    </div>
    <div v-else>
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
  /**
   * Removes Container wrapper (no 44px horizontal padding).
   * Use when parent already provides containment.
   *
   * @default false
   */
  flush: {
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
