<template>
  <div>
    <div class="tabs">
      <ul>
        <li v-for="tab in tabs" key="tab.src" class="is-active">
          <a v-text="tab.title"></a>
        </li>
      </ul>
    </div>
    <div class="tab-content">
      <div v-for="tab in tabs" key="tab.src" class="tab-pane">
        <DataView :heading="tab.heading ? tab.heading : null" :src="tab.src" :type="tab.type" :view="tab.view" is-active></DataView>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/* Todo: 
- could use the beforeParseExtension to extract the dataviewtabs from the callout-body and have them available via props
- we do not need prose-tabs > they are NOT supported in Obsidian quite well
- setup user-interaction tabs > tab-content
- transform tabs>li>a>heading to proper html
*/

import { Container, Section } from '@crearis-nuxt/ui'

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
