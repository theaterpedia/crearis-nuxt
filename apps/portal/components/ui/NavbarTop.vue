<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { useDark, useToggle } from '@vueuse/core'
import * as SfIcons from '@crearis/vue';

import {
  SfButton,
  SfIconCircle,
  SfIconExpandMore,
} from '@crearis/vue'

const props = defineProps<{
  filled?: boolean,
  extended?: boolean,
}>()

const navigation = [
  { title: 'home', _path: "/" },
  { title: 'Workshops', _path: "/category/13" },
  { title: 'Projekte', _path: "/projekte/p-1" },
  { title: 'Supervision', _path: "/kurse/k-1" },
]

const isDark = useDark()
const toggleDark = useToggle(isDark)

const NuxtLink = resolveComponent('NuxtLink')

const scrollBreak = 80
const y = useWindowScroll().y

// const topbar = ref(!props.extended && y.value > 80)
// console.log('topbar', topbar)

</script>

<template>
  <header
    class="h-14 flex z-50 md:sticky md:pt-2.5" :class="[
      { 'dark:bg-black md:h-28 md:-top-12 max-w-screen-3xl mx-auto md:px-6 lg:px-10 md:mt-6 lg:mt-10': y <= scrollBreak && props.extended },
      { 'md:h-20 md:-top-4 md:shadow-md': y > scrollBreak || !props.extended },
      { 'bg-primary-700 text-white': filled &&  (y > scrollBreak || !props.extended ) },
      { 'bg-white text-[#02C652] border-b border-neutral-200': (!filled || y <= scrollBreak && props.extended) },
    ]"
    data-testid="navbar-top"
  >
    <div
      class="flex gap-[clamp(1rem,3vw,3rem)] items-center w-full md:h-[60px] max-w-screen-3xl py-6 px-4 md:px-6 lg:px-10 mx-auto sticky top-0 justify-between md:justify-normal"
    >
      <NuxtLink :to="paths.home" aria-label="Sf Homepage" class="h-6 md:h-7 -mt-1.5 md:basis-2/4">
        <UiLogo :filled=props.filled :extended="y <= scrollBreak && props.extended" :logoSize="y <= scrollBreak && props.extended ? 'lg' : 'default'"/>
      </NuxtLink>  
      <!-- Links Section -->
      <div
         class="md:basis-2/4  text-lg items-center justify-between justify-items-start md:justify-items-center md:flex md:pt-2 left-0 top-16 px-5 md:px-10 py-3 md:py-0 border-t md:border-t-0"
         :class="[
          { 'text-white': (filled && !(y <= scrollBreak && props.extended)) },
          { 'text-primary-700 dark:text-primary-200': !filled || y <= scrollBreak && props.extended },
         ]" 
      >
        <NuxtLink
          v-for="link of navigation"
          v-show="link.title !== 'home' && link.title !== 'Dev' "
          :key="link._path"
          :to="link._path"
          class="flex font-semibold lg:text-2xl active:text-secondary-700 hover:text-secondary-700 cursor-pointer transition-colors duration-300"
        >
          {{ link.title }}
        </NuxtLink>
        <slot />
        <SfButton @click="toggleDark()" class="text-primary-700 bg-primary-200 dark:text-primary-200 dark:bg-primary-700">
          <component :is="SfIcons['SfIconCircle']" />
        </SfButton>          
      </div>
    </div>
  </header>
</template>
