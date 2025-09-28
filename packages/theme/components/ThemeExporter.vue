<script lang="ts" setup>
import { onMounted, PropType, ref, watch, watchEffect } from 'vue'
import type { OklchColor, SfColorMapping } from '@crearis/theme/utils/colorSettings'

const props = defineProps({
  /*colorScales: {
    type: Array as PropType<OklchColor[]>,
    required: true,
  },*/
  themeId: {
    type: Number,
    required: false,
  },
  themeConfig: {
    type: String,
    required: false,
  },
  tsVars: {
    type: Array as PropType<String[]>,
    required: true,
  },
})

const tsVarsStripped = ref(props.tsVars.map((v) => v.replace(/"/g, "'")))
// make it a string separated by linebreaks
const allVars = ref(tsVarsStripped.value.join('\n'))
const localThemeConfig = ref(props.themeConfig || '')
const localThemeId = ref(props.themeId || 1)

const colors = ref('')
</script>

<template>
  <div class="bg-muted mt-0 h-6 text-sm font-thin">
    <!--strong>colorScales</!--strong>
    <p v-html="colors" />
    <hr class="mt-6" />
    <strong>colorVars</strong -->
      <p></p>
      <Heading content="**Export to Site-Settings**Paste into settings" is="h2" />
      <p>
      ID: 
      <!-- make it an input-field-->
      <input type="text" v-model="localThemeId" />
      <br/>
      Config:
      <br/>
      <!-- print the config as input-field-->
       <textarea v-model="localThemeConfig" rows="20" class="w-full" spellcheck="false" />

      </p>
      <Heading content="**Export to Server**Paste settings into theme.ts" is="h2" />
      <p>
      <span class="mt-0 block text-sm font-thin">
        <!-- don't show spellchecking -->
        <textarea v-model="allVars" rows="20" class="w-full" spellcheck="false" />
        <br />
      </span>
    </p>
  </div>
</template>
