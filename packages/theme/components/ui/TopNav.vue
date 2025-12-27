<script setup lang="ts">
/**
 * Theme Layer: TopNav wrapper
 * Re-exports TopNav from @crearis/ui for auto-import with Ui prefix
 * 
 * This allows us to use <UiTopNav> in layouts while getting the component from @crearis/ui
 */
import { TopNav } from '@crearis/ui'
import type { TopnavParentItem } from '@crearis/ui'

// Define props to match TopNav from @crearis/ui
defineProps<{
  items: TopnavParentItem[]
  scrollStyle?: 'simple' | 'overlay' | 'overlay_reappear'
  wide?: boolean
}>()
</script>

<template>
  <TopNav :items="items" :scrollStyle="scrollStyle" :wide="wide">
    <template #actions>
      <slot name="actions" />
    </template>
  </TopNav>
</template>
