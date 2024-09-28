<template>
  <ContentRenderer :value="data">
    <Heading is="h3" :content="heading ? heading : data.heading ? data.heading.toString() : default_heading" v-if="data.heading"></Heading>
    <br>
    <MdBlock htag="h2" :content="data.product?.header" v-if="data.product?.header" />
  </ContentRenderer>
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

const props = defineProps({
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

</script>
