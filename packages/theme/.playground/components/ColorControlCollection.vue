<script lang="ts" setup>
import { should } from 'vitest'
import type { OklchScale } from '@crearis/theme/utils/colorSettings'
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

const colors = defineModel<OklchScale[]>({
  type: Array as PropType<OklchScale[]>,
  default: [],
})

const updateColor = (color: OklchScale) => {
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
      :greyval="color.greyval"
      :hue="color.hue"
      :key="index"
      :name="color.name"
      :scale="color.scale"
      :showHead="index === 0 && showHead"
      @update:greyval="updateColor({ name: color.name, hue: color.hue, scale: color.scale, greyval: $event })"
      @update:hue="updateColor({ name: color.name, hue: $event, scale: color.scale, greyval: color.greyval })"
      @update:scale="updateColor({ name: color.name, hue: color.hue, scale: $event, greyval: color.greyval })"
    />
  </div>
</template>
