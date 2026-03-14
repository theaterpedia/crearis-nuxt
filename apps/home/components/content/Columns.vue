<template>
  <Columns :gap="gap" :align="align" :wrap="wrapBool" :stackReverse="stackReverseBool" :background="background">
    <ContentSlot />
  </Columns>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Columns } from '@crearis/ui'

const props = defineProps({
  gap: {
    type: String,
    default: 'medium',
  },
  align: {
    type: String,
    default: 'top',
  },
  wrap: {
    type: [Boolean, String],
    default: true,
  },
  stackReverse: {
    type: [Boolean, String],
    default: false,
  },
  background: {
    type: String,
  },
})

// Coerce string "true"/"false" to boolean (markdown attributes come as strings)
const wrapBool = computed(() => props.wrap === true || props.wrap === 'true')
const stackReverseBool = computed(() => props.stackReverse === true || props.stackReverse === 'true')
</script>
