<template>
  <Section :background="background" overlap class="section" :class="`bottom-${bottomSpacing}`">
    <div v-if="imgTmp" class="hero-background">
      <div
        class="static-cover-image"
        :style="{
          backgroundImage: `url(${imgTmp})`,
          backgroundPositionX: 'center',
          backgroundPositionY: imgTmpAlignY === 'stretch' ? 'top' : imgTmpAlignY === 'cover' ? 'center' : imgTmpAlignY,
          backgroundSize:
            imgTmpAlignX === 'cover' || imgTmpAlignY === 'cover'
              ? 'cover'
              : `${imgTmpAlignX === 'stretch' ? '100%' : 'auto'} ${imgTmpAlignY === 'stretch' ? '100%' : 'auto'}`,
        }"
      >
        <div class="hero-cover-overlay" :style="{ background: `rgba(255, 255, 255, ${simpleOverlay}%)` }"></div>
      </div>
    </div>
    <Container v-if="title" class="mt-[-3.25rem]">
      <Heading
        :content="title"
        :is="`h${level ? level : 2}`"
        class="bg-primary theme-shadow ml-[-2.75rem] max-w-[44rem] py-2 pl-11"
        :class="imgTmp && isBackgroundImage ? 'mb-52' : ''"
      />
      <p v-if="description">
        {{ description }}
      </p>
    </Container>
    <Container class="mt-4">
      <div
        :class="[
          `columns-${colGapSmall ? 'small' : 'medium'}`,
          `columns-${columns}`,
          `columns-${colbackground ?? 'nobox'}`,
          columns !== 'none' ? 'columns' : null,
          colWrap ? 'columns-wrap' : null,
          colStackReverse ? 'columns-stack-reverse' : null,
        ]"
      >
        <slot />
      </div>
    </Container>
  </Section>
</template>

<script lang="ts" setup>
import { Container, Section } from '@crearis/ui'
import { defineBlock, textField, numberField, checkboxField, selectField } from '#pruvious'

defineBlock({
  icon: 'H2',
  label: 'B: Section',
  slots: {
    default: {
      label: 'Blocks', // Displayed in the dashboard
      allowedChildBlocks: ['SubColumns', 'SubColumn', 'SubPostIt', 'VarProse', 'VarVideo', 'VarImage'],
    },
  },
})

const props = defineProps({
  title: textField({
    placeholder: 'Heading: _ID_ overline **HEADLINE** subline',
    label: 'Heading (optional)',
    required: false,
  }),
  level: numberField({
    label: 'Überschrifts-Ebene',
    placeholder: '2',
    default: 2,
    min: 1,
    max: 3,
  }),
  description: textField({
    placeholder: 'Teasertext (optional)',
  }),
  columns: selectField({
    choices: { none: 'nein', start: 'links', block: 'geblockt', middle: 'zentriert', end: 'rechts' },
    default: 'none',
    label: 'Spalten',
  }),
  colWrap: checkboxField({
    default: true,
    label: 'Spalten: umbrechen',
  }),
  colGapSmall: checkboxField({
    default: false,
    label: 'Spalten: eng',
  }),
  colStackReverse: checkboxField({
    default: false,
    label: 'Spalten: letzte nach oben',
  }),
  bottomSpacing: selectField({
    choices: { small: 'schmal', default: 'normal', medium: 'mittel', large: 'groß' },
    default: 'default',
    label: 'Bodenhöhe',
  }),
  background: selectField({
    choices: { default: 'default', muted: 'muted', accent: 'accent' },
    default: 'default',
    label: 'Hintergrund',
  }),
  colbackground: selectField({
    choices: { nobox: 'nein', transparent: 'tansparent', default: 'normal', muted: 'muted', accent: 'accent' },
    default: 'nobox',
    label: 'Spalten in Kasten?',
  }),
  imgTmp: textField({
    required: false,
    label: 'Banner-Bild? (1440*400): URL angeben',
  }),
  isBackgroundImage: checkboxField({
    default: false,
    label: ' > als Hintergrund-Banner?',
  }),
  simpleOverlay: numberField({
    label: '---> Banner abschwächen (0-100%)',
    placeholder: '0',
    default: 0,
    min: 0,
    max: 100,
  }),
  imgTmpAlignY: selectField({
    choices: { top: 'top', bottom: 'bottom', center: 'center', stretch: 'stretch', cover: 'cover' },
    default: 'stretch',
    label: 'Hintergrund: V-Fokus',
  }),
  imgTmpAlignX: selectField({
    choices: { left: 'left', right: 'right', center: 'center', stretch: 'stretch', cover: 'cover' },
    default: 'center',
    label: 'Hintergrund: H-Fokus',
  }),
  /* gradientType: selectField({
    choices: {
      top: 'top',
      leftTop: 'left-top',
      left: 'left',
      leftBottom: 'left-bottom',
      bottom: 'bottom',
      none: 'none',
      full: 'full',
    },
    default: 'none',
    label: 'Hintergrund: Abdecken Fokus',
  }),
  gradientDepth: numberField({
    default: 0.8,
    decimals: 2,
    min: 0,
    max: 1,
    label: 'Hintergrund: Abdecken Intensität (0-1)',
  }), */
})

const overlay = getoverlay(props.gradientType, props.gradientDepth)
</script>

<style scoped>
.hero-background {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;
  max-height: 250px;
  transform: translate3d(0, 0, 0);
}

.static-cover-image {
  top: 0;
  width: 100%;
  height: 100%;
  max-height: 250px;
  background-repeat: no-repeat;
}

.hero-cover-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.bottom-small {
  padding-bottom: 0em;
}

.bottom-medium {
  padding-bottom: 4em;
}

.bottom-large {
  padding-bottom: 6em;
}

.columns {
  --column-padding: 0;
  display: flex;
  align-items: flex-start;
}

.columns-default {
  --color-bg: var(--color-card-bg);
  --color-contrast: var(--color-card-contrast);
  background-color: var(--color-card-bg);
  color: var(--color-card-contrast);
}

:is(.columns-default, .columns-muted, .columns-transparent, .columns-accent) :deep() > .column-default:first-child {
  padding-left: var(--column-padding);
}

:is(.columns-default, .columns-muted, .columns-transparent, .columns-accent) :deep() > .column-default:last-child {
  padding-right: var(--column-padding);
}

.columns-muted {
  --color-bg: var(--color-muted-bg);
  --color-contrast: var(--color-card-contrast);
  background-color: var(--color-muted-bg);
  color: var(--color-card-contrast);
}

.columns-accent {
  --color-bg: var(--color-accent-bg);
  --color-contrast: var(--color-accent-contrast);
  --color-muted-contrast: var(--color-accent-contrast);
  --link: var(--color-primary-base);
  background-color: var(--color-accent-bg);
  color: var(--color-accent-contrast);
}

.columns-small {
  gap: 1.75rem; /* 28px */
}

.columns-small:not(.columns-transparent) {
  --column-padding: 1.75rem; /* 28px */
}

.columns-medium {
  gap: 3.5rem; /* 56px */
}

.columns-medium:not(.columns-transparent) {
  --column-padding: 3.5rem; /* 56px */
}

.columns-start {
  justify-content: flex-start;
}

.columns-middle {
  justify-content: center;
}

.columns-block {
  justify-content: space-between;
}

.columns-end {
  justify-content: flex-end;
}

.columns-wrap {
  flex-wrap: wrap;
}

@media (max-width: 767px) {
  .columns {
    flex-direction: column;
    gap: 1.75rem; /* 28px */
  }

  .columns-stack-reverse {
    flex-direction: column-reverse;
  }
}

.theme-shadow {
  box-shadow: var(--theme-shadow);
}
.section {
  max-width: 90rem; /* 1440px */
  align-self: center;
}
</style>
