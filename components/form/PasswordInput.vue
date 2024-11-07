<template>
  <SfInput :type="isPasswordVisible ? 'text' : 'password'">
    <template #suffix>
      <button type="button" @click="isPasswordVisible = !isPasswordVisible">
        <SfIconVisibilityOff v-if="isPasswordVisible"/>
        <SfIconVisibility v-else />
      </button>
    </template>
  </SfInput>
</template>

<script lang="ts" setup>

const isPasswordVisible = ref<boolean>();
</script>