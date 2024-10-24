<script lang="ts" setup>
import { SfScrollable } from '@crearis/vue'
import { ref } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: [],
  },
})

const thumbsRef = ref<HTMLElement>()
const activeIndex = ref(0)
const images = computed<any[]>(() => props.images)
</script>

<template>
  <div class="relative flex aspect-[4/3] max-h-[600px] w-full">
    <SfScrollable
      :active-index="activeIndex"
      buttons-placement="none"
      direction="vertical"
      ref="thumbsRef"
      class="w-full items-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <button
        v-for="({ imageThumbSrc, alt }, index) in images"
        :aria-current="activeIndex === 0"
        :aria-label="alt"
        :key="`${alt}-${index}-thumbnail`"
        type="button"
        class="focus-visible:outline-offset border-primary-700 relative mx-4 shrink-0 flex-grow cursor-pointer snap-start border-b-4 pb-1 transition-colors focus-visible:outline md:h-auto md:w-[78px] md:flex-grow-0"
      >
        <NuxtImg :alt="alt" :src="imageThumbSrc" height="78" provider="odooProvider" width="78" class="object-cover" />
      </button>
    </SfScrollable>
    <SfScrollable
      :active-index="activeIndex"
      :drag="{ containerWidth: true }"
      buttons-placement="none"
      direction="vertical"
      is-active-index-centered
      wrapper-class="h-full m-auto"
      class="h-full w-full snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        v-for="({ imageSrc, alt }, index) in images"
        :key="`${alt}-${index}`"
        class="flex h-full shrink-0 grow basis-full snap-center justify-center"
      >
        <NuxtImg
          :alt="alt"
          :aria-hidden="activeIndex !== index"
          :aria-label="alt"
          :height="505"
          :src="imageSrc"
          :width="380"
          provider="odooProvider"
          class="h-full w-auto object-cover"
        />
      </div>
    </SfScrollable>
  </div>
</template>
