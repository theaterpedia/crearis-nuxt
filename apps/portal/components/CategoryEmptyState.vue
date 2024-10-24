<template>
  <section data-testid="category-empty-state" class="flex flex-col items-center md:mt-16">
    <NuxtImg :alt="$t('emptyStateAltText')" height="192" src="/images/something-went-wrong.svg" width="192" />
    <p class="mt-8 font-medium">{{ $t('emptyStateText') }}</p>
    <p class="mt-4">{{ $t('emptyStateText2') }}</p>
    <ButtonTmp :is="NuxtLink" :to="paths.category" variant="plain" class="mt-4">
      {{ $t('allProductsLinkText') }}
    </ButtonTmp>
  </section>
</template>

<script lang="ts" setup>
import ButtonTmp from '../components/ButtonTmp.vue'
const NuxtLink = resolveComponent('NuxtLink')
</script>
