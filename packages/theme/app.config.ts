import { colorVars, colorScales } from './theme'

const cssVars = {}
// = Object.fromEntries(
//  Object.entries(colorVars).map(([key, value]) => [`--color-${key.replace(/_/g, '-')}`, value]),
//)

export default defineAppConfig({
  theme: {
    colorScales: colorScales,
    colorVars: colorVars,
  },
  cssVars: cssVars,
})
