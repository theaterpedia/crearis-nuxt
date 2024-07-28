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
  max-height: 100vh;
  overflow-y: auto;
  padding: 2.75rem 1.75rem; /* 44px 28px */
}

.sidebar > * + * {
  margin-top: 3.5rem; /* 56px */
}
</style>
