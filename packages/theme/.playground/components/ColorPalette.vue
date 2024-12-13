<script lang="ts" setup>
import type { SfColorMapping, BaseColors } from '@crearis/theme/utils/colorSettings'
import { PropType } from 'vue'
import { palette, shades } from '@crearis/theme/utils/colorSettings'

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
        <div class="bg-muted flex max-w-40 flex-row">
          <SfSwitch v-model="inverted" class="bg-secondary ml-1 mr-4 mt-[2px]"></SfSwitch>
          <span v-if="inverted">Inverted</span>
          <span v-else>Normal</span>
        </div>
        <ColorControlCollection v-model="baseColors" showHead />
        <div class="bg-muted mt-0 flex h-6">
          <div class="mx-2 min-w-24">Shades</div>
          <div v-for="(shade, index) in shades" :key="index" class="grow px-2">{{ shade }}</div>
        </div>
        <div v-for="(color, key) in baseColors" :key="key" class="flex flex-row" style="margin-top: 4px">
          <div v-if="color" class="mx-2 min-w-24" :style="`background-color: ${palette(color, inverted ? '1':'0').DEFAULT}`">
            {{ key }}
          </div>
          <div
            v-if="color"
            v-for="(value, key) in palette(`oklch(${color})`, !inverted || color.endsWith('.001') ? '0' : '1')"
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
