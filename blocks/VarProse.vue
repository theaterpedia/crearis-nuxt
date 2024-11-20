<script lang="ts" setup>
import { defineBlock, editorField, checkboxField } from '#pruvious'

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
  <div class="min-w-[21.5rem]">
    <SectionContainer v-if="pageBlock">
      <Prose>
        <PruviousHTML :html="text" class="text-base" />
      </Prose>
    </SectionContainer>
    <Prose v-else>
      <PruviousHTML :html="text" class="text-sm" />
    </Prose>
  </div>
</template>
