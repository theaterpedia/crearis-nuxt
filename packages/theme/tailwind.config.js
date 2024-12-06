import defaultTheme from 'tailwindcss/defaultTheme'
import { tailwindConfig } from '@crearis/tailwind-config'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindConfig],
  content: ['blocks/**/*.vue', 'components/**/*.vue'],
  theme: {
    variables: {
      DEFAULT: {
        colors: {
          primary: {
            400: '255 238 0',
          },
          notsecondary: {
            50: '245 243 255',
            100: '237 233 254',
            200: '221 214 254',
            300: '196 181 253',
            400: '130 203 21',
            500: '135 92 246',
            600: '111 64 236',
            700: '97 49 221',
            800: '83 30 211',
            900: '68 21 178',
          },
        },
      },
    },
    extend: {
      fontFamily: {
        body: ['MonaspaceNeon', ...defaultTheme.fontFamily.sans], // Pruvious: Lato
        sans: ['MonaspaceNeon', ...defaultTheme.fontFamily.sans], // Pruvious: Lato
        mono: ['MonaspaceNeon', ...defaultTheme.fontFamily.serif],
        headings: ['MonaspaceNeon', ...defaultTheme.fontFamily.mono], // Pruvious: Poppins
      },
      screens: {
        xxl: '1440px',
        lp: { max: '1440px' },
        tl: { max: '1199px' },
        tp: { max: '1023px' },
        ph: { max: '767px' },
        xs: '376px',
      },
      zIndex: {
        60: '60',
        80: '60',
        100: '100',
      },
      spacing: {
        23: '5.75rem',
      },
    },
    borderColor: ({ theme }) => ({
      DEFAULT: theme('colors.border'),
      ...theme('colors'),
    }),
    borderRadius: {
      DEFAULT: 'var(--radius)',
    },
    colors: {
      primary: {
        DEFAULT: 'oklch(var(--color-primary-base) / <alpha-value>)', 
        400: 'oklch(var(--color-primary-base) / <alpha-value>)',
        contrast: 'oklch(var(--color-primary-contrast) / <alpha-value>)',
      },
      'background': 'oklch(var(--color-base) / <alpha-value>)',
      'foreground': 'oklch(var(--color-contrast) / <alpha-value>)',
      'card': 'oklch(var(--color-card-base) / <alpha-value>)',
      'card-contrast': 'oklch(var(--color-card-contrast) / <alpha-value>)',
      'popover': 'oklch(var(--color-popover-base) / <alpha-value>)',
      'popover-contrast': 'oklch(var(--color-popover-contrast) / <alpha-value>)',
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
