<template>
  <Section overlap class="section">
    <Container v-if="title" class="mt-[-3.25rem]">
      <Heading :is="`h${level ? level : 2}`" :content="title" class="ml-[-2.75rem] pl-11 max-w-[44rem] bg-primary-base py-2 theme-shadow"/>
    </Container>
    <Container class="mt-4" >
      <slot />
    </Container>
  </Section>
</template>

<script lang="ts" setup>
import { Container, Section } from '@crearis/ui'
import { defineBlock, textField, numberField, textAreaField } from '#pruvious'

defineBlock({
  icon: 'H2',
  label: 'B: Section',
  slots: {
    default: {
      label: 'Blocks', // Displayed in the dashboard
      allowedChildBlocks: ['FlexProse', 'FlexColumns', 'FlexVideo', 'FlexImage'],
    },
  },
})

defineProps({
  title: textField({
    placeholder: 'Heading: _ID_ overline **HEADLINE** subline',
    label: 'Heading (optional)',
    required: false,
  }),
  level: numberField({
    label: 'Überschrifts-Ebene',
    placeholder: '2',
    default: 2,
    min: 1,
    max: 3,
  }),  
  description: textField({
    placeholder: 'Teasertext (optional)',
  })
})

</script>

<style scoped>
  .theme-shadow {
    box-shadow: var(--theme-shadow);
  }
  .section {
    max-width: 90rem; /* 1440px */
    align-self: center;
  }
</style>