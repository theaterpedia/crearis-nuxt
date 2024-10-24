<script setup>
import { SfButton } from '@crearis/vue';
import { defineBlock, repeaterField, textSubfield, linkSubfield, imageSubfield } from '#pruvious'

defineBlock({
  icon: 'Pencil',
  label: 'Display',
})

// eslint-disable-next-line vue/define-macros-order
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

const NuxtLink = resolveComponent('NuxtLink');
</script>

<template>
  <SectionContainer>
    <div class="flex flex-col md:flex-row flex-wrap gap-6 mb-10" data-testid="display">
      <div
        v-for="card in cards"
        :key="card.headline"
        class="relative flex md:max-w-screen-3xl md:[&:not(:first-of-type)]:flex-1 md:first-of-type:w-full first:bg-secondary-200 last:bg-warning-200 even:bg-negative-200"
      >
        <div
          :class="[
            'flex overflow-hidden grow flex-col',
            {
              'flex-col-reverse': card.reverse,
              'md:flex-row-reverse': card.reverse,
            },
          ]"
        >
          <div class="flex flex-1 flex-col justify-center items-center md:items-start p-6 lg:p-10 max-w-1/2">
            <p class="uppercase typography-text-xs block font-bold tracking-widest">
              {{ card.overline }}
            </p>
            <h2 class="mb-4 mt-2 font-bold typography-headline-3">
              {{ card.headline }}
            </h2>
            <p class="typography-text-base block text-center md:text-left mb-4">
              {{ card.description }}
            </p>
            <SfButton class="!bg-black text-white" :tag="NuxtLink" :to="card.buttonlink">
              {{ card.buttonText }}
            </SfButton>
          </div>
          <PruviousPicture
              :image="card.image"
              :lazy="true"
              :alt="card.headline"
              class="w-full md:w-1/2 self-end object-contain flex-1"
              width="300"
              height="300"            
            />
        </div>
      </div>
    </div>
  </SectionContainer>
</template>