<template>
  <!-- Stepper mode: inline stepper with variant selector in header -->
  <StepperSection v-if="mode === 'stepper'" :tabs="tabs" />

  <!-- Default tabs mode: traditional tabbed interface -->
  <Tabs v-else>
    <Tab v-for="(tab, index) in tabs" :active="index === 0" :key="index" :title="tab.title">
      <DataView
        :heading="tab.heading"
        :src="tab.src"
        :type="tab.type"
        :view="tab.view"
        is-active
      ></DataView>
    </Tab>
  </Tabs>
</template>

<script lang="ts" setup>
/* Todo: 
- make the content immediately available, fix SSR (first tab only?)
- merge components/content/tabs into this component
- integrate section + container + background-prop
- optionally make tab-component obsolete (inject the functionality into dataview-compenents)
- fix design-issues (Line above shortcode, <br> after heading)
*/

import { type PropType } from 'vue'
import DataView from './DataView.vue'
import StepperSection from './StepperSection.vue'

/** Tab item structure from parseTabs() */
interface TabItem {
  title: string
  src: string
  heading?: string
  type?: string
  view?: 'product' | 'details'
  background?: 'default' | 'muted' | 'accent'
}

defineProps({
  /**
   * Rendering mode for tabs
   * - 'tabs' (default): Traditional tabbed interface
   * - 'stepper': Inline stepper with variant selector in header
   */
  mode: {
    type: String as PropType<'tabs' | 'stepper'>,
    default: 'tabs',
  },
  /**
   * Array of tab items from parseTabs()
   */
  tabs: {
    type: Array as PropType<TabItem[]>,
    required: true,
  },
})
</script>
