<script lang="ts" setup>
import { onMounted, PropType, ref, watch, watchEffect } from 'vue'
import type { OklchColor, SfColorMapping } from '@crearis/theme/utils/colorSettings'

const props = defineProps({
  /*colorScales: {
    type: Array as PropType<OklchColor[]>,
    required: true,
  },*/
  tsVars: {
    type: Array as PropType<String[]>,
    required: true,
  },
})

const colors = ref('')
</script>

<template>
  <div class="bg-muted mt-0 h-6 text-sm font-thin">
    <!--strong>colorScales</!--strong>
    <p v-html="colors" />
    <hr class="mt-6" />
    <strong>colorVars</strong -->
    <p>
      <span v-for="(tsVar, index) in props.tsVars" :key="index" class="mt-0 block text-sm font-thin">
        {{ tsVar.replace(/"/g, "'") }}
        <br />
      </span>
    </p>
  </div>
</template>
