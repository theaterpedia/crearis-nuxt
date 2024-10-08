<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
/* Todo: 
- make the content immediately available, fix SSR (first tab only?)
- merge components/content/tabs into this component
- integrate section + container + background-prop
- optionally make tab-component obsolete (inject the functionality into dataview-compenents)
- fix design-issues (Line above shortcode, <br> after heading)
*/

defineProps({
  /**
   *
   */
  title: {
    type: String,
    required: true,
  },
})
</script>
