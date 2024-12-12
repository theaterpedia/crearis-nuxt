<script lang="ts" setup>
import { onMounted, PropType, ref, watch, watchEffect } from 'vue'
import type { OklchColor, SfColorMapping } from '@crearis/theme/utils/colorSettings'

const props = defineProps({
  colorScales: {
    type: Array as PropType<OklchColor[]>,
    required: true,
  },
  cssVars: {
    type: Array as PropType<String[]>,
    required: true,
  },
})

const colors = ref('')
const vars = ref('')

onMounted(() => {
  // add a text-row for each colorScale
  watchEffect(() => {
    colors.value = props.colorScales
      .map((colorScale) => {
        return `{ name: '${colorScale.name}', hue: ${colorScale.hue}, light: ${colorScale.light}, chroma: ${colorScale.chroma} }`
      })
      .join(',<br />')
  })
})
</script>

<template>
  <div class="bg-muted mt-0 h-6 text-sm font-thin">
    <strong>colorScales</strong>
    <p v-html="colors" />
    <hr class="mt-6" />
    <strong>colorVars</strong>
    <p>
      --color-inverted: 1;
      <span v-for="(cssVar, index) in props.cssVars" :key="index" class="mt-0 block text-sm font-thin">
        {{ cssVar }}
        <br />
      </span>
    </p>
  </div>
</template>
