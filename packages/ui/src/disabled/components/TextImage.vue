<template>
  <div class="text-image" :class="['text-image-' + heightTmp, `text-image-align-${contentAlignY}`]">
    <div class="text-image-grid">
      <!-- Text Column (Left on desktop, bottom on mobile) -->
      <div class="text-image-content">
        <slot />
      </div>
      
      <!-- Image Column (Right on desktop, top on mobile) -->
      <div class="text-image-media">
        <div
          v-if="imgTmp"
          class="text-image-media-inner"
          :style="{
            backgroundImage: `url(${imgTmp})`,
            backgroundPositionX: getBackgroundPositionX,
            backgroundPositionY: getBackgroundPositionY,
            backgroundSize: getBackgroundSize,
          }"
        ></div>
        <slot v-else name="media" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, computed } from 'vue'

const props = defineProps({
  /**
   * Defines the height of the text-image component.
   *
   * @default 'prominent'
   */
  heightTmp: {
    type: String as PropType<'full' | 'prominent' | 'medium' | 'mini'>,
    default: 'prominent',
  },

  /**
   * The URL of the image used as a background in the media column.
   */
  imgTmp: {
    type: String,
  },

  /**
   * Defines the horizontal placement of the background image.
   */
  imgTmpAlignX: {
    type: String as PropType<'left' | 'right' | 'center' | 'stretch' | 'cover'>,
    default: 'center',
  },

  /**
   * Defines the vertical placement of the background image.
   */
  imgTmpAlignY: {
    type: String as PropType<'top' | 'bottom' | 'center' | 'stretch' | 'cover'>,
    default: 'center',
  },

  /**
   * Defines the vertical alignment of the text content.
   */
  contentAlignY: {
    type: String as PropType<'top' | 'bottom' | 'center'>,
    default: 'center',
  },
})

const getBackgroundPositionX = computed(() => {
  switch (props.imgTmpAlignX) {
    case 'left':
      return 'left'
    case 'right':
      return 'right'
    case 'center':
      return 'center'
    case 'stretch':
    case 'cover':
      return 'center'
    default:
      return 'center'
  }
})

const getBackgroundPositionY = computed(() => {
  switch (props.imgTmpAlignY) {
    case 'top':
      return 'top'
    case 'bottom':
      return 'bottom'
    case 'center':
      return 'center'
    case 'stretch':
    case 'cover':
      return 'center'
    default:
      return 'center'
  }
})

const getBackgroundSize = computed(() => {
  if (props.imgTmpAlignX === 'cover' || props.imgTmpAlignY === 'cover') {
    return 'cover'
  }
  if (props.imgTmpAlignX === 'stretch' || props.imgTmpAlignY === 'stretch') {
    return '100% 100%'
  }
  return 'contain'
})
</script>

<style scoped>
.text-image {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.text-image-full {
  min-height: 40rem;
}

.text-image-prominent {
  min-height: 28rem;
}

.text-image-medium {
  min-height: 21rem;
}

.text-image-mini {
  min-height: 14rem;
}

.text-image-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  height: 100%;
  min-height: inherit;
}

/* Mobile: Stack columns, image on top */
@media (max-width: 767px) {
  .text-image-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .text-image-content {
    order: 2;
  }
  
  .text-image-media {
    order: 1;
  }
}

.text-image-content {
  display: flex;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

.text-image-align-top .text-image-content {
  align-items: flex-start;
}

.text-image-align-center .text-image-content {
  align-items: center;
}

.text-image-align-bottom .text-image-content {
  align-items: flex-end;
}

.text-image-media {
  position: relative;
  overflow: hidden;
}

.text-image-media-inner {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
}

/* Mobile adjustments for text content */
@media (max-width: 767px) {
  .text-image-content {
    padding: 1.5rem;
  }
  
  .text-image-media {
    min-height: 16rem;
  }
}
</style>
