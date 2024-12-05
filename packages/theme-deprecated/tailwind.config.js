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
      'background': 'hsl(var(--color-base) / <alpha-value>)',
      'foreground': 'hsl(var(--color-contrast) / <alpha-value>)',
      'card': 'hsl(var(--color-card-base) / <alpha-value>)',
      'card-contrast': 'hsl(var(--color-card-contrast) / <alpha-value>)',
      'popover': 'hsl(var(--color-popover-base) / <alpha-value>)',
      'popover-contrast': 'hsl(var(--color-popover-contrast) / <alpha-value>)',
      'primary': 'hsl(var(--color-primary-base) / <alpha-value>)',
      'primary-contrast': 'hsl(var(--color-primary-contrast) / <alpha-value>)',
      'secondary': 'hsl(var(--color-secondary-base) / <alpha-value>)',
      'secondary-contrast': 'hsl(var(--color-secondary-contrast) / <alpha-value>)',
      'muted': 'hsl(var(--color-muted-base) / <alpha-value>)',
      'muted-contrast': 'hsl(var(--color-muted-contrast) / <alpha-value>)',
      'accent': 'hsl(var(--color-accent-base) / <alpha-value>)',
      'accent-contrast': 'hsl(var(--color-accent-contrast) / <alpha-value>)',
      'focus': 'hsl(var(--focus-base) / <alpha-value>)',
      'focus-contrast': 'hsl(var(--focus-contrast) / <alpha-value>)',
      'destructive': 'hsl(var(--color-destructive-base) / <alpha-value>)',
      'destructive-contrast': 'hsl(var(--color-destructive-contrast) / <alpha-value>)',
      'border': 'hsl(var(--color-border) / <alpha-value>)',
      'input': 'hsl(var(--color-input) / <alpha-value>)',
      'ring': 'hsl(var(--color-ring) / <alpha-value>)',
    },
    fontFamily: {
      sans: 'var(--font)',
    },
    ringColor: {
      DEFAULT: 'hsl(var(--color-ring))',
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
