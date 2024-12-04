<script setup lang="ts">
import { should } from 'vitest';
import type { OklchColor } from '../utils/ColorSettings'
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
        v-for="color, index in colors"
        :key="index"
        :showHead="index === 0 && showHead"
        :name="color.name"
        :hue="color.hue"
        :scale="color.scale"
        :greyval="color.greyval"
        @update:hue="updateColor({name: color.name, hue: $event, scale: color.scale, greyval: color.greyval})"
        @update:scale="updateColor({name: color.name, hue: color.hue, scale: $event, greyval: color.greyval})"
        @update:greyval="updateColor({name: color.name, hue: color.hue, scale: color.scale, greyval: $event})"
      />
    </div>
</template>