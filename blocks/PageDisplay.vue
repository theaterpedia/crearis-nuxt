<script setup>
import { defineBlock, repeaterField, textSubfield, numberSubfield, linkSubfield, imageSubfield } from '#pruvious'

defineBlock({
  icon: 'Pencil',
  label: 'B: Display',
})

defineProps({
  cards: repeaterField({
    subfields: {
      title: textSubfield({
        placeholder: 'Heading: _ID_ overline **HEADLINE** subline',
        required: true,
      }),
      level: numberSubfield({
        label: 'Überschrifts-Ebene',
        placeholder: '3',
        default: 3,
        min: 2,
        max: 4,
      }),
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
        class="md:max-w-screen-3xl first:bg-secondary-200 last:bg-warning-200 even:bg-negative-200 relative flex md:first-of-type:w-full md:[&:not(:first-of-type)]:flex-1"
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
            <Heading :content="card.title" :is="`h${card.level ? card.level : 2}`" />
            <p class="mb-4 block text-center text-base md:text-left">
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
