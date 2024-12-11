import type { OklchColor } from '@crearis/theme/utils/colorSettings'

export const colorScales = <OklchColor[]>[
  { name: 'primary', hue: 80, light: 99, chroma: 0.25 },
  { name: 'secondary', hue: 274, light: 80, chroma: 0.4 },
  { name: 'warning', hue: 111, light: 94, chroma: 0.3 },
  { name: 'positive', hue: 145, light: 85, chroma: 0.35 },
  { name: 'negative', hue: 23, light: 99, chroma: 0.395 },
  { name: 'neutral', hue: 0, light: 70, chroma: 0.02 },
]

export const colorVars = {
  'inverted': '0',
  'base': 'oklch(98.5% 0.025 88)',
  'contrast': 'oklch(29% 0.025 88)',
  'card-base': 'oklch(82.67% 0.025 88)',
  'card-contrast': 'oklch(29% 0.025 88)',
  'popover-base': 'oklch(82.67% 0.025 88)',
  'popover-contrast': 'oklch(29% 0.025 88)',
  'primary-base': 'oklch(64.78% 0.4 235)',
  'primary-contrast': 'oklch(29% 0.025 88)',
  'secondary-base': 'oklch(39.44% 0.4 274)',
  'secondary-contrast': 'oklch(29% 0.025 88)',
  'muted-base': 'oklch(93% 0.025 88)',
  'muted-contrast': 'var(--color-base)',
  'accent-base': 'oklch(62% 0.025 88)',
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
