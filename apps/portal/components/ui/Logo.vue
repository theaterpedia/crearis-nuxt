<script setup lang="ts">
const props = defineProps({
  filled: { type: Boolean, default: false },
  extended: { type: Boolean, default: false },
  logoSize: { type: String, default: 'default' }, // sm, lg
})


// const colorMode = useColorMode()
// const logoClass = computed(() => colorMode.preference === 'theaterpedia-light' ? 'text-content' : 'text-content')
const logoClass = 'text-content'
</script>

<template>
  <div :class="logoClass" class="pl-2 md:pl-4 lg:pl-6 xl:pl-8 font-semibold dark:bg-black">
    <h2 v-show="extended" :class="props.logoSize === 'default' ? 'font-mona invisible sm:visible text-sm tracking-tight lg:text-lg xl:tracking-tighter xl:text-2xl 2xl:tracking-wide 2xl:text-2xl' : props.logoSize === 'sm' ? 'invisible lg:visible text-sm lg:tracking-tight xl:text-lg' : 'tracking-wider text-xs sm:text-base lg:text-2xl 2xl:text-4xl 2xl:tracking-tight'">
      <span :class="filled && !extended ? 'text-primary-400': 'text-primary-700'">Lehrstücke</span><span :class="filled && !extended ? '': 'text-primary-700'"> für die Schule</span>
    </h2>
    <h1 :class="props.logoSize === 'default' ? 'font-mona text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl' : props.logoSize === 'sm' ? 'font-mona text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl' : 'font-mona text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl'">
      <span :class="props.filled === true && props.extended === false ? 'text-white dark:text-black': 'text-primary-700'">Lehrer </span><span :class="filled && !extended ? 'text-secondary-400': 'text-secondary-700'">Lämpel</span>
    </h1>
  </div>
</template>
