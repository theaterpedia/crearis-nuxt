<script lang="ts" setup>
import { SfButton } from '@crearis/vue'
import { defineBlock, imageField, linkField, textField, editorField, switchField } from '#pruvious'

defineBlock({ icon: 'Mouse' })

// eslint-disable-next-line vue/define-macros-order
defineProps({
  showText: switchField({
    default: false,
  }),
  fullWidth: switchField({
    default: false,
  }),
  minHeight: switchField({
    default: false,
  }),
  image: imageField({
    minWidth: 1400,
    sources: [
      { media: '(max-width: 768px)', format: 'webp', width: 764, resize: 'cover' },
      { media: '(max-width: 768px)', format: 'jpeg', width: 764, resize: 'cover' },
      { format: 'webp', width: 1400, resize: 'cover' },
      { format: 'jpeg', width: 1400, resize: 'cover' },
    ],
  }),
  title: textField({
    placeholder: 'Titel eingeben',
  }),
  overline: textField({
    placeholder: 'Overline eingeben',
  }),
  text: editorField({
    placeholder: 'formatierten Text eingeben',
  }),
  imageButtonLink: linkField({
    required: false,
    placeholder: '1. Button Link',
  }),
  secondaryButtonText: textField({
    placeholder: '2. Button: Text eingeben',
  }),
  secondaryButtonLink: linkField({
    required: false,
    placeholder: '2. Button Link',
  }),
})

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <div class="max-w-screen-3xl mx-auto md:flex md:justify-center" :class="minHeight ? '' : 'min-h-[600px]'">
    <div
      class="flex flex-col justify-center md:items-stretch md:overflow-hidden"
      :class="fullWidth ? '' : 'md:basis-2/4'"
    >
      <!-- #TODO _06 Re-Enable Images -->
      <NuxtLink :to="imageButtonLink" class="relative">
        <PruviousPicture :image="image" :lazy="true" />
      </NuxtLink>
    </div>
    <div v-show="showText" class="p-4 md:flex md:basis-2/4 md:flex-col md:items-start md:justify-center md:p-10">
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
          <PruviousHTML :html="text" :v-show="text" class="max-w-content prose" />
        </slot>
      </div>
      <div class="mt-6 flex flex-col gap-4 md:flex-row">
        <SfButton
          :tag="NuxtLink"
          :to="secondaryButtonLink"
          :v-show="secondaryButtonLink !== ''"
          size="lg"
          variant="secondary"
          class="bg-white"
        >
          {{ secondaryButtonText }}
        </SfButton>
      </div>
    </div>
  </div>
</template>
