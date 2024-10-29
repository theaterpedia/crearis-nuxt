<script lang="ts" setup>
import { defineBlock, editorField } from '#pruvious'

defineBlock({
  icon: 'Pencil',
})

defineProps({
  text: editorField({
    required: true,
    toolbar: ['bold', 'italic', 'link', 'heading1', 'heading2', 'heading3', 'paragraph', 'link', 'bulletList'],
  }),
})
</script>

<template>
  <NarrowContainer class="content-block">
    <PruviousHTML :html="text" class="max-w-content prose" />
  </NarrowContainer>
</template>
