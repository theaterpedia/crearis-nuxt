<script setup lang="ts">
/**
 * Theme Layer: ToggleMenu wrapper
 * Re-exports ToggleMenu from @crearis/ui for auto-import with Ui prefix
 */
import { ToggleMenu, type ToggleOption, type ArrayOption } from '@crearis/ui'

const modelValue = defineModel<string | number | boolean>({ required: true })

defineProps<{
  toggleOptions?: ToggleOption[]
  arrayOptions?: ArrayOption[]
  header?: string
}>()

const emit = defineEmits<{
  'update:arrayOption': [option: ArrayOption, newState: boolean]
}>()

function handleArrayOptionUpdate(option: ArrayOption, newState: boolean) {
  emit('update:arrayOption', option, newState)
}
</script>

<template>
  <ToggleMenu 
    v-model="modelValue"
    :toggleOptions="toggleOptions"
    :arrayOptions="arrayOptions"
    :header="header"
    @update:arrayOption="handleArrayOptionUpdate"
  />
</template>
