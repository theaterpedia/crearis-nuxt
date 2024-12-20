<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
const color = defineModel({
  type: String,
  required: true,
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

const hue = ref<Number>(0)
const light = ref(88)
const chroma = ref(0.4)
const pin = ref(false)

const extractRefs = (color: String) => {
  const [l, c, h] = color.split(' ').map((value) => parseFloat(value))
  light.value = l
  chroma.value = c
  hue.value = parseInt(h, 10)
  pin.value = color.endsWith('.001')
}

onMounted(() => {
  extractRefs(color.value)
})

watch(color, (newColor) => {
  extractRefs(newColor)
})

watch([hue, light, chroma, pin], (newColor) => {
  color.value = `${light.value}% ${chroma.value} ${hue.value}${pin.value ? '.001' : ''}`
})
</script>

<template>
  <form v-if="name !== 'grey'" class="mb-1 flex max-w-96 flex-row gap-2">
    <span class="bg-muted min-w-28" :class="{ 'mt-8': showHead }">{{ name }}</span>
    <span class="min-w-10" :class="{ 'mt-8': showHead }">{{ hue }}</span>
    <label class="min-w-56 flex-grow">
      <span v-show="showHead" class="bg-muted block">Hue</span>
      <input v-model.number="hue" max="360" min="0" step="1" type="range" class="min-w-56" />
    </label>
    <label class="min-w-16 max-w-16">
      <span v-show="showHead" class="bg-muted block">Light</span>
      <input v-model.number="light" max="99.9" min="0" class="min-w-16 max-w-16 text-black" />
    </label>
    <label class="min-w-16 max-w-16">
      <span v-show="showHead" class="bg-muted block">Chroma</span>
      <input v-model.number="chroma" max="0.5" min="0" class="min-w-16 max-w-16 text-black" />
    </label>
    <label v-show="name != 'neutral'" class="min-w-12 max-w-12">
      <span v-show="showHead" class="bg-muted block">Pin</span>
      <SfSwitch v-model="pin" v-show="name !== 'Neutral'" />
    </label>
  </form>
</template>
