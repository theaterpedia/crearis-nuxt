<template>
  <SfInput :type="isPasswordVisible ? 'text' : 'password'">
    <template #suffix>
      <button type="button" @click="isPasswordVisible = !isPasswordVisible">
        <SfIconVisibility v-if="isPasswordVisible" />
        <SfIconVisibilityOff v-else />
      </button>
    </template>
  </SfInput>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isPasswordVisible = ref<boolean>();
</script>
