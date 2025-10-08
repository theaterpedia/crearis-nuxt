<template>
  <!-- TODO: Hardcoded padding is a hack. Should use CSS classes or theme variables instead of inline styles -->
  <div :style="option === 'bauchbinde' ? 'padding-left: 4rem;' : ''"
    :class="{
      banner: !card,
      transparent: transparent,
      card: card,
      primary: themeColor === 'primary',
      secondary: themeColor === 'secondary',
      neutral: themeColor === 'neutral' || !themeColor,
      muted: themeColor === 'muted',
      accent: themeColor === 'accent',
    }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'

defineProps({
  /**
   * Specifies whether the banner background is slightly transparent.
   */
  transparent: {
    type: Boolean,
    default: false,
  },

  /**
   * Theme color for the banner background.
   * @default 'neutral'
   */
  themeColor: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'muted' | 'accent'>,
    default: 'neutral',
  },

  /**
   * Options for special effects.
   * TODO: This is currently a hack for bauchbinde layout. The hardcoded padding should be 
   * refactored into proper CSS classes or controlled by theme variables.
   * @default ''
   */
  option: {
    type: String as PropType<'' | 'bauchbinde'>,
    default: '',
  },

  /**
   * For usage outside of pageHero (cards ...).
   * @deprecated Use themeColor prop instead. Will be removed in future versions.
   */
  card: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
/* Banner base styles */
.banner {
  padding: 1.5rem;
}

/* Primary theme color */
.primary {
  --selection: var(--color-secondary-bg);
  --selection-foreground: var(--color-secondary-contrast);
  background-color: var(--color-primary-bg);
}

.primary :deep(*) {
  --selection: var(--color-secondary-bg);
  --selection-foreground: var(--color-secondary-contrast);
}

.primary.transparent {
  background-color: oklch(from var(--color-primary-bg) l c h / var(--transparency-banner));
}

/* Secondary theme color */
.secondary {
  --selection: var(--color-primary-bg);
  --selection-foreground: var(--color-primary-contrast);
  background-color: var(--color-secondary-bg);
}

.secondary :deep(*) {
  --selection: var(--color-primary-bg);
  --selection-foreground: var(--color-primary-contrast);
}

.secondary.transparent {
  background-color: oklch(from var(--color-secondary-bg) l c h / var(--transparency-banner));
}

/* Neutral theme color (default) */
.neutral {
  --selection: var(--color-primary-base);
  --selection-foreground: var(--color-primary-contrast);
  background-color: var(--color-bg);
}

.neutral :deep(*) {
  --selection: var(--color-primary-base);
  --selection-foreground: var(--color-primary-contrast);
}

.neutral.transparent {
  background-color: oklch(from var(--color-bg) l c h / var(--transparency-banner));
}

/* Muted theme color */
.muted {
  --selection: var(--color-primary-base);
  --selection-foreground: var(--color-primary-contrast);
  background-color: var(--color-muted-bg);
}

.muted :deep(*) {
  --selection: var(--color-primary-base);
  --selection-foreground: var(--color-primary-contrast);
}

.muted.transparent {
  background-color: oklch(from var(--color-muted-bg) l c h / var(--transparency-banner));
}

/* Accent theme color */
.accent {
  --selection: var(--color-primary-base);
  --selection-foreground: var(--color-primary-contrast);
  background-color: var(--color-accent-bg);
}

.accent :deep(*) {
  --selection: var(--color-primary-base);
  --selection-foreground: var(--color-primary-contrast);
}

.accent.transparent {
  background-color: oklch(from var(--color-accent-bg) l c h / var(--transparency-banner));
}

/* Deprecated: Card styles for backwards compatibility */
.card {
  --selection: var(--color-primary-base);
  --selection-foreground: var(--color-primary-contrast);
  padding: 1.5rem;
  background-color: var(--color-bg);
}

.card.transparent {
  background-color: oklch(from var(--color-bg) l c h / var(--transparency-banner));
}

/* Responsive styles - applies to all theme colors when not using card */
@media (max-width: 767px) {
  .banner:not(.card) {
    padding: 1rem;
  }
}
</style>
