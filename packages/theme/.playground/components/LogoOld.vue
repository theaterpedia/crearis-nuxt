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
const textShadow = 'text-shadow: 0.2rem 0.2rem 0.3rem hsla(110, 10%, 0%, 0.8);'
</script>

<template>
  <div
    :class="props.padding ? '' : 'pl-2 md:pl-4 lg:pl-6 xl:pl-8 ' + 'logoClass font-semibold dark:bg-black'"
    :style="textShadow"
  >
    <h1
      :class="
        props.logoSize === 'default'
          ? 'font-mono text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl'
          : props.logoSize === 'sm'
            ? 'text-md font-mono sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'
            : 'font-@crearis-mono text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl'
      "
    >
      <span :class="props.filled === true && props.extended === false ? 'text-primary-400' : 'text-primary-400'">
        Theater
      </span>
      <span :class="filled && !extended ? 'text-secondary-400' : 'text-secondary-400'" style="margin-left: -0.6em">
        pedia
      </span>
    </h1>
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
        <span :class="props.filled ? 'text-foreground' : 'text-foreground'">Theaterpädagogik</span>
        <span :class="props.filled ? '' : 'text-primary-base'">suchen und finden</span>
      </slot>
    </h2>
  </div>
</template>
