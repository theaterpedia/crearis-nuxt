<template>
  <div class="sidebar">
    <div class="sidebar-mobile-header">
      <button @click="isOpen = true" aria-label="Menü öffnen" class="sidebar-mobile-button">
        <svg
          fill="none"
          height="1.5em"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="1.5em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      <!-- Placeholder -->
      <span></span>
    </div>

    <div class="sidebar-drawer" :class="{ 'sidebar-drawer-open': isOpen }">
      <div class="sidebar-top">
        <RouterLink to="/">
          <img :alt="logoAlt" :src="logoSmall" class="sidebar-logo-small" />
        </RouterLink>

        <div class="sidebar-search">
          <svg
            fill="none"
            height="1em"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input placeholder="Suchen oder Befehl ..." type="text" />
        </div>

        <slot name="top" />

        <button @click="isOpen = false" aria-label="Menü schließen" class="sidebar-mobile-button">
          <svg
            fill="none"
            height="1.5em"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="1.5em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <RouterLink to="/">
        <img :alt="logoAlt" :src="logo" class="sidebar-logo" />
      </RouterLink>

      <slot />

      <span v-if="footerText" class="sidebar-footer">{{ footerText }}</span>
    </div>

    <div @click="isOpen = false" class="sidebar-drawer-overlay"></div>
  </div>
</template>

<script lang="ts" setup>
import { onKeyStroke } from '@vueuse/core'
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebar } from '../composables/useSidebar'

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

const { isOpen } = useSidebar()
const route = useRoute()

let stopKeyListener: () => void | undefined

watch(
  isOpen,
  () => {
    if (isOpen.value) {
      stopKeyListener = onKeyStroke('Escape', () => {
        isOpen.value = false
      })
    } else {
      stopKeyListener?.()
    }
  },
  { immediate: true },
)

watch(
  () => route.fullPath,
  () => {
    isOpen.value = false
  },
)
</script>

<style scoped>
.sidebar {
  position: sticky;
  z-index: 40;
  top: 0;
}

.sidebar-mobile-header {
  display: none;
  align-items: center;
  width: 100vw;
  height: 2.75rem;
  padding: 0 1rem;
  background-color: hsl(var(--card) / 48%);
  color: hsl(var(--card-foreground));
}

.sidebar-mobile-button {
  display: none;
  justify-content: center;
  align-items: center;
  gap: 1em;
  width: 2em;
  height: 2em;
}

.sidebar-mobile-button:last-child {
  margin-left: auto;
}

.sidebar-drawer {
  display: flex;
  flex-direction: column;
  width: 18.125rem; /* 290px */
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 1.75rem 1.5rem;
}

.sidebar-top {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 2.75rem;
  margin-bottom: 1rem;
}

.sidebar-logo-small {
  display: none;
  width: auto;
  height: 2rem;
}

.sidebar-search {
  flex: 1;
  position: relative;
  display: flex;
  font-size: 0.875rem;
}

.sidebar-search input {
  width: 100%;
  height: 100%;
  padding-left: calc(1em + 0.5rem);
  overflow: hidden;
  background-color: transparent;
  outline: none;
  text-overflow: ellipsis;
}

.sidebar-search input::placeholder {
  color: hsl(var(--dimmed));
}

.sidebar-search svg {
  position: absolute;
  top: 50%;
  left: 0;
  pointer-events: none;
  transform: translateY(-50%);
}

.sidebar-logo {
  display: block;
  width: 100%;
  height: auto;
  margin-bottom: 2em;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 2em;
  color: hsl(var(--dimmed));
  font-size: 0.875em;
  font-weight: 600;
  text-align: center;
}

.sidebar-drawer-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: hsl(var(--foreground) / 50%);
  visibility: hidden;
  opacity: 0;
  transition: var(--transition);
  transition-property: visibility, opacity;
}

@media (max-width: 1023px) {
  .sidebar-mobile-header {
    position: fixed;
    top: 0;
    display: flex;
  }

  .sidebar-mobile-button {
    display: flex;
  }

  .sidebar-drawer {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: hsl(var(--background));
    transition: var(--transition);
    transition-property: transform;
    transform: translate3d(-100%, 0, 0);
  }

  .sidebar-drawer-open {
    transform: translate3d(0, 0, 0);
  }

  .sidebar-drawer-open + .sidebar-drawer-overlay {
    visibility: visible;
    opacity: 1;
  }
}

@media (max-width: 767px) {
  .sidebar-drawer {
    width: 100%;
  }

  .sidebar-top {
    margin-bottom: 2.75rem;
  }

  .sidebar-logo-small {
    display: block;
  }

  .sidebar-logo {
    display: none;
  }
}
</style>
