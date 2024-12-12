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
  'inverted': '1',
  'base': 'oklch(98.5% 0.025 88)',
  'neutral': 'oklch(98.5% 0.025 88)',
  'contrast': 'oklch(29% 0.025 88)',
  'card-bg': 'oklch(82.67% 0.025 88)',
  'card-contrast': 'oklch(29% 0.025 88)',
  'popover-bg': 'oklch(82.67% 0.025 88)',
  'popover-contrast': 'oklch(29% 0.025 88)',
  'primary-base': 'oklch(64.78% 0.4 235)',
  'primary-contrast': 'oklch(29% 0.025 88)',
  'secondary-base': 'oklch(39.44% 0.4 274)',
  'secondary-contrast': 'oklch(29% 0.025 88)',
  'muted-bg': 'oklch(93% 0.025 88)',
  'muted-contrast': 'var(--color-contrast)',
  'accent-bg': 'oklch(62% 0.025 88)',
  'accent-contrast': 'oklch(82.67% 0.025 88)',
  'negative-base': 'oklch(57.33% 0.4 4)',
  'negative-contrast': 'oklch(29% 0.025 88)',
  'positive-base': 'oklch(82.67% 0.4 138)',
  'positive-contrast': 'oklch(29% 0.025 88)',
  'warning-base': 'oklch(91.11% 0.4 104)',
  'warning-contrast': 'oklch(29% 0.025 88)',
  'dimmed': 'oklch(91% 0.025 88)',
  'border': 'oklch(96.5% 0.025 88)',
  'input': 'oklch(3% 0.025 88)',
  'ring': 'oklch(29% 0.025 88)',
}
