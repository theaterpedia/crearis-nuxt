import plugin from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import { tailwindConfig } from '@crearis/tailwind-config'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindConfig],
  content: ['blocks/**/*.vue'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans], // Pruvious: Lato
        mono: ['Mona-Neon', ...defaultTheme.fontFamily.serif],
        headings: ['Mona-Neon', ...defaultTheme.fontFamily.mono], // Pruvious: Poppins
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
  },
  plugins: [
    plugin(function({ addUtilities, addComponents, theme }) {
      addUtilities({
        '.headline-2': {
          fontSize: theme('fontSize.6xl'),
          fontFamily: theme('fontFamily.headings'),
          lineHeight: '1.125',
        },
        '.btn-hans-2': {
          padding: '2.5rem 2.5rem',
          borderRadius: '.25rem',
          fontWeight: '900',
          'font-size': '3rem'
        },         
      }),
      addComponents({
        '.btn-hans': {
          padding: '2.5rem 2.5rem',
          borderRadius: '.25rem',
          fontWeight: '900',
          'font-size': '3rem'
        },        
      })
    })
  ],
}
