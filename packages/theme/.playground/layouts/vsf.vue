<script lang="ts" setup></script>

<template>
  <Header class="mt-12" />
  <TheHeader />

  <div class="my-23 space-y-23">
    <!-- Our page blocks will be rendered here -->
    <slot />
  </div>

  <Footer class="mb-23" />
</template>
