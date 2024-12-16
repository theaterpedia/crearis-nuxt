import defaultTheme from 'tailwindcss/defaultTheme'
import { colorVars } from './theme'
import tailwindCssVariables from '@mertasan/tailwindcss-variables'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['blocks/**/*.vue', 'components/**/*.vue'],
  theme: {
    variables: {
      DEFAULT: {
        font: 'Roboto',
        headings: 'Roboto',
        color: colorVars,
      },
    },
    extend: {
      fontFamily: {
        body: ['Roboto', ...defaultTheme.fontFamily.sans], // Pruvious: Lato
        sans: ['Roboto', ...defaultTheme.fontFamily.sans], // Pruvious: Lato
        mono: ['MonaspaceNeon', ...defaultTheme.fontFamily.serif],
        headings: ['Roboto', ...defaultTheme.fontFamily.mono], // Pruvious: Poppins
      },

    },
  },
  plugins: [tailwindCssVariables],
}
