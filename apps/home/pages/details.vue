<template>
  <NuxtLayout>
    <ContentQuery :path="src" find="one" v-slot="{ data }">
      <DataViewDetails :src="src" :data="data"/>
    </ContentQuery>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'details'
})

const src = 'agenda/einstiege-ins-theaterspiel-m16e'
//const src = useRoute().query.src

</script>