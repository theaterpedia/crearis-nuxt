<script setup lang="ts">
import { defineLayout } from '#pruvious'

defineLayout({
  label: 'checkout',
  // @ts-expect-error #TODO _05 remove once components are created
  allowedBlocks: ['Cart', 'Checkout', 'Subnavigation', 'Link', 'Container', 'Image', 'Prose'],
  // @ts-expect-error #TODO _05 remove once components are created
  allowedRootBlocks: ['Cart', 'Checkout', 'Subnavigation', 'Link', 'Container', 'Image', 'Prose'],
})

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <UiNavbarTop />
  <main data-testid="checkout-layout">
    <NarrowContainer>
      <div class="px-4 md:px-0 mb-20">
        <slot />
      </div>
    </NarrowContainer>
  </main>
  <UiFooter />
</template>
