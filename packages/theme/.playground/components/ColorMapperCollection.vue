<script lang="ts" setup>
import type { SfColorMapping } from '../utils/ColorSettings'
import { PropType } from 'vue'

const colormap = defineModel<SfColorMapping[]>({
  type: Array as PropType<SfColorMapping[]>,
  default: [],
})

const updateMapping = (color: SfColorMapping) => {
  const index = colormap.value.findIndex((c) => c.name === color.name)
  if (index === -1) return
  const newMap = [...colormap.value]
  newMap[index] = color
  colormap.value = newMap
}
</script>

<template>
  <div class="color-palette__colors">
    <ColorMapper
      v-for="(mapping, index) in colormap"
      :key="index"
      :name="mapping.name"
      :sfname="mapping.sfname"
      :shade="mapping.shade"
      :showHead="index === 0"
      @update:sfname="updateMapping({ name: mapping.name, sfname: $event, shade: mapping.shade })"
      @update:shade="updateMapping({ name: mapping.name, sfname: mapping.sfname, shade: $event })"
    />
  </div>
</template>
