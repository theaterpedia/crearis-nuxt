<script lang="ts" setup>
// import { useSfContent } from '../composables/useSfContent';
// const { getContent, data: content } = useSfContent('home-page');

// getContent();
</script>

<template>
  <!-- #TODO _7 ReEnable SfContent-Logic></! -->
  <!-- div v-for="(component, index) in content" :key="`${component.fields.component}-${index}`">
    <RenderContent :content="component.fields.content" />
  </! -->
  <NuxtLayout>
    <div class="prose px-8 py-8">
      <h1>Index Old</h1>
      <NuxtLink to="/">Home</NuxtLink>
    </div>
  </NuxtLayout>
  <!-- ContentDoc / -->
</template>
