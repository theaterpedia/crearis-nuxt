<template>
  <div class="slider" :class="{ 'first-slide-left': firstSlideLeft && isFirstSlide, 'first-slide-section': firstSlideSection && isFirstSlide, 'is-first-slide': isFirstSlide }">
    <div ref="root" class="slider-inner swiper-container">
      <div class="slider-wrapper swiper-wrapper">
        <slot />
      </div>

      <div class="slider-navigation">
        <button aria-label="Vorheriger Slide" ref="prevSlide">
          <svg fill="currentColor" height="32" viewBox="0 0 256 256" width="32" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"
            ></path>
          </svg>
        </button>

        <button aria-label="Nächster Slide" ref="nextSlide">
          <svg fill="currentColor" height="32" viewBox="0 0 256 256" width="32" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <div ref="pagination" class="slider-pagination"></div>
  </div>
</template>

<script lang="ts" setup>
import Swiper from 'swiper'
import 'swiper/css'
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules'
import { onMounted, onUnmounted, ref, computed } from 'vue'

const props = defineProps({
  /**
   * When true, applies negative left margin on first slide to left-align content
   * @default true
   */
  firstSlideLeft: {
    type: Boolean,
    default: true,
  },
  /**
   * When true, first slide has no background and shows a right border instead
   * @default false
   */
  firstSlideSection: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'slideChange', payload: { isFirstSlide: boolean; isLastSlide: boolean; slideCount: number; currentSlidePos: number }): void
}>()

const root = ref<HTMLElement>()
const prevSlide = ref<HTMLElement>()
const nextSlide = ref<HTMLElement>()
const pagination = ref<HTMLElement>()

// Reactive slide state
const currentSlidePos = ref(0)
const slideCount = ref(0)
const isFirstSlide = computed(() => currentSlidePos.value === 0)
const isLastSlide = computed(() => currentSlidePos.value === slideCount.value - 1)

// Expose state to parent components
defineExpose({
  isFirstSlide,
  isLastSlide,
  slideCount,
  currentSlidePos,
})

let swiper: Swiper | undefined

const updateSlideState = () => {
  if (!swiper) return
  currentSlidePos.value = swiper.activeIndex
  slideCount.value = swiper.slides.length
  emit('slideChange', {
    isFirstSlide: isFirstSlide.value,
    isLastSlide: isLastSlide.value,
    slideCount: slideCount.value,
    currentSlidePos: currentSlidePos.value,
  })
}

// Debounced resize handler
let resizeTimeout: ReturnType<typeof setTimeout> | null = null
const handleResize = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    swiper?.updateAutoHeight(0)
    swiper?.update()
  }, 100)
}

onMounted(() => {
  swiper = new Swiper(root.value!, {
    modules: [Keyboard, Mousewheel, Navigation, Pagination],
    slidesPerView: 'auto',
    autoHeight: true,
    speed: 400,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    keyboard: {
      enabled: true,
    },
    mousewheel: {
      enabled: true,
      forceToAxis: true,
    },
    navigation: {
      prevEl: prevSlide.value!,
      nextEl: nextSlide.value!,
    },
    pagination: {
      el: pagination.value!,
      clickable: true,
    },
    on: {
      init: () => {
        updateSlideState()
        // Delay initial height calculation to ensure content is rendered
        setTimeout(() => swiper?.updateAutoHeight(0), 50)
      },
      slideChange: updateSlideState,
      slideChangeTransitionEnd: () => {
        // Force height recalculation after transition completes
        swiper?.updateAutoHeight(0)
      },
      resize: () => {
        swiper?.updateAutoHeight(0)
      },
    },
  })
  
  // Listen for window resize
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  swiper?.destroy()
  window.removeEventListener('resize', handleResize)
  if (resizeTimeout) clearTimeout(resizeTimeout)
})
</script>

<style scoped>
.slider {
  /* Outer wrapper - flex container for inner + pagination */
}

.slider-inner {
  position: relative;
  overflow: hidden;
}

/* First slide left alignment - applied via prop */
@media (min-width: 768px) {
  .slider.first-slide-left {
    margin-left: -2.75rem; /* matches Container padding */
  }
}
@media (max-width: 767px) {
  .slider.first-slide-left {
    margin-left: 0; /* Mobile: use default padding */
  }
}

/* First slide section style - no background, activator on right */
.slider.first-slide-section :deep(.swiper-slide:first-child .slide-inner) {
  background-color: transparent;
  --color-contrast: var(--color-card-contrast);
  --color-muted-contrast: var(--color-card-contrast);
  --link: var(--color-primary-base);
}

/* Right activator: next button with primary background and white borders */
/* TODO: Make activator border color configurable for dark/light/inverted theme support */
.slider.first-slide-section .slider-navigation button:last-child {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  height: auto;
  background-color: var(--color-primary-bg);
  color: var(--color-primary-contrast);
  /* White inner borders top/bottom matching slide-inner padding (1.125rem = 18px) */
  border-top: 1.125rem solid #fff;
  border-bottom: 1.125rem solid #fff;
  box-sizing: border-box;
}

.container .slider {
  width: calc(100% + 3.5rem); /* 56px */
  margin-right: -1.75rem;
  margin-left: -1.75rem;
  padding: 0 1.75rem;
}

.slider-wrapper {
  pointer-events: none;
}

.slider-navigation {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0; /* Full height of slider-inner */
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
}

.container .slider-inner .slider-navigation {
  right: 1.75rem; /* 28px */
  left: 1.75rem; /* 28px */
}

.slider-navigation button {
  position: relative;
  display: flex;
  width: 4.5rem;
  height: 4.5rem;
  pointer-events: auto;
  color: var(--color-contrast);
  transition: var(--transition);
  transition-property: opacity, visibility, color;
}

.slider-navigation button:disabled {
  opacity: 0;
  visibility: hidden;
}

.slider-navigation button svg {
  width: 3rem;
  height: 3rem;
  margin: auto;
}

.slider-pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.875rem;
  margin-top: 1.125rem; /* 18px */
}

.slider-pagination:deep() .swiper-pagination-bullet {
  width: 0.4375rem;
  height: 0.4375rem;
  background-color: var(--color-contrast);
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
  transition-property: background-color;
}

.slider-pagination:deep() .swiper-pagination-bullet-active {
  background-color: var(--color-primary-bg);
}

@media (max-width: 1023px) {
  .slider-navigation {
    display: none;
  }
  
  /* Show next button on first slide only */
  .slider.is-first-slide .slider-navigation {
    display: flex;
    z-index: 10; /* Above slide content */
  }
  
  .slider.is-first-slide .slider-navigation button:first-child {
    display: none; /* Hide prev button */
  }
  
  .slider.is-first-slide .slider-navigation button:last-child {
    width: 1.7rem; /* Narrow on mobile */
  }
}

@media (max-width: 767px) {
  .container .slider {
    width: calc(100% + 2rem);
    margin-right: -1rem;
    margin-left: -1rem;
    padding: 0 1rem;
  }
}
</style>
