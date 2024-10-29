<script lang="ts" setup>
import { defineLayout } from '#pruvious'

import { useDisclosure, SfIconSearch } from '@crearis/vue'

defineLayout({
  label: 'default',
  allowedBlocks: [
    'ProductSlider',
    'Display',
    'MockImageSection',
    'MockBreadcrumbs',
    'MockLogo',
    'Hero',
    'Prose',
    'Video',
  ],
  allowedRootBlocks: [
    'ProductSlider',
    'Display',
    'MockImageSection',
    'MockBreadcrumbs',
    'MockLogo',
    'Hero',
    'Prose',
    'Video',
  ],
})

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <UiNavbarTop extended filled>
  </UiNavbarTop>
  <main>
    <slot />
  </main>
  <NuxtLazyHydrate when-visible>
    <Footer />
  </NuxtLazyHydrate>
</template>
