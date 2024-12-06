<script lang="ts" setup>
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
  <form class="mb-1 flex max-w-96 flex-row gap-2">
    <span class="bg-muted min-w-64">{{ name }}</span>
    <label class="min-w-32 flex-grow">
      <span v-show="showHead" class="bg-muted block">Sf-Name</span>
      <input v-model.trim="sfname" class="min-w-56" />
    </label>
    <label class="min-w-20 max-w-20">
      <span v-show="showHead" class="bg-muted block">TW-shade</span>
      <input v-model.number="shade" max="10" min="0" step="1" type="number" class="min-w-20 max-w-20" />
    </label>
  </form>
</template>
