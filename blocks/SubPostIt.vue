<template>
  <PostIt :color="color" :rotation="rotation" :sticky="sticky" :width="width">
    <Heading v-if="title" :content="title" :is="`h${level ? level : 4}`" />
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
  title: textField({
    placeholder: 'Heading: _ID_ overline **HEADLINE** subline',
    label: 'Heading (optional)',
    required: false,
  }),
  level: numberField({
    label: 'Überschrifts-Ebene',
    placeholder: '4',
    default: 4,
    min: 3,
    max: 4,
  }),
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
    choices: {
      'rotate-0': 'keine',
      '-rotate-3': '-9',
      '-rotate-2': '-6',
      '-rotate-1': '-3',
      'rotate-1': '3',
      'rotate-2': '6',
      'rotate-3': '6',
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
