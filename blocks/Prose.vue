<script lang="ts" setup>
import { defineBlock, editorField } from '#pruvious'

defineBlock({
  icon: 'Pencil',
  label: 'B: Freitext',
})

defineProps({
  text: editorField({
    required: true,
    toolbar: ['bold', 'italic', 'link', 'heading1', 'heading2', 'heading3', 'paragraph', 'link', 'bulletList'],
  }),
})
</script>

<template>
  <Prose>
    <PruviousHTML :html="text"/>
  </Prose>
</template>
