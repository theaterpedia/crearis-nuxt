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
  <Header class="mt-12" />

  <div class="my-23 space-y-23">
    <!-- Our page blocks will be rendered here -->
    <slot />
  </div>

  <Footer class="mb-23" />
</template>
