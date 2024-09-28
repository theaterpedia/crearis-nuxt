<template>
  <Tabs>
    <Tab v-for="(tab, index) in tabs" key="tab.src" :active="index === 0" :title="tab.title">
      <DataView :heading="tab.heading ? tab.heading : null" :src="tab.src" :type="tab.type" :view="tab.view" is-active></DataView>
    </Tab>
  </Tabs>
</template>

<script lang="ts" setup>
/* Todo: 
- make the content immediately available, fix SSR (first tab only?)
- merge components/content/tabs into this component
- integrate section + container + background-prop
- optionally make tab-component obsolete (inject the functionality into dataview-compenents)
- fix design-issues (Line above shortcode, )
*/

import DataView from './DataView.vue'
import type { ExtractPropTypes } from 'vue'
defineProps({
  /**
   *
   */
  tabs: {
    type: Array as PropType<(typeof DataView)[]>,
    required: true,
  },
})
</script>
