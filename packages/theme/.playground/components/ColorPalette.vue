<script setup lang="ts">
import type { PaletteColor } from '../utils/ColorSettings'
import { PropType } from 'vue'

defineEmits<{
  'update:colors': [colors: PaletteColor[]]
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

/* is this valid?
const updateColor = (color: PaletteColor) => {
  const index = props.colors.findIndex((c) => c.name === color.name)
  if (index === -1) return

  const newColors = [...props.colors]
  newColors[index] = color

  emit('update:colors', newColors)
} */

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
    <ShowPalette />
  </div>
</template>