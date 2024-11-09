<script lang="ts" setup>
import { ref, toRefs, type PropType, type ConcreteComponent } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useTrapFocus } from '../../composables/useTrapFocus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  tag: {
    type: [String, Object] as PropType<string | ConcreteComponent>,
    default: '',
  },
  disableClickAway: {
    type: Boolean,
    default: false,
  },
  disableEsc: {
    type: Boolean,
    default: false,
  },
})
const { disableClickAway, disableEsc, modelValue } = toRefs(props)
const emit = defineEmits<{
  (event: 'update:modelValue', isOpen: boolean): void
}>()

const modalRef = ref<HTMLElement>()

onClickOutside(modalRef, () => {
  if (disableClickAway.value) return
  emit('update:modelValue', false)
})

const onEscKeyDown = () => {
  if (disableEsc.value) return
  emit('update:modelValue', false)
}

useTrapFocus(modalRef, {
  trapTabs: true,
  activeState: modelValue,
  initialFocus: false,
  initialFocusContainerFallback: true,
})
</script>

<template>
  <component
    v-if="modelValue"
    :is="tag || 'div'"
    @keydown.esc="onEscKeyDown"
    aria-modal="true"
    data-testid="modal"
    ref="modalRef"
    tabindex="-1"
    class="fixed inset-0 m-auto h-fit w-fit rounded-xl border border-neutral-100 bg-white p-6 pt-10 shadow-xl outline-none lg:p-10"
  >
    <slot />
  </component>
</template>
