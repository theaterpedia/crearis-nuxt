<script setup>
import { defineBlock, repeaterField, textSubfield, linkSubfield, imageSubfield } from '#pruvious'
import { NuxtLink } from '#components'

defineBlock({
  icon: 'Pencil',
  label: 'Cart',
})

defineProps({})

</script>

<template>
  <SectionContainer>
    <CartPageContent />
  </SectionContainer>
</template>
