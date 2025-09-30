// import { useToast } from 'vue-toastification'
import { ref, reactive, watch } from 'vue'
import type { BaseColors, SfColorMapping } from '@crearis/theme/utils/colorSettings'
import { palette } from '@crearis/theme/utils/colorSettings'

export function useTheme() {
  const themes = [
    {
      id: 0,
      heading: '**E-Motion**Performance und Shows',
      description: `dark-Theme mit
      <br />- markanter Typographie 
      <br />- flächigen Farben`,
      inverted: true,
      font: 'MonaspaceKrypton',
      headings: 'MonaspaceKrypton',
      baseColors: <BaseColors>{
        primary: '70% 0.4 20',
        secondary: '88% 0.4 100',
        warning: '88% 0.4 100',
        positive: '88% 0.4 138',
        negative: '88% 0.4 4',
        neutral: '88% 0.02 88',
      },
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
    {
      id: 1,
      heading: '**REGIO**Vernetzung und Profile',
      description: `Sidenavigation mit Scroll-Over-Design 
      <br />description-text 
      <br />description-text`,
      inverted: false,
      font: 'MonaspaceNeon',
      headings: 'MonaspaceNeon',
      baseColors: <BaseColors>{
        primary: '70% 0.4 141.001',
        secondary: '76% 0.205 131.001',
        warning: '93% 0.2 104',
        positive: '76% 0.205 131',
        negative: '88% 0.3 17',
        neutral: '70% 0 0',
      },
      colormap: [
        { name: 'muted-bg', sfname: 'neutral', shade: 300 },
        { name: 'muted-contrast', sfname: 'neutral', shade: 700 },
        { name: 'accent-bg', sfname: 'neutral', shade: 800 },
        { name: 'accent-contrast', sfname: 'neutral', shade: 100 },
      ],
      imgUrl:
        'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
    },
    {
      id: 2,
      heading: '**Pastell**Blogging und News',
      description: `description-text description-text 
      <br />description-text 
      <br />description-text`,
      inverted: false,
      font: 'MonaspaceRadon',
      headings: 'MonaspaceRadon',
      baseColors: <BaseColors>{
        primary: '99% 0.25 80',
        secondary: '80% 0.4 274',
        warning: '94% 0.3 111',
        positive: '85% 0.35 145',
        negative: '99% 0.395 23',
        neutral: '88% 0.02 88',
      },
      colormap: [
        { name: 'primary-bg', sfname: 'primary', shade: 200 },
        { name: 'secondary-bg', sfname: 'secondary', shade: 200 },
        { name: 'warning-bg', sfname: 'warning', shade: 200 },
        { name: 'positive-bg', sfname: 'positive', shade: 200 },
        { name: 'negative-bg', sfname: 'negative', shade: 200 },
        { name: 'card-bg', sfname: 'neutral', shade: 100 },
        { name: 'card-contrast', sfname: 'neutral', shade: 900 },
        { name: 'muted-bg', sfname: 'neutral', shade: 200 },
        { name: 'muted-contrast', sfname: 'neutral', shade: 500 },
        { name: 'accent-bg', sfname: 'neutral', shade: 800 },
        { name: 'accent-contrast', sfname: 'neutral', shade: 100 },
      ],
      imgUrl:
        'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
    },
    {
      id: 3,
      heading: '**INSTITUT**Kurse managen',
      description: `Sidenavigation mit Scroll-Over-Design 
      <br />description-text 
      <br />description-text`,
      inverted: false,
      font: 'Roboto',
      headings: 'Roboto',
      baseColors: <BaseColors>{
        primary: '97% 0.35 191.001',
        secondary: '70% 0.204 43',
        warning: '94% 0.3 111',
        positive: '70% 0.4 150',
        negative: '60% 0.35 30',
        neutral: '70% 0 0',
      },
      colormap: [
        { name: 'primary-contrast', sfname: 'gray', shade: 950 },
        { name: 'secondary-contrast', sfname: 'gray', shade: 950 },
        { name: 'positive-contrast', sfname: 'gray', shade: 950 },
        { name: 'negative-contrast', sfname: 'gray', shade: 950 },
        { name: 'warning-contrast', sfname: 'gray', shade: 950 },
        { name: 'card-bg', sfname: 'neutral', shade: 100 },
        { name: 'muted-bg', sfname: 'neutral', shade: 200 },
        { name: 'muted-contrast', sfname: 'neutral', shade: 600 },
        { name: 'accent-bg', sfname: 'neutral', shade: 800 },
        { name: 'accent-contrast', sfname: 'neutral', shade: 100 },
      ],
      imgUrl:
        'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
    },
    {
      id: 4,
      heading: '**Neon**Konzepte visualisieren',
      description: `knallige Post-Its-Farben 
      <br />- Mono-Typographie 
      <br />- schlichte Farbflächen`,
      inverted: false,
      font: 'MonaspaceNeon',
      headings: 'MonaspaceArgon',
      baseColors: <BaseColors>{
        primary: '99% 0.30 110',
        secondary: '82% 0.35 0',
        warning: '99% 0.30 110',
        positive: '97% 0.35 145',
        negative: '82% 0.35 0',
        neutral: '99% 0.02 110',
      },
      colormap: [
        { name: 'primary-bg', sfname: 'primary', shade: 400 },
        { name: 'secondary-bg', sfname: 'secondary', shade: 400 },
        { name: 'warning-bg', sfname: 'warning', shade: 400 },
        { name: 'positive-bg', sfname: 'positive', shade: 400 },
        { name: 'negative-bg', sfname: 'negative', shade: 400 },
        { name: 'card-bg', sfname: 'neutral', shade: 400 },
        { name: 'card-contrast', sfname: 'neutral', shade: 900 },
        { name: 'muted-bg', sfname: 'neutral', shade: 600 },
        { name: 'muted-contrast', sfname: 'neutral', shade: 950 },
        { name: 'accent-bg', sfname: 'neutral', shade: 900 },
        { name: 'accent-contrast', sfname: 'primary', shade: 200 },
      ],
      imgUrl:
        'https://res.cloudinary.com/little-papillon/image/upload/t_event-banner-smart/v1722972081/dasei/thematische_warmups_wfwtzh.jpg',
    },
    {
      id: 5,
      heading: '**Lempel**Theme with VSF-Colors & Typography',
      description: `
      <br />- missing: typography
      <br />- missing: colors`,
      inverted: false,
      font: 'Lato',
      headings: 'Poppins',
      baseColors: <BaseColors>{
        primary: '88% 0.4 100',
        secondary: '88% 0.4 100',
        warning: '88% 0.4 100',
        positive: '88% 0.4 138',
        negative: '88% 0.4 4',
        neutral: '88% 0.02 88',
      },
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
    {
      id: 6,
      heading: '**Rayleigh**Theme from the pruvious-tutorial',
      description: `description-text description-text 
      <br />description-text 
      <br />description-text`,
      inverted: false,
      font: 'Lato',
      headings: 'Poppins',
      baseColors: <BaseColors>{
        primary: '88% 0.4 100',
        secondary: '88% 0.4 100',
        warning: '88% 0.4 100',
        positive: '88% 0.4 138',
        negative: '88% 0.4 4',
        neutral: '88% 0.02 88',
      },
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
    {
      id: 7,
      heading: '**Theaterpedia**eine Neon-Variante',
      description: `knallige Post-Its-Farben 
      <br />- Mono-Typographie 
      <br />- schlichte Farbflächen`,
      inverted: true,
      font: 'MonaspaceNeon',
      headings: 'MonaspaceArgon',
      baseColors: <BaseColors>{
        primary: '93% 0.25 104.001',
        secondary: '76% 0.25 131',
        warning: '93% 0.25 104',
        positive: '76% 0.25 131',
        negative: '82% 0.3 17',
        neutral: '80% 0.02 104',
      },
      colormap: [
        { name: 'contrast', sfname: 'gray', shade: 950 },
        { name: 'primary-bg', sfname: 'primary', shade: 500 },
        { name: 'secondary-bg', sfname: 'secondary', shade: 500 },
        { name: 'warning-bg', sfname: 'warning', shade: 500 },
        { name: 'positive-bg', sfname: 'positive', shade: 500 },
        { name: 'negative-bg', sfname: 'negative', shade: 500 },
        { name: 'card-bg', sfname: 'neutral', shade: 300 },
        { name: 'card-contrast', sfname: 'neutral', shade: 900 },
        { name: 'muted-bg', sfname: 'neutral', shade: 200 },
        { name: 'muted-contrast', sfname: 'neutral', shade: 950 },
        { name: 'accent-bg', sfname: 'neutral', shade: 800 },
        { name: 'accent-contrast', sfname: 'neutral', shade: 50 },
        { name: 'warning-contrast', sfname: 'gray', shade: 950 },
        { name: 'positive-contrast', sfname: 'gray', shade: 950 },
        { name: 'negative-contrast', sfname: 'gray', shade: 950 },
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

  const themeId = ref(0)
  const theme = ref(themes[0])

  // active theme state (preview theme if selected)
  const font = ref(theme.value.font)
  const headings = ref(theme.value.headings)
  const baseColors = reactive<BaseColors>({ ...theme.value.baseColors })
  const colormap = ref<SfColorMapping[]>([...colormap_defaults])
  const inverted = ref(false)
  const getInverted = () => {
    return inverted.value ? '1' : '0'
  }

  // currently edited theme state (for page-level theming)
  // const editFont = ref(theme.value.font)
  // const editHeadings = ref(theme.value.headings)
  // const editBaseColors = reactive<BaseColors>({ ...theme.value.baseColors })
  // const editColormap = ref<SfColorMapping[]>([...colormap_defaults])
  // const editInverted = ref(false)

  const loading = ref(false)
  // const toast = useToast()
  const getThemeId = () => {
    return themeId.value
  }

  // method to preview a theme if selected
  const initTheme = (id: number) => {
    themeId.value = id
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

  const isPinned = (colorName: String, colors?: BaseColors) => {
    if (colorName === 'gray') return true
    if (colorName === 'neutral') return false
    
    // Use provided colors or fall back to global baseColors
    const targetColors = colors || baseColors
    const colorKey = colorName.toString() as keyof BaseColors
    if (!targetColors[colorKey]) return false
    return targetColors[colorKey].endsWith('.001')
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
      }).concat(
      Object.entries(colormap).map(([key, value]) => {
        const varName = `var(--color-${value.sfname}-base)`
        // if shade is 500, use the base color = no calculations + no effect on 'inverted'
        if (value.shade === 500) {
          return `${asCss ? '--color-' : '"'}${value.name}${asCss ? ': ' : '": "'}${varName}${asCss ? ';' : '",'}`
        }
        return `${asCss ? '--color-' : '"'}${value.name}${asCss ? ': ' : '": "'}${palette(varName, isPinned(value.sfname, colors) ? '0' : 'var(--color-inverted)')[value.shade as keyof ReturnType<typeof palette>]}${asCss ? ';' : '",'}`
      }))
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
    // toast.info('Inverted: ' + getInverted())
    /* updateTheme()
    toast.info('Inverted colors: ' + getInverted())
    console.log('cssColorVars.value', cssColorVars.value) */
  }

  const updateTheme = () => {
    cssColorVars.value = getColorVars(baseColors, getColormapWithDefaults(colormap.value), true)
    cssFontVars.value = getFontVars(font.value, headings.value, true)
    // console.log('🎨 Current theme base-colors:', JSON.stringify(themes[themeId.value].baseColors))
    // log only the colormap entries (all strings without '-base'), concatenated to a single string with line breaks
    // console.log('🎨 Current theme bg-colormap:', '\n'.concat(cssColorVars.value.filter((c) => c.indexOf('bg') > 0).join('\n')))

    useHead({
      htmlAttrs: {
        'data-theme': 'dynamic',
        style: cssColorVars.value.concat(cssFontVars.value),
        id: 'dynamic-theme-vars'
      },
    })

    // const newAppConfig = useAppConfig().cssVars

    //convert colorVars to css vars
    // const cssVars = Object.fromEntries(
    //  Object.entries(colorVars).map(([key, value]) => [`--color-${key.replace(/_/g, '-')}`, value])
    //)
    // newAppConfig['--color-primary-base'] = 'oklch(60% 0.25 264)'
    // updateAppConfig(newAppConfig)
    // console.log('new CSSVars: ', useAppConfig().cssVars)
  }

  const getThemeVars = (id: number) => {
    // Use the specific theme's baseColors for pinning logic, not the global state
    const colors = getColorVars(themes[id].baseColors, getColormapWithDefaults(themes[id].colormap), true)
    const fonts = getFontVars(themes[id].font, themes[id].headings, true)
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

  const getConfigJson = () => {
    const newConfig = { baseColors: {} as any, colormap: [] as any }
    if (font.value !== theme.value.font) Object.assign(newConfig, { font: font.value })
    if (headings.value !== theme.value.headings) Object.assign(newConfig, { headings: headings.value })
    if (inverted.value !== theme.value.inverted) Object.assign(newConfig, { inverted: inverted.value })
    if (baseColors.primary !== theme.value.baseColors.primary)
      Object.assign(newConfig.baseColors, { primary: baseColors.primary })
    if (baseColors.secondary !== theme.value.baseColors.secondary)
      Object.assign(newConfig.baseColors, { secondary: baseColors.secondary })
    if (baseColors.warning !== theme.value.baseColors.warning)
      Object.assign(newConfig.baseColors, { warning: baseColors.warning })
    if (baseColors.positive !== theme.value.baseColors.positive)
      Object.assign(newConfig.baseColors, { positive: baseColors.positive })
    if (baseColors.negative !== theme.value.baseColors.negative)
      Object.assign(newConfig.baseColors, { negative: baseColors.negative })
    if (baseColors.neutral !== theme.value.baseColors.neutral)
      Object.assign(newConfig.baseColors, { neutral: baseColors.neutral })

    // only add those entries in colormap that are different from the colormap of the loaded theme
    const currentColormap = colormap.value
    const loadedColormap = getColormapWithDefaults(theme.value.colormap)
    for (const [key, value] of Object.entries(currentColormap)) {
      if (JSON.stringify(value) !== JSON.stringify(loadedColormap[key])) {
        Object.assign(newConfig.colormap, { [key]: value })
      }
    }
    // delete null entries from colormap
    newConfig.colormap = newConfig.colormap.filter((c) => c != null)

    // delete baseColors if empty
    if (Object.keys(newConfig.baseColors).length === 0) delete newConfig.baseColors
    // delete colormap if empty
    if (newConfig.colormap.length === 0) delete newConfig.colormap

    // if no changes were made, return empty json
    if (Object.keys(newConfig).length === 0) return '{}'
    return JSON.stringify(newConfig, null, 2)
  }

  const getTsVars = () => {
    return getColorVars(baseColors, colormap.value, false)
  }

  // this could be used to update the theme in the database
  /* const updatePartner = async (params: MutationCreateUpdatePartnerArgs) => {
    loading.value = true

    const { data } = await $sdk().odoo.mutation<MutationCreateUpdatePartnerArgs, CreateUpdatePartnerResponse>(
      { mutationName: MutationName.CreateUpdatePartner },
      params,
    )

    user.value = data.value.createUpdatePartner

    if (userCookie.value?.id) {
      userCookie.value = data.value?.createUpdatePartner?.id
    }

    toast.success('Partner updated successfully')
  } */

  // this could be used to reset the theme in the database
  /* const resetPassword = async (params: MutationResetPasswordArgs) => {
    loading.value = true
    const { error } = await $sdk().odoo.mutation<MutationResetPasswordArgs, ResetPasswordResponse>(
      { mutationName: MutationName.SendResetPasswordMutation },
      { ...params },
    )
    if (error.value) {
      toast.error(error.value?.data?.message)
      return
    }

    router.push('/reset-password-success')
    resetEmail.value = params.email
  } */

  // this could be used to check whether we have loaded theme-settings from the database
  /* const isAuthenticated = computed(() => {
    return user?.value?.id || Boolean(userCookie.value)
  }) */

  initTheme(0)

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
    getThemeId,
    loadTheme,
    initTheme,
    getCssVars,
    getTsVars,
    setInverted,
    getThemeVars,
    getConfigJson,
  }
}
