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
      'background': 'hsl(var(--background) / <alpha-value>)',
      'foreground': 'hsl(var(--foreground) / <alpha-value>)',
      'card': 'hsl(var(--card) / <alpha-value>)',
      'card-foreground': 'hsl(var(--card-foreground) / <alpha-value>)',
      'popover': 'hsl(var(--popover) / <alpha-value>)',
      'popover-foreground': 'hsl(var(--popover-foreground) / <alpha-value>)',
      'primary': 'hsl(var(--primary) / <alpha-value>)',
      'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
      'secondary': 'hsl(var(--secondary) / <alpha-value>)',
      'secondary-foreground': 'hsl(var(--secondary-foreground) / <alpha-value>)',
      'muted': 'hsl(var(--muted) / <alpha-value>)',
      'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
      'accent': 'hsl(var(--accent) / <alpha-value>)',
      'accent-foreground': 'hsl(var(--accent-foreground) / <alpha-value>)',
      'focus': 'hsl(var(--focus) / <alpha-value>)',
      'focus-foreground': 'hsl(var(--focus-foreground) / <alpha-value>)',
      'destructive': 'hsl(var(--destructive) / <alpha-value>)',
      'destructive-foreground': 'hsl(var(--destructive-foreground) / <alpha-value>)',
      'border': 'hsl(var(--border) / <alpha-value>)',
      'input': 'hsl(var(--input) / <alpha-value>)',
      'ring': 'hsl(var(--ring) / <alpha-value>)',
    },
    fontFamily: {
      sans: 'var(--font)',
      mona: ['Monaspace', ...fontFamily.serif],
    },
    ringColor: {
      DEFAULT: 'hsl(var(--ring))',
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
