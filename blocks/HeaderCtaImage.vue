<script lang="ts" setup>
import { defineBlock, imageField, linkField, textField, numberField } from '#pruvious'

defineBlock({
  icon: 'H2',
  label: 'A: Cta + Bild',
})

const props = defineProps({
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
        <PruviousPicture :image="image" :lazy="true" />
      </div>
      <div class="p-4 md:flex md:basis-2/4 md:flex-col md:items-start md:justify-center md:p-10">
        <Heading :content="title" :is="`h${level ? level : 2}`" />
        <!-- #TODO _05 Reference-Implement Prose with UiHero
          - unwrap the slot ...
        -->
        <div>
          <slot>
            <p v-text="description" class="typography-text-base md:typography-text-lg" />
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
