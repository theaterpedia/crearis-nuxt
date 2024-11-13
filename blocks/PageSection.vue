<template>
  <Section overlap class="section">
    <Container v-if="title" class="mt-[-3.25rem]">
      <Heading
        :content="title"
        :is="`h${level ? level : 2}`"
        class="bg-primary-base theme-shadow ml-[-2.75rem] max-w-[44rem] py-2 pl-11"
      />
    </Container>
    <Container class="mt-4">
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
      allowedChildBlocks: ['VarProse', 'PageColumns', 'VarVideo', 'VarImage'],
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
  }),
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
