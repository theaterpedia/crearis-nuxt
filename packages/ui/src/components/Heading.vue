<template>
  <Prose>
    <component :is="is" class="heading" :class="[hasOverline || hasSubline ? 'twoliner' : 'oneliner',  maxShortCode ? 'flex-box' : '' ]">
      <span class="shortcode-float" v-if="fancyShortCode">{{ shortcode }}</span>
      <template v-if="hasOverline">
        <span class="shortcode" v-if="extLineShortCode">{{ shortcode }}  </span>
        <span class="tags" v-if="tags">{{ tags }}</span>
        <span class="separator" v-if="tags && overline"> // </span>
        <span class="overline">{{ overline  }}</span>
      </template>
      <strong>
        <span class="shortcode" v-if="mainLineShortCode">{{ shortcode }}  </span>
        {{ headline }}
      </strong>
      <template v-if="hasSubline">
        <span class="shortcode" v-if="extLineShortCode">{{ shortcode }}  </span>
        <span class="tags" v-if="tags">{{ tags }}</span>
        <span class="separator" v-if="tags && subline"> // </span>
        <span class="subline">{{ subline  }}</span>
      </template>
      <!-- slot / not needed anymore? -->
    </component>
  </Prose>
</template>

<script lang="ts" setup>
import Prose from './Prose.vue';
import { ref } from 'vue';
import type { PropType } from 'vue';

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
  headline: {
    type: String,
    required: true,
  },
  subline: {
    type: String,
  },  
  overline: {
    type: String,
  },
  tags: {
    type: String,
  },
  shortcode: {
    type: String,
  },  
  isMobile: { // for development purposes only > has to be removed
    type: Boolean,
    default: false,    
  },     
})

// TODO: detect mobile
// const isMobile = false

// TODO: do we need computed here? maybe refactor towards crearis 1.0 once runnung to have less computations
const hasOverline = ref(props.overline || (!props.subline && props.tags))
const hasSubline = ref(!hasOverline.value && (props.subline || props.tags))
const mainLineShortCode = ref(props.shortcode && (!hasOverline.value && !hasSubline.value))
const extLineShortCode = ref(props.shortcode && (props.isMobile && !mainLineShortCode.value))
const fancyShortCode = ref(props.shortcode && !props.isMobile && (hasOverline.value || hasSubline.value))

</script>

<style scoped>

.shortcode  {
  margin-right: 6px;
  background-color: #999;
}

.shortcode-float{
  font-size: 72px !important;
  float: left;
  margin-right: 14px;
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
