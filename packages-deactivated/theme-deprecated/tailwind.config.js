/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    borderColor: ({ theme }) => ({
      DEFAULT: theme('colors.border'),
      ...theme('colors'),
    }),
    borderRadius: {
      DEFAULT: 'var(--radius)',
    },
    colors: {
      'background': 'oklch(var(--color-base) / <alpha-value>)',
      'foreground': 'oklch(var(--color-contrast) / <alpha-value>)',
      'card': 'oklch(var(--color-card-base) / <alpha-value>)',
      'card-contrast': 'oklch(var(--color-card-contrast) / <alpha-value>)',
      'popover': 'oklch(var(--color-popover-base) / <alpha-value>)',
      'popover-contrast': 'oklch(var(--color-popover-contrast) / <alpha-value>)',
      'primary': 'oklch(var(--color-primary-base) / <alpha-value>)',
      'primary-contrast': 'oklch(var(--color-primary-contrast) / <alpha-value>)',
      'secondary': 'oklch(var(--color-secondary-base) / <alpha-value>)',
      'secondary-contrast': 'oklch(var(--color-secondary-contrast) / <alpha-value>)',
      'muted': 'oklch(var(--color-muted-base) / <alpha-value>)',
      'muted-contrast': 'oklch(var(--color-muted-contrast) / <alpha-value>)',
      'accent': 'oklch(var(--color-accent-base) / <alpha-value>)',
      'accent-contrast': 'oklch(var(--color-accent-contrast) / <alpha-value>)',
      'focus': 'oklch(var(--focus-base) / <alpha-value>)',
      'focus-contrast': 'oklch(var(--focus-contrast) / <alpha-value>)',
      'destructive': 'oklch(var(--color-destructive-base) / <alpha-value>)',
      'destructive-contrast': 'oklch(var(--color-destructive-contrast) / <alpha-value>)',
      'border': 'oklch(var(--color-border) / <alpha-value>)',
      'input': 'oklch(var(--color-input) / <alpha-value>)',
      'ring': 'oklch(var(--color-ring) / <alpha-value>)',
    },
    fontFamily: {
      sans: 'var(--font)',
    },
    ringColor: {
      DEFAULT: 'oklch(var(--color-ring))',
    },
    transitionDuration: {
      DEFAULT: 'var(--duration)',
    },
    transitionTimingFunction: {
      DEFAULT: 'var(--ease)',
    },
  },
  plugins: [],
}
