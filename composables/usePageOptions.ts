import { ref, reactive, watch } from 'vue'

export function usePageOptions() {
  const heroTypes = [
    {
      id: 0,
      name: 'none',
      description: `no hero`,
      heroSize: 'mini',
      allowedSizes: [],
      font: 'MonaspaceKrypton',
      headings: 'MonaspaceKrypton',
      colormap: [
        { name: 'primary-bg', sfname: 'primary', shade: 400 },
        { name: 'secondary-bg', sfname: 'secondary', shade: 400 },
        { name: 'warning-bg', sfname: 'warning', shade: 400 },
        { name: 'positive-bg', sfname: 'positive', shade: 400 },
        { name: 'negative-bg', sfname: 'negative', shade: 400 },
        { name: 'muted-bg', sfname: 'neutral', shade: 300 },
        { name: 'muted-contrast', sfname: 'neutral', shade: 700 },
        { name: 'accent-bg', sfname: 'neutral', shade: 800 },
        { name: 'accent-contrast', sfname: 'neutral', shade: 100 },
      ],
      imgUrl:
        'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
    },
  ]

  // these mappings are congifurable and can be changed by the user, will be exported as css-vars
  const colormap_defaults = <SfColorMapping[]>[
    { name: 'bg', sfname: 'neutral', shade: 50 },
    { name: 'contrast', sfname: 'neutral', shade: 950 },
    { name: 'black', sfname: 'gray', shade: 950 },
    { name: 'white', sfname: 'gray', shade: 50 },
    { name: 'primary-bg', sfname: 'primary', shade: 500 },
    { name: 'secondary-bg', sfname: 'secondary', shade: 500 },
    { name: 'warning-bg', sfname: 'warning', shade: 500 },
    { name: 'positive-bg', sfname: 'positive', shade: 500 },
    { name: 'negative-bg', sfname: 'negative', shade: 500 },
    { name: 'muted-bg', sfname: 'neutral', shade: 200 },
    { name: 'muted-contrast', sfname: 'neutral', shade: 700 },
    { name: 'accent-bg', sfname: 'neutral', shade: 800 },
    { name: 'accent-contrast', sfname: 'neutal', shade: 50 },
    { name: 'card-bg', sfname: 'neutral', shade: 200 },
    { name: 'card-contrast', sfname: 'neutral', shade: 900 },
    { name: 'popover-bg', sfname: 'neutral', shade: 200 },
    { name: 'popover-contrast', sfname: 'neutral', shade: 900 },
    { name: 'primary-contrast', sfname: 'primary', shade: 950 },
    { name: 'secondary-contrast', sfname: 'secondary', shade: 950 },
    { name: 'positive-contrast', sfname: 'positive', shade: 950 },
    { name: 'negative-contrast', sfname: 'negative', shade: 950 },
    { name: 'warning-contrast', sfname: 'warning', shade: 950 },
    // TODO: specify these from sf-colors
    { name: 'dimmed', sfname: 'neutral', shade: 300 },
    { name: 'border', sfname: 'neutral', shade: 100 },
    { name: 'input', sfname: 'neutral', shade: 200 },
    { name: 'ring', sfname: 'neutral', shade: 900 },
  ]

  const theme = ref(themes[0])
  const font = ref(theme.value.font)
  const headings = ref(theme.value.headings)
  const baseColors = reactive<BaseColors>(theme.value.baseColors)
  const colormap = ref<SfColorMapping[]>(colormap_defaults)
  const inverted = ref(false)
  const getInverted = () => {
    return inverted.value ? '1' : '0'
  }
  const loading = ref(false)
  const toast = useToast()

  // method to preview a theme if selected
  const initTheme = (id: number) => {
    theme.value = themes[id]
    font.value = theme.value.font
    headings.value = theme.value.headings
    colormap.value = colormap_defaults.map((c) => theme.value.colormap.find((tc) => tc.name === c.name) || c)
    baseColors.primary = theme.value.baseColors.primary
    baseColors.secondary = theme.value.baseColors.secondary
    baseColors.warning = theme.value.baseColors.warning
    baseColors.positive = theme.value.baseColors.positive
    baseColors.negative = theme.value.baseColors.negative
    baseColors.neutral = theme.value.baseColors.neutral.endsWith('.001')
      ? theme.value.baseColors.neutral.slice(0, -4)
      : theme.value.baseColors.neutral
    baseColors.gray = theme.value.baseColors.neutral + '.001'
    inverted.value = theme.value.inverted
  }
  // initialize colormap and baseColors with first theme

  const getColormapWithDefaults = (colormap: SfColorMapping[]) => {
    return colormap_defaults.map((c) => colormap.find((tc) => tc.name === c.name) || c)
  }

  const isPinned = (colorName: String) => {
    if (colorName === 'gray') return true
    if (colorName === 'neutral') return false
    if (!baseColors[colorName.toString()]) return false
    return baseColors[colorName.toString()].endsWith('.001')
  }

  // update gray color if neutral changes
  watch(baseColors, (newColors) => {
    const newNeutral = newColors.neutral.endsWith('.001') ? newColors.neutral : newColors.neutral + '.001'
    if (baseColors.gray !== newNeutral) {
      baseColors.gray = newNeutral
    }
  })

  // initialize colormap and baseColors with first theme
  const getColorVars = (colors: BaseColors, colormap: SfColorMapping[], asCss: Boolean) => {
    return (
      Object.entries(colors).map(([key, value]) => {
        // if value ends with ' pin', set boolean pin to true and remove it from value
        const oklchColor = `oklch(${value})`
        return `${asCss ? '--color-' : '"'}${key}-base${asCss ? ': ' : '": "'}${palette(oklchColor, 'var(--color-inverted)')[500]}${asCss ? ';' : '",'}`
      }),
      Object.entries(colormap).map(([key, value]) => {
        const varName = `var(--color-${value.sfname}-base)`
        // if shade is 500, use the base color = no calculations + no effect on 'inverted'
        if (value.shade === 500) {
          return `${asCss ? '--color-' : '"'}${value.name}${asCss ? ': ' : '": "'}${varName}${asCss ? ';' : '",'}`
        }
        return `${asCss ? '--color-' : '"'}${value.name}${asCss ? ': ' : '": "'}${palette(varName, isPinned(value.sfname) ? '0' : 'var(--color-inverted)')[value.shade.toString()]}${asCss ? ';' : '",'}`
      })
    )
  }

  const getFontVars = (font: String = 'Roboto', headings: String = 'MonaspaceNeon', asCss: Boolean) => {
    return [
      `${asCss ? '--font:' : '"font": "'}${font}${asCss ? ';' : '",'}`,
      `${asCss ? '--headings:' : '"headings": "'}${headings}${asCss ? ';' : '",'}`,
    ]
  }

  const cssColorVars = ref(getColorVars(baseColors, getColormapWithDefaults(colormap.value), true))
  const cssFontVars = ref(getFontVars(font.value, headings.value, true))

  /* useHead({
    htmlAttrs: {
      style: "'var(--color-inverted)': inverted.value ? '1;' : '0;'",
    },
    // htmlAttrs: {
    //  style: cssColorVars.value.concat(cssFontVars.value),
    //}, 
  })  */

  const loadTheme = (id: number) => {
    initTheme(id)
    updateTheme()
  }

  const setInverted = (invert: boolean) => {
    inverted.value = invert
    useHead({ htmlAttrs: { style: { '--color-inverted': inverted.value ? '1' : '0' } } })
    toast.info('Inverted: ' + getInverted())
    /* updateTheme()
    toast.info('Inverted colors: ' + getInverted())
    console.log('cssColorVars.value', cssColorVars.value) */
  }

  const updateTheme = () => {
    console.log('Current theme:', theme.value)
    cssColorVars.value = getColorVars(baseColors, colormap.value, true)
    cssFontVars.value = getFontVars(font.value, headings.value, true)
    console.log('Current colors:', cssColorVars.value)
    useHead({ htmlAttrs: { style: cssColorVars.value.concat(cssFontVars.value) } })
  }

  const getThemeVars = (id: number) => {
    const colors = getColorVars(themes[id].baseColors, themes[id].colormap, true)
    const fonts = getFontVars(themes[id].font, themes[id].heading, true)
    const theme_invert = themes[id].inverted ? '1' : '0'
    const ThemeCssVars = colors.concat(fonts).map((v) => v.replace('var(--color-inverted)', theme_invert))
    return ThemeCssVars
  }

  const getCssVars = (withInverted: boolean = false) => {
    if (withInverted) {
      return cssColorVars.value.concat(cssFontVars.value).map((v) => v.replace('var(--color-inverted)', getInverted()))
    }
    return cssColorVars.value.concat(cssFontVars.value)
  }

  const getTsVars = () => {
    return getColorVars(baseColors, colormap.value, false)
  }

  return {
    baseColors,
    colormap,
    themes,
    theme,
    font,
    headings,
    inverted,
    loading,
    updateTheme,
    loadTheme,
    initTheme,
    getCssVars,
    getTsVars,
    setInverted,
    getThemeVars,
  }
}
