<template>
  <div class="background"></div>
</template>

<script lang="ts" setup>
/* This belongs to the DataView + DataViewTab component
- it should not be availabe in the spec
*/

/* Todo: 
- create simple stepper view based on file: /content/agenda/einstiege-ins-theaterspiel-m16e.md  
- take data it from yaml:items (view:details)
- product is a course > so the stepper creates list views and summaries, refererence-Implementation of the catalog-component here
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
  src: {
    type: String,
    required: true,
  },
})
</script>
