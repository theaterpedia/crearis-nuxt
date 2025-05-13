<template>
  <h2>{{ title }}</h2>
  <ThemeConfigurator background="muted"></ThemeConfigurator>
</template>

<script lang="ts" setup>
import { defineBlock, textField } from '#pruvious'

defineBlock({
  icon: 'Pencil',
  label: 'B: ThemeSwitch',
})

defineProps({
  title: textField({
    placeholder: 'Heading: _ID_ overline **HEADLINE** subline',
    label: 'Heading (optional)',
    required: false,
  }),
})

</script>
