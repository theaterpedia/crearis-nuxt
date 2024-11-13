<template>
  <div class="construction">
    <SectionContainer v-if="pageBlock">
      <div v-if="warning" class="warning"></div>
      <div>
        <div class="mb-2 flex">
          <Logo hideSearch logoSize="sm" />
          <strong class="text-md ml-2 font-mono sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">{{ extension }}</strong>
        </div>
        <p v-if="text">
          {{ text }}
        </p>
      </div>
    </SectionContainer>
    <div v-else class="content mt-4 flex">
      <div v-if="warning" class="warning"></div>
      <div>
        <div class="mb-2 flex">
          <Logo hideSearch logoSize="sm" />
          <strong class="text-md ml-2 font-mono sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">{{ extension }}</strong>
        </div>
        <p v-if="text">
          {{ text }}
        </p>
      </div>
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
  margin-right: 1em;
  height: 6em;
  width: 5em;
  min-width: 5em;
  background-image: url('/global/warning.svg');
  background-size: 5em;
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
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1em;
}
</style>
