<template>
  <div ref="root" class="slider swiper-container">
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

    <div ref="pagination" class="slider-pagination"></div>
  </div>
</template>

<script lang="ts" setup>
import Swiper from 'swiper'
import 'swiper/css'
import { Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules'
import { onMounted, onUnmounted, ref } from 'vue'

const root = ref<HTMLElement>()
const prevSlide = ref<HTMLElement>()
const nextSlide = ref<HTMLElement>()
const pagination = ref<HTMLElement>()

let swiper: Swiper | undefined

onMounted(() => {
  swiper = new Swiper(root.value!, {
    modules: [Keyboard, Mousewheel, Navigation, Pagination],
    slidesPerView: 'auto',
    autoHeight: true,
    speed: 400,
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
  })
})

onUnmounted(() => {
  swiper?.destroy()
})
</script>

<style scoped>
.slider {
  position: relative;
  overflow: hidden;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: calc(100% - 2.1875rem); /* 35px */
  pointer-events: none;
}

.container .slider-navigation {
  right: 1.75rem; /* 28px */
  left: 1.75rem; /* 28px */
}

.slider-navigation button {
  position: relative;
  display: flex;
  width: 4.5rem;
  height: 4.5rem;
  pointer-events: auto;
  color: hsl(var(--color-contrast));
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
  background-color: hsl(var(--color-contrast));
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
  transition-property: background-color;
}

.slider-pagination:deep() .swiper-pagination-bullet-active {
  background-color: hsl(var(--color-primary-base));
}

@media (max-width: 1023px) {
  .slider-navigation {
    display: none;
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
