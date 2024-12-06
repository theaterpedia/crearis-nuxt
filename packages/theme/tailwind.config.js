import defaultTheme from 'tailwindcss/defaultTheme'
import peerNextPlugin from '@storefront-ui/tw-plugin-peer-next'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['blocks/**/*.vue', 'components/**/*.vue'],
  future: {
    hoverOnlyWhenSupported: true,
  },  
  theme: {
    extend: {
      fontFamily: {
        body: ['MonaspaceNeon', ...defaultTheme.fontFamily.sans], // Pruvious: Lato
        sans: ['MonaspaceNeon', ...defaultTheme.fontFamily.sans], // Pruvious: Lato
        mono: ['MonaspaceNeon', ...defaultTheme.fontFamily.serif],
        headings: ['MonaspaceNeon', ...defaultTheme.fontFamily.mono], // Pruvious: Poppins
      },
      //crearis-ui      
      screens: {
        xxl: '1440px',
        lp: { max: '1440px' },
        tl: { max: '1199px' },
        tp: { max: '1023px' },
        ph: { max: '767px' },
        xs: '376px',
        sm: '640px',
      },
      zIndex: {
        60: '60',
        80: '60',
        100: '100',
      },
      spacing: {
        23: '5.75rem',
      },
      //vsf-defaults
      outlineColor: ({ theme }) => ({
        DEFAULT: theme('colors.secondary.600'),
      }),
      outlineOffset: {
        DEFAULT: '2px',
      },
      outlineWidth: {
        DEFAULT: '2px',
      },
      boxShadow: {
        DEFAULT: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        md: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'checked-checkbox-current':
          'linear-gradient(-45deg,transparent 65%, currentcolor 65.99%),linear-gradient(45deg,transparent 75%, currentcolor 75.99%),linear-gradient(-45deg, currentcolor 40%,transparent 40.99%),linear-gradient(45deg, currentcolor 30%, white 30.99%, white 40%,transparent 40.99%),linear-gradient(-45deg, white 50%, currentcolor 50.99%)',
        'indeterminate-checkbox-current':
          'linear-gradient(90deg,transparent 80%, currentcolor 80%),linear-gradient(-90deg,transparent 80%, currentcolor 80%),linear-gradient(0deg, currentcolor 43%, white 43%, white 57%, currentcolor 57%)',
      },      
      keyframes: {
        'stroke-loader-circular': {
          '0%': { 'stroke-dasharray': '1, 200', 'stroke-dashoffset': '0' },
          '50%': { 'stroke-dasharray': '140, 200', 'stroke-dashoffset': '-35' },
          '100%': { 'stroke-dasharray': '89, 200', 'stroke-dashoffset': '-150' },
        },
        'line': {
          from: {
            left: '-100%',
            width: '100%',
          },
          to: {
            left: '100%',
            width: '10%',
          },
        },
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
        'line': 'line 1.5s ease-in infinite',
        'stroke-loader-circular': 'stroke-loader-circular 2s ease-in-out infinite',
      },
      fontSize: {
        '2xs': ['10px', '11px'],
        '3xs': ['8px', '8px'],
      },       
    },
    // crearis-ui
    ringColor: {
      DEFAULT: 'oklch(var(--color-ring))',
    },
    transitionDuration: {
      DEFAULT: 'var(--duration)',
    },
    transitionTimingFunction: {
      DEFAULT: 'var(--ease)',
    },      
    borderColor: ({ theme }) => ({
      DEFAULT: theme('colors.border'),
      ...theme('colors'),
    }),
    borderRadius: {
      DEFAULT: 'var(--radius)',
    },
    //theming
    colors: {
      'primary': {
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
  },
  plugins: [
    peerNextPlugin
  ],
}
