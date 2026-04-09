<template>
  <ContentRenderer :value="data">
    <div class="card">
      <NuxtLink :to="data.productlink || data._path">
        <CardHero
          :imgTmp="data.image?.src"
          :imgTmpAlignX="data.hero?.image_focus_x"
          :imgTmpAlignY="data.hero?.image_focus_y"
          target="card"
          class="c-hero"
        ></CardHero>
        <Heading
          v-if="heading || data.heading || data.title"
          card
          :content="heading ? heading : data.heading ? data.heading : data.title"
          is="h4"
          class="heading"
        />
      </NuxtLink>
      <!-- Date + location tagline at bottom -->
      <NuxtLink v-if="dateTimeStr || cityStr" :to="data.productlink || data._path" class="card-tagline">
        <span>{{ dateTimeStr }}</span>
        <span v-if="cityStr">{{ cityStr }}</span>
      </NuxtLink>
    </div>
  </ContentRenderer>
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components'
import { computed } from 'vue'
import {
  extractCity,
  formatDateCompact,
  formatTime,
} from '~/composables/useRepeatingEvents'

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

const dateTimeStr = computed(() => {
  const dateStart = props.data.date_start as string | undefined
  const dateEnd = (props.data.date_end || props.data.end) as string | undefined
  if (!dateStart) return ''
  const dateStr = formatDateCompact(dateStart, dateEnd)
  const start = new Date(dateStart)
  const end = dateEnd ? new Date(dateEnd) : null
  const isSingleDay = !end || (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth() && start.getDate() === end.getDate())
  const timeStr = isSingleDay ? formatTime(start) : ''
  return [dateStr, timeStr].filter(Boolean).join(' ')
})

const cityStr = computed(() => {
  return extractCity(props.data.location as string | undefined, props.data.tag as string | undefined)
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
  background-color: var(--color-card-bg);
}

.c-hero::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 0.5rem;
  background-color: var(--color-muted-bg);
}
.c-hero:hover::after {
  background-color: var(--color-primary-bg);
}

.heading {
  padding: 0.5rem 1rem;
}

.heading :deep() > h4.heading > .overline {
  font-size: 0.825rem;
}

/* Date + location tagline at card bottom */
.card-tagline {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-inline: 1rem;
  background-color: var(--color-muted-bg);
  text-decoration: none;
  color: inherit;
  line-height: 1rem;
  padding-top: 0.1em;
  padding-bottom: 0.1em;
  font-size: 0.9em;
}

.card-tagline:hover {
  background-color: var(--color-primary-bg);
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
