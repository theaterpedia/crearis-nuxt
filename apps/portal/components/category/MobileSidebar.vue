<script lang="ts" setup>
import { SfDrawer, SfIconClose } from '@crearis/vue'
import ButtonTmp from '../../components/ButtonTmp.vue'

export type CategorySidebarProps = {
  isOpen: boolean
}
export type CategorySidebarEmits = (event: 'close') => void

defineProps<CategorySidebarProps>()
defineEmits<CategorySidebarEmits>()
</script>

<template>
  <transition
    enter-active-class="transition duration-500 ease-in-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition duration-500 ease-in-out"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <SfDrawer
      v-show="isOpen"
      :disable-click-away="true"
      :disable-esc="true"
      :model-value="true"
      data-testid="category-sidebar"
      class="z-[100] w-full shrink-0 -translate-x-full bg-white shadow-none lg:static lg:z-0 lg:!block lg:w-[303px] lg:translate-x-0"
    >
      <div class="grid-rows-category-sidebar grid h-full lg:block">
        <div class="flex items-center justify-between p-4 lg:hidden">
          <span class="text-lg font-bold">Filter</span>
          <ButtonTmp :aria-label="$t('closeListSettings')" @click="$emit('close')" variant="tertiary">
            <template #prefix>
              <SfIconClose class="text-neutral-500" />
            </template>
          </ButtonTmp>
        </div>
        <div class="overflow-y-auto py-4 lg:overflow-y-visible lg:p-0">
          <slot />
        </div>
      </div>
    </SfDrawer>
  </transition>
</template>
