<template>
  <div class="sidebar">
    <slot />
  </div>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  width: 18.125rem; /* 290px */
  overflow-y: auto;
}
</style>
