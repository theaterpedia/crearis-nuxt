<template>
  <Hero :contentType="phoneBanner ? 'banner' : 'text'" :heightTmp="heightTmp" :imgTmp="imgTmp" :imgTmpAlignX="imgTmpAlignX" :imgTmpAlignY="imgTmpAlignY" :bottomline="bottomline" :contentWidth="isFullWidth ? 'full' : 'short'" :contentAlignY="contentAlignY" :overlay="getoverlay(gradient_type, gradient_depth)">
    <component :transparent="isTransparent" :is="banner ? 'Banner' : 'div'">
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
  label: 'B: Section',
  gradient_type: selectField({
    choices: {top: 'top', leftTop: 'left-top', left: 'left', leftBottom: 'left-bottom', bottom: 'bottom', none: 'none', full: 'full'},
    label: 'Abdecken: Fokus'
  }),
  gradient_depth: numberField({
    default: 0.8,
    min: 0,
    max: 1,
    label: 'Abdecken: Intensität (0-1)'
  }),
  inBanner: checkboxField({
    default: false,
    label: 'Content-Banner'
  }), 
  phoneBanner: checkboxField({
    default: false,
    label: 'phone>banner-style?'
  }),   
  isTansparent: checkboxField({
    default: true,
    label: 'Banner-Transparenz'
  }),
  isFullWidth: checkboxField({
    default: false,
    label: 'breit'
  }),  
  bottomLine: checkboxField({
    default: false,
    label: 'breit'
  }),   
  heightTmp: selectField({
    choices: {full: 'full',  prominent: 'prominent', medium: 'medium', mini: 'mini'},
    default: 'prominent',
    label: 'Höhe',
  }), 
  contentAlignY: selectField({
    choices: {top: 'top',  bottom: 'bottom', center: 'center'},
    label: 'Content: V-Fokus'
  }), 
  imgTmp: textField({
    required: true,
    label: 'Bild: URL',
  }),
  imgTmpAlignY: selectField({
    choices: {top: 'top',  bottom: 'bottom', center: 'center', stretch: 'stretch', cover: 'cover'},
    default: 'stretch',
    label: 'Bild: V-Fokus'
  }),
  imgTmpAlignX: selectField({
    choices: {left: 'left',  right: 'right', center: 'center', stretch: 'stretch', cover: 'cover'},
    default: 'center',
    label: 'Bild: H-Fokus'
  }),          
  slots: {
    default: {
      label: 'Blocks', // Displayed in the dashboard
      allowedChildBlocks: ['FlexProse', 'FlexColumns', 'FlexVideo', 'FlexImage'],
    },
  },
})

const getoverlay = (gradient: string, depth: number) => {
  const deg =
    gradient && gradient !== 'none'
      ? gradient == 'left'
        ? '90deg'
        : gradient == 'left-bottom'
          ? '60deg'
          : gradient == 'left-top'
            ? '120deg'
            : gradient == 'right'
              ? '270deg'
              : gradient == 'bottom'
                ? '10deg'
                : gradient == 'top'
                  ? '170deg'
                  : ''
      : ''
  return gradient && gradient !== 'none'
    ? gradient !== 'full'
      ? `linear-gradient(${deg}, rgba(255, 193, 7, ${depth}) 18%, rgba(255, 255, 255, 0.62) 50%, rgba(255, 255, 255, 0.10) 81%)`
      : ''
    : ''
}
</script>
