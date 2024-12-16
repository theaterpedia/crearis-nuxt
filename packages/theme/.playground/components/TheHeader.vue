<script lang="ts" setup>
const isDesktopOrTablet = true
</script>

<template>
  <HeaderDesktop v-if="isDesktopOrTablet" />
  <HeaderMobile v-else />
</template>
