<script setup lang="ts">
import type { OklchColor, Palette } from '../utils/ColorSettings'
import { onMounted, PropType, ref, watch } from 'vue'
import { generateAllPalettes } from '../utils/ColorSettings';

const neutralColors = defineModel<OklchColor[]>('neutral', {
  type: Array as PropType<OklchColor[]>,
  required: true
})
const basisColors = defineModel<OklchColor[]>('basis', {
  type: Array as PropType<OklchColor[]>,
    required: true
})
const brandColors = defineModel<OklchColor[]>('brand', {
  type: Array as PropType<OklchColor[]>,
  required: true
})

const colors = ref<OklchColor[]>([])

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
        <Heading is="h3" content="**Systempalette** Hintergründe & Graustile" />
        <ColorControlCollection showHead v-model="neutralColors" />
        <Heading is="h3" content="**Basispalette** Basisfarben & Post-Its" />
        <ColorControlCollection v-model="basisColors" />
        <Heading is="h3" content="**Theme-Farben** Brand, Primary, Secondary" />
        <ColorControlCollection v-model="brandColors" />        
      </Column>
      <Column>
        <div class='flex h-8' v-for="{name, palette} in palettes">
          <div class='w-full mr-4'>{{name}}</div>
          <div class='w-full grow' :style="`background-color: ${color}`" v-for="color, index in palette" :key="index"></div>
        </div>
      </Column>
    </Columns>  
  </div>
</template>