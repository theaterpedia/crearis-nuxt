import type { OklchScale, SfColorMapping } from '@crearis/theme/utils/colorSettings'

export const colorVars = {
  'base': '96.19% 0 0',
  'contrast': '0% 0 0',
  'card-base': '100% 0 106.37',
  'card-contrast': '0% 0 0',
  'popover-base': '100% 0 106.37',
  'popover-contrast': '0% 0 0',
  'primary-base': '72.21% 0.2812 144.53',
  'primary-contrast': '0% 0 0',
  'secondary-base': '65.74% 0.2393 304.41',
  'secondary-contrast': '100% 0 106.37',
  'muted-base': '88.45% 0 0',
  'muted-contrast': '32.11% 0 0',
  'accent-base': '32.11% 0 0',
  'accent-contrast': '100% 0 106.37',
  'negative-base': '63.68% 0.2078 25.33',
  'negative-contrast': '100% 0 106.37',
  'positive-base': '63.68% 0.2078 25.33',
  'positive-contrast': '100% 0 106.37',
  'warning-base': '63.68% 0.2078 25.33',
  'instuctive-contrast': '100% 0 106.37',
  'dimmed': '55.47% 0 0',
  'border': '92.4% 0.0035 247.86',
  'input': '80.54% 0 0',
  'ring': '0% 0 0',
}

export const colorUtilities = {
  primary: {
    DEFAULT: 'oklch(var(--color-primary-base) / <alpha-value>)',
    contrast: 'oklch(var(--color-primary-contrast) / <alpha-value>)',
    400: 'oklch(var(--color-primary-base) / <alpha-value>)',
  },
  secondary: {
    DEFAULT: 'oklch(var(--color-secondary-base) / <alpha-value>)',
    contrast: 'oklch(var(--color-secondary-contrast) / <alpha-value>)',
    400: 'oklch(var(--color-secondary-base) / <alpha-value>)',
  },
  positive: {
    DEFAULT: 'oklch(var(--color-positive-base) / <alpha-value>)',
    contrast: 'oklch(var(--color-positive-contrast) / <alpha-value>)',
    400: 'oklch(var(--color-positive-base) / <alpha-value>)',
  },
  negative: {
    DEFAULT: 'oklch(var(--color-negative-base) / <alpha-value>)',
    contrast: 'oklch(var(--color-negative-contrast) / <alpha-value>)',
    400: 'oklch(var(--color-negative-base) / <alpha-value>)',
  },
  warning: {
    DEFAULT: 'oklch(var(--color-warning-base) / <alpha-value>)',
    contrast: 'oklch(var(--color-warning-contrast) / <alpha-value>)',
    400: 'oklch(var(--color-warning-base) / <alpha-value>)',
  },
  neutral: {
    DEFAULT: 'oklch(var(--color-base) / <alpha-value>)',
    contrast: 'oklch(var(--color-contrast) / <alpha-value>)',
    400: 'oklch(var(--color-base) / <alpha-value>)',
  },
}

export const colorscales = {}

export const colormapping = {}
