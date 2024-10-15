<template>
  <NuxtLayout>
    <DataViewDetails :product="product" :src="src" />
  </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'details',
})

//ERR 'Calling `useRoute` within middleware may lead to misleading results. Instead, use the (to, from) arguments passed to the middleware to access the new and old routes.'
const src = useRoute().query.src

if (typeof src !== 'string') {
  throw new Error('The `src` query parameter is required.')
}

const mainMenu = useMainMenu()
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
const { data: product } = await useAsyncData('home', () => queryContent(src).findOne())

mainMenu.value.navigation = navigation.value ?? []

if (typeof product.value?.navigation_highlight === 'string') {
  refreshMainMenu(product.value.navigation_highlight)
}
</script>
