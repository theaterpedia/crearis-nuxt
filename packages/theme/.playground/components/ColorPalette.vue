<script lang="ts" setup>
import type { OklchColor, ColorShades, SfColorMapping, BaseColors } from '@crearis/theme/utils/colorSettings'
import { onMounted, PropType, ref, watch } from 'vue'
import { palette, getOklchColor, generateAllPalettes, shades } from '@crearis/theme/utils/colorSettings'

const baseColors = defineModel('baseColors', {
  type: Object as PropType<BaseColors>,
  required: true,
})

const inverted = defineModel('inverted', {
  type: Boolean,
  required: true,
})

const colormap = defineModel('colormap', {
  type: Array as PropType<SfColorMapping[]>,
  required: true,
})
</script>

<template>
  <div class="color-palette">
    <Columns>
      <Column>
        <Heading content="**Theme-Farben** Brand, Primary, Secondary" is="h3" />
        <ColorControlCollection v-model="baseColors" showHead />
        <div class="bg-muted mt-0 flex h-6">
          <div class="mx-2 min-w-24">Shades</div>
          <div v-for="(shade, index) in shades" :key="index" class="grow px-2">{{ shade }}</div>
        </div>
        <div v-for="(color, key) in baseColors" :key="key" class="flex flex-row" style="margin-top: 4px">
          <div class="mx-2 min-w-24" :style="`background-color: ${palette(color, inverted ? '1' : '0').DEFAULT}`">
            {{ key }}
          </div>
          <div
            v-for="(value, key) in palette(`oklch(${color})`, inverted ? '1' : '0')"
            :key="key"
            class="grow"
            :style="`background-color: ${value}`"
          ></div>
        </div>
      </Column>
      <Column>
        <ColorMapperCollection v-model="colormap" />
      </Column>
    </Columns>
  </div>
</template>
