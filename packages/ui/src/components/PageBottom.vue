<template>
  <div
    ref="pageBottomEl"
    class="page-bottom"
    :class="[
      `page-bottom-${heightTmp}`,
      `page-bottom-align-content-${contentAlignY}`,
      `page-bottom-effect-${effect}`,
      { 'page-bottom-interaction': interaction },
    ]"
  >
    <!-- AnchorLine replaces the old CSS ::before topline -->
    <AnchorLine
      v-if="computedAnchorline"
      :anchor="anchor"
      :variant="anchorlineVariant"
      :sticky="!interaction"
      class="page-bottom-anchorline"
    />

    <div class="page-bottom-cover" :style="coverStyle">
      <div
        v-if="imgTmp && !interaction"
        class="page-bottom-cover-image"
        :style="{
          backgroundImage: `url(${computedImageUrl})`,
          backgroundPositionX: imgTmpAlignX,
          backgroundPositionY: imgTmpAlignY,
          backgroundSize: 'cover',
          opacity: imageOpacity,
        }"
      >
        <div v-if="overlay" class="page-bottom-cover-overlay" :style="{ background: overlay }"></div>
      </div>
      <div v-else class="page-bottom-cover-bg">
        <div v-if="overlay && !interaction" class="page-bottom-cover-overlay" :style="{ background: overlay }"></div>
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
import { type PropType, computed, ref, provide, onMounted, onUnmounted } from 'vue'
import Container from './Container.vue'
import AnchorLine from './AnchorLine.vue'
import { pageBottomContextKey, type PageBottomContext } from './PageBottomContext'

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
   * Anchor line at top of page-bottom.
   * - false: no anchor line
   * - true: anchor line with 'accent' variant (default)
   * - 'accent' | 'primary' | 'default' | 'muted': specific variant
   *
   * @default true
   */
  anchorline: {
    type: [Boolean, String] as PropType<boolean | 'accent' | 'primary' | 'default' | 'muted'>,
    default: true,
  },

  /**
   * The anchor ID for the anchorline element.
   * Used for scroll-to navigation.
   *
   * @default 'pagebottom'
   */
  anchor: {
    type: String,
    default: 'pagebottom',
  },

  /**
   * Background effect mode.
   * - 'appear': Image fades in as user scrolls (default, cleaner for interaction)
   * - 'scroll': Image scrolls with parallax effect (original behavior)
   *
   * @default 'appear'
   */
  effect: {
    type: String as PropType<'appear' | 'scroll'>,
    default: 'appear',
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

// Interaction state - provided to child components
const interaction = ref(false)
const setInteraction = (value: boolean) => {
  interaction.value = value
}

// Provide context to children (ConsultingDialog)
provide(pageBottomContextKey, {
  interaction,
  setInteraction,
  anchor: props.anchor,
})

// Element ref for scroll detection
const pageBottomEl = ref<HTMLElement | null>(null)

// Image opacity for 'appear' effect
const imageOpacity = ref(0)
const scrollProgress = ref(0)

// Compute anchorline visibility and variant
const computedAnchorline = computed(() => props.anchorline !== false)
const anchorlineVariant = computed(() => {
  if (props.anchorline === true) return 'accent'
  if (props.anchorline === false) return 'invisible'
  return props.anchorline
})

// Cover style - disables scroll effect when effect='appear' or interaction is active
const coverStyle = computed(() => {
  if (props.effect === 'appear' || interaction.value) {
    return {
      position: 'absolute' as const,
      height: '100%',
    }
  }
  return {}
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

// Scroll handler for 'appear' effect
const handleScroll = () => {
  if (props.effect !== 'appear' || !pageBottomEl.value || interaction.value) {
    imageOpacity.value = 0
    return
  }

  const rect = pageBottomEl.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  // Calculate how much of PageBottom is visible
  // When top of PageBottom is at bottom of viewport: 0%
  // When top of PageBottom is at top of viewport: 100%
  const visibleTop = Math.max(0, viewportHeight - rect.top)
  const totalHeight = rect.height

  // Progress from 0 (not visible) to 1 (50% scrolled into view)
  // Image starts fading in when 50% of the content has scrolled off top
  const progress = Math.min(1, Math.max(0, (visibleTop / totalHeight - 0.5) * 2))
  scrollProgress.value = progress
  imageOpacity.value = progress
}

onMounted(() => {
  if (props.effect === 'appear') {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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

/* AnchorLine positioning at absolute top */
.page-bottom-anchorline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

/* Cover - default behavior for 'scroll' effect */
.page-bottom-cover {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200%;
  transform: translate3d(0, 0, 0);
}

/* 'appear' effect: cover is static, no scroll */
.page-bottom-effect-appear .page-bottom-cover {
  height: 100%;
}

/* Interaction mode: suppress all background effects */
.page-bottom-interaction .page-bottom-cover {
  height: 100%;
}

/* Background sticks to BOTTOM for 'scroll' effect */
.page-bottom-cover-image,
.page-bottom-cover-bg {
  position: sticky;
  bottom: 0;
  width: 100%;
  height: 50%;
  background-repeat: no-repeat;
  background-color: var(--color-muted);
}

/* 'appear' effect: static positioning, full height */
.page-bottom-effect-appear .page-bottom-cover-image,
.page-bottom-effect-appear .page-bottom-cover-bg {
  position: relative;
  height: 100%;
  transition: opacity 0.5s ease;
}

/* Interaction mode: static, muted bg only */
.page-bottom-interaction .page-bottom-cover-image,
.page-bottom-interaction .page-bottom-cover-bg {
  position: relative;
  height: 100%;
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
