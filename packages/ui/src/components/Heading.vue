<template>
  <Prose>
    <component :is="is" class="heading" :class="[hasOverline || hasSubline ? 'twoliner' : 'oneliner',  maxShortCode ? 'flex-box' : '' ]">
      <template v-if="maxShortCode">
        <span class="flex-item shortcode">{{ shortcode }}</span>
      </template> 
      <div class="maxShortCode ? 'flex-item' : '' ">
        <template v-if="hasOverline">
          <span class="tags" v-if="tags">{{ tags }}</span>
          <span class="separator" v-if="tags && overline"> // </span>
          <span class="overline">{{ overline  }}</span>
        </template>
        <strong>
          <template v-if="minShortCode">
            <span class="shortcode">{{ shortcode }}</span>
          </template>
          {{ headline }}
        </strong>
        <template v-if="hasSubline">
          <span class="tags" v-if="tags">{{ tags }}</span>
          <span class="separator" v-if="tags && subline"> // </span>
          <span class="subline">{{ subline  }}</span>
        </template>
      </div>
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
})

// TODO: detect mobile
const isMobile = false

// TODO: do we need computed here? maybe refactor towards crearis 1.0 once runnung to have less computations
const hasOverline = ref(props.overline || (!props.subline && props.tags))
const hasSubline = ref(!hasOverline.value && (props.subline || props.tags))
const minShortCode = ref(props.shortcode && (isMobile || (!hasOverline.value && !hasSubline.value)))
const maxShortCode = ref(props.shortcode && !minShortCode.value)

</script>

<style scoped>
.flex-box {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-start;
}

.flex-item {
  flex: none;
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
