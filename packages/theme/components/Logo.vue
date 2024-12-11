<script lang="ts" setup>
import { Prose } from '@crearis/ui'
import { DesktopSearch } from '#components'
const props = defineProps({
  filled: { type: Boolean, default: false },
  padding: { type: Boolean, default: false },
  extended: { type: Boolean, default: false },
  logoSize: { type: String, default: 'lg' }, // sm, lg
  hideSearch: { type: Boolean, default: false, required: false },
  hideLogo: { type: Boolean, default: false, required: false },
})

// const colorMode = useColorMode()
// const logoClass = computed(() => colorMode.preference === 'theaterpedia-light' ? 'text-content' : 'text-content')
const textShadow = 'text-shadow: 0.2rem 0.2rem 0.3rem hsla(110, 10%, 0%, 0.8);'
</script>

<template>
  <div
    class="flex justify-between gap-2 xl:pr-20"
    :class="logoSize === 'sm' ? 'flex-row' : 'ml-1 flex-col sm:ml-4 md:ml-0 md:flex-row'"
  >
    <div
      v-show="!hideLogo"
      :class="(props.padding ? 'pl-1 sm:pl-2 md:pl-4 lg:pl-6 xl:pl-8 ' : '') + 'font-semibold'"
      :style="textShadow"
    >
      <Prose>
        <h1
          :class="
            logoSize === 'lg'
              ? 'text-sm sm:text-base md:text-xl lg:text-2xl 2xl:text-3xl'
              : 'text-[0.5em] md:pt-2 lg:text-[0.75em]'
          "
          style="line-height: 0.25"
        >
          <strong>
            <span class="text-accent-contrast">Theater</span>
            <span class="text-primary">pedia</span>
          </strong>
          <span
            v-show="extended"
            class="text-primary line-solid subline"
            style="margin-left: 0.4em; margin-top: -0.5em"
          >
            Theaterpädagogik
          </span>
          <span v-show="extended" class="line-dashed subline text-accent-contrast">suchen und finden</span>
        </h1>
      </Prose>
    </div>
    <Component
      v-show="!hideSearch"
      :is="DesktopSearch"
      class="max-w-sm flex-grow"
      :class="logoSize === 'lg' ? 'lg: max-w-md lg:max-w-lg' : 'text-[0.7em] xl:max-w-md'"
      style="box-shadow: var(--theme-shadow)"
    />
  </div>
</template>

<style scoped>
/* extend the Logo-Underline */

.subline {
  letter-spacing: 0.075em;
}
.line-solid {
  text-decoration: overline 2px var(--color-primary-base);
}

.line-dashed {
  text-decoration: overline dashed 2px var(--color-primary-base);
}

@media (min-width: 900px) {
  .line-dashed::after {
    content: '......';
    min-width: 10px;
    overflow-y: none;
    color: rgba(0, 0, 0, 0);
    text-shadow: none;
    text-decoration: overline dashed 2px var(--color-primary-base);
  }
}
</style>
