<template>
  <ThemeConfigurator background="muted" @update:theme-config="changeThemeConfig" @update:theme-id="changeThemeId"></ThemeConfigurator>
  <button @click="changeTheme">Change Theme</button>
</template>

<script lang="ts" setup>
import { defineBlock, textField } from '#pruvious'
import { ref } from 'vue'

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
