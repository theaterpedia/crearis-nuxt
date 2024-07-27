<template>
  <div class="container">
    <Container is="header">
      <Heading>Header-Container</Heading>
    </Container>

    <Container>
      <Heading>Section-Container</Heading>
    </Container>

    <Container is="div">
      <Heading>Div-Container</Heading>
    </Container>

    <Container is="footer">
      <Heading>Footer-Container</Heading>
    </Container>    
  </div>
</template>

<script lang="ts" setup>
import { Container } from '@/index'
</script>

<style scoped>
.container {
  padding: 2rem;
}

.container > * + * {
  margin-top: 2rem;
}
</style>
