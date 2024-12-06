<script setup lang="ts">
import { colorVars, shades } from '@crearis/theme/utils/colorSettings'
import { onMounted, PropType, ref, watch } from 'vue'
import type { OklchScale, SfColorMapping } from '@crearis/theme/utils/colorSettings'
import { colorScales } from '../../theme';

const props = defineProps({
  colorScales: {
    type: Array as PropType<OklchScale[]>,
    required: true,
  },
  colorMap: {
    type: Array as PropType<SfColorMapping[]>,
    required: true,
  }
})

</script>

<template>
  <div class="bg-muted mt-0 h-6 text-sm font-thin">
    <strong>colorVars</strong>
    <p>
    <span
      v-for="([key, val], index) in Object.entries(colorVars(colorMap, colorScales))"
      :key="index"
      class="mt-0 block text-sm font-thin"
      >
      '{{ key }}': {{ val }},
      <br />
    </span>
    </p>
    <hr class="mt-6">
    <strong>colorScales</strong>
    <span
      v-for="({ name, hue, scale, greyval }, index) in colorScales"
      :key="index"
      class="mt-0 block text-sm font-thin"
      >
      { name: '{{ name }}', hue: {{ hue }}, scale: {{ scale }}, greyval: {{ greyval }} },
      <br />
    </span>
  </div>
</template>