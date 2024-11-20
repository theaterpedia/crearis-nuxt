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
      'background': 'hsl(var(--background) / <alpha-value>)',
      'foreground': 'hsl(var(--foreground) / <alpha-value>)',
      'card-base': 'hsl(var(--card-base) / <alpha-value>)',
      'card-foreground': 'hsl(var(--card-foreground) / <alpha-value>)',
      'popover-base': 'hsl(var(--popover-base) / <alpha-value>)',
      'popover-foreground': 'hsl(var(--popover-foreground) / <alpha-value>)',
      'primary-base': 'hsl(var(--primary-base) / <alpha-value>)',
      'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
      'secondary-base': 'hsl(var(--secondary-base) / <alpha-value>)',
      'secondary-foreground': 'hsl(var(--secondary-foreground) / <alpha-value>)',
      'muted-base': 'hsl(var(--muted-base) / <alpha-value>)',
      'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
      'accent-base': 'hsl(var(--accent-base) / <alpha-value>)',
      'accent-foreground': 'hsl(var(--accent-foreground) / <alpha-value>)',
      'focus-base': 'hsl(var(--focus-base) / <alpha-value>)',
      'focus-foreground': 'hsl(var(--focus-foreground) / <alpha-value>)',
      'destructive-base': 'hsl(var(--destructive-base) / <alpha-value>)',
      'destructive-foreground': 'hsl(var(--destructive-foreground) / <alpha-value>)',
      'border': 'hsl(var(--border) / <alpha-value>)',
      'input': 'hsl(var(--input) / <alpha-value>)',
      'ring': 'hsl(var(--ring) / <alpha-value>)',
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
