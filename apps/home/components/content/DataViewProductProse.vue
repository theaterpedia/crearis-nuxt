<template>
  <div class="background">
    <ContentRenderer :value="data">
      <Heading is="h3" :content="heading ? heading : data.heading ? data.heading.toString() : default_heading" v-if="data.heading"></Heading>
      <Prose>
        {{ content }}
      </Prose>
    </ContentRenderer>
  </div>
</template>

<script lang="ts" setup>
/* This should work but it DOES NOT, see Issue #35
*/


import { Container, Section } from '@crearis-nuxt/ui'
import { renderMdProp } from '~/utils/md-renderer'
const props = defineProps({
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
   * typically undefined (if defined it overwrites the heading-entry of the src)
   */
   heading: {
    type: String as PropType<'default' | 'muted' | 'accent'>,
  },    
  /**
   *
   *
   * @default 'default'
   */
  type: {
    type: String as PropType<'yaml' | 'md' | 'all'>,
    default: 'yaml',
  },
  /**
   *
   *
   * @default 'default'
   */
  data: {
    type: Object as PropType<Record<string, unknown>>,
    required: true,
  },
})

const default_heading = '## Default Heading'
const content = renderMdProp(props.data.product?.header, 'h2')

</script>
