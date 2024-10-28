<script lang="ts" setup>
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
    <SectionContainer>
      <div class="mb-20 px-4 md:px-0">
        <slot />
      </div>
    </SectionContainer>
  </main>
  <Footer />
  <Toaster position="top-right" />
</template>
