<template>
  <ContentQuery :path="src" find="one" v-slot="{ data }">
    <Component :heading="heading" :data="data" :is="`data-view-${view}`"/>
  </ContentQuery>
</template>

<script lang="ts" setup>
/*
can be both used as PageComponent or as a TabComponent
*/

/* Todo: 
- decide on background-color-strategy
  - it could be done via section if we are on level 0
  - or it is set on the dataview itself (same for the tabs)
- implement query-logic here (and forward data to dataviewproduct/dataviewdetails)
- template part has to be implemented, based on component:is syntax 
- view-product + view-details has to be implemented
- query-logic has to be implemented
- template part has to be implemented, based on component:is syntax 
- view-product + view-details has to be implemented
*/

// import { DataViewDetails } from './DataViewDetails.vue' // not needed?
// import { DataViewProduct } from './DataViewProduct.vue' // not needed?

defineProps({
  /**
   * This is only needed visually, it stores data for the tabs-selectors if the component is used inside tabs
   * it should render prose headings as tab-headings (using the 'as' h4 prop)
   */
  title: {
    type: String,
  },
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
  view: {
    type: String as PropType<'product' | 'details'>,
    default: 'product',
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
