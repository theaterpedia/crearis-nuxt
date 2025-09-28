<template>
  <ThemeConfigurator background="muted" @update:theme-config="changeThemeConfig" @update:theme-id="changeThemeId"></ThemeConfigurator>
  <button @click="changeTheme">Change Theme</button>
</template>

<script lang="ts" setup>
import { defineBlock, textField } from '#pruvious'
import { ref } from 'vue'

defineBlock({
  icon: 'Pencil',
  label: 'B: ThemeSwitch',
})

const newThemeConfig = ref('')
const newThemeId = ref(0)

const changeThemeConfig = (newConfig: string) => {
  // Logic to change the theme config
  newThemeConfig.value = newConfig
}

const changeThemeId = (newId: number) => {
  newThemeId.value = newId
}

const changeTheme = async () => {
  try {
    const { data } = await $fetch('/api/settings', {
      method: 'PATCH',
      body: {
        themeId: newThemeId.value,
        themeConfig: newThemeConfig.value
      }
    })
    console.log('Theme updated successfully:', data)
  } catch (error) {
    console.error('Failed to update theme:', error)
  }
}

</script>
