<template>
  <SfInput :type="isPasswordVisible ? 'text' : 'password'">
    <template #suffix>
      <button type="button" @click="isPasswordVisible = !isPasswordVisible">
        <component :is="isPasswordVisible ? SfIconVisibilityOff : SfIconVisibility" />
      </button>
    </template>
  </SfInput>
</template>

<script lang="ts" setup>
import { SfInput, SfIconVisibility, SfIconVisibilityOff } from '@crearis/vue';

const isPasswordVisible = ref<boolean>();
</script>