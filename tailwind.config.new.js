import defaultTheme from 'tailwindcss/defaultTheme'
import { tailwindConfig } from '@crearis-nuxt/tailwind-config'

// #DOCU _07 Theming with tw-colors
// https://github.com/L-Blondy/tw-colors
const { createThemes } = require('tw-colors')

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindConfig],
  content: ['blocks/**/*.vue', 'node_modules/@crearis-nuxt/sfui/**/*.{js,mjs}'],
  theme: {
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
      'card': 'hsl(var(--card) / <alpha-value>)',
      'card-foreground': 'hsl(var(--card-foreground) / <alpha-value>)',
      'popover': 'hsl(var(--popover) / <alpha-value>)',
      'popover-foreground': 'hsl(var(--popover-foreground) / <alpha-value>)',
      'primary': 'hsl(var(--primary) / <alpha-value>)',
      'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
      'secondary': 'hsl(var(--secondary) / <alpha-value>)',
      'secondary-foreground': 'hsl(var(--secondary-foreground) / <alpha-value>)',
      'muted': 'hsl(var(--muted) / <alpha-value>)',
      'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
      'accent': 'hsl(var(--accent) / <alpha-value>)',
      'accent-foreground': 'hsl(var(--accent-foreground) / <alpha-value>)',
      'focus': 'hsl(var(--focus) / <alpha-value>)',
      'focus-foreground': 'hsl(var(--focus-foreground) / <alpha-value>)',
      'destructive': 'hsl(var(--destructive) / <alpha-value>)',
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

    extend: {
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
        mona: ['Monaspace', ...defaultTheme.fontFamily.serif],
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
  /*plugins: [
    createThemes({
      // vsf-variation: lime + fuchsia
      'main': { 
        'primary': {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#365314',
          950: '#1a2e05'
        },
        'secondary': {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e'
        },              
      },
      'alt': { 
        'primary': {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e'
        },
        'secondary': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },          
      },
      'exp': { 
        'primary': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        'secondary': {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#365314',
          950: '#1a2e05'
        },          
      },        
      'grey': { 
        'primary': {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09'
        },
        'secondary': {
          50: '#fafaf9',
          100: '#fafaf9',
          200: '#f5f5f4',
          300: '#e7e5e4',
          400: '#e7e5e4',
          500: '#d6d3d1',
          600: '#a8a29e',
          700: '#78716c',
          800: '#57534e',
          900: '#1c1917',
          950: '#0c0a09'
        },          
      }                
    }, {
      defaultTheme: 'main'
    })
  ], */
}
