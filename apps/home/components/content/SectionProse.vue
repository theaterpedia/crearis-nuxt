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
// this component is used to wrap the markdown-content from the document-root
// that way in nuxt-devtools the component is instantly distinguished from special components

import { Container } from '@crearis-nuxt/ui'
import { Prose } from '@crearis-nuxt/ui'
</script>