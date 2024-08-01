<template>
  <div class="sidebar">
    <picture>
      <source :srcset="logoSmall" media="(max-width: 767px)" />
      <img :alt="logoAlt" :src="logo" class="sidebar-logo" />
    </picture>

    <slot />

    <span v-if="footerText" class="sidebar-footer">{{ footerText }}</span>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  /**
   * The URL to the logo image.
   */
  logo: String,

  /**
   * The URL to the small version of the logo image.
   * This is used for the mobile version of the sidebar.
   */
  logoSmall: String,

  /**
   * The alt text for the logo image.
   */
  logoAlt: String,

  /**
   * The text to display in the footer.
   */
  footerText: String,
})
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 3.5rem; /* 56px */
  width: 18.125rem; /* 290px */
  height: 100vh;
  overflow-y: auto;
  padding: 2.75rem 1.75rem 1.5rem;
}

.sidebar-logo {
  display: block;
  width: 100%;
  height: auto;
}

.sidebar-footer {
  margin-top: auto;
  color: hsl(var(--dimmed));
  font-size: 0.875em;
  font-weight: 600;
  text-align: center;
}
</style>
