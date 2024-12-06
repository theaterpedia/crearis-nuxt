<script lang="ts" setup>
import type { OklchScale, SfColorMapping } from '@crearis/theme/utils/colorSettings'
import { onMounted, PropType, ref, watch } from 'vue'
import { generateAllPalettes, shades } from '@crearis/theme/utils/colorSettings'

const brandColors = defineModel<OklchScale[]>('brand', {
  type: Array as PropType<OklchScale[]>,
  required: true,
})
const basisColors = defineModel<OklchScale[]>('basis', {
  type: Array as PropType<OklchScale[]>,
  required: true,
})
const neutralColors = defineModel<OklchScale[]>('neutral', {
  type: Array as PropType<OklchScale[]>,
  required: true,
})

const colormap = defineModel<SfColorMapping[]>('colormap', {
  type: Array as PropType<SfColorMapping[]>,
  required: true,
})

const colors = ref<OklchScale[]>([])

const palettes = ref([])
onMounted(() => {
  colors.value.push(...neutralColors.value, ...basisColors.value, ...brandColors.value)
  palettes.value = generateAllPalettes(colors.value)
  watch([neutralColors, basisColors, brandColors], (newColors) => {
    colors.value = []
    colors.value.push(...neutralColors.value, ...basisColors.value, ...brandColors.value)
    palettes.value = generateAllPalettes(colors.value)
  })
  /*
  watch(palettes, (newPalettes) => {
    emit('update:palettes', newPalettes)
  })  */
})
</script>

<template>
  <div class="color-palette">
    <Columns>
      <Column>
        <Heading content="**Theme-Farben** Brand, Primary, Secondary" is="h3" />
        <ColorControlCollection v-model="brandColors" showHead />
        <p>Post-Its & Generalfarben</p>
        <ColorControlCollection v-model="basisColors" />
        <p>Hintergründe & Graustile</p>
        <ColorControlCollection v-model="neutralColors" />
        <div class="bg-muted mt-0 flex h-6">
          <div class="mx-2 min-w-24">Shades</div>
          <div v-for="(shade, index) in shades" :key="index" class="grow px-2">{{ shade }}</div>
        </div>
        <div v-for="({ name, palette }, index) in palettes" :key="index" class="mt-0 flex h-8" style="margin-top: 4px">
          <div class="mx-2 min-w-24">{{ name }}</div>
          <div
            v-for="(color, index) in palette"
            :key="index"
            class="grow"
            :class="{ 'text-accent-contrast': index > 6 }"
            :style="`background-color: ${color}`"
          ></div>
        </div>
      </Column>
      <Column>
        <ColorMapperCollection v-model="colormap" />
      </Column>
    </Columns>
  </div>
</template>
