<script setup lang="ts">
import { SfButton, SfIconArrowBack, SfLoaderCircular } from '@crearis/vue'
import { defineBlock, textField, linkField  } from '#pruvious'

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
      <div class="px-4 md:px-0 mb-20">
        <div class="flex justify-between mt-8 mb-10 px-4 md:px-0">
          <h1 class="font-bold typography-headline-3 md:typography-headline-2">
            {{ heading }}
          </h1>
          <SfButton
            :tag="NuxtLink"
            :to="backHref"
            class="flex md:hidden whitespace-nowrap"
            size="sm"
            variant="tertiary"
          >
            <template #prefix>
              <SfIconArrowBack />
            </template>
            {{ backLabelMobile }}
          </SfButton>
          <SfButton :tag="NuxtLink" :to="backHref" class="hidden md:flex" variant="tertiary">
            <template #prefix>
              <SfIconArrowBack />
            </template>
            {{ backLabelDesktop }}
          </SfButton>
        </div>
      </div>
</template>
