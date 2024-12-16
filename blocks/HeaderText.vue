<script lang="ts" setup>
import { defineBlock, textField, numberField, textAreaField } from '#pruvious'

defineBlock({
  icon: 'H3',
  label: 'A: Text',
})

defineProps({
  title: textField({
    placeholder: 'Heading: _ID_ overline **HEADLINE** subline',
    required: true,
  }),
  level: numberField({
    label: 'Überschrifts-Ebene',
    placeholder: '2',
    default: 2,
    min: 1,
    max: 3,
  }),
  description: textField({
    placeholder: 'Teasertext optional',
  }),
  bodytext: textAreaField({
    placeholder: 'Text-Inhalt optional',
  }),
})
</script>

<template>
  <Container>
    <div class="max-w-content space-y-2">
      <Heading :content="title" :is="`h${level ? level : 2}`" />
      <p v-if="description" class="text-sm sm:text-base md:text-lg">
        {{ description }}
      </p>
      <p v-if="bodytext" class="text-sm sm:text-base">
        {{ bodytext }}
      </p>
    </div>
  </Container>
</template>
