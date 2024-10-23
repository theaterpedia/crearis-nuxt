<template>
  <Prose :style = "$viewport.isLessThan('tablet') ? 'font-size: 0.875em;' : ''">
    <ContentSlot />
  </Prose>
</template>

<script lang="ts" setup>
import { Prose } from '@crearis-nuxt/ui'
import { useNuxtApp } from '#app'
const { $viewport } = useNuxtApp()
</script>
