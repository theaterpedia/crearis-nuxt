<template>
  <NuxtLayout>
    <ContentDoc />
  </NuxtLayout>
</template>

<script lang="ts" setup>
const route = useRoute()
const mainMenu = useMainMenu()
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())

mainMenu.value.navigation = navigation.value ?? []

refreshMainMenu(route)
</script>
