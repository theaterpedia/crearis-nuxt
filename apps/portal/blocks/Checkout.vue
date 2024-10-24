<script setup>
import { defineBlock, repeaterField, textSubfield, linkSubfield, imageSubfield } from '#pruvious'
import checkoutContent from '~/components/checkoutContent.vue'

defineBlock({
  icon: 'Pencil',
  label: 'Checkout',
})

// eslint-disable-next-line vue/define-macros-order
defineProps({})

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <SectionContainer>
    <checkoutContent />
  </SectionContainer>
</template>
