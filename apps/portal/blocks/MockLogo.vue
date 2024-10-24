<script setup lang="ts">
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
  <div :class="logoClass" class="pl-2 md:pl-4 lg:pl-6 xl:pl-8 font-semibold">
    <h1 :class="props.logoSize === 'default' ? 'font-mona text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl' : props.logoSize === 'sm' ? 'font-mona text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl' : 'font-mona text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl'">
      Theater<span class="text-primary">pedia</span>
    </h1>
    <h2 v-show="extended" :class="props.logoSize === 'default' ? 'invisible sm:visible text-sm tracking-tight lg:pl-1 lg:text-lg xl:pl-none xl:tracking-tighter xl:text-2xl 2xl:pl-3 2xl:tracking-wide 2xl:text-2xl' : props.logoSize === 'sm' ? 'invisible lg:visible text-sm lg:tracking-tight xl:text-lg xl:pl-1.5' : 'tracking-wider text-xs sm:text-base lg:text-2xl 2xl:text-4xl 2xl:tracking-tight'">
      <span class="text-primary">Theaterpädagogik</span> digital vernetzen
    </h2>
  </div>
</template>
