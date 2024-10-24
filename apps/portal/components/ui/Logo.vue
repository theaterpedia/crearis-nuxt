<script lang="ts" setup>
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
  <div class="pl-2 font-semibold md:pl-4 lg:pl-6 xl:pl-8 dark:bg-black" :class="logoClass">
    <h2
      v-show="extended"
      :class="
        props.logoSize === 'default'
          ? 'font-mona invisible text-sm tracking-tight sm:visible lg:text-lg xl:text-2xl xl:tracking-tighter 2xl:text-2xl 2xl:tracking-wide'
          : props.logoSize === 'sm'
            ? 'invisible text-sm lg:visible lg:tracking-tight xl:text-lg'
            : 'text-xs tracking-wider sm:text-base lg:text-2xl 2xl:text-4xl 2xl:tracking-tight'
      "
    >
      <span :class="filled && !extended ? 'text-primary-400' : 'text-primary-700'">Lehrstücke</span>
      <span :class="filled && !extended ? '' : 'text-primary-700'">für die Schule</span>
    </h2>
    <h1
      :class="
        props.logoSize === 'default'
          ? 'font-mona text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl'
          : props.logoSize === 'sm'
            ? 'font-mona text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'
            : 'font-mona text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl'
      "
    >
      <span
        :class="props.filled === true && props.extended === false ? 'text-white dark:text-black' : 'text-primary-700'"
      >
        Lehrer
      </span>
      <span :class="filled && !extended ? 'text-secondary-400' : 'text-secondary-700'">Lämpel</span>
    </h1>
  </div>
</template>
