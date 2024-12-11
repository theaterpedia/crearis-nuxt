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
      'background': 'var(--color-base) / <alpha-value>)',
      'foreground': 'var(--color-contrast) / <alpha-value>)',
      'card': 'var(--color-card-base) / <alpha-value>)',
      'card-contrast': 'var(--color-card-contrast) / <alpha-value>)',
      'popover': 'var(--color-popover-base) / <alpha-value>)',
      'popover-contrast': 'var(--color-popover-contrast) / <alpha-value>)',
      'primary': 'var(--color-primary-base) / <alpha-value>)',
      'primary-contrast': 'var(--color-primary-contrast) / <alpha-value>)',
      'secondary': 'var(--color-secondary-base) / <alpha-value>)',
      'secondary-contrast': 'var(--color-secondary-contrast) / <alpha-value>)',
      'muted': 'var(--color-muted-base) / <alpha-value>)',
      'muted-contrast': 'var(--color-muted-contrast) / <alpha-value>)',
      'accent': 'var(--color-accent-base) / <alpha-value>)',
      'accent-contrast': 'var(--color-accent-contrast) / <alpha-value>)',
      'focus': 'var(--focus-base) / <alpha-value>)',
      'focus-contrast': 'var(--focus-contrast) / <alpha-value>)',
      'negative': 'var(--color-negative-base) / <alpha-value>)',
      'negative-contrast': 'var(--color-negative-contrast) / <alpha-value>)',
      'border': 'var(--color-border) / <alpha-value>)',
      'input': 'var(--color-input) / <alpha-value>)',
      'ring': 'var(--color-ring) / <alpha-value>)',
    },
    fontFamily: {
      sans: 'var(--font)',
    },
    ringColor: {
      DEFAULT: 'var(--color-ring))',
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
