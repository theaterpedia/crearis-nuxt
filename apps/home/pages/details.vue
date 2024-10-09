<template>
  <NuxtLayout>
    <ContentQuery v-slot="{ data }" :path="src" find="one">
      <DataViewDetails :product="data" :src="src" />
    </ContentQuery>
  </NuxtLayout>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'details',
})

//ERR 'Calling `useRoute` within middleware may lead to misleading results. Instead, use the (to, from) arguments passed to the middleware to access the new and old routes.'
const src = useRoute().query.src
</script>
