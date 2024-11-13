<script lang="ts" setup>
import { defineBlock, editorField, checkboxField } from '#pruvious'
import { Container } from '#components'

defineBlock({
  icon: 'Pencil',
  label: 'B/C: Freitext',
})

defineProps({
  text: editorField({
    required: true,
    toolbar: ['bold', 'italic', 'link', 'heading2', 'heading3', 'paragraph', 'link', 'bulletList'],
  }),
  pageBlock: checkboxField({
    default: true,
    label: 'B-Component?',
  }),
})
</script>

<template>
  <component :is="pageBlock ? 'Container' : 'div'">
    <Prose>
      <PruviousHTML :html="text" />
    </Prose>
  </component>
</template>
