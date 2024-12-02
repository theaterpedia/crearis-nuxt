<script setup lang="ts">
import type { PaletteColor } from '../utils/ColorSettings'
import { onMounted, PropType, ref } from 'vue'
import { generateAllPalettes } from '../utils/ColorSettings';

defineEmits<{
  'update:colors': [colors: PaletteColor[]]
  'update:palettes': []
}>()

const props = defineProps({
  /**
   * The color palette to display.
   */
  colors: {
    type: Array as PropType<PaletteColor[]>,
    required: true,
  },
})

const palettes = ref([])

if (props.colors.length) {
  palettes.value = generateAllPalettes(props.colors)
}

/* is this needed?
const updateColor = (color: PaletteColor) => {
  const index = props.colors.findIndex((c) => c.name === color.name)
  if (index === -1) return

  const newColors = [...props.colors]
  newColors[index] = color

  emit('update:colors', newColors)
}
  */

</script>

<template>
  <div class="color-palette">
    <div class="color-palette__colors">
      <ColorControl
        v-for="color in colors"
        :key="color.name"
        :name="color.name"
        :hue="color.hue"
        :scale="color.scale"
      />
    </div>
    <div class='flex h-8' v-for="{name, palette} in palettes">
      <div class='w-full mr-4'>{{name}}</div>
      <div class='w-full grow' :style="`background-color: ${color}`" v-for="color, index in palette" :key="index"></div>
    </div>
  </div>
</template>