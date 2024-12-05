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
