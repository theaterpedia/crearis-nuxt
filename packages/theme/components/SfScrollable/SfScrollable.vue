<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>
<script lang="ts" setup>
import { computed, toRefs, type PropType, type ConcreteComponent, reactive } from 'vue'
import { ClassProp } from '../../utils'

import { useScrollable } from '../../composables/useScrollable'

import {
  SfScrollableDirection,
  SfScrollableButtonsPlacement,
  type SfScrollableOnDragStartData,
  type SfScrollableOnScrollData,
  type SfScrollableOnPrevData,
  type SfScrollableOnNextData,
  type SfScrollableOnDragEndData,
  type ScrollableOptions,
} from '../../utils/ScrollableTypes'

const props = defineProps({
  tag: {
    type: [String, Object] as PropType<string | ConcreteComponent>,
    default: 'div',
  },
  direction: {
    type: String as PropType<`${SfScrollableDirection}`>,
    default: SfScrollableDirection.horizontal,
  },
  buttonsPlacement: {
    type: String as PropType<`${SfScrollableButtonsPlacement}`>,
    default: SfScrollableButtonsPlacement.block,
  },
  wrapperClass: ClassProp,
  activeIndex: {
    type: Number,
    default: undefined,
  },
  reduceMotion: {
    type: Boolean,
    default: undefined,
  },
  drag: {
    type: [Object, Boolean] as PropType<ScrollableOptions['drag']>,
    default: undefined,
  },
  prevDisabled: {
    type: Boolean,
    default: undefined,
  },
  nextDisabled: {
    type: Boolean,
    default: undefined,
  },
  isActiveIndexCentered: {
    type: Boolean,
    default: false,
  },
  buttonPrevAriaLabel: {
    type: String,
    default: 'Previous',
  },
  buttonNextAriaLabel: {
    type: String,
    default: 'Next',
  },
})
const emit = defineEmits<{
  (e: 'onDragStart', data: SfScrollableOnDragStartData): void
  (e: 'onDragEnd', data: SfScrollableOnDragEndData): void
  (e: 'onScroll', data: SfScrollableOnScrollData): void
  (e: 'onPrev', data: SfScrollableOnPrevData): void
  (e: 'onNext', data: SfScrollableOnNextData): void
}>()
const { direction, activeIndex, reduceMotion, drag, isActiveIndexCentered } = toRefs(props)

const { containerRef, state, getNextButtonProps, getPrevButtonProps } = useScrollable(
  computed(() => ({
    ...reactive({
      direction,
      activeIndex,
      reduceMotion,
      drag,
      isActiveIndexCentered,
    }),
    onDragStart: (data) => emit('onDragStart', data),
    onDragEnd: (data) => emit('onDragEnd', data),
    onScroll: (data) => emit('onScroll', data),
    onPrev: (data) => emit('onPrev', data),
    onNext: (data) => emit('onNext', data),
  })),
)

const isHorizontal = computed(() => props.direction === SfScrollableDirection.horizontal)
const isFloating = computed(() => props.buttonsPlacement === SfScrollableButtonsPlacement.floating)
const isBlock = computed(() => props.buttonsPlacement === SfScrollableButtonsPlacement.block)
</script>

<template>
  <div :class="['items-center', 'relative', isHorizontal ? 'flex' : 'inline-flex h-full flex-col', wrapperClass]">
    <slot
      v-if="$slots.previousButton && buttonsPlacement !== SfScrollableButtonsPlacement.none"
      v-bind="getPrevButtonProps"
      name="previousButton"
    />
    <SfButton
      v-else-if="buttonsPlacement !== SfScrollableButtonsPlacement.none"
      v-bind="getPrevButtonProps"
      :aria-label="buttonPrevAriaLabel"
      :disabled="prevDisabled || getPrevButtonProps.disabled"
      size="lg"
      square
      variant="secondary"
      :class="[
        'hidden !rounded-full bg-white !text-neutral-500 !ring-neutral-500 md:block',
        {
          'mr-4': isBlock && isHorizontal,
          'rotate-30 mb-4': isBlock && !isHorizontal,
          'absolute left-4 z-10': isFloating && isHorizontal,
          'rotate-30 absolute top-4 z-10': isFloating && !isHorizontal,
        },
        isFloating ? 'disabled:hidden' : 'disabled:!text-disabled-500 disabled:!ring-disabled-300',
      ]"
    >
      <SfIconChevronLeft />
    </SfButton>
    <component
      v-bind="{ ...$attrs, ...props }"
      :disabled="prevDisabled"
      :is="tag"
      ref="containerRef"
      :class="[
        'motion-safe:scroll-smooth',
        {
          'flex gap-4 overflow-x-auto': isHorizontal,
          'flex flex-col gap-4 overflow-y-auto': !isHorizontal,
          'cursor-grab': state.isDragged,
        },
      ]"
    >
      <slot />
    </component>
    <slot
      v-if="$slots.nextButton && buttonsPlacement !== SfScrollableButtonsPlacement.none"
      v-bind="getNextButtonProps"
      name="nextButton"
    />
    <SfButton
      v-else-if="buttonsPlacement !== SfScrollableButtonsPlacement.none"
      v-bind="getNextButtonProps"
      :aria-label="buttonNextAriaLabel"
      :disabled="nextDisabled || getNextButtonProps.disabled"
      size="lg"
      square
      variant="secondary"
      :class="[
        'hidden !rounded-full bg-white !text-neutral-500 !ring-neutral-500 md:block',
        {
          'ml-4': isBlock && isHorizontal,
          'rotate-30 mt-4': isBlock && !isHorizontal,
          'absolute right-4 z-10': isFloating && isHorizontal,
          'rotate-30 absolute bottom-4 z-10': isFloating && !isHorizontal,
        },
        isFloating ? 'disabled:hidden' : 'disabled:!text-disabled-500 disabled:!ring-disabled-300',
      ]"
    >
      <SfIconChevronRight />
    </SfButton>
  </div>
</template>
