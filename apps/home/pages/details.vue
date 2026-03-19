<template>
  <div>
    <NuxtLayout>
      <DataViewDetails :product="product" :src="src" />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'details',
})

const route = useRoute()
const src = route.query.src

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
