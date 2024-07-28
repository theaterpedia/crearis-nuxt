<template>
  <nav class="main-menu">
    <ul>
      <li v-for="item in items" :key="item.label">
        <component
          v-if="item.type === 'link'"
          :is="linkComponent"
          :rel="item.link.startsWith('http') ? 'noopener noreferrer' : undefined"
          :target="item.link.startsWith('http') ? '_blank' : undefined"
          :to="item.link"
          class="main-menu-link"
        >
          {{ item.label }}
        </component>

        <template v-else-if="item.type === 'group'">
          <!-- @todo -->
          <button class="main-menu-group-label">{{ item.label }}</button>

          <ul class="main-menu-group-menu">
            <li v-for="child in item.children" :key="child.label">
              <component
                :is="linkComponent"
                :rel="child.link.startsWith('http') ? 'noopener noreferrer' : undefined"
                :target="child.link.startsWith('http') ? '_blank' : undefined"
                :to="child.link"
                class="main-menu-group-link"
              >
                {{ child.label }}
              </component>
            </li>
          </ul>
        </template>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import type { Component, PropType } from 'vue'
import { RouterLink } from 'vue-router'

export type MainMenuItem = {
  /**
   * The display label for the menu item.
   */
  label: string
} & (
  | {
      /**
       * The type of menu item.
       */
      type: 'link'

      /**
       * The URL (path) to navigate to when the menu item is clicked.
       */
      link: string
    }
  | {
      /**
       * The type of menu item.
       */
      type: 'group'

      /**
       * The child menu items.
       */
      children: Pick<MainMenuItem & { type: 'link' }, 'label' | 'link'>[]
    }
)

defineProps({
  /**
   * An array of menu items.
   */
  items: {
    type: Array as PropType<MainMenuItem[]>,
    required: true,
  },

  /**
   * The component to use for rendering links.
   * When using Nuxt, this should be `NuxtLink`.
   *
   * @default RouterLink
   */
  linkComponent: {
    type: Object as PropType<Component>,
    default: RouterLink,
  },
})
</script>

<style scoped>
.main-menu {
  line-height: 1em;
}

.main-menu > ul {
  font-size: 0.875em;
}

.main-menu li + li {
  margin-top: 1em;
}

.main-menu-group-menu {
  margin: 1em 0 1.75em;
}

.main-menu-link,
.main-menu-group-label {
  font-weight: 700;
  text-transform: uppercase;
}

.main-menu-link,
.main-menu-group-label,
.main-menu-group-link {
  display: flex;
  padding-left: 0.125em;
}

.sidebar .main-menu-link,
.sidebar .main-menu-group-label,
.sidebar .main-menu-group-link {
  width: calc(100% + 1.75rem + 0.125em);
  margin-right: calc(-0.75em - 0.125em);
  padding-right: calc(1.75rem + 0.125em);
}

.main-menu-link,
.main-menu-group-link {
  transition: var(--transition);
  transition-property: background-color;
}

.main-menu-link:hover,
.main-menu-group-link:hover {
  background-color: hsl(var(--primary));
}
</style>
