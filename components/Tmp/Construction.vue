<template>
  <div class="construction">
    <div class="content flex mt-4">
      <div class="warning" v-if="warning"></div>
      <div>
        <div class="flex mb-2">
          <Logo logoSize="sm" />
          <strong class="ml-2 font-mona text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">{{ extension }}</strong>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// css-background see https://www.svgbackgrounds.com/how-to-add-svgs-with-css-background-image/
// image taken from https://publicdomainvectors.org/en/free-clipart/Brick-wall-picture/71978.html

const props = defineProps({
  extension: { type: String, default: 'Beta-Phase' },
  warning: { type: Boolean, default: false }
})
</script>

<style scoped>
.warning {
  margin-right: 1.5em;
  height: 6em;
  width: 5em;
  min-width: 5em;
  background-image: url( '/global/warning.svg' );
  background-size: 5em;
}

.construction {
  min-height: 8em;
  min-width: 20em;
  background-image: url( '/global/brick.jpg' );
  background-size: 14em;
  background-repeat: repeat;
  padding: 2em;
}
.content {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1em;
}
</style>