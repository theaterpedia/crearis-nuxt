<template>
  <ContentRenderer :value="data">
    <div class="card">
      <NuxtLink :to="data._path">
        <CardHero
          :imgTmp="data.image?.src"
          :imgTmpAlignX="data.hero?.image_focus_x"
          :imgTmpAlignY="data.hero?.image_focus_y"
          target="card"
          class="c-hero"
        ></CardHero>
        <Heading
          v-if="heading || data.heading || data.title"
          :content="heading ? heading : data.heading ? data.heading : data.title"
          is="h4"
          class="heading"
        />
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

.c-hero::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 0.5rem;
  background-color: hsl(var(--muted));
}
.c-hero:hover::after {
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
