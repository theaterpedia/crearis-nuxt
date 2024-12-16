<template>
  <div class="box" :class="{ 'box-centered': layout === 'centered' }">
    <slot />
  </div>
</template>

<script lang="ts" setup>
/*
 * tasks and todos see #33
 * for the moment relies on the box.
 * */

import type { PropType } from 'vue'

defineProps({
  /**
   * same as box?
   * @default 'centered'
   */
  layout: {
    type: String as PropType<'centered' | 'full-width'>,
    default: 'centered',
  },
  AlertType: {
    type: String as PropType<
      | 'note'
      | 'abstract'
      | 'summary'
      | 'tldr'
      | 'info'
      | 'todo'
      | 'tip'
      | 'hint'
      | 'important'
      | 'success'
      | 'check'
      | 'done'
      | 'question'
      | 'help'
      | 'faq'
      | 'warning'
      | 'fail'
      | 'failure'
      | 'missing'
      | 'danger'
      | 'error'
      | 'bug'
      | 'example'
      | 'quote'
      | 'cite'
    >,
    default: 'info',
  },
})
</script>

<style scoped>
.box {
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.box-centered {
  max-width: 90rem; /* 1440px */
  margin: 0 auto;
}

@media (max-width: 1023px) {
  .box-centered {
    flex-direction: column;
  }
}
</style>
