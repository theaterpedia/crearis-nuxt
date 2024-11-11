<script lang="ts" setup>
const props = defineProps({
  filled: { type: Boolean, default: false },
  padding: { type: Boolean, default: true },
  extended: { type: Boolean, default: false },
  logoSize: { type: String, default: 'default' }, // sm, lg
})

// const colorMode = useColorMode()
// const logoClass = computed(() => colorMode.preference === 'theaterpedia-light' ? 'text-content' : 'text-content')
const logoClass = 'text-content'
</script>

<template>
  <div :class="props.padding ? '' : 'pl-2 md:pl-4 lg:pl-6 xl:pl-8 ' + 'logoClass font-semibold dark:bg-black'">
    <h2
      v-show="extended"
      :class="
        props.logoSize === 'default'
          ? 'invisible font-mono text-sm tracking-tight sm:visible lg:text-lg xl:text-2xl xl:tracking-tighter 2xl:text-2xl 2xl:tracking-wide'
          : props.logoSize === 'sm'
            ? 'invisible font-mono text-sm lg:visible lg:tracking-tight xl:text-lg'
            : 'font-mono text-xs tracking-wider sm:text-base lg:text-2xl 2xl:text-4xl 2xl:tracking-tight'
      "
    >
      <slot>
        <span :class="props.filled ? 'text-primary-400' : 'text-primary-700'">Lehrstücke</span>
        <span :class="props.filled ? '' : 'text-primary-700'">für die Schule</span>
      </slot>
    </h2>
    <h1
      :class="
        props.logoSize === 'default'
          ? 'font-mono text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl'
          : props.logoSize === 'sm'
            ? 'text-md font-mono sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'
            : 'font-@crearis-mono text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl'
      "
    >
      <span
        :class="props.filled === true && props.extended === false ? 'text-white dark:text-black' : 'text-primary-700'"
      >
        Theater
      </span>
      <span style="margin-left: -0.6em" :class="filled && !extended ? 'text-secondary-400' : 'text-secondary-700'">pedia</span>
    </h1>
  </div>
</template>
