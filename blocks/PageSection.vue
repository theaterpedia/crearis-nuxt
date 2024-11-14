<template>
  <Section overlap class="section" :background="background"
    :class="[
        `columns-${colGapSmall ? 'small' : 'medium'}`,
        `columns-${columns}`,
        `columns-${colbackground ?? 'transparent'}`,
        columns!=='none' ? 'columns' : null,
        colWrap ? 'columns-wrap' : null,
        colStackReverse ? 'columns-stack-reverse' : null,
    ]"
  >
    <div class="hero-cover" v-if="imgTmp">
      <div
        class="static-cover-image"
        :style="{
          backgroundImage: `url(${imgTmp})`,
          backgroundPositionX: 'center',
          backgroundPositionY:
            imgTmpAlignY === 'stretch'
            ? 'top'
            : imgTmpAlignY === 'cover'
              ? 'center'
              : imgTmpAlignY,
          backgroundSize:
            imgTmpAlignX === 'cover' || imgTmpAlignY === 'cover'
              ? 'cover'
              : `${imgTmpAlignX === 'stretch' ? '100%' : 'auto'} ${imgTmpAlignY === 'stretch' ? '100%' : 'auto'}`,
        }"
      >
        <div v-if="overlay" class="hero-cover-overlay" :style="{ background: overlay }"></div>
      </div>
    </div>    
    <Container v-if="title" class="mt-[-3.25rem]">
      <Heading
        :content="title"
        :is="`h${level ? level : 2}`"
        class="bg-primary-base theme-shadow ml-[-2.75rem] max-w-[44rem] py-2 pl-11"
      />
    </Container>
    <Container class="mt-4">
      <slot />
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
      allowedChildBlocks: ['SubColumns', 'VarProse', 'VarVideo', 'VarImage'],
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
    choices: { none: 'nein', start: 'links', block: 'geblockt',middle: 'zentriert', rechts: 'end' },
    default: 'none',
    label: 'Spalten',
  }), 
  colbackground: selectField({
    choices: { default: 'default', muted: 'muted', accent: 'accent' },
    default: 'default',
    label: 'Spalten: Hintergrund',
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
  background: selectField({
    choices: { default: 'default', muted: 'muted', accent: 'accent' },
    default: 'default',
    label: 'Hintergrund-Typ',
  }),  
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
    min: 0,
    max: 1,
    label: 'Abdecken: Intensität (0-1)',
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
})

const overlay = getoverlay(props.gradient_type, props.gradientDepth)

</script>

<style scoped>
.hero-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;
  transform: translate3d(0, 0, 0);
}

.static-cover-image {
  top: 0;
  width: 100%;
  max-width: 500px;
  height: 50%;
  background-repeat: no-repeat;
}

.hero-cover-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}



.columns {
  --column-padding: 0;
  display: flex;
}

.columns-default {
  --background: var(--card-base);
  --foreground: var(--card-foreground);
  background-color: hsl(var(--card-base));
  color: hsl(var(--card-foreground));
}

.columns-muted {
  --background: var(--muted-base);
  --foreground: var(--card-foreground);
  background-color: hsl(var(--muted-base));
  color: hsl(var(--card-foreground));
}

.columns-accent {
  --background: var(--accent-base);
  --foreground: var(--accent-foreground);
  --muted-foreground: var(--accent-foreground);
  --link: var(--primary-base);
  background-color: hsl(var(--accent-base));
  color: hsl(var(--accent-foreground));
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
