import { toGamut, differenceEuclidean, formatCss, converter } from 'culori'

export interface OklchScale {
  name: String
  hue: Number
  scale: 0 | 1 | 2 | 3 | 4 | 5
  grayval: 0 | 1 | 2 | 3 | 4
}
export interface ColorShades {
  DEFAULT: String
  50: String
  100: String
  200: String
  300: String
  400: String
  500: String
  600: String
  700: String
  800: String
  900: String
  950: String
}
export interface OklchColor {
  name: String
  hue: Number
  light: Number
  chroma: Number
}

export interface BaseColors {
  primary: String
  secondary: String
  warning: String
  positive: String
  negative: String
  neutral: String
  gray?: String
}

export interface SfColorMapping {
  name: String
  sfname: String
  shade: Number
}

export interface Palette {
  name: String
  palette: String[]
}

// see  https://stackblitz.com/edit/vitejs-vite-ncyeyc
export const shades = [50, ...Array.from({ length: 9 }).map((_, i) => (i + 1) * 100), 950, 'bas']

export function palette(color: String, invert: String = '0'): ColorShades {
  const inverted = color.endsWith('.001') || invert === '0' ? '0' : invert
  return {
    DEFAULT: `${color}`,
    50: `oklch(from ${color} calc(l + 1 * (1 - ${inverted} - l)) calc(c / 4.5) h)`,
    100: `oklch(from ${color} calc(l + 0.8 * (1 - ${inverted} - l)) calc(c / 3) h)`,
    200: `oklch(from ${color} calc(l + 0.6 * (1 - ${inverted} - l)) calc(c / 2) h)`,
    300: `oklch(from ${color} calc(l + 0.4 * (1 - ${inverted} - l)) calc(c / 1.5) h)`,
    400: `oklch(from ${color} calc(l + 0.2 * (1 - ${inverted} - l)) calc(c / 1.25) h)`,
    500: `${color}`,
    600: `oklch(from ${color} calc(l + 0.2 * (${inverted} - l)) calc(c / 1.25) h)`,
    700: `oklch(from ${color} calc(l + 0.4 * (${inverted} - l)) calc(c / 1.5) h)`,
    800: `oklch(from ${color} calc(l + 0.6 * (${inverted} - l)) calc(c / 2)  h)`,
    900: `oklch(from ${color} calc(l + 0.8 * (${inverted} - l)) calc(c / 3)  h)`,
    950: `oklch(from ${color} calc(l + 1 * (${inverted} - l)) calc(c / 4.5) h)`,
  }
}

export function getOklchColor(color: OklchColor): String {
  return `oklch(${color.light}% ${color.chroma} ${color.hue})`
}

export const maxChroma = (i, hue, scale, grayval) => {
  let oklch = converter('oklch')
  let color = 'oklch(' + lightness[scale][i] + '% ' + gray[grayval] + ' ' + hue + ')'
  return formatCss(oklch(toGamut('p3', 'oklch', differenceEuclidean('oklch'), 0)(color)))
}

export const oklchVal = (i, hue, scale, grayval) => {
  let oklch = converter('oklch')
  return `oklch(${lightness[scale][i]}% ${gray[grayval]} ${hue} / <alpha-value>)`
}

const oklchParams = (i, hue, scale, grayval) => {
  let oklch = converter('oklch')
  return `'${lightness[scale][i]}% ${gray[grayval]} ${hue}'`
}

function calculatePalette(hue, scale, grayval) {
  return shades.map((shade, i) => maxChroma(i, hue, scale, grayval))
}
