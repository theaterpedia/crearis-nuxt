<template>
  <PostIt :color="color" :width="width" :rotation="rotation">
    <Heading v-if="title" :is="`h${level ? level : 4}`" :content="title" class="ml-[-2.75rem] pl-11 max-w-[44rem] bg-primary-base py-2 theme-shadow"/>
    <Prose>
      <PruviousHTML :html="text"/>
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
    toolbar: ['bold', 'italic', 'link', 'heading2', 'heading3', 'paragraph', 'link', 'bulletList'],
  }),
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
  color: selectField({
    choices: {primary: 'primary',  secondary: 'secondary', yellow: 'yellow', green: 'green', pink: 'pink', accent: 'accent', muted: 'muted'},
    default: 'primary',
    label: 'Farbe',
  }),
  width: selectField({
    choices: {'1/5': '1/5', '1/3': '1/3', '1/2': '1/2', '3/5': '3/5', '4/5': '4/5'},
    default: '1/3',
    label: 'Breite',
  }),  
  rotation: selectField({
    choices: {none: 'none',  left: 'left', right: 'right'},
    default: 'none',
    label: 'Drehung',
  }),   
})

</script>
