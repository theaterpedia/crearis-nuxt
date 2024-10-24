<script lang="ts" setup>
import { SfIconArrowBack } from '@crearis/vue'
import { defineBlock, textField, linkField } from '#pruvious'
import ButtonTmp from '../components/ButtonTmp.vue'

defineBlock({
  icon: 'Pencil',
  label: 'Subnavigation',
})

defineProps({
  backLabelDesktop: textField(),
  backLabelMobile: textField(),
  backHref: linkField({
    required: false,
    placeholder: 'Enter url',
  }),
  heading: textField(),
})

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <div class="mb-20 px-4 md:px-0">
    <div class="mb-10 mt-8 flex justify-between px-4 md:px-0">
      <h1 class="typography-headline-3 md:typography-headline-2 font-bold">
        {{ heading }}
      </h1>
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
