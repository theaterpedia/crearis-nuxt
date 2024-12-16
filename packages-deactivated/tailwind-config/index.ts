import { Config } from 'tailwindcss'
import { ThemeConfig } from 'tailwindcss/types/config'
import tailwindCssVariables from '@mertasan/tailwindcss-variables'
import peerNextPlugin from '@storefront-ui/tw-plugin-peer-next'

export const tailwindConfig: Config = {
  content: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    typography: ({ theme }: ThemeConfig) => ({
      'display-1': {
        fontSize: theme('fontSize.6xl'),
        fontFamily: theme('fontFamily.headings'),
        lineHeight: '1.125',
      },
      'display-2': {
        fontSize: theme('fontSize.4xl'),
        fontFamily: theme('fontFamily.headings'),
        lineHeight: '1.125',
      },
      'display-3': {
        fontSize: theme('fontSize.2xl'),
        fontFamily: theme('fontFamily.headings'),
        lineHeight: '1.125',
      },
      'headline-1': {
        fontSize: theme('fontSize.6xl'),
        fontFamily: theme('fontFamily.headings'),
        lineHeight: '1.125',
      },
      'headline-2': {
        fontSize: theme('fontSize.4xl'),
        fontFamily: theme('fontFamily.headings'),
        lineHeight: '1.125',
      },
      'headline-3': {
        fontSize: theme('fontSize.2xl'),
        fontFamily: theme('fontFamily.headings'),
        lineHeight: '1.125',
      },
      'headline-4': {
        fontSize: theme('fontSize.lg'),
        fontFamily: theme('fontFamily.headings'),
        lineHeight: '1.125',
      },
      'headline-5': {
        fontSize: theme('fontSize.base'),
        fontFamily: theme('fontFamily.headings'),
        lineHeight: '1.125',
      },
      'headline-6': {
        fontSize: theme('fontSize.sm'),
        fontFamily: theme('fontFamily.headings'),
        lineHeight: '1.125',
      },
      'text-xl': {
        fontSize: theme('fontSize.xl'),
        lineHeight: '1.4',
      },
      'text-lg': {
        fontSize: theme('fontSize.lg'),
        lineHeight: '1.4',
      },
      'text-base': {
        fontSize: theme('fontSize.base'),
        lineHeight: '1.4',
      },
      'text-sm': {
        fontSize: theme('fontSize.sm'),
        lineHeight: '1.4',
      },
      'text-xs': {
        fontSize: theme('fontSize.xs'),
        lineHeight: '1.4',
      },
      'button-lg': {
        fontSize: theme('fontSize.lg'),
        lineHeight: '1.4',
      },
      'button-base': {
        fontSize: theme('fontSize.base'),
        lineHeight: '1.4',
      },
      'button-sm': {
        fontSize: theme('fontSize.sm'),
        lineHeight: '1.4',
      },
      'label-lg': {
        fontSize: theme('fontSize.lg'),
        lineHeight: '1.4',
      },
      'label-base': {
        fontSize: theme('fontSize.base'),
        lineHeight: '1.4',
      },
      'label-sm': {
        fontSize: theme('fontSize.sm'),
        lineHeight: '1.4',
      },
      'error-lg': {
        fontSize: theme('fontSize.lg'),
        lineHeight: '1.4',
      },
      'error-base': {
        fontSize: theme('fontSize.base'),
        lineHeight: '1.4',
      },
      'error-sm': {
        fontSize: theme('fontSize.sm'),
        lineHeight: '1.4',
      },
      'error-xs': {
        fontSize: theme('fontSize.xs'),
        lineHeight: '1.4',
      },
      'hint-lg': {
        fontSize: theme('fontSize.lg'),
        lineHeight: '1.4',
      },
      'hint-base': {
        fontSize: theme('fontSize.base'),
        lineHeight: '1.4',
      },
      'hint-sm': {
        fontSize: theme('fontSize.sm'),
        lineHeight: '1.4',
      },
      'hint-xs': {
        fontSize: theme('fontSize.xs'),
        lineHeight: '1.4',
      },
    }),
    extend: {
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
      colors: {
        brand: 'rgb(var(--colors-brand) / <alpha-value>)',
        neutral: {
          '900': 'rgb(var(--colors-neutral-900) / <alpha-value>)',
          '800': 'rgb(var(--colors-neutral-800) / <alpha-value>)',
          '700': 'rgb(var(--colors-neutral-700) / <alpha-value>)',
          '600': 'rgb(var(--colors-neutral-600) / <alpha-value>)',
          '500': 'rgb(var(--colors-neutral-500) / <alpha-value>)',
          '400': 'rgb(var(--colors-neutral-400) / <alpha-value>)',
          '300': 'rgb(var(--colors-neutral-300) / <alpha-value>)',
          '200': 'rgb(var(--colors-neutral-200) / <alpha-value>)',
          '100': 'rgb(var(--colors-neutral-100) / <alpha-value>)',
          '50': 'rgb(var(--colors-neutral-50) / <alpha-value>)',
        },
        primary: {
          '900': 'rgb(var(--colors-primary-900) / <alpha-value>)',
          '800': 'rgb(var(--colors-primary-800) / <alpha-value>)',
          '700': 'rgb(var(--colors-primary-700) / <alpha-value>)',
          '600': 'rgb(var(--colors-primary-600) / <alpha-value>)',
          '500': 'rgb(var(--colors-primary-500) / <alpha-value>)',
          '400': 'rgb(var(--colors-primary-400) / <alpha-value>)',
          '300': 'rgb(var(--colors-primary-300) / <alpha-value>)',
          '200': 'rgb(var(--colors-primary-200) / <alpha-value>)',
          '100': 'rgb(var(--colors-primary-100) / <alpha-value>)',
          '50': 'rgb(var(--colors-primary-50) / <alpha-value>)',
        },
        secondary: {
          '900': 'rgb(var(--colors-secondary-900) / <alpha-value>)',
          '800': 'rgb(var(--colors-secondary-800) / <alpha-value>)',
          '700': 'rgb(var(--colors-secondary-700) / <alpha-value>)',
          '600': 'rgb(var(--colors-secondary-600) / <alpha-value>)',
          '500': 'rgb(var(--colors-secondary-500) / <alpha-value>)',
          '400': 'rgb(var(--colors-secondary-400) / <alpha-value>)',
          '300': 'rgb(var(--colors-secondary-300) / <alpha-value>)',
          '200': 'rgb(var(--colors-secondary-200) / <alpha-value>)',
          '100': 'rgb(var(--colors-secondary-100) / <alpha-value>)',
          '50': 'rgb(var(--colors-secondary-50) / <alpha-value>)',
        },
        positive: {
          '900': 'rgb(var(--colors-positive-900) / <alpha-value>)',
          '800': 'rgb(var(--colors-positive-800) / <alpha-value>)',
          '700': 'rgb(var(--colors-positive-700) / <alpha-value>)',
          '600': 'rgb(var(--colors-positive-600) / <alpha-value>)',
          '500': 'rgb(var(--colors-positive-500) / <alpha-value>)',
          '400': 'rgb(var(--colors-positive-400) / <alpha-value>)',
          '300': 'rgb(var(--colors-positive-300) / <alpha-value>)',
          '200': 'rgb(var(--colors-positive-200) / <alpha-value>)',
          '100': 'rgb(var(--colors-positive-100) / <alpha-value>)',
          '50': 'rgb(var(--colors-positive-50) / <alpha-value>)',
        },
        negative: {
          '900': 'rgb(var(--colors-negative-900) / <alpha-value>)',
          '800': 'rgb(var(--colors-negative-800) / <alpha-value>)',
          '700': 'rgb(var(--colors-negative-700) / <alpha-value>)',
          '600': 'rgb(var(--colors-negative-600) / <alpha-value>)',
          '500': 'rgb(var(--colors-negative-500) / <alpha-value>)',
          '400': 'rgb(var(--colors-negative-400) / <alpha-value>)',
          '300': 'rgb(var(--colors-negative-300) / <alpha-value>)',
          '200': 'rgb(var(--colors-negative-200) / <alpha-value>)',
          '100': 'rgb(var(--colors-negative-100) / <alpha-value>)',
          '50': 'rgb(var(--colors-negative-50) / <alpha-value>)',
        },
        warning: {
          '900': 'rgb(var(--colors-warning-900) / <alpha-value>)',
          '800': 'rgb(var(--colors-warning-800) / <alpha-value>)',
          '700': 'rgb(var(--colors-warning-700) / <alpha-value>)',
          '600': 'rgb(var(--colors-warning-600) / <alpha-value>)',
          '500': 'rgb(var(--colors-warning-500) / <alpha-value>)',
          '400': 'rgb(var(--colors-warning-400) / <alpha-value>)',
          '300': 'rgb(var(--colors-warning-300) / <alpha-value>)',
          '200': 'rgb(var(--colors-warning-200) / <alpha-value>)',
          '100': 'rgb(var(--colors-warning-100) / <alpha-value>)',
          '50': 'rgb(var(--colors-warning-50) / <alpha-value>)',
        },
        disabled: {
          '900': 'rgb(var(--colors-disabled-900) / 0.5)',
          '800': 'rgb(var(--colors-disabled-800) / 0.5)',
          '700': 'rgb(var(--colors-disabled-700) / 0.5)',
          '600': 'rgb(var(--colors-disabled-600) / 0.5)',
          '500': 'rgb(var(--colors-disabled-500) / 0.5)',
          '400': 'rgb(var(--colors-disabled-400) / 0.5)',
          '300': 'rgb(var(--colors-disabled-300) / 0.5)',
          '200': 'rgb(var(--colors-disabled-200) / 0.5)',
          '100': 'rgb(var(--colors-disabled-100) / 0.5)',
          '50': 'rgb(var(--colors-disabled-50) / 0.5)',
        },
      },
      fontFamily: {
        headings: 'Red Hat Display, sans-serif',
        body: 'Red Hat Text, sans-serif',
      },
      screens: {
        xs: '376px',
        sm: '640px',
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
    variables: {
      DEFAULT: {
        colors: {
          primary: {
            '50': '240 253 244',
            '100': '220 252 231',
            '200': '187 247 208',
            '300': '134 239 172',
            '400': '74 222 128',
            '500': '2 198 82',
            '600': '10 171 69',
            '700': '1 137 55',
            '800': '22 101 52',
            '900': '20 83 45',
          },
          secondary: {
            '50': '245 243 255',
            '100': '237 233 254',
            '200': '221 214 254',
            '300': '196 181 253',
            '400': '167 139 250',
            '500': '135 92 246',
            '600': '111 64 236',
            '700': '97 49 221',
            '800': '83 30 211',
            '900': '68 21 178',
          },
          positive: {
            '50': '240 253 244',
            '100': '220 252 231',
            '200': '187 247 208',
            '300': '134 239 172',
            '400': '74 222 128',
            '500': '2 198 82',
            '600': '10 171 69',
            '700': '1 137 55',
            '800': '22 101 52',
            '900': '20 83 45',
          },
          negative: {
            '50': '255 241 242',
            '100': '255 228 230',
            '200': '254 205 211',
            '300': '253 164 175',
            '400': '251 113 133',
            '500': '244 63 94',
            '600': '225 29 72',
            '700': '190 18 60',
            '800': '159 18 57',
            '900': '136 19 55',
          },
          warning: {
            '50': '254 252 232',
            '100': '254 249 195',
            '200': '254 240 138',
            '300': '253 224 71',
            '400': '250 204 21',
            '500': '234 179 8',
            '600': '202 138 4',
            '700': '161 98 7',
            '800': '133 77 14',
            '900': '113 63 18',
          },
          neutral: {
            '50': '250 250 250',
            '100': '244 244 245',
            '200': '228 228 231',
            '300': '212 212 216',
            '400': '161 161 170',
            '500': '113 113 122',
            '600': '82 82 91',
            '700': '63 63 70',
            '800': '39 39 42',
            '900': '24 24 27',
          },
          disabled: {
            '50': '250 250 250',
            '100': '244 244 245',
            '200': '228 228 231',
            '300': '212 212 216',
            '400': '161 161 170',
            '500': '113 113 122',
            '600': '82 82 91',
            '700': '63 63 70',
            '800': '39 39 42',
            '900': '24 24 27',
          },
        },
      },
    },
  },
  plugins: [tailwindCssVariables, peerNextPlugin],
}
