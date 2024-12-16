<template>
  <Prose>
    <component
      :is="is"
      class="heading"
      :class="[hasOverline || hasSubline ? 'twoliner' : 'oneliner', fancyShortCode ? 'twocolums' : '']"
    >
      <span v-if="fancyShortCode" class="shortcode-float">{{ shortcode }}</span>
      <template v-if="hasOverline">
        <span v-if="extLineShortCode" class="shortcode">{{ shortcode }}</span>
        <span v-if="tags" class="tags">{{ tags }}</span>
        <span v-if="tags && overline" class="separator">//</span>
        <span class="overline">{{ overline }}</span>
      </template>
      <strong>
        <span v-if="mainLineShortCode" class="shortcode">{{ shortcode }}</span>
        {{ headline }}
      </strong>
      <template v-if="hasSubline">
        <span v-if="extLineShortCode" class="shortcode">{{ shortcode }}</span>
        <span v-if="tags" class="tags">{{ tags }}</span>
        <span v-if="tags && subline" class="separator">//</span>
        <span class="subline">{{ subline }}</span>
      </template>
      <!-- slot / not needed anymore? -->
    </component>
  </Prose>
</template>

<script lang="ts" setup>
import Prose from './Prose.vue'
import { ref } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  /**
   * The heading tag to render.
   *
   * @default 'h1'
   */
  is: {
    type: [Object, String] as PropType<'h1' | 'h2' | 'h3' | 'span' | 'li'>,
    default: 'h1',
  },
  /**
   * The main line of the heading, important for SEO.
   * required
   */
  headline: {
    type: String,
    required: true,
  },
  /**
   * For newspaper-style headings, typicall gives abstract/meta-informaton
   * small font-size
   * If provided, contents of the `subline` will be ignored.
   */
  overline: {
    type: String,
  },
  /**
   * For default headings, extends the headline with additional information
   * Only shows up, if no overline is provided
   */
  subline: {
    type: String,
  },
  /**
   * Tags extend the overline or subline with contextual information like date, time, location
   * if no overline or subline is provided, tags will be shown as overline
   */
  tags: {
    type: String,
  },
  /**
   * A unique shortcode representing the data of this heading, for instance "B1" for an event, "26.7" for a date
   * if no overline or subline is provided, tags will be shown as overline
   */
  shortcode: {
    type: String,
  },
  isMobile: {
    // for development purposes only > has to be removed
    type: Boolean,
    default: false,
  },
})

// TODO: detect mobile
// const isMobile = false

// TODO:  maybe refactor towards crearis 1.0 once runnung to have less computations
const hasOverline = ref(props.overline || (!props.subline && props.tags))
const hasSubline = ref(!hasOverline.value && (props.subline || props.tags))
const mainLineShortCode = ref(props.shortcode && !hasOverline.value && !hasSubline.value)
const extLineShortCode = ref(props.shortcode && props.isMobile && !mainLineShortCode.value)
const fancyShortCode = ref(props.shortcode && !props.isMobile && (hasOverline.value || hasSubline.value))
</script>

<style scoped>
.shortcode {
  margin-right: 0.3em;
  background-color: #999;
  padding: 0em 0.15em;
}

.shortcode,
.shortcode-float {
  font-weight: 800;
}

.separator {
  margin-right: 0.4em;
  margin-left: 0.4em;
}

.shortcode-float {
  float: left;
  margin-right: 0.15em;
  line-height: 0.9;
}
:where(h1, h2, h3).heading.twoliner :where(strong) {
  line-height: 1.05;
}

:where(h1, .h1) > span.shortcode-float {
  font-size: 4.4em;
}

:where(h2, .h2) > span.shortcode-float {
  font-size: 3.8em;
}

:where(h3, .h3) > span.shortcode-float {
  font-size: 3em;
}

.overline {
  font-weight: 300;
  text-decoration-line: none;
}

.twoliner {
}

.oneliner {
}

/* Add your styles here / deactivated
.heading {

}

.heading :deep() em {

}

.heading :deep() mark {

}

.heading :deep() strong {
  
}
*/
</style>
