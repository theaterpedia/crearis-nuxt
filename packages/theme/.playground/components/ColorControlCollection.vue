<script lang="ts" setup>
import type { BaseColors } from '@crearis/theme/utils/colorSettings'
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

const colors = defineModel({
  type: Object as PropType<BaseColors>,
  required: true,
})
</script>

<template>
  <div class="color-palette__colors">
    <ColorControl v-model="colors.primary" name="Primary" showHead />
    <ColorControl v-model="colors.secondary" name="Secondary" />
    <ColorControl v-model="colors.warning" name="Warning" />
    <ColorControl v-model="colors.positive" name="Positive" />
    <ColorControl v-model="colors.negative" name="Negative" />
    <ColorControl v-model="colors.neutral" name="Neutral" />
  </div>
</template>
