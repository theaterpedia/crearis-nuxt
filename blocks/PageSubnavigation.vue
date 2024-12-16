<script lang="ts" setup>
import { defineBlock, textField, linkField, numberField } from '#pruvious'

defineBlock({
  icon: 'Pencil',
  label: 'B: Subnavigation',
})

defineProps({
  backLabelDesktop: textField(),
  backLabelMobile: textField(),
  backHref: linkField({
    required: false,
    placeholder: 'Enter url',
  }),
  title: textField({
    placeholder: 'Heading: _ID_ overline **HEADLINE** subline',
  }),
  level: numberField({
    label: 'Überschrifts-Ebene',
    placeholder: '2',
    default: 2,
    min: 1,
    max: 3,
  }),
})

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <div class="mb-20 px-4 md:px-0">
    <div class="mb-10 mt-8 flex justify-between px-4 md:px-0">
      <Heading v-if="title" :content="title" :is="`h${level ? level : 2}`" />
      <ButtonTmp :is="NuxtLink" :to="backHref" size="small" variant="tertiary" class="flex whitespace-nowrap md:hidden">
        <template #prefix>
          <SfIconArrowBack />
        </template>
        {{ backLabelMobile }}
      </ButtonTmp>
      <ButtonTmp :is="NuxtLink" :to="backHref" variant="tertiary" class="hidden md:flex">
        <template #prefix>
          <SfIconArrowBack />
        </template>
        {{ backLabelDesktop }}
      </ButtonTmp>
    </div>
  </div>
</template>
