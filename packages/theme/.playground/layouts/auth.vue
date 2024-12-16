<script lang="ts" setup>
defineProps<{
  heading: string
}>()

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <UiNavbarTop />
  <main
    :class="[
      'mx-auto px-4 pb-20 pt-4 md:mt-4 md:px-0',
      { 'md:mb-8': heading },
      heading ? 'md:max-w-[630px]' : 'md:max-w-[677px]',
    ]"
  >
    <h1 v-if="heading" class="typography-headline-3 md:typography-headline-2 mb-10 font-bold">{{ heading }}</h1>
    <slot />
  </main>
  <Footer />
</template>
