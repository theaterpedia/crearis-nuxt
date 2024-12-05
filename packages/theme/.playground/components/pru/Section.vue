<template>
  <Section overlap class="section">
    <Container style="margin-top: -52px">
      <Heading
        :content="heading"
        :is="is"
        class="bg-primary theme-shadow py-2"
        style="max-width: 600px; margin-left: -44px; padding-left: 44px"
      ></Heading>
    </Container>
    <Container class="mt-4">
      <slot>
        <div v-if="content" v-html="content"></div>
      </slot>
    </Container>
  </Section>
</template>

<script lang="ts" setup>
import { Container, Section } from '@crearis/ui'

const props = defineProps({
  /**
   * The heading tag to render.
   *
   * @default 'h2'
   */
  is: {
    type: [Object, String] as PropType<'h1' | 'h2' | 'h3' | 'span' | 'li'>,
    default: 'h2',
  },
  heading: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
})
</script>

<style scoped>
.theme-shadow {
  box-shadow: var(--theme-shadow);
}
.section {
  max-width: 90rem; /* 1440px */
  align-self: center;
}
</style>
