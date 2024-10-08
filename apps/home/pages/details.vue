<template>
  <NuxtLayout>
    <ContentQuery v-slot="{ data }" :path="src" find="one">
      <DataViewDetails :data="data" :src="src" />
    </ContentQuery>
  </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'details',
})

const src = 'agenda/einstiege-ins-theaterspiel-m16e'
//const src = useRoute().query.src
</script>
