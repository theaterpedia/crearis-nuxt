<template>
  <SfInput :type="isPasswordVisible ? 'text' : 'password'">
    <template #suffix>
      <button @click="isPasswordVisible = !isPasswordVisible" type="button">
        <SfIconVisibilityOff v-if="isPasswordVisible" />
        <SfIconVisibility v-else />
      </button>
    </template>
  </SfInput>
</template>

<script lang="ts" setup>
import { SfIconsSfIconVisibility, SfIconsSfIconVisibilityOff } from '#components'
const isPasswordVisible = ref<boolean>()
</script>
