<template>
  <Section>
    <Container>
      <Prose>
        <ContentSlot />
      </Prose>
    </Container>
  </Section>
</template>

<script lang="ts" setup>
import { Container } from '@crearis-nuxt/ui'
import { Prose } from '@crearis-nuxt/ui'
</script>
