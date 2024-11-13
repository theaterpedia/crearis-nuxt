<template>
  <PostIt :color="color" :rotation="rotation" :width="width">
    <Prose>
      <PruviousHTML :html="text" />
    </Prose>
  </PostIt>
</template>

<script lang="ts" setup>
import { defineBlock, selectField, textField, numberField, editorField } from '#pruvious'

defineBlock({
  icon: 'Note',
  label: 'C: Post-It',
})

defineProps({
  text: editorField({
    required: true,
    toolbar: ['bold', 'italic', 'link', 'heading3', 'heading4', 'paragraph', 'link', 'bulletList'],
  }),
  color: selectField({
    choices: {
      primary: 'primary',
      secondary: 'secondary',
      yellow: 'yellow',
      green: 'green',
      pink: 'pink',
      accent: 'accent',
      muted: 'muted',
    },
    default: 'primary',
    label: 'Farbe',
  }),
  width: selectField({
    choices: { '1/5': '1/5', '1/3': '1/3', '1/2': '1/2', '3/5': '3/5', '4/5': '4/5' },
    default: '1/3',
    label: 'Breite',
  }),
  rotation: selectField({
    choices: { none: 'none', left: 'left', right: 'right' },
    default: 'none',
    label: 'Drehung',
  }),
})
</script>
