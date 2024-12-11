<script lang="ts" setup>
import { should } from 'vitest'
import type { OklchColor } from '@crearis/theme/utils/colorSettings'
import { onMounted, PropType } from 'vue'

defineProps({
  /**
   * The color palette to display.
   */
  showHead: {
    type: Boolean,
    default: false,
  },
})

const colors = defineModel<OklchColor[]>({
  type: Array as PropType<OklchColor[]>,
  default: [],
})

const updateColor = (color: OklchColor) => {
  const index = colors.value.findIndex((c) => c.name === color.name)
  if (index === -1) return
  const newColors = [...colors.value]
  newColors[index] = color
  colors.value = newColors
}
</script>

<template>
  <div class="color-palette__colors">
    <ColorControl
      v-for="(color, index) in colors"
      :chroma="color.chroma"
      :hue="color.hue"
      :key="index"
      :name="color.name"
      :light="color.light"
      :showHead="index === 0 && showHead"
      @update:chroma="updateColor({ name: color.name, hue: color.hue, light: color.light, chroma: $event })"
      @update:hue="updateColor({ name: color.name, hue: $event, light: color.light, chroma: color.chroma })"
      @update:light="updateColor({ name: color.name, hue: color.hue, light: $event, chroma: color.chroma })"
    />
  </div>
</template>
