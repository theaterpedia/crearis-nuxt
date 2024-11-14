<script lang="ts" setup>
import { defineBlock } from '#pruvious'
import { Columns } from '@crearis/ui'

defineBlock({
  icon: 'Pencil',
  label: 'B: Spalten',
  slots: {
    default: {
      label: 'Blocks', // Displayed in the dashboard
      allowedChildBlocks: ['VarProse', 'SubColumn', 'SubColumns', 'SubPostIt', 'VarVideo', 'VarImage'],
    },
  },
})
</script>

<template>
  <SectionContainer>
    <Columns class="flex-wrap md:max-w-3xl lg:max-w-6xl xl:max-w-7xl">
      <slot />
    </Columns>
  </SectionContainer>
</template>
