<template>
  <nav class="main-menu">
    <ul>
      <MainMenuItem
        v-for="item in items"
        :item="item"
        :linkComponent="linkComponent"
        @update:item="
          $emit(
            'update:items',
            items.map((i, j) => (i === item ? ($event as MainMenuParentItem) : i)),
          )
        "
      />
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import type { Component, PropType } from 'vue'
import { RouterLink } from 'vue-router'
import MainMenuItem, { type MainMenuParentItem } from './MainMenuItem.vue'

defineProps({
  /**
   * An array of menu items.
   */
  items: {
    type: Array as PropType<MainMenuParentItem[]>,
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

defineEmits<{
  'update:items': [items: MainMenuParentItem[]]
}>()
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
</style>
