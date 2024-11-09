<script setup>
import { defineBlock, repeaterField, textSubfield, linkSubfield, imageSubfield } from '#pruvious'

defineBlock({
  icon: 'Pencil',
  label: 'Display',
})

defineProps({
  cards: repeaterField({
    subfields: {
      overline: textSubfield(),
      headline: textSubfield(),
      description: textSubfield(),
      buttonText: textSubfield(),
      buttonLink: linkSubfield({
        required: false,
        placeholder: 'Enter url',
      }),
      image: imageSubfield({
        minWidth: 700,
        sources: [
          { media: '(max-width: 768px)', format: 'webp', width: 382, resize: 'cover' },
          { media: '(max-width: 768px)', format: 'jpeg', width: 382, resize: 'cover' },
          { format: 'webp', width: 700, resize: 'cover' },
          { format: 'jpeg', width: 700, resize: 'cover' },
        ],
      }),
    },
    addLabel: 'Add card',
  }),
})

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <SectionContainer>
    <div data-testid="display" class="mb-10 flex flex-col flex-wrap gap-6 md:flex-row">
      <div
        v-for="card in cards"
        :key="card.headline"
        class="md:max-w-screen-3xl relative flex first:bg-secondary-200 last:bg-warning-200 even:bg-negative-200 md:first-of-type:w-full md:[&:not(:first-of-type)]:flex-1"
      >
        <div
          :class="[
            'flex grow flex-col overflow-hidden',
            {
              'flex-col-reverse': card.reverse,
              'md:flex-row-reverse': card.reverse,
            },
          ]"
        >
          <div class="max-w-1/2 flex flex-1 flex-col items-center justify-center p-6 md:items-start lg:p-10">
            <p class="typography-text-xs block font-bold uppercase tracking-widest">
              {{ card.overline }}
            </p>
            <h2 class="typography-headline-3 mb-4 mt-2 font-bold">
              {{ card.headline }}
            </h2>
            <p class="typography-text-base mb-4 block text-center md:text-left">
              {{ card.description }}
            </p>
            <ButtonTmp :is="NuxtLink" :to="card.buttonlink" class="!bg-black text-white">
              {{ card.buttonText }}
            </ButtonTmp>
          </div>
          <PruviousPicture
            :alt="card.headline"
            :image="card.image"
            :lazy="true"
            height="300"
            width="300"
            class="w-full flex-1 self-end object-contain md:w-1/2"
          />
        </div>
      </div>
    </div>
  </SectionContainer>
</template>
