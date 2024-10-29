<script setup>
import { defineBlock, repeaterField, textSubfield, linkSubfield, imageSubfield } from '#pruvious'
import checkoutContent from '~/components/checkoutContent.vue'

defineBlock({
  icon: 'Pencil',
  label: 'Checkout',
})

defineProps({})

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <SectionContainer>
    <checkoutContent />
  </SectionContainer>
</template>
