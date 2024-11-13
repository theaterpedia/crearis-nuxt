<script lang="ts" setup>
import { defineBlock, imageField, linkField, textField } from '#pruvious'

defineBlock({ 
  icon: 'Mouse',
  label: 'Text-Image-Hero',
})

defineProps({
  image: imageField({
    minWidth: 764,
    minHeight: 600,
    sources: [
      { media: '(max-width: 768px)', format: 'webp', width: 764, height: 600, resize: 'cover' },
      { media: '(max-width: 768px)', format: 'jpeg', width: 764, height: 600, resize: 'cover' },
      { format: 'webp', width: 764, height: 600, resize: 'cover' },
      { format: 'jpeg', width: 764, height: 600, resize: 'cover' },
    ],
  }),
  title: textField({
    placeholder: 'Titel eingeben',
  }),
  overline: textField({
    placeholder: 'Overline eingeben',
  }),
  teasertext: textField({
    placeholder: 'Overline eingeben',
  }),
  primaryButtonText: textField({
    placeholder: '1. Button: Text eingeben',
  }),
  primaryButtonLink: linkField({
    required: true,
    placeholder: '1. Button Link',
  }),
  secondaryButtonText: textField({
    placeholder: '2. Button: Text eingeben',
  }),
  secondaryButtonLink: linkField({
    required: true,
    placeholder: '2. Button Link',
  }),
})

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <div class="relative mb-10 min-h-[600px]">
    <div class="max-w-screen-3xl mx-auto min-h-[600px] md:flex md:flex-row-reverse md:justify-center">
      <div class="flex flex-col justify-center md:basis-2/4 md:items-stretch md:overflow-hidden">
        <!-- #TODO _06 Re-Enable Images -->
        <PruviousPicture :image="image" :lazy="true" />
      </div>
      <div class="p-4 md:flex md:basis-2/4 md:flex-col md:items-start md:justify-center md:p-10">
        <p class="typography-text-xs md:typography-text-sm font-bold uppercase tracking-widest text-neutral-500">
          {{ overline }}
        </p>
        <h1 class="typography-headline-2 md:typography-headline-1 mb-4 mt-2 font-bold md:leading-[67.5px]">
          {{ title }}
        </h1>
        <!-- #TODO _05 Reference-Implement Prose with UiHero
          - unwrap the slot ...
        -->
        <div>
          <slot>
            <p v-text="teasertext" class="typography-text-base md:typography-text-lg" />
          </slot>
        </div>
        <div class="mt-6 flex flex-col gap-4 md:flex-row">
          <SfButton :is="NuxtLink" :to="primaryButtonLink" size="lg">
            {{ primaryButtonText }}
          </SfButton>
          <SfButton :is="NuxtLink" :to="secondaryButtonLink" size="lg" variant="secondary" class="bg-white">
            {{ secondaryButtonText }}
          </SfButton>
        </div>
      </div>
    </div>
  </div>
</template>
