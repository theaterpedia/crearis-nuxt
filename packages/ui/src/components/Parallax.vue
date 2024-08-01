<template>
  <div ref="root" class="parallax" :class="[`parallax-${placement}`]">
    <div
      class="parallax-bg"
      :style="{
        backgroundImage: `url(${backgroundImage})`,
        transform: `translate3d(0, ${dy}px, 0)`,
      }"
    ></div>

    <div class="parallax-content">
      <Container>
        <slot />
      </Container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useElementBounding } from '@vueuse/core'
import { ref, watch, type PropType } from 'vue'
import Container from './Container.vue'

const props = defineProps({
  /**
   * The background image.
   */
  backgroundImage: {
    type: String,
    required: true,
  },

  /**
   * Defines whether the parallax component is placed above or below the main content.
   */
  placement: {
    type: String as PropType<'above' | 'below'>,
    required: true,
  },
})

const root = ref<HTMLElement | null>(null)
const { top, bottom, height } = useElementBounding(root)
const dy = ref(0)

watch(
  [top, bottom, height],
  () => {
    dy.value =
      props.placement === 'above'
        ? Math.min(-top.value / 2, height.value) / 2
        : Math.max((height.value - bottom.value) / 2, -(height.value / 2))
  },
  { immediate: true },
)
</script>

<style scoped>
.parallax {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  min-height: 100vh;
  padding: 6.25rem 0; /* 100px */
  overflow: hidden;
}

.parallax-above {
  border-bottom: 1rem solid hsl(var(--primary));
}

.parallax-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-repeat: no-repeat;
  background-size: cover;
}

.parallax-above .parallax-bg {
  background-position: top center;
}

.parallax-below .parallax-bg {
  background-position: bottom center;
}

.parallax-content {
  position: relative;
  min-width: 23rem; /* 368px */
  max-width: 40rem; /* 640px */
}

@media (max-width: 1023px) {
  .parallax {
    --offset: 2.75rem; /* 44px */
    min-height: calc(100vh - var(--offset));
  }
}
</style>
