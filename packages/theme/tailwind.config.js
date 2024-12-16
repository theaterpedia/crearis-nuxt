import defaultTheme from 'tailwindcss/defaultTheme'
import { colorVars } from './theme'
import { palette } from '@crearis/theme/utils/colorSettings'
import peerNextPlugin from '@storefront-ui/tw-plugin-peer-next'
import tailwindCssVariables from '@mertasan/tailwindcss-variables'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['blocks/**/*.vue', 'components/**/*.vue'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    variables: {
      DEFAULT: {
        font: 'MonaspaceNeon',
        headings: 'MonaspaceNeon',
        color: colorVars,
      },
    },
    extend: {
      fontFamily: {
        body: ['Roboto', ...defaultTheme.fontFamily.sans], // Pruvious: Lato
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
      DEFAULT: 'var(--color-ring))',
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
    colors: Object.assign(
      {
        primary: palette('var(--color-primary-base)', 'var(--color-inverted)'),
        secondary: palette('var(--color-secondary-base)', 'var(--color-inverted)'),
        positive: palette('var(--color-positive-base)', 'var(--color-inverted)'),
        negative: palette('var(--color-negative-base)', 'var(--color-inverted)'),
        warning: palette('var(--color-warning-base)', 'var(--color-inverted)'),
        neutral: palette('var(--color-neutral-base)', 'var(--color-inverted)'),
        grey: palette('var(--color-grey-base)', '0'),
      },
      {
        'black': 'var(--color-black) ',
        'white': 'var(--color-white) ',
        'background': 'var(--color-bg) ',
        'foreground': 'var(--color-contrast) ',
        'primary-bg': 'var(--color-primary-bg) ',
        'primary-contrast': 'var(--color-primary-contrast)',
        'secondary-bg': 'var(--color-secondary-bg) ',
        'primary-contrast': 'var(--color-primary-contrast)',
        'positive-bg': 'var(--color-positive-bg) ',
        'positive-contrast': 'var(--color-positive-contrast) ',
        'negative-bg': 'var(--color-negative-bg) ',
        'negative-contrast': 'var(--color-negative-contrast) ',
        'warning-bg': 'var(--color-warning-bg) ',
        'warning-contrast': 'var(--color-warning-contrast) ',
        'card': 'var(--color-card-bg) ',
        'card-contrast': 'var(--color-card-contrast) ',
        'popover': 'var(--color-popover-bg) ',
        'popover-contrast': 'var(--color-popover-contrast) ',
        'muted': 'var(--color-muted-bg) ',
        'muted-contrast': 'var(--color-muted-contrast) ',
        'accent': 'var(--color-accent-bg) ',
        'accent-contrast': 'var(--color-accent-contrast) ',
        'focus': 'var(--focus-bg) ',
        'focus-contrast': 'var(--focus-contrast) ',
        'border': 'var(--color-border) ',
        'input': 'var(--color-input) ',
        'ring': 'var(--color-ring) ',
      },
    ),
  },
  plugins: [tailwindCssVariables, peerNextPlugin],
}
