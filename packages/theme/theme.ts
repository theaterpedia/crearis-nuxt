import type { OklchScale } from '@crearis/theme/utils/colorSettings'

export const colorScales = <OklchScale[]>[
  { name: 'primary', hue: 235, scale: 2, greyval: 0 },
  { name: 'secondary', hue: 274, scale: 5, greyval: 0 },
  { name: 'warning', hue: 104, scale: 0, greyval: 0 },
  { name: 'positive', hue: 138, scale: 1, greyval: 0 },
  { name: 'negative', hue: 4, scale: 3, greyval: 0 },
  { name: 'neutral', hue: 88, scale: 1, greyval: 4 },
]

export const colorVars = {
  'base': '98.5% 0.025 88',
  'contrast': '29% 0.025 88',
  'card-base': '82.67% 0.025 88',
  'card-contrast': '29% 0.025 88',
  'popover-base': '82.67% 0.025 88',
  'popover-contrast': '29% 0.025 88',
  'primary-base': '64.78% 0.4 235',
  'primary-contrast': '29% 0.025 88',
  'secondary-base': '39.44% 0.4 274',
  'secondary-contrast': '29% 0.025 88',
  'muted-base': '93% 0.025 88',
  'muted-contrast': 'var(--color-base)',
  'accent-base': '62% 0.025 88',
  'accent-contrast': '82.67% 0.025 88',
  'negative-base': '57.33% 0.4 4',
  'negative-contrast': '29% 0.025 88',
  'positive-base': '82.67% 0.4 138',
  'positive-contrast': '29% 0.025 88',
  'warning-base': '91.11% 0.4 104',
  'warning-contrast': '29% 0.025 88',
  'dimmed': '91% 0.025 88',
  'border': '96.5% 0.025 88',
  'input': '93% 0.025 88',
  'ring': '29% 0.025 88',
}
