<template>
  <div
    class="page-bottom"
    :class="[
      `page-bottom-${heightTmp}`,
      `page-bottom-align-content-${contentAlignY}`,
      topline ? 'page-bottom-topline' : '',
    ]"
  >
    <div class="page-bottom-cover">
      <div
        v-if="imgTmp"
        class="page-bottom-cover-image"
        :style="{
          backgroundImage: `url(${computedImageUrl})`,
          backgroundPositionX: imgTmpAlignX,
          backgroundPositionY: imgTmpAlignY,
          backgroundSize: 'cover',
        }"
      >
        <div v-if="overlay" class="page-bottom-cover-overlay" :style="{ background: overlay }"></div>
      </div>
      <div v-else class="page-bottom-cover-bg">
        <div v-if="overlay" class="page-bottom-cover-overlay" :style="{ background: overlay }"></div>
      </div>
    </div>

    <div class="page-bottom-content" :class="[`page-bottom-content-${contentWidth}`]">
      <Container>
        <slot />
      </Container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, computed } from 'vue'
import Container from './Container.vue'

const props = defineProps({
  /**
   * Defines the height of the page-bottom section.
   * Mirrors Hero.vue height options.
   *
   * @default 'medium'
   */
  heightTmp: {
    type: String as PropType<'full' | 'prominent' | 'medium' | 'mini'>,
    default: 'medium',
  },

  /**
   * The URL or Cloudinary path of the background image.
   * If cloudinary path (starts with /), will apply cloudinary transforms.
   */
  imgTmp: {
    type: String,
  },

  /**
   * Cloudinary crop height in pixels.
   * Used when imgTmp is a cloudinary path.
   *
   * @default 400
   */
  imgTmpHeight: {
    type: Number,
    default: 400,
  },

  /**
   * Cloudinary gravity for image crop.
   * 'south' shows the bottom of the image (e.g., feet).
   *
   * @default 'south'
   */
  imgTmpGravity: {
    type: String as PropType<'north' | 'south' | 'center' | 'auto'>,
    default: 'south',
  },

  /**
   * Defines the horizontal placement of the background image.
   *
   * @default 'center'
   */
  imgTmpAlignX: {
    type: String as PropType<'left' | 'right' | 'center'>,
    default: 'center',
  },

  /**
   * Defines the vertical placement of the background image.
   *
   * @default 'bottom'
   */
  imgTmpAlignY: {
    type: String as PropType<'top' | 'bottom' | 'center'>,
    default: 'bottom',
  },

  /**
   * The CSS background of the overlay on top of the cover image/bg.
   */
  overlay: {
    type: String,
  },

  /**
   * Displays an accent divider line at the top of the page-bottom.
   * Inverse of Hero's bottomline.
   *
   * @default true
   */
  topline: {
    type: Boolean,
    default: true,
  },

  /**
   * Defines the width of the content.
   *
   * @default 'full'
   */
  contentWidth: {
    type: String as PropType<'short' | 'full'>,
    default: 'full',
  },

  /**
   * Defines the vertical alignment of the content.
   *
   * @default 'top'
   */
  contentAlignY: {
    type: String as PropType<'top' | 'bottom' | 'center'>,
    default: 'top',
  },
})

/**
 * Compute cloudinary URL if imgTmp is a path (starts with /).
 * Otherwise return imgTmp as-is (full URL).
 */
const computedImageUrl = computed(() => {
  if (!props.imgTmp) return undefined

  // If already a full URL, use as-is
  if (props.imgTmp.startsWith('http')) {
    return props.imgTmp
  }

  // Cloudinary transform for path
  const cloudinaryBase = 'https://res.cloudinary.com/dasei/image/upload'
  const transforms = [
    'c_fill',
    'w_1920',
    `h_${props.imgTmpHeight}`,
    `g_${props.imgTmpGravity}`,
    'q_auto',
    'f_auto',
  ].join(',')

  // Remove leading slash if present for clean URL
  const path = props.imgTmp.startsWith('/') ? props.imgTmp.slice(1) : props.imgTmp

  return `${cloudinaryBase}/${transforms}/v1/${path}`
})
</script>

<style scoped>
.page-bottom {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 6.25rem 0;
  overflow: clip;
}

.page-bottom-full {
  min-height: 100vh;
}

.page-bottom-prominent {
  min-height: 75vh;
}

.page-bottom-medium {
  min-height: 50vh;
}

.page-bottom-mini {
  min-height: 25vh;
}

.page-bottom-align-content-top {
  justify-content: flex-start;
}

.page-bottom-align-content-center {
  justify-content: center;
}

.page-bottom-align-content-bottom {
  justify-content: flex-end;
}

/* Accent divider at TOP (inverse of Hero's bottomline) */
.page-bottom-topline::before {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  height: 1rem;
  background-color: var(--color-primary-bg);
  z-index: 2;
}

/* Cover extends UPWARD (inverse of Hero) */
.page-bottom-cover {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200%;
  transform: translate3d(0, 0, 0);
}

/* Background sticks to BOTTOM (inverse of Hero's top: 0) */
.page-bottom-cover-image,
.page-bottom-cover-bg {
  position: sticky;
  bottom: 0;
  width: 100%;
  height: 50%;
  background-repeat: no-repeat;
  background-color: var(--color-muted);
}

.page-bottom-cover-image {
  background-size: cover;
}

.page-bottom-cover-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.page-bottom-content {
  position: relative;
  z-index: 1;
  padding: 0 1rem;
}

.page-bottom-content-short {
  min-width: 23rem; /* 368px */
  max-width: 50rem; /* 800px */
}

.page-bottom-content-full {
  width: 100%;
}

@media (max-width: 767px) {
  .page-bottom {
    padding: 4rem 0;
  }

  .page-bottom-content {
    padding: 0;
  }
}
</style>
