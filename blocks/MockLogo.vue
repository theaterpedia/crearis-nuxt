<script lang="ts" setup>
const props = defineProps({
  extended: { type: Boolean, default: false },
  logoSize: { type: String, default: 'default' }, // sm, lg
})

import { defineBlock } from '#pruvious'

defineBlock({
  icon: 'Pencil',
  label: 'Logo',
})

// const colorMode = useColorMode()
// const logoClass = computed(() => colorMode.preference === 'theaterpedia-light' ? 'text-content' : 'text-content')
const logoClass = 'text-content'
</script>

<template>
  <div class="pl-2 font-semibold md:pl-4 lg:pl-6 xl:pl-8" :class="logoClass">
    <h1
      :class="
        props.logoSize === 'default'
          ? 'font-mona text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl'
          : props.logoSize === 'sm'
            ? 'font-mona text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'
            : 'font-mona text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl'
      "
    >
      Theater
      <span class="text-primary">pedia</span>
    </h1>
    <h2
      v-show="extended"
      :class="
        props.logoSize === 'default'
          ? 'xl:pl-none invisible text-sm tracking-tight sm:visible lg:pl-1 lg:text-lg xl:text-2xl xl:tracking-tighter 2xl:pl-3 2xl:text-2xl 2xl:tracking-wide'
          : props.logoSize === 'sm'
            ? 'invisible text-sm lg:visible lg:tracking-tight xl:pl-1.5 xl:text-lg'
            : 'text-xs tracking-wider sm:text-base lg:text-2xl 2xl:text-4xl 2xl:tracking-tight'
      "
    >
      <span class="text-primary">Theaterpädagogik</span>
      digital vernetzen
    </h2>
  </div>
</template>
