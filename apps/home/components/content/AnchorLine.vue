<template>
  <div
    ref="anchorEl"
    :id="anchor"
    class="anchor-line"
    :class="[`anchor-line--${variant}`, { 'anchor-line--inline': inline }]"
  ></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, type PropType } from 'vue'

const props = defineProps({
  /**
   * The anchor ID for navigation. Used as the target for #anchor links.
   */
  anchor: {
    type: String,
    required: true,
  },
  /**
   * When true, the anchor has zero height (anchor target only, no visible line).
   * Use this when nesting inside a section-container.
   * @default false
   */
  inline: {
    type: Boolean,
    default: false,
  },
  /**
   * The color variant of the line.
   * - primary: Yellow/primary background (like hero bottomline)
   * - accent: Accent color background
   * - muted: Muted/gray background
   * - default: Default contrast color
   * - invisible: Transparent (anchor only, no visible line)
   *
   * @default 'primary'
   */
  variant: {
    type: String as PropType<'primary' | 'accent' | 'muted' | 'default' | 'invisible'>,
    default: 'primary',
  },
  /**
   * If true, emits 'anchor:enter' event when element enters viewport.
   */
  enter: {
    type: Boolean,
    default: false,
  },
  /**
   * If true, emits 'anchor:exit' event when element exits viewport.
   */
  exit: {
    type: Boolean,
    default: false,
  },
})

const anchorEl = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const emit = defineEmits<{
  (e: 'anchor:enter', anchor: string): void
  (e: 'anchor:exit', anchor: string): void
}>()

onMounted(() => {
  if (!props.enter && !props.exit) return
  if (!anchorEl.value) return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && props.enter) {
          emit('anchor:enter', props.anchor)
          // Dispatch custom event for layout-level handling
          window.dispatchEvent(new CustomEvent('anchorEnter', { detail: { anchor: props.anchor } }))
        } else if (!entry.isIntersecting && props.exit) {
          emit('anchor:exit', props.anchor)
          // Dispatch custom event for layout-level handling
          window.dispatchEvent(new CustomEvent('anchorExit', { detail: { anchor: props.anchor } }))
        }
      }
    },
    {
      threshold: 0.5,
      rootMargin: '0px',
    }
  )

  observer.observe(anchorEl.value)
})

onUnmounted(() => {
  if (observer && anchorEl.value) {
    observer.unobserve(anchorEl.value)
    observer.disconnect()
  }
})
</script>

<style scoped>
.anchor-line {
  width: 100%;
  height: 1rem; /* Matches hero bottomline height */
  scroll-margin-top: 0; /* Anchor scrolls to exact top of viewport */
  margin-top: -0.05rem; /* Pull up into section above to eliminate padding gap */
}

.anchor-line--primary {
  background-color: var(--color-primary-bg);
}

.anchor-line--accent {
  background-color: var(--color-accent-bg);
}

.anchor-line--muted {
  background-color: var(--color-muted-bg);
}

.anchor-line--default {
  background-color: var(--color-contrast);
}

.anchor-line--invisible {
  background-color: transparent;
}

.anchor-line--inline {
  height: 0;
  margin-top: 0; /* Reset negative margin when inside a section */
}
</style>
