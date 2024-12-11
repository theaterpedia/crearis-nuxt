<script lang="ts" setup>
import type { OklchColor, ColorShades, SfColorMapping } from '@crearis/theme/utils/colorSettings'
import { onMounted, PropType, ref, watch } from 'vue'
import { palette, getOklchColor, generateAllPalettes, shades } from '@crearis/theme/utils/colorSettings'

const brandColors = defineModel<OklchColor[]>('brand', {
  type: Array as PropType<OklchColor[]>,
  required: true,
})
const basisColors = defineModel<OklchColor[]>('basis', {
  type: Array as PropType<OklchColor[]>,
  required: true,
})
const neutralColors = defineModel<OklchColor[]>('neutral', {
  type: Array as PropType<OklchColor[]>,
  required: true,
})

const colormap = defineModel<SfColorMapping[]>('colormap', {
  type: Array as PropType<SfColorMapping[]>,
  required: true,
})

const pPalette = ref<ColorShades>()
const sPalette = ref<ColorShades>()
const posPalette = ref<ColorShades>()
const negPalette = ref<ColorShades>()
const warnPalette = ref<ColorShades>()
const neutralPalette = ref<ColorShades>()

onMounted(() => {
  // for every color in brandColors, basisColors, neutralColors create palette-array and push to colors
  if (neutralColors.value.length < 1 || basisColors.value.length < 3 || brandColors.value.length < 2) {
    return
  }
  pPalette.value = palette(getOklchColor(brandColors.value[0]), '1')
  sPalette.value = palette(getOklchColor(brandColors.value[1]), '1')
  posPalette.value = palette(getOklchColor(basisColors.value[1]), '1')
  negPalette.value = palette(getOklchColor(basisColors.value[0]), '1')
  warnPalette.value = palette(getOklchColor(basisColors.value[2]), '1')
  neutralPalette.value = palette(getOklchColor(neutralColors.value[0]), '1')


  watch([neutralColors, basisColors, brandColors], (newColors) => {
    // same as above
    if (neutralColors.value.length < 1 || basisColors.value.length < 3 || brandColors.value.length < 2) {
      return
    }
    pPalette.value = palette(getOklchColor(brandColors.value[0]), '1')
    sPalette.value = palette(getOklchColor(brandColors.value[1]), '1')
    posPalette.value = palette(getOklchColor(basisColors.value[1]), '1')
    negPalette.value = palette(getOklchColor(basisColors.value[2]), '1')
    warnPalette.value = palette(getOklchColor(basisColors.value[0]), '1')
    neutralPalette.value = palette(getOklchColor(neutralColors.value[0]), '1')
  })
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
        <div class="flex flex-row">
          <div :style="`background-color: ${pPalette?.DEFAULT}`" class="mx-2 min-w-24">Primary</div>
          <div
            v-for="(value, key) in pPalette"
            :key="key"
            class="grow"
            :style="`background-color: ${value}`"
          >
          </div>
        </div>
        <div class="flex flex-row">
          <div :style="`background-color: ${sPalette?.DEFAULT}`" class="mx-2 min-w-24">Secondary</div>
          <div
            v-for="(value, key) in sPalette"
            :key="key"
            class="grow"
            :style="`background-color: ${value}`"
          >
          </div>
        </div>  
        <div class="flex flex-row">
          <div :style="`background-color: ${warnPalette?.DEFAULT}`" class="mx-2 min-w-24">Warning</div>
          <div
            v-for="(value, key) in warnPalette"
            :key="key"
            class="grow"
            :style="`background-color: ${value}`"
          >
          </div>
        </div>         
        <div class="flex flex-row">
          <div :style="`background-color: ${posPalette?.DEFAULT}`" class="mx-2 min-w-24">Positive</div>
          <div
            v-for="(value, key) in posPalette"
            :key="key"
            class="grow"
            :style="`background-color: ${value}`"
          >
          </div>
        </div> 
        <div class="flex flex-row">
          <div :style="`background-color: ${negPalette?.DEFAULT}`" class="mx-2 min-w-24">Negative</div>
          <div
            v-for="(value, key) in negPalette"
            :key="key"
            class="grow"
            :style="`background-color: ${value}`"
          >
          </div>
        </div>   
        <div class="flex flex-row">
          <div :style="`background-color: ${neutralPalette?.DEFAULT}`" class="mx-2 min-w-24">Neutral</div>
          <div
            v-for="(value, key) in neutralPalette"
            :key="key"
            class="grow"
            :style="`background-color: ${value}`"
          >
          </div>
        </div>                                        
      
      </Column>
      <Column>
        <ColorMapperCollection v-model="colormap" />
      </Column>
    </Columns>
  </div>
</template>
