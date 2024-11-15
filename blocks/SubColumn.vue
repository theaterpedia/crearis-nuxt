<template>
  <Column :fill="fill === true" :rotation="rotation" :sticky="sticky" :width="width">
    <slot />
  </Column>
</template>

<script lang="ts" setup>
import { Column } from '@crearis/ui'
import { defineBlock, checkboxField, selectField } from '#pruvious'

defineBlock({
  icon: 'Pencil',
  label: 'C: Spalte',
  slots: {
    default: {
      label: 'Blocks', // Displayed in the dashboard
      allowedChildBlocks: ['VarProse', 'VarVideo', 'VarImage'],
    },
  },
})

defineProps({
  fill: checkboxField({
    default: false,
    label: 'Bild als Vollbild anzeigen',
  }),
  width: selectField({
    choices: {
      '1/5': '1/5',
      '1/4': '1/4',
      '1/3': '1/3',
      '1/2': '1/2',
      '2/5': '2/3',
      '3/5': '3/5',
      '3/4': '3/4',
      '4/5': '4/5',
      'auto': 'auto',
    },
    default: 'auto',
    label: 'Breite',
  }),
  rotation: selectField({
    choices: {
      'rotate-0': 'keine',
      '-rotate-3': '-3',
      '-rotate-2': '-2',
      '-rotate-1': '-1',
      'rotate-1': '1',
      'rotate-2': '2',
      'rotate-3': '3',
    },
    default: 'rotate-0',
    label: 'Drehung',
  }),
  sticky: selectField({
    choices: {
      'static': 'nein',
      'top-0': 'top-0',
      'top-20': 'top-20',
      'bottom-0': 'bottom-0',
      'bottom-20': 'bottom-20',
    },
    default: 'static',
    label: 'Anheften',
  }),
})
</script>
