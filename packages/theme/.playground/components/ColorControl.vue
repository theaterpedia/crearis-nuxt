<script setup lang="ts">

const hue = defineModel('hue', {
  type: Number,
  default: 0,
})

const scale = defineModel('scale', {
  type: Number,
  default: 3,
})

const greyval = defineModel('greyval', {
  type: Number,
  default: 0,
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
  <form class="flex flex-row max-w-96 gap-2 mb-1">
    <span class="min-w-28 bg-muted-base" :class="{'mt-8': showHead}">{{ name }}</span>
    <span class="min-w-10" :class="{'mt-8': showHead}">{{ hue }}</span>
    <label class="min-w-56 flex-grow">
      <span class="block bg-muted-base" v-show="showHead">Hue</span>
      <input class="min-w-56" v-model.number="hue" type="range" min="0" max="360" step="1" />
    </label>
    <label class="min-w-16 max-w-16">
      <span class="block bg-muted-base" v-show="showHead">Scale</span>
      <input class="min-w-16 max-w-16" v-model.number="scale" type="range" min="0" max="5" step="1" />
    </label>
    <label class="min-w-16 max-w-16">
      <span class="block bg-muted-base" v-show="showHead">Greyval</span>
      <input class="min-w-16 max-w-16" v-model.number="greyval" type="range" min="0" max="4" step="1" />
    </label>    
  </form>
</template>