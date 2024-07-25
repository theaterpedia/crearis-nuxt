<template>
  <div class="container">
    <Heading>Heading 1</Heading>

    <Heading is="h2">Heading 2</Heading>
  </div>
</template>

<script lang="ts" setup>
import { Heading } from '@/index'
</script>

<style scoped>
.container {
  padding: 2rem;
}

.container > * + * {
  margin-top: 2rem;
}
</style>
