import defaultTheme from 'tailwindcss/defaultTheme'
// import { tailwindConfig } from '@crearis-nuxt/tailwind-config'

/** @type {import('tailwindcss').Config} */
export default {
  // presets: [tailwindConfig],
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
  plugins: [],
}
