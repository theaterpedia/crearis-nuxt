<script setup lang="ts">

const hue = defineModel('hue', {
  type: Number,
  default: 0,
})

const scale = defineModel('scale', {
  type: Number,
  default: 3,
})


defineProps({
  /**
   * The color palette to display.
   */
  name: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <form>
    <span>{{ name }}</span>
    <label>
      <span>Hue</span>
      <input v-model="hue" type="range" min="0" max="360" step="1" />
    </label>
    <label>
      <span>Scale</span>
      <input v-model="scale" type="range" min="1" max="10" step="1" />
    </label>
  </form>
</template>