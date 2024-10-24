<script setup>
import { defineBlock, repeaterField, textSubfield, linkSubfield, imageSubfield } from '#pruvious'

defineBlock({
  icon: 'Pencil',
  label: 'Cart',
})

// eslint-disable-next-line vue/define-macros-order
defineProps({})

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <SectionContainer>
    <CartPageContent />
  </SectionContainer>
</template>
