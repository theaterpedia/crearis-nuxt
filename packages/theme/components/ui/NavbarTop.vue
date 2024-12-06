<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core'
import { useDark, useToggle } from '@vueuse/core'
import { Container } from '@crearis/ui'
import { ref } from 'vue'

const props = defineProps<{
  filled?: boolean
  extended?: boolean
  hideLogo?: boolean
  hideSearch?: boolean
  hideLinksOnMobile?: boolean
}>()

const navigation = [{ title: 'home', _path: '/' }]

const isDark = useDark()
const toggleDark = useToggle(isDark)

const NuxtLink = resolveComponent('NuxtLink')

const scrollBreak = 80
const y = ref(useWindowScroll().y)

// const topbar = ref(!props.extended && y.value > 80)
// console.log('topbar', topbar)
</script>

<template>
  <Container
    is="header"
    class="jfustify-between fixed inset-x-0 top-0 z-50 flex h-14 items-center md:pt-2.5 lg:justify-start"
    :class="[
      {
        'max-w-screen-3xl mx-auto md:-top-12 md:mt-6 md:h-28 lg:mt-10 dark:bg-black':
          y <= scrollBreak && props.extended,
      },
      { 'md:-top-4 md:h-20': y > scrollBreak || !props.extended },
      { 'bg-muted text-white': filled && (y > scrollBreak || !props.extended) },
      { 'bg-white text-primary': !filled || (y <= scrollBreak && props.extended) },
    ]"
  >
    <div
      class="ph:px-0 ph:-ml-2 sticky top-0 mx-auto flex w-full items-center justify-between gap-[clamp(1rem,3vw,3rem)] px-3 py-6 md:h-[60px] md:justify-normal md:px-5"
    >
      <NuxtLink to="/" class="flex-grow">
        <Logo
          :extended="y <= scrollBreak && props.extended"
          :filled="filled"
          :hideLogo="hideLogo"
          :hideSearch="hideSearch"
          logoSize="sm"
        />
      </NuxtLink>
      <!-- Links Section -->
      <nav
        aria-label="SF Navigation"
        class="flex-nowrap items-center justify-end gap-x-4 md:ml-10 lg:flex"
        :class="[
          { 'text-white': filled && !(y <= scrollBreak && props.extended) },
          { 'text-primary': !filled || (y <= scrollBreak && props.extended) },
          { hidden: hideLinksOnMobile },
        ]"
      >
        <NuxtLink
          v-for="link of navigation"
          v-show="link.title !== 'home' && link.title !== 'Dev'"
          :key="link._path"
          :to="link._path"
        >
          {{ link.title }}
        </NuxtLink>
        <slot />
        <NuxtLink @click="toggleDark()">
          <!-- SfIconCircle class="text-muted"/ -->
        </NuxtLink>
      </nav>
    </div>
  </Container>
</template>
