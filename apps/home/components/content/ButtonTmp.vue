<template>
  <Button :is="NuxtLink">
    <ContentSlot unwrap="p" />
  </Button>
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components'

defineProps({
  /**
   * A dynamic component or an HTML tag to render.
   * This is useful when rendering `<RouterLink>` or `<NuxtLink>` components.
   *
   * @default NuxtLink
   */
  is: {
    type: [Object, String] as PropType<'a' | 'button' | 'span' | Component>,
    default: NuxtLink,
  },
})
</script>
