<template>
  <div
    class="hero"
    :class="[
      target === 'page' ? `hero-${heightTmp}` : 'hero-mini card-hero',
      `hero-align-content-${contentAlignY}`,
      bottomline ? 'hero-bottomline' : '',
    ]"
  >
    <div class="hero-cover">
      <div
        :class="target === 'page' ? 'hero-cover-image' : 'static-cover-image'"
        :style="{
          backgroundImage: `url(${imgTmp})`,
          backgroundPositionX:
            target === 'page'
              ? imgTmpAlignX === 'stretch'
                ? 'left'
                : imgTmpAlignX === 'cover'
                  ? 'center'
                  : imgTmpAlignX
              : 'center',
          backgroundPositionY:
            target === 'page'
              ? imgTmpAlignY === 'stretch'
                ? 'top'
                : imgTmpAlignY === 'cover'
                  ? 'center'
                  : imgTmpAlignY
              : 'center',
          backgroundSize:
            target === 'page'
              ? imgTmpAlignX === 'cover' || imgTmpAlignY === 'cover'
                ? 'cover'
                : `${imgTmpAlignX === 'stretch' ? '100%' : 'auto'} ${imgTmpAlignY === 'stretch' ? '100%' : 'auto'}`
              : '500px',
        }"
      >
        <div v-if="overlay" class="hero-cover-overlay" :style="{ background: overlay }"></div>
      </div>
    </div>

    <div class="hero-content" :class="[`hero-content-${contentWidth}`, `hero-content-${contentType}`]">
      <Container>
        <slot />
      </Container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'
import Container from './Container.vue'

defineProps({
  /**
   * Defines the height of the hero.
   *
   * @default 'full'
   */
  heightTmp: {
    type: String as PropType<'full' | 'prominent' | 'medium' | 'mini'>,
    default: 'prominent',
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
   * deactivates the bottom-line.
   */
  bottomline: {
    type: Boolean,
    default: false,
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
   * makes hero cards-compatible if set to 'card'.
   */
  target: {
    type: String as PropType<'page' | 'card'>,
    default: 'page',
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
</script>

<style scoped>
.hero {
  position: relative;
  display: flex;
  justify-content: flex-start;
  padding: 6.25rem 0 6.25rem 1rem;
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
  min-height: 25vh;
}

.card-hero {
  max-width: 500px;
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

.hero-bottomline::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1rem;
  background-color: hsl(var(--color-primary-base));
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
  max-width: 500px;
  height: 50%;
  background-repeat: no-repeat;
}

.hero-cover-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.hero-content {
  position: relative;
}

.hero-align-content-top .hero-content {
  position: sticky;
  top: 6.25rem;
}

.hero-align-content-bottom .hero-content {
  position: sticky;
  bottom: 6.25rem;
}

.hero-content-short {
  min-width: 23rem; /* 368px */
  max-width: 50rem; /* 800px */
}

.hero-content-full {
  width: 100%;
}

@media (max-width: 767px) {
  .hero {
    padding: 0 0 1rem;
  }

  .hero-content > * {
    padding: 0;
  }

  .hero-content-text > * {
    padding: 1.75rem 1rem;
  }
}
</style>
