<script setup lang="ts">
import { SfButton } from '@crearis/vue'
import { defineBlock, imageField, linkField, textField } from '#pruvious'

defineBlock({ icon: 'Mouse' })

// eslint-disable-next-line vue/define-macros-order
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
  <div class="relative min-h-[600px] mb-10">
    <div class="md:flex md:flex-row-reverse md:justify-center min-h-[600px] max-w-screen-3xl mx-auto">
      <div class="flex flex-col justify-center md:basis-2/4 md:items-stretch md:overflow-hidden">
        <!-- #TODO _06 Re-Enable Images -->
        <PruviousPicture
          :image="image"
          :lazy="true"
        />
      </div>
      <div class="p-4 md:p-10 md:flex md:flex-col md:justify-center md:items-start md:basis-2/4">
        <p class="typography-text-xs md:typography-text-sm font-bold tracking-widest text-neutral-500 uppercase">
          {{ overline }}
        </p>
        <h1 class="typography-headline-2 md:typography-headline-1 md:leading-[67.5px] font-bold mt-2 mb-4">
          {{ title }}
        </h1>
        <!-- #TODO _05 Reference-Implement Prose with UiHero
          - unwrap the slot ...
        -->
        <div>
          <slot>
            <p class="typography-text-base md:typography-text-lg" v-text="teasertext" />
          </slot>
        </div>
        <div class="flex flex-col md:flex-row gap-4 mt-6">
          <SfButton size="lg" :tag="NuxtLink" :to="primaryButtonLink">
            {{ primaryButtonText }}
          </SfButton>
          <SfButton size="lg" :tag="NuxtLink" :to="secondaryButtonLink" class="bg-white" variant="secondary">
            {{ secondaryButtonText }}
          </SfButton>
        </div>
      </div>
    </div>
  </div>
</template>