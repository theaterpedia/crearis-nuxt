<template>
  <li
    class="main-menu-item"
    :class="[`main-menu-item-${level}`, { 'main-menu-item-no-wrap': !wrap }]"
    :style="{ paddingLeft: `${(level - 1) * 1}em` }"
  >
    <template v-if="'children' in item">
      <button @click="$emit('update:item', { ...item, expanded: !item.expanded })" class="main-menu-item-button">
        <span>{{ item.label }}</span>

        <svg
          v-if="level > 0 && item.expanded"
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
          <path d="m7 20 5-5 5 5" />
          <path d="m7 4 5 5 5-5" />
        </svg>

        <svg
          v-else-if="level > 0"
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
          <path d="m7 15 5 5 5-5" />
          <path d="m7 9 5-5 5 5" />
        </svg>
      </button>

      <ul v-if="item.children.length && item.expanded" class="main-menu-item-group">
        <MainMenuItem
          v-for="(child, i) in item.children"
          :item="child"
          :level="level + 1"
          :linkComponent="linkComponent"
          :wrap="wrap"
          @update:item="
            $emit('update:item', {
              ...item,
              children: item.children.map((c, j) => (j === i ? ($event as MainMenuParentItem) : c)),
            })
          "
        ></MainMenuItem>
      </ul>
    </template>

    <component
      v-else
      :is="linkComponent"
      :rel="item.link.startsWith('http') ? 'noopener noreferrer' : undefined"
      :target="item.link.startsWith('http') ? '_blank' : undefined"
      :to="item.link"
      class="main-menu-item-link"
    >
      <span>{{ item.label }}</span>
    </component>
  </li>
</template>

<script lang="ts" setup>
import { type Component, type PropType } from 'vue'
import { RouterLink } from 'vue-router'

export interface MainMenuParentItem {
  /**
   * The display label for the menu item.
   */
  label: string

  /**
   * The type of menu item.
   */
  children: (MainMenuParentItem | MainMenuLinkItem)[]

  /**
   * Whether the menu group is expanded.
   *
   * @default false
   */
  expanded?: boolean
}

export interface MainMenuLinkItem {
  /**
   * The display label for the menu item.
   */
  label: string

  /**
   * The URL (path) to navigate to when the menu item is clicked.
   */
  link: string
}

defineProps({
  /**
   * The menu item.
   */
  item: {
    type: Object as PropType<MainMenuParentItem | MainMenuLinkItem>,
    required: true,
  },

  /**
   * The current nesting level of the menu item.
   */
  level: {
    type: Number,
    default: 0,
  },

  /**
   * Whether to wrap text in the menu item.
   *
   * @default false
   */
  wrap: {
    type: Boolean,
    default: false,
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

defineEmits<{
  'update:item': [item: MainMenuParentItem | MainMenuLinkItem]
}>()
</script>

<style scoped>
.main-menu-item li + li {
  margin-top: 1em;
}

.main-menu-item-group {
  margin-top: 1em;
}

.main-menu-item-0 > .main-menu-item-group {
  margin-bottom: 1.75em;
}

.main-menu-item-button,
.main-menu-item-link {
  display: flex;
  width: calc(100% + 1.75rem + 0.125em);
  margin-right: calc(-0.75em - 0.125em);
  padding-right: calc(1.75rem + 0.125em);
  padding-left: 0.125em;
}

.main-menu-item-no-wrap .main-menu-item-button,
.main-menu-item-no-wrap .main-menu-item-link,
.main-menu-item-no-wrap .main-menu-item-button span,
.main-menu-item-no-wrap .main-menu-item-link span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.main-menu-item-button {
  align-items: center;
  gap: 0.5em;
  text-align: left;
}

.main-menu-item-0 > .main-menu-item-button {
  font-weight: 700;
  text-transform: uppercase;
}

.main-menu-item-link {
  transition: var(--transition);
  transition-property: background-color;
}

.main-menu-item-link:hover {
  background-color: hsl(var(--primary));
}
</style>
