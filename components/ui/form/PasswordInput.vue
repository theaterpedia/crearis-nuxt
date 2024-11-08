<template>
  <SfInput :type="isPasswordVisible ? 'text' : 'password'">
    <template #suffix>
      <button @click="isPasswordVisible = !isPasswordVisible" type="button">
        <component :is="isPasswordVisible ? SfIconVisibility : SfIconVisibilityOff" />
        <component :is="isPasswordVisible ? SfIconVisibility : SfIconVisibilityOff" />
      </button>
    </template>
  </SfInput>
</template>

<script lang="ts" setup>
import { SfIconsSfIconVisibility, SfIconsSfIconVisibilityOff } from '#build/components'
const isPasswordVisible = ref<boolean>()
</script>
