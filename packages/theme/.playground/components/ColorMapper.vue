<script setup lang="ts">

const sfname = defineModel('sfname', {
  type: String,
  default: '',
})

const shade = defineModel('shade', {
  type: Number,
  default: 50,
})

defineProps({
  /**
   * The var-name to display.
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
    <span class="min-w-64 bg-muted">{{ name }}</span>
    <label class="min-w-32 flex-grow">
      <span class="block bg-muted" v-show="showHead">Sf-Name</span>
      <input class="min-w-56" v-model.trim="sfname" />
    </label>
    <label class="min-w-20 max-w-20">
      <span class="block bg-muted" v-show="showHead">TW-shade</span>
      <input class="min-w-20 max-w-20" v-model.number="shade" type="number" min="50" max="950" step="50" />
    </label>  
  </form>
</template>