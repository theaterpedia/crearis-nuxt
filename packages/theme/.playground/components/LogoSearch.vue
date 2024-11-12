<script lang="ts" setup>
import {DesktopSearch} from '#components'

const props = defineProps<{
  filled?: boolean
  extended?: boolean
  hideLogo?: boolean
  hideSearch?: boolean
}>()


</script>

<template>
  <div class="flex">
    <NuxtLink v-show="!hideLogo" :to="paths.home" aria-label="Sf Homepage" class="flex-auto -mt-1.5 h-6 md:h-7 md:basis-2/4">
        <Logo
          :extended="extended"
          :filled="props.filled"
          :logoSize="extended ? 'lg' : 'default'"
        />
      </NuxtLink>
      <Component v-show="!hideSearch" :is="DesktopSearch" style="box-shadow: var(--theme-shadow);" class="flex-grow max-w-lg"/>
  </div>
</template>