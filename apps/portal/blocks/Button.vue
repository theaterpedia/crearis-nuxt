<script lang="ts" setup>
import { linkField, textField } from '#pruvious'

defineProps({
  linkTitle: textField({
    placeholder: 'Titel eingeben',
  }),
  link: linkField({
    required: true,
    placeholder: 'Link aussuchen',
  }),
})
</script>

<template>
  <NuxtLink :to="link" class="inline-block whitespace-nowrap rounded-md bg-blue-600 px-4 py-3 text-white outline-none transition hover:bg-blue-700 focus:bg-blue-800 focus:ring-4">
    {{ linkTitle }}
  </NuxtLink>
</template>