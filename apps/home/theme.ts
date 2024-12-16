import type { OklchColor } from '@crearis/theme/utils/colorSettings'

export const colorScales = <OklchColor[]>[
  { name: 'primary', hue: 56, light: 99, chroma: 0.3 },
  { name: 'secondary', hue: 274, light: 80, chroma: 0.4 },
  { name: 'warning', hue: 94, light: 92, chroma: 0.3 },
  { name: 'positive', hue: 150, light: 70, chroma: 0.4 },
  { name: 'negative', hue: 30, light: 60, chroma: 0.35 },
  { name: 'neutral', hue: 0, light: 70, chroma: 0.02 },
]

export const colorVars = {
  'inverted': '0',
  'primary-base': 'oklch(97% 0.35 81.001)',
  'secondary-base': 'oklch(70% 0.204 43)',
  'warning-base': 'oklch(94% 0.3 111)',
  'positive-base': 'oklch(70% 0.4 150)',
  'negative-base': 'oklch(60% 0.35 30)',
  'neutral-base': 'oklch(70% 0 0)',
  'grey-base': 'oklch(70% 0 0.001)',
  'bg': 'oklch(from var(--color-neutral-base) calc(l + 1 * (1 - var(--color-inverted) - l)) calc(c / 4.5) h)',
  'contrast': 'oklch(from var(--color-neutral-base) calc(l + 1 * (var(--color-inverted) - l)) calc(c / 4.5) h)',
  'black': 'oklch(from var(--color-grey-base) calc(l + 1 * (0 - l)) calc(c / 4.5) h)',
  'white': 'oklch(from var(--color-grey-base) calc(l + 1 * (1 - 0 - l)) calc(c / 4.5) h)',
  'primary-bg': 'var(--color-primary-base)',
  'secondary-bg': 'var(--color-secondary-base)',
  'warning-bg': 'var(--color-warning-base)',
  'positive-bg': 'var(--color-positive-base)',
  'negative-bg': 'var(--color-negative-base)',
  'muted-bg': 'oklch(from var(--color-neutral-base) calc(l + 0.6 * (1 - var(--color-inverted) - l)) calc(c / 2) h)',
  'muted-contrast':
    'oklch(from var(--color-neutral-base) calc(l + 0.2 * (var(--color-inverted) - l)) calc(c / 1.25) h)',
  'accent-bg': 'oklch(from var(--color-neutral-base) calc(l + 0.6 * (var(--color-inverted) - l)) calc(c / 2) h)',
  'accent-contrast':
    'oklch(from var(--color-neutral-base) calc(l + 0.8 * (1 - var(--color-inverted) - l)) calc(c / 3) h)',
  'card-bg': 'oklch(from var(--color-neutral-base) calc(l + 0.8 * (1 - var(--color-inverted) - l)) calc(c / 3) h)',
  'card-contrast': 'oklch(from var(--color-neutral-base) calc(l + 0.8 * (var(--color-inverted) - l)) calc(c / 3) h)',
  'popover-bg': 'oklch(from var(--color-neutral-base) calc(l + 0.6 * (1 - var(--color-inverted) - l)) calc(c / 2) h)',
  'popover-contrast': 'oklch(from var(--color-neutral-base) calc(l + 0.8 * (var(--color-inverted) - l)) calc(c / 3) h)',
  'primary-contrast': 'oklch(from var(--color-grey-base) calc(l + 1 * (0 - l)) calc(c / 4.5) h)',
  'secondary-contrast': 'oklch(from var(--color-grey-base) calc(l + 1 * (0 - l)) calc(c / 4.5) h)',
  'positive-contrast': 'oklch(from var(--color-grey-base) calc(l + 1 * (0 - l)) calc(c / 4.5) h)',
  'negative-contrast': 'oklch(from var(--color-grey-base) calc(l + 1 * (0 - l)) calc(c / 4.5) h)',
  'warning-contrast': 'oklch(from var(--color-grey-base) calc(l + 1 * (0 - l)) calc(c / 4.5) h)',
  'dimmed': 'oklch(from var(--color-neutral-base) calc(l + 0.4 * (1 - var(--color-inverted) - l)) calc(c / 1.5) h)',
  'border': 'oklch(from var(--color-neutral-base) calc(l + 0.8 * (1 - var(--color-inverted) - l)) calc(c / 3) h)',
  'input': 'oklch(from var(--color-neutral-base) calc(l + 0.6 * (1 - var(--color-inverted) - l)) calc(c / 2) h)',
  'ring': 'oklch(from var(--color-neutral-base) calc(l + 0.8 * (var(--color-inverted) - l)) calc(c / 3) h)',
}
