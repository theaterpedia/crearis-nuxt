<script lang="ts" setup>
const hue = defineModel('hue', {
  type: Number,
  default: 0,
})

const light = defineModel('light', {
  type: Number,
  default: 88,
})

const chroma = defineModel('chroma', {
  type: Number,
  default: 0.4,
})

defineProps({
  /**
   * The color palette to display.
   */
  name: {
    type: String,
    required: true,
  },
  showHead: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <form class="mb-1 flex max-w-96 flex-row gap-2">
    <span class="bg-muted min-w-28" :class="{ 'mt-8': showHead }">{{ name }}</span>
    <span class="min-w-10" :class="{ 'mt-8': showHead }">{{ hue }}</span>
    <label class="min-w-56 flex-grow">
      <span v-show="showHead" class="bg-muted block">Hue</span>
      <input v-model.number="hue" max="360" min="0" step="1" type="range" class="min-w-56" />
    </label>
    <label class="min-w-16 max-w-16">
      <span v-show="showHead" class="bg-muted block">Scale</span>
      <input v-model.number="light" max="99.9" min="0"  class="min-w-16 max-w-16" />
    </label>
    <label class="min-w-16 max-w-16">
      <span v-show="showHead" class="bg-muted block">Greyval</span>
      <input v-model.number="chroma" max="0.5" min="0" class="min-w-16 max-w-16" />
    </label>
  </form>
</template>
