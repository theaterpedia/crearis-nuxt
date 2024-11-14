<template>
  <div class="construction">
    <div v-if="warning" class="warning drop-shadow-md"></div>
    <SectionContainer v-if="pageBlock" class="content mt-4 shadow">
      <div class="mb-2 flex min-w-80 justify-start">
        <Logo hideSearch logoSize="sm" />
        <strong class="text-md -ml-14 mt-[12px] font-mono sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
          {{ extension }}
        </strong>
      </div>
      <p v-if="text">
        {{ text }}
      </p>
    </SectionContainer>
    <div v-else class="content mt-4 shadow">
      <div class="mb-2 flex min-w-80 justify-start">
        <Logo hideSearch logoSize="sm" />
        <strong class="text-md -ml-14 mt-[12px] font-mono sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
          {{ extension }}
        </strong>
      </div>
      <p v-if="text">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineBlock, textField, checkboxField, textAreaField } from '#pruvious'

defineBlock({
  icon: 'H3',
  label: 'B/C: Construction',
})

defineProps({
  warning: checkboxField({
    label: 'Baustelle-Icon',
    default: true,
  }),
  pageBlock: checkboxField({
    label: 'als Page-Block anzeigen',
    default: true,
  }),
  text: textAreaField({
    placeholder: 'Beschreibungstext eingeben',
    required: false,
  }),
  extension: textField({
    placeholder: 'Beta-Phase',
    required: true,
  }),
})
// css-background see https://www.svgbackgrounds.com/how-to-add-svgs-with-css-background-image/
// image taken from https://publicdomainvectors.org/en/free-clipart/Brick-wall-picture/71978.html
</script>

<style scoped>
.warning {
  margin-left: 14em;
  height: 7.2em;
  width: 6em;
  min-width: 6em;
  background-image: url('/global/warning.svg');
  background-size: 6em;
  rotate: 2deg;
}

.construction {
  min-height: 8em;
  min-width: 20em;
  background-image: url('/global/brick.jpg');
  background-size: 14em;
  background-repeat: repeat;
  padding: 2em;
}
.content {
  background-color: rgba(255, 255, 255, 1);
  rotate: 2deg;
  max-width: 35rem;
  padding: 1em;
}
</style>
