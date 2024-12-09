<script setup lang="ts">
import { colorVars, shades } from '@crearis/theme/utils/colorSettings'
import { onMounted, PropType, ref, watch, watchEffect } from 'vue'
import type { OklchScale, SfColorMapping } from '@crearis/theme/utils/colorSettings'
import { colorScales } from '../../theme';

const props = defineProps({
  colorScales: {
    type: Array as PropType<OklchScale[]>,
    required: true,
  },
  colorMap: {
    type: Array as PropType<SfColorMapping[]>,
    required: true,
  }
})

const colors = ref('')

onMounted(() => {
  // add a text-row for each colorScale
  watchEffect(() => {
    colors.value = props.colorScales.map((colorScale) => {
      return `{ ${colorScale.name}: hue: ${colorScale.hue}, scale: ${colorScale.scale}, greyval: ${colorScale.greyval} }`
    }).join(',<br />')
  })
})


</script>

<template>
  <div class="bg-muted mt-0 h-6 text-sm font-thin">
    <strong>colorScales</strong>
    <p v-html="colors" />
    <hr class="mt-6">     
    <strong>colorVars</strong>
    <p>
    <span
      v-for="([key, val], index) in Object.entries(colorVars(colorMap, colorScales))"
      :key="index"
      class="mt-0 block text-sm font-thin"
      >
      '{{ key }}': {{ val }},
      <br />
    </span>
    </p> 
  </div>
</template>