<script lang="ts">
export const variantClasses = {
  [SfButtonVariant.primary]:
    'text-white shadow hover:shadow-md active:shadow bg-primary-700 hover:bg-primary-800 active:bg-primary-900 disabled:bg-disabled-300',
  [SfButtonVariant.secondary]:
    'text-primary-700 hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 ring-1 ring-inset ring-primary-700 shadow hover:shadow-md active:shadow hover:ring-primary-800 active:ring-primary-900 disabled:ring-1 disabled:ring-disabled-300 disabled:bg-white/50',
  [SfButtonVariant.tertiary]:
    'text-primary-700 hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 disabled:bg-transparent',
}
</script>

<script lang="ts" setup>
import { type PropType, type ConcreteComponent, computed, toRefs } from 'vue'
import { SfButtonSize, SfButtonVariant } from '@storefront-ui/shared'
import { useAttrsRef } from '../../utils/reactiveContext'
import { NuxtLink } from '#components'

const props = defineProps({
  size: {
    type: String as PropType<`${SfButtonSize}`>,
    default: SfButtonSize.base,
  },
  variant: {
    type: String as PropType<`${SfButtonVariant}`>,
    default: SfButtonVariant.primary,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  square: {
    type: Boolean,
    default: false,
  },
  tag: {
    type: [String, Object] as PropType<string | ConcreteComponent>,
    default: NuxtLink,
  },
})

const { size, tag, square } = toRefs(props)

const sizeClasses = computed(() => {
  switch (size.value) {
    case SfButtonSize.sm:
      return [square.value ? 'p-1.5' : 'leading-5 text-sm py-1.5 px-3', 'gap-1.5']
    case SfButtonSize.lg:
      return [square.value ? 'p-4' : 'py-3 leading-6 px-6', 'gap-3']
    default:
      return [square.value ? 'p-2' : 'py-2 leading-6 px-4', 'gap-2']
  }
})
const tagWithDefaults = computed(() => tag?.value || 'button')

const attrs = useAttrsRef()
const type = computed(
  () =>
    attrs.value.type ??
    (typeof tagWithDefaults.value === 'string' && tagWithDefaults.value.toLowerCase() === 'button'
      ? 'button'
      : undefined),
)
</script>
<template>
  <component
    :disabled="disabled"
    :is="tagWithDefaults"
    :type="type"
    data-testid="button"
    :class="[
      'inline-flex items-center justify-center rounded-md text-base font-medium focus-visible:outline focus-visible:outline-offset disabled:cursor-not-allowed disabled:bg-disabled-300 disabled:text-disabled-500 disabled:shadow-none disabled:ring-0',
      sizeClasses,
      variantClasses[variant],
    ]"
  >
    <slot v-if="$slots.prefix" name="prefix" />
    <slot />
    <slot v-if="$slots.suffix" name="suffix" />
  </component>
</template>
