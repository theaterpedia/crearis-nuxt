<script lang="ts" setup>
import { defineBlock, checkboxField } from '#pruvious'
import { Container } from '#components'
import { Columns } from '@crearis/ui'

defineBlock({
  icon: 'Pencil',
  label: 'B: Spalten',
  slots: {
    default: {
      label: 'Blocks', // Displayed in the dashboard
      allowedChildBlocks: ['VarProse', 'SubColumn', 'VarVideo', 'VarImage'],
    },
  },
})

defineProps({
  pageBlock: checkboxField({
    default: true,
    label: 'B-Component?',
  }),
})
</script>

<template>
  <component :is="pageBlock ? 'Container' : 'div'">
    <Columns>
      <slot />
    </Columns>
  </component>
</template>
