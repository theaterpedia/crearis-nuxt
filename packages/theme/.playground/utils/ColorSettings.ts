import type { MaybeRef } from '@vueuse/core'
import { toGamut, differenceEuclidean, formatCss, converter } from 'culori'

export interface OklchColor {
  name: String
  hue: Number
  scale: 0 | 1 | 2 | 3 | 4 | 5
  greyval: 0 | 1 | 2 | 3 | 4
}

export interface Palette {
  name: String
  palette: String[]
}

// see  https://stackblitz.com/edit/vitejs-vite-ncyeyc
const shades = [50, ...Array.from({ length: 9 }).map((_, i) => (i + 1) * 100), 950]

const grey = [0.4, 0.2, 0.1, 0.05, 0.025]

const lightness = [
  [98.9, 98.0, 97.0, 95.5, 94.0, 91.11, 84, 62, 45, 29, 16],
  [98.5, 96.5, 93.0, 91.0, 88.11, 82.67, 73, 62, 45, 29, 16],
  [97.78, 93.56, 88.11, 82.67, 74.22, 64.78, 57.33, 46.89, 39.44, 32, 23.78],
  [93.56, 88.11, 82.67, 74.22, 64.78, 57.33, 46.89, 39.44, 32, 23.78, 16],
  [88.11, 82.67, 74.22, 64.78, 57.33, 46.89, 39.44, 32, 23.78, 16, 12],
  [82.67, 74.22, 64.78, 57.33, 46.89, 39.44, 32, 23.78, 16, 12, 8],
]

const getCssColor = (i, hue, scale, greyval) => {
  let oklch = converter('oklch')
  let color = 'oklch(' + lightness[scale][i] + '% ' + grey[greyval] + ' ' + hue + ')'
  return formatCss(oklch(toGamut('p3', 'oklch', differenceEuclidean('oklch'), 0)(color)))
}

function calculatePalette(hue, scale, greyval) {
  return shades.map((_, i) => getCssColor(i, hue, scale, greyval))
}

export function generateAllPalettes(colors) {
  return colors.map((color) => ({
    palette: calculatePalette(color.hue, color.scale, color.greyval),
    name: color.name,
  }))
}

export const twClasses = [
  [
    'bg-orange-50',
    'bg-orange-100',
    'bg-orange-200',
    'bg-orange-300',
    'bg-orange-400',
    'bg-orange-500',
    'bg-orange-600',
    'bg-orange-700',
    'bg-orange-800',
    'bg-orange-900',
    'bg-orange-950',
  ],
  [
    'bg-green-50',
    'bg-green-100',
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
    'bg-green-500',
    'bg-green-600',
    'bg-green-700',
    'bg-green-800',
    'bg-green-900',
    'bg-green-950',
  ],
  [
    'bg-sky-50',
    'bg-sky-100',
    'bg-sky-200',
    'bg-sky-300',
    'bg-sky-400',
    'bg-sky-500',
    'bg-sky-600',
    'bg-sky-700',
    'bg-sky-800',
    'bg-sky-900',
    'bg-sky-950',
  ],
]
