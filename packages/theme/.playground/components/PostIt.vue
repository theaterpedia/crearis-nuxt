<template>
  <div :style="width === '1/3' ? 'font-size: 0.8em;' : '' " class="post-it column theme-shadow" :class="[`column-${width}`, `rotate-${rotation}`, `bg-${color}`, `${width==='1/5' ? 'p-2 text-[0.7em] sm:p-3 md:p-4 sm:text-[0.8em] ' : 'p-4 md:p-6 '}`]">
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
    >
    </Heading>
    <slot />
  </div>
</template>

<script lang="ts" setup>
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
    type: [Object, String] as PropType<'primary' | 'secondary' | 'yellow' | 'green' | 'pink' | 'muted'>,
    default: 'primary',
  }, 
  rotation: {
    type: [Object, String] as PropType<'none' | 'left' | 'right' | Number>,
    default: 'none',
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
    width: 20%;
    min-width: 10.5rem; /* 176px */
  }

  .column-1\/3 {
    width: calc(1 / 3 * 100%);
    min-width: 18rem; /* 288px */
  }

  .column-1\/2 {
    width: 50%;
    min-width: 21.5rem; /* 344px */
  }

  .column-3\/5 {
    width: 60%;
    min-width: 21.5rem; /* 344px */
  }

  .column-4\/5 {
    width: 80%;
    min-width: 21.5rem; /* 344px */
  }

  .rotate-left {
    rotate: -7deg;
  }

  .rotate-right {
    rotate: 5deg;
  }

  .rotate-none {
    rotate: 0deg;
  }

  .bg-primary {
    background-color: hsl(var(--primary-base));
  }
  .bg-secondary {
    background-color: hsl(var(--secondary-base));
  }
  .bg-muted {
    background-color: hsl(var(--muted-base));
  }
</style>