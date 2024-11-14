<template>
  <Hero
    :bottomline="bottomline"
    :contentAlignY="contentAlignY"
    :contentType="phoneBanner ? 'banner' : 'text'"
    :contentWidth="isFullWidth ? 'full' : 'short'"
    :heightTmp="heightTmp"
    :imgTmp="imgTmp"
    :imgTmpAlignX="imgTmpAlignX"
    :imgTmpAlignY="imgTmpAlignY"
    :overlay="getoverlay(gradient_type, gradientDepth)"
  >
    <component :is="banner ? 'Banner' : 'div'" :transparent="isTransparent">
      <slot />
    </component>
  </Hero>
</template>

<script lang="ts" setup>
import { Hero, Banner } from '@crearis/ui'
import { type PropType } from 'vue'
import { defineBlock, checkboxField, textField, selectField, numberField } from '#pruvious'

defineBlock({
  icon: 'H2',
  label: 'A: Scroll-Header',
  gradientType: selectField({
    choices: {
      top: 'top',
      leftTop: 'left-top',
      left: 'left',
      leftBottom: 'left-bottom',
      bottom: 'bottom',
      none: 'none',
      full: 'full',
    },
    label: 'Abdecken: Fokus',
  }),
  gradientDepth: numberField({
    default: 0.8,
    decimals: 2,    
    min: 0,
    max: 1,
    label: 'Abdecken: Intensität (0-1)',
  }),
  inBanner: checkboxField({
    default: false,
    label: 'Content-Banner',
  }),
  phoneBanner: checkboxField({
    default: false,
    label: 'phone>banner-style?',
  }),
  isTansparent: checkboxField({
    default: true,
    label: 'Banner-Transparenz',
  }),
  isFullWidth: checkboxField({
    default: false,
    label: 'breit',
  }),
  bottomLine: checkboxField({
    default: false,
    label: 'breit',
  }),
  heightTmp: selectField({
    choices: { full: 'full', prominent: 'prominent', medium: 'medium', mini: 'mini' },
    default: 'prominent',
    label: 'Höhe',
  }),
  contentAlignY: selectField({
    choices: { top: 'top', bottom: 'bottom', center: 'center' },
    label: 'Content: V-Fokus',
  }),
  imgTmp: textField({
    required: true,
    label: 'Bild: URL',
  }),
  imgTmpAlignY: selectField({
    choices: { top: 'top', bottom: 'bottom', center: 'center', stretch: 'stretch', cover: 'cover' },
    default: 'stretch',
    label: 'Bild: V-Fokus',
  }),
  imgTmpAlignX: selectField({
    choices: { left: 'left', right: 'right', center: 'center', stretch: 'stretch', cover: 'cover' },
    default: 'center',
    label: 'Bild: H-Fokus',
  }),
  slots: {
    default: {
      label: 'Blocks', // Displayed in the dashboard
      allowedChildBlocks: ['VarProse', 'PageColumns', 'VarVideo', 'VarImage'],
    },
  },
})
</script>
