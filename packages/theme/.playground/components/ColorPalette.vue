<script setup lang="ts">
import type { OklchScale, SfColorMapping } from '../utils/ColorSettings'
import { onMounted, PropType, ref, watch } from 'vue'
import { generateAllPalettes, shades } from '../utils/ColorSettings';

const brandColors = defineModel<OklchScale[]>('brand', {
  type: Array as PropType<OklchScale[]>,
  required: true
})
const basisColors = defineModel<OklchScale[]>('basis', {
  type: Array as PropType<OklchScale[]>,
    required: true
})
const neutralColors = defineModel<OklchScale[]>('neutral', {
  type: Array as PropType<OklchScale[]>,
  required: true
})


const colormap = defineModel<SfColorMapping[]>('colormap', {
  type: Array as PropType<SfColorMapping[]>,
  required: true
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
        <Heading is="h3" content="**Theme-Farben** Brand, Primary, Secondary" />
        <ColorControlCollection showHead v-model="brandColors" />
        <p>Post-Its & Generalfarben</p>
        <ColorControlCollection v-model="basisColors" />
        <p>Hintergründe & Graustile</p>
        <ColorControlCollection v-model="neutralColors" />
        <div class='bg-muted flex h-6 mt-0'>
          <div class='min-w-24 mx-2'>Shades</div>
          <div class='grow px-2' v-for="shade, index in shades" :key="index">{{ shade }}</div>
        </div>
        <div style="margin-top: 4px" class='flex h-8 mt-0' v-for="{name, palette}, index in palettes" :key="index" >
          <div class='min-w-24 mx-2'>{{name}}</div>
          <div class='grow' :class="{'text-accent-contrast': index > 6}" :style="`background-color: ${color}`" v-for="color, index in palette" :key="index"></div>
        </div>
      </Column>
      <Column>

        <ColorMapperCollection v-model="colormap" />   
        <template style="margin-top: 4px" class='flex h-8 mt-0' v-for="{name, palette}, index in palettes" :key="index">
          <p class="text-sm font-thin" v-for="color, index in palette" :key="index">--color-{{ name }}-{{ shades[index] }}: {{ color }}</p>
        </template>

      </Column>
    </Columns>  
  </div>
</template>