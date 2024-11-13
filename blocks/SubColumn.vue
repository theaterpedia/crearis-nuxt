<template>
  <Column :fill="fill === true">
    <slot />
  </Column>
</template>

<script lang="ts" setup>
import { Column } from '@crearis/ui'
import { defineBlock, checkboxField } from '#pruvious'

defineBlock({
  icon: 'Pencil',
  label: 'C: Spalte',
  slots: {
    default: {
      label: 'Blocks', // Displayed in the dashboard
      allowedChildBlocks: ['FlexProse', 'Columns', 'FlexVideo', 'FlexImage'],
    },
  },
})

defineProps({
  fill: checkboxField({
    default: false,
    label: 'Vollbild?',
  }),
})
</script>
