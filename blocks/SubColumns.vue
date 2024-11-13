<script lang="ts" setup>
import { defineBlock } from '#pruvious'
import { Columns } from '@crearis/ui'

defineBlock({
  icon: 'Pencil',
  label: 'C: Spalten',
  slots: {
    default: {
      label: 'Blocks', // Displayed in the dashboard
      allowedChildBlocks: ['VarProse', 'SubColumn', 'SubPostIt', 'VarVideo', 'VarImage'],
    },
  },
})
</script>

<template>
  <Columns>
    <slot />
  </Columns>
</template>
