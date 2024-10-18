<template>
  <div
    class="hero"
    :class="['hero-mini card-hero', `hero-align-content-${contentAlignY}`]"
  >
    <div class="hero-cover">
      <div
        class="static-cover-image"
        :style="{
          backgroundImage: `url(${imgTmp})`,
          backgroundPositionX: 'center',
          backgroundPositionY: 'center',
          backgroundSize: '340px',
        }"
      ></div>

      <div v-if="overlay" class="hero-cover-overlay" :style="{ background: overlay }"></div>
    </div>

    <div class="hero-content" :class="[`hero-content-${contentWidth}`, `hero-content-${contentType}`]">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'

defineProps({
  /**
   * Defines the height of the hero.
   *
   * @default 'full'
   */
  heightTmp: {
    type: String as PropType<'full' | 'prominent' | 'medium' | 'mini'>,
    default: 'medium',
  },

  /**
   * The URL of the image used as a background.
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
    default: 'stretch',
  },

  /**
   * The CSS background of the overlay on top of the cover image.
   */
  overlay: {
    type: String,
  },

  /**
   * Defines the width of the content.
   */
  contentWidth: {
    type: String as PropType<'short' | 'full'>,
    default: 'short',
  },

  /**
   * Defines the vertical alignment of the content.
   */
  contentAlignY: {
    type: String as PropType<'top' | 'bottom' | 'center'>,
    default: 'bottom',
  },



  /**
   * Defines the padding of the content.
   *
   * - `text` - Applies standard padding like in sections.
   * - `banner` - Sticks the content to the edges on phone screens.
   */
  contentType: {
    type: String as PropType<'text' | 'banner'>,
    default: 'text',
  },
})

const target = 'card'
</script>

<style scoped>
.hero {
  position: relative;
  display: flex;
  justify-content: flex-start;
  overflow: clip;
}

.hero-full {
  min-height: 100vh;
}

.hero-prominent {
  min-height: 75vh;
}

.hero-medium {
  min-height: 50vh;
}

.hero-mini {
  min-height: 170px;
}

.card-hero {
  max-width: 340px;
}

.hero-align-content-top {
  align-items: flex-start;
}

.hero-align-content-center {
  align-items: center;
}

.hero-align-content-bottom {
  align-items: flex-end;
}

.hero-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;
  transform: translate3d(0, 0, 0);
}

.hero-cover-image {
  position: sticky;
  top: 0;
  width: 100%;
  height: 50%;
  background-repeat: no-repeat;
}

.static-cover-image {
  top: 0;
  width: 100%;
  max-width: 340px;
  height: 50%;
  background-repeat: no-repeat;
}

.hero-cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
}

.hero-content {
  position: relative;
}

.hero-content-short {
  min-width: 340px; /* 368px */
  max-width: 340px; /* 800px */
}

.hero-content-full {
  width: 100%;
}
</style>
