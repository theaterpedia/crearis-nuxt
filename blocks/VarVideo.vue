<script lang="ts" setup>
import { defineBlock, imageField, checkboxField } from '#pruvious'
import { Container } from '#components'

defineBlock({
  icon: 'Video',
  label: 'B/C: Video',
})

defineProps({
  image: imageField({
    required: true,
    minWidth: 1440,
    sources: [
      { media: '(max-width: 400px)', format: 'webp', width: 720 },
      { media: '(max-width: 400px)', format: 'jpeg', width: 720 },
      { format: 'webp', width: 1440 },
      { format: 'jpeg', width: 1440 },
    ],
  }),
  pageBlock: checkboxField({
    default: true,
    label: 'B-Component?',
  }),
})
</script>

<template>
  <div>
    <SectionContainer v-if="pageBlock">
      <PruviousImage :image="image" />
    </SectionContainer>
    <PruviousImage v-else :image="image" />
  </div>  
</template>
