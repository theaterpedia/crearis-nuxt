<template>
  <div class="background">
    <ContentRenderer :value="data">
      <Heading is="h2" :content="data.heading ? data.heading.toString() : default_heading" v-if="data.heading"></Heading>
      
    </ContentRenderer>
  </div>
</template>

<script lang="ts" setup>
/* This belongs to the DataView + DataViewTab component
- it should NOT be availabe in the component-spec
*/

/* Todo: 
- create simple product view based on file: /content/agenda/einstiege-ins-theaterspiel-m16e.md  
- take data in from yaml:items (view:product)
- product is a course > so the product view should be a course view > we take the slider>slides for now
*/

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

</script>
