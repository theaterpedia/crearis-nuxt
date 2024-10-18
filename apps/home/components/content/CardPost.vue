<template>
  <ContentRenderer :value="data">
    <div class="card">
      <NuxtLink :to="data._path">
        <div class="tagline" style="display: flex; flex-direction: row; justify-content: space-between; padding-inline: 1rem; ">
          <span style="line-height: 1rem; padding-top: 0.1em; font-size: 0.9em">{{ data.tagline ? data.tagline : '' }}</span>
          <span v-if="data.blog" style="line-height: 1rem; padding-top: 0.1em; font-size: 0.9em">{{ data.blog }}</span>
        </div>
        <CardHero
          :imgTmp="data.image?.src"
          :imgTmpAlignX="data.hero?.image_focus_x"
          :imgTmpAlignY="data.hero?.image_focus_y"
          :overlay="overlay"
          target="card"
          heightTmp="prominent"
          class="c-hero"
        >
          <Heading
            v-if="heading || data.heading || data.title"
            :content="heading ? heading : data.heading ? data.heading : data.title"
            is="h4"
            class="heading"
          />        
        </CardHero>
      </NuxtLink>
    </div>
  </ContentRenderer>
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components'

const props = defineProps({
  /**
   * typically undefined (if defined it overwrites the heading-entry of the src)
   */
  heading: {
    type: String,
  },
  /**
   * show the heading at the bottom
   * @default false
   */
  bottom: {
    type: Boolean,
    required: false,
  },  
  /**
   *
   */
  data: {
    type: Object as PropType<Record<string, unknown>>,
    required: true,
  },
})

const shortcodeTitle = (shortcode: string | undefined, title: string) => {
  if (!shortcode) return title
  return `_${shortcode.toUpperCase()}_ ${title}`
}

const overlay = `linear-gradient(${props.bottom ? '180deg' : '0deg'}, rgba(255, 255, 255, 0.95) 18%, rgba(255, 255, 255, 0.62) 50%, rgba(255, 255, 255, 0.10) 81%)`

const default_heading = '## Default Heading'
</script>

<style scoped>
.card {
  min-width: 21rem; /* 336px */
  max-width: 21rem;
  width: 21rem;
  box-shadow:
    0px 4px 6px 1px rgba(0, 0, 0, 0.1),
    0px 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: hsl(var(--card));
}

.tagline {
  background-color: hsl(var(--muted));
}

.tagline:hover {
  background-color: hsl(var(--primary));
}

.heading {
  padding: 0.5rem 1rem;
}



.column-auto {
  flex: 1;
}

.column > * + * {
  margin-top: 1.75rem; /* 28px */
}

.column-default {
  padding-top: var(--column-padding);
  padding-bottom: var(--column-padding);
}

.column-default:first-child {
  padding-left: var(--column-padding);
}

.column-default:last-child {
  padding-right: var(--column-padding);
}

.column-fill {
  align-self: stretch;
}

.column-fill :deep() > p:only-child {
  height: 100%;
}

.column-fill :where(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>