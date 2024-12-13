<template>
  <div
    class="post-it column theme-shadow"
    :class="[
      `column-${width}`,
      rotation,
      sticky !== 'static' ? 'sticky ' + sticky : '',
      `bg-${color}`,
      `${width === '1/5' ? 'p-2 text-[0.7em] sm:p-3 sm:text-[0.8em] md:p-4' : 'p-4 md:p-6'}`,
    ]"
    :style="width === '1/3' ? 'font-size: 0.8em;' : ''"
  >
    <Heading
      v-if="heading"
      :headline="headline"
      :is="is"
      :overline="overline ? overline : ''"
      :shortcode="shortcode ? shortcode : ''"
      :subline="subline ? subline : ''"
      :tags="tags ? tags : ''"
      class="mb-4"
      :style="
        $viewport.isLessThan('tablet')
          ? is === 'h2'
            ? 'font-size: 0.75em;'
            : is === 'h3'
              ? 'font-size: 0.825em;'
              : 'font-size: 0.875em;'
          : ''
      "
    ></Heading>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { Heading } from '@crearis/ui'
import { extractHeading } from '~/utils/md-renderer'
const props = defineProps({
  /**
   * The width of the column.
   * On tablet and mobile, the column will take up the full width.
   *
   * @default 'auto'
   */
  width: {
    type: String as PropType<'1/5' | '1/3' | '1/2' | '3/5' | '4/5'>,
    default: '1/3',
  },
  /**
   * The heading tag to render.
   *
   * @default 'h3'
   */
  is: {
    type: [Object, String] as PropType<'h2' | 'h3' | 'h4' | 'span'>,
    default: 'h3',
  },
  heading: {
    type: String,
    required: false,
  },
  color: {
    type: [Object, String] as PropType<'primary' | 'secondary' | 'yellow' | 'green' | 'pink' | 'accent' | 'muted'>,
    default: 'primary',
  },
  /**
   * The rotation of the column.
   *
   * @default 'rotate-0'
   */
  rotation: {
    type: String as PropType<
      'rotate-0' | '-rotate-3' | '-rotate-2' | '-rotate-1' | 'rotate-1' | 'rotate-2' | 'rotate-3'
    >,
    default: 'rotate-0',
  },
  /**
   * Specification to be written
   *
   * @default 'static'
   */
  sticky: {
    type: String as PropType<'static' | 'top-0' | 'top-20' | 'bottom-0' | 'bottom-20'>,
    default: 'static',
  },
})

import { useNuxtApp } from '#app'
const { $viewport } = useNuxtApp()

const { headline, overline, subline, tags, shortcode } = props.heading ? extractHeading(props.heading) : {}
</script>

<style scoped>
.theme-shadow {
  box-shadow: var(--theme-shadow);
}

.column-1\/5 {
  width: 17.5%;
  min-width: 10.5rem; /* 176px */
}

.column-1\/3 {
  width: calc(1 / 3 * 88%);
  min-width: 18rem; /* 288px */
}

.column-1\/2 {
  width: calc(1 / 2 * 93%);
  min-width: 21.5rem; /* 344px */
}

.column-3\/5 {
  width: 58%;
  min-width: 21.5rem; /* 344px */
}

.column-4\/5 {
  width: 79%;
  min-width: 21.5rem; /* 344px */
}

.-rotate-2 {
  rotate: -2deg;
}

.rotate-2 {
  rotate: 2deg;
}

.-rotate-1 {
  rotate: -1deg;
}

.rotate-1 {
  rotate: 1deg;
}

.-rotate-3 {
  rotate: -3deg;
}

.rotate-3 {
  rotate: 3deg;
}

.rotate-0 {
  rotate: 0deg;
}

.bg-primary {
  background-color: var(--color-primary-bg);
}
.bg-secondary {
  background-color: var(--color-secondary-bg);
}
.bg-muted {
  background-color: var(--color-muted-bg);
}
</style>
