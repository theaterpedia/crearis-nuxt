<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core'
import { useDark, useToggle } from '@vueuse/core'
import * as SfIcons from '@crearis/vue'
import ButtonTmp from '../../components/ButtonTmp.vue'

const props = defineProps<{
  filled?: boolean
  extended?: boolean
}>()

const navigation = [
  { title: 'home', _path: '/' },
  { title: 'Workshops', _path: '/category/13' },
  { title: 'Projekte', _path: '/projekte/p-1' },
  { title: 'Supervision', _path: '/kurse/k-1' },
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
    data-testid="navbar-top"
    class="z-50 flex h-14 md:sticky md:pt-2.5"
    :class="[
      {
        'max-w-screen-3xl mx-auto md:-top-12 md:mt-6 md:h-28 md:px-6 lg:mt-10 lg:px-10 dark:bg-black':
          y <= scrollBreak && props.extended,
      },
      { 'md:-top-4 md:h-20 md:shadow-md': y > scrollBreak || !props.extended },
      { 'bg-primary-700 text-white': filled && (y > scrollBreak || !props.extended) },
      { 'border-b border-neutral-200 bg-white text-[#02C652]': !filled || (y <= scrollBreak && props.extended) },
    ]"
  >
    <div
      class="max-w-screen-3xl sticky top-0 mx-auto flex w-full items-center justify-between gap-[clamp(1rem,3vw,3rem)] px-4 py-6 md:h-[60px] md:justify-normal md:px-6 lg:px-10"
    >
      <NuxtLink :to="paths.home" aria-label="Sf Homepage" class="-mt-1.5 h-6 md:h-7 md:basis-2/4">
        <UiLogo
          :extended="y <= scrollBreak && props.extended"
          :filled="props.filled"
          :logoSize="y <= scrollBreak && props.extended ? 'lg' : 'default'"
        />
      </NuxtLink>
      <!-- Links Section -->
      <div
        class="left-0 top-16 items-center justify-between justify-items-start border-t px-5 py-3 text-lg md:flex md:basis-2/4 md:justify-items-center md:border-t-0 md:px-10 md:py-0 md:pt-2"
        :class="[
          { 'text-white': filled && !(y <= scrollBreak && props.extended) },
          { 'text-primary-700 dark:text-primary-200': !filled || (y <= scrollBreak && props.extended) },
        ]"
      >
        <NuxtLink
          v-for="link of navigation"
          v-show="link.title !== 'home' && link.title !== 'Dev'"
          :key="link._path"
          :to="link._path"
          class="active:text-secondary-700 hover:text-secondary-700 flex cursor-pointer font-semibold transition-colors duration-300 lg:text-2xl"
        >
          {{ link.title }}
        </NuxtLink>
        <slot />
        <ButtonTmp
          @click="toggleDark()"
          class="text-primary-700 bg-primary-200 dark:text-primary-200 dark:bg-primary-700"
        >
          <component :is="SfIcons['SfIconCircle']" />
        </ButtonTmp>
      </div>
    </div>
  </header>
</template>
