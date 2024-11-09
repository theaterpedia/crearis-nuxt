import defaultTheme from 'tailwindcss/defaultTheme'
import { tailwindConfig } from '@crearis/tailwind-config'
import sfTypography from '@crearis/typography'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindConfig],
  plugins: [sfTypography],
  content: ['blocks/**/*.vue', 'node_modules/@crearis/sfui/**/*.{js,mjs}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
        heading: ['Poppins', ...defaultTheme.fontFamily.mono],
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
  plugins: [],
}
