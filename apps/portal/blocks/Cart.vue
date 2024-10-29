<script setup>
import { defineBlock, repeaterField, textSubfield, linkSubfield, imageSubfield } from '#pruvious'

defineBlock({
  icon: 'Pencil',
  label: 'Cart',
})

defineProps({})

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <SectionContainer>
    <CartPageContent />
  </SectionContainer>
</template>
