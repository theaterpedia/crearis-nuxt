<script lang="ts">
export const sizeClasses = {
  [SfListItemSize.sm]: 'text-sm px-4 py-1',
  [SfListItemSize.base]: 'px-4 py-2',
  [SfListItemSize.lg]: 'p-4',
}
</script>

<script lang="ts" setup>
import { type PropType, type ConcreteComponent } from 'vue'
import { SfListItemSize } from './types'

defineProps({
  size: {
    type: String as PropType<`${SfListItemSize}`>,
    default: SfListItemSize.base,
  },
  disabled: {
    type: Boolean,
    default: undefined,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  tag: {
    type: [String, Object] as PropType<string | ConcreteComponent>,
    default: undefined,
  },
  childrenTag: {
    type: String,
    default: 'span',
  },
})
</script>

<template>
  <component
    :disabled="disabled"
    :is="tag || 'li'"
    data-testid="list-item"
    :class="[
      'inline-flex w-full cursor-pointer items-center gap-2 hover:bg-neutral-100 focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-offset active:bg-neutral-200',
      sizeClasses[size],
      { 'pointer-events-none cursor-not-allowed text-disabled-900': disabled, 'font-medium': selected },
    ]"
  >
    <component v-if="$slots.prefix" :is="childrenTag" :class="disabled ? 'text-disabled-500' : 'text-neutral-500'">
      <slot name="prefix" />
    </component>
    <component :is="childrenTag" class="flex w-full min-w-0 flex-col">
      <slot />
    </component>
    <component v-if="$slots.suffix" :is="childrenTag" :class="disabled ? 'text-disabled-500' : 'text-neutral-500'">
      <slot name="suffix" />
    </component>
  </component>
</template>
