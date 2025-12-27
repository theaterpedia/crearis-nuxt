<script setup lang="ts">
/**
 * Theme Layer: CardHero wrapper
 * Re-exports CardHero from @crearis/ui for auto-import with Ui prefix
 */
import { CardHero } from '@crearis/ui'

defineProps<{
  heightTmp?: 'full' | 'prominent' | 'medium' | 'mini'
  imgTmp?: string
}>()
</script>

<template>
  <CardHero :heightTmp="heightTmp" :imgTmp="imgTmp">
    <slot />
  </CardHero>
</template>
