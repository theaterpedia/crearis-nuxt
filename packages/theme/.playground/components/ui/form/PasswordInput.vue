<template>
  <SfInput :type="isPasswordVisible ? 'text' : 'password'">
    <template #suffix>
      <button @click="isPasswordVisible = !isPasswordVisible" type="button">
        <component :is="isPasswordVisible ? SfIconVisibilityOff : SfIconVisibility" />
      </button>
    </template>
  </SfInput>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { SfInput, SfIconVisibility, SfIconVisibilityOff } from '#components'

const isPasswordVisible = ref<boolean>()
</script>
