<template>
  <div
    ref="pageBottomEl"
    class="page-bottom"
    :class="[
      `page-bottom-effect-${effect}`,
      { 'page-bottom-interaction': interaction },
    ]"
  >
    <!-- AnchorLine at top - sticky when not in interaction mode -->
    <AnchorLine
      v-if="computedAnchorline"
      :anchor="anchor"
      :variant="anchorlineVariant"
      :sticky="!interaction"
      class="page-bottom-anchorline"
    />

    <!-- Slot area: ConsultingDialog and other content -->
    <div ref="slotEl" class="page-bottom-slot" :class="[`page-bottom-slot-${contentWidth}`]">
      <Container>
        <slot />
      </Container>
    </div>

    <!-- Bottom effect div: background image with scroll-reveal (appear) or fixed background (uncover) -->
    <div
      v-if="!interaction && (imgTmp || claim)"
      ref="effectEl"
      class="page-bottom-effect"
      :class="{ 'page-bottom-effect-has-image': !!imgTmp }"
      :style="effect === 'uncover' && imgTmp ? {
        backgroundImage: `url(${computedImageUrl})`,
        backgroundPositionX: imgTmpAlignX,
        backgroundPositionY: imgTmpAlignY,
      } : undefined"
      :data-visible="imageVisible"
      :data-fully-visible="imageFullyVisible"
    >
      <!-- Background image layer - only for 'appear' effect -->
      <div
        v-if="effect === 'appear' && imgTmp"
        class="page-bottom-effect-image"
        :style="{
          backgroundImage: `url(${computedImageUrl})`,
          backgroundPositionX: imgTmpAlignX,
          backgroundPositionY: imgTmpAlignY,
        }"
      >
        <div v-if="overlay" class="page-bottom-effect-overlay" :style="{ background: overlay }"></div>
      </div>

      <!-- Overlay for 'uncover' effect -->
      <div v-if="effect === 'uncover' && overlay" class="page-bottom-effect-overlay" :style="{ background: overlay }"></div>

      <!-- Claim text -->
      <div
        v-if="claim"
        class="page-bottom-claim"
        :class="[
          `page-bottom-claim-${claim.orientation || 'left'}`,
          `page-bottom-claim-effect-${claim.effect || 'fade'}`,
        ]"
        :data-claim-visible="claimVisible"
      >
        <Container>
          <p class="page-bottom-claim-text">{{ claim.text }}</p>
        </Container>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, computed, ref, provide, onMounted, onUnmounted, watch } from 'vue'
import Container from './Container.vue'
import AnchorLine from './AnchorLine.vue'
import { pageBottomContextKey, type PageBottomContext } from './PageBottomContext'

interface ClaimConfig {
  text: string
  orientation?: 'left' | 'right'
  effect?: 'fade' | 'slide' | 'typewriter'
}

const props = defineProps({
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
   * - 'appear': Image fades in as user scrolls (default)
   * - 'uncover': Image sits behind entire PageBottom, effect div is translucent
   * - 'scroll': Image scrolls with parallax effect
   *
   * @default 'appear'
   */
  effect: {
    type: String as PropType<'appear' | 'uncover' | 'scroll'>,
    default: 'appear',
  },

  /**
   * Defines the width of the slot content.
   *
   * @default 'full'
   */
  contentWidth: {
    type: String as PropType<'short' | 'full'>,
    default: 'full',
  },

  /**
   * Claim configuration for text at bottom of effect area.
   * - text: The claim text to display
   * - orientation: 'left' | 'right' (default: 'left')
   * - effect: 'fade' | 'slide' | 'typewriter' (default: 'fade')
   */
  claim: {
    type: Object as PropType<ClaimConfig>,
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

// Element refs
const pageBottomEl = ref<HTMLElement | null>(null)
const slotEl = ref<HTMLElement | null>(null)
const effectEl = ref<HTMLElement | null>(null)

// Visibility state for scroll effect
const imageVisible = ref(false)
const imageFullyVisible = ref(false)
const claimVisible = ref(false)

// Compute anchorline visibility and variant
const computedAnchorline = computed(() => props.anchorline !== false)
const anchorlineVariant = computed(() => {
  if (props.anchorline === true) return 'accent'
  if (props.anchorline === false) return 'invisible'
  return props.anchorline
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

// IntersectionObserver for 'appear' effect scroll-based visibility
let observer: IntersectionObserver | null = null

const setupObserver = () => {
  if (!effectEl.value || props.effect !== 'appear') return

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry) return

      const ratio = entry.intersectionRatio

      // Image starts appearing at 50% visibility, fully visible at 80%
      imageVisible.value = ratio >= 0.5
      imageFullyVisible.value = ratio >= 0.8

      // Claim appears at 90% visibility
      claimVisible.value = ratio >= 0.9
    },
    {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    }
  )

  observer.observe(effectEl.value)
}

const cleanupObserver = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

// Watch for interaction changes to reset visibility
watch(interaction, (isInteracting) => {
  if (isInteracting) {
    cleanupObserver()
    imageVisible.value = false
    imageFullyVisible.value = false
    claimVisible.value = false
  } else {
    // Re-setup scroll detection when exiting interaction mode
    setTimeout(() => {
      setupObserver()
    }, 100)
  }
})

onMounted(() => {
  setupObserver()
})

onUnmounted(() => {
  cleanupObserver()
})
</script>

<style scoped>
.page-bottom {
  position: relative;
  display: flex;
  flex-direction: column;
}

/* AnchorLine positioning */
.page-bottom-anchorline {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

/* Slot area - content like ConsultingDialog */
.page-bottom-slot {
  position: relative;
  z-index: 1;
  padding: 2rem 1rem;
  background-color: var(--color-bg);
}

.page-bottom-slot-short {
  min-width: 23rem;
  max-width: 50rem;
}

.page-bottom-slot-full {
  width: 100%;
}

/* Bottom effect div - full viewport minus footer */
.page-bottom-effect {
  position: relative;
  height: calc(100svh - var(--footer-min-height));
  width: 100%;
  overflow: hidden;
  background-color: var(--color-bg);
}

/* Background image - fades in based on scroll visibility */
.page-bottom-effect-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 0.6s var(--ease);
}

/* Image visible at 50% scroll */
.page-bottom-effect[data-visible="true"] .page-bottom-effect-image {
  opacity: 0.5;
}

/* Image fully visible at 80% scroll */
.page-bottom-effect[data-fully-visible="true"] .page-bottom-effect-image {
  opacity: 1;
}

.page-bottom-effect-overlay {
  position: absolute;
  inset: 0;
}

/* Claim positioning */
.page-bottom-claim {
  position: absolute;
  bottom: 10%;
  left: 0;
  right: 0;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
}

.page-bottom-claim-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary-contrast, #fff);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  max-width: 40rem;
}

/* Claim orientation */
.page-bottom-claim-left .page-bottom-claim-text {
  text-align: left;
}

.page-bottom-claim-right .page-bottom-claim-text {
  text-align: right;
  margin-left: auto;
}

/* Claim effects */
.page-bottom-claim-effect-fade[data-claim-visible="true"] {
  opacity: 1;
}

.page-bottom-claim-effect-slide {
  transform: translateX(-2rem);
}

.page-bottom-claim-effect-slide.page-bottom-claim-right {
  transform: translateX(2rem);
}

.page-bottom-claim-effect-slide[data-claim-visible="true"] {
  opacity: 1;
  transform: translateX(0);
}

.page-bottom-claim-effect-typewriter .page-bottom-claim-text {
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  transition: width 1s steps(40, end);
}

.page-bottom-claim-effect-typewriter[data-claim-visible="true"] .page-bottom-claim-text {
  opacity: 1;
  width: 100%;
}

/* Scroll effect mode (parallax) */
.page-bottom-effect-scroll .page-bottom-effect {
  height: 200%;
}

.page-bottom-effect-scroll .page-bottom-effect-image {
  position: sticky;
  bottom: 0;
  height: 50%;
  opacity: 1;
}

/* Interaction mode: hide effect area completely */
.page-bottom-interaction .page-bottom-effect {
  display: none;
}

/* Uncover effect: CSS-only with background-attachment: fixed */
.page-bottom-effect-uncover .page-bottom-effect {
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

@media (max-width: 767px) {
  .page-bottom-slot {
    padding: 1.5rem 0;
  }

  .page-bottom-claim-text {
    font-size: 1.25rem;
  }
}
</style>
