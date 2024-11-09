import { ref, onMounted, unref, computed, watch, onUnmounted } from 'vue'
import { focusVisibleManager } from '@storefront-ui/shared'
import type { FocusHandlerEvent, FocusModality } from '@storefront-ui/shared'
import type { FocusVisibleProps, FocusVisibleResult } from '../utils/FocusTypes'

const manager = focusVisibleManager()

export const useFocusVisible = (props: FocusVisibleProps = {}): FocusVisibleResult => {
  const isTextInput = computed(() => unref(props.isTextInput))
  const isFocusVisible = ref(props.autoFocus || manager.isFocusVisible())

  onMounted(() => {
    manager.setupGlobalFocusEvents()
  })

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let onCleanup = () => {}
  watch(
    isTextInput,
    () => {
      onCleanup()

      const handler = (modality: FocusModality, e: FocusHandlerEvent) => {
        if (!manager.isKeyboardFocusEvent(isTextInput?.value, modality, e)) {
          return
        }
        isFocusVisible.value = manager.isFocusVisible()
      }
      manager.changeHandlers.add(handler)

      onCleanup = () => {
        manager.changeHandlers.delete(handler)
      }
    },
    { immediate: true },
  )

  onUnmounted(() => {
    onCleanup()
  })

  return { isFocusVisible }
}
