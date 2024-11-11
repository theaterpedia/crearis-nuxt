<template>
  <Section overlap>
    <Container style="margin-top:-52px" >
        <Heading :is="is" style="max-width:600px; margin-left:-44px; padding-left: 44px" :content="heading" class="bg-primary-400 py-2" >

        </Heading>
    </Container>
    <Container class="mt-4" >
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
