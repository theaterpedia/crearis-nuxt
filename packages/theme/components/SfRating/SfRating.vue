<script lang="ts">
const sizeClasses = {
  [SfRatingSize.xs]: 'text-xs',
  [SfRatingSize.sm]: 'text-sm',
  [SfRatingSize.base]: 'text-base',
  [SfRatingSize.lg]: 'text-lg',
  [SfRatingSize.xl]: 'text-xl',
}
</script>

<script lang="ts" setup>
import { computed, toRefs, type PropType } from 'vue'
import { clamp, roundToNearest } from '@storefront-ui/shared'
import { SfRatingSize } from './types'

const props = defineProps({
  size: {
    type: String as PropType<`${SfRatingSize}`>,
    default: SfRatingSize.base,
  },
  max: {
    type: Number,
    default: 5,
  },
  value: {
    type: Number,
    default: 0,
  },
  halfIncrement: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: undefined,
  },
})
const { value, max, halfIncrement, ariaLabel } = toRefs(props)

const precision = computed(() => (halfIncrement.value ? 0.5 : 1))
const ratingValue = computed(() => clamp(roundToNearest(value.value, precision.value), 0, max.value))
const partiallyFilled = computed(() => Number(!Number.isInteger(ratingValue.value)))
const filled = computed(() => Math.ceil(ratingValue.value - partiallyFilled.value))
const empty = computed(() => max.value - filled.value - partiallyFilled.value)
const label = computed(() => ariaLabel?.value ?? `${value.value} out of ${max.value}`)
</script>

<template>
  <span
    :ariaLabel="label"
    :title="label"
    data-testid="rating"
    role="img"
    :class="['text-warning-500 inline-flex items-center', sizeClasses[size]]"
  >
    <SfIconStarFilled v-for="index in filled" :key="index" aria-hidden="true" class="h-[1.5em] w-[1.5em]" />
    <SfIconStarHalf v-if="partiallyFilled" aria-hidden="true" class="h-[1.5em] w-[1.5em]" />
    <SfIconStar v-for="index in empty" :key="index" aria-hidden="true" class="text-disabled-500 h-[1.5em] w-[1.5em]" />
  </span>
</template>
