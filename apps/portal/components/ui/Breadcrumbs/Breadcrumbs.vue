<script setup>
// THIS IS FROM ODOOGAP

import { SfDropdown, SfIconMoreHoriz } from '@crearis/vue'
import ButtonTmp from '../../components/ButtonTmp.vue'

defineProps({
  breadcrumbs: Array,
})

const dropdownOpened = ref(false)
function close() {
  dropdownOpened.value = false
}
function toggle() {
  dropdownOpened.value = !dropdownOpened.value
}

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <nav data-testid="breadcrumbs" class="font-body inline-flex items-center text-sm font-normal">
    <ol class="group flex w-auto pl-0 leading-none md:flex-wrap">
      <li class="z-1 flex items-center text-neutral-500 sm:hidden">
        <SfDropdown v-model="dropdownOpened" @update:model-value="close" placement="bottom-start" strategy="absolute">
          <template #trigger>
            <ButtonTmp
              @click="toggle"
              aria-label="Show more breadcrumbs"
              data-testid="breadcrumbs-dropdown-button"
              type="button"
              variant="tertiary"
              class="outline-secondary-600 relative h-5 w-5 rounded-sm !p-0 hover:bg-transparent active:bg-transparent"
            >
              <template #prefix>
                <SfIconMoreHoriz
                  size="sm"
                  class="hover:text-primary-700 active:text-primary-800 text-neutral-500 active:bg-transparent"
                />
              </template>
            </ButtonTmp>
          </template>
          <ol data-testid="breadcrumbs-dropdown" class="rounded-md border-neutral-100 px-4 py-2 shadow-md">
            <li v-for="item in breadcrumbs" :key="item.name" class="py-2 last-of-type:hidden">
              <ButtonTmp
                :is="NuxtLink"
                :to="item.link"
                variant="link"
                class="outline-secondary-600 whitespace-nowrap leading-5 text-inherit no-underline hover:underline active:underline"
              >
                {{ item.name }}
              </ButtonTmp>
            </li>
          </ol>
        </SfDropdown>
      </li>
      <li
        v-for="(item, index) in breadcrumbs"
        :key="item.name"
        class="peer hidden items-center text-neutral-500 last-of-type:flex last-of-type:font-medium last-of-type:text-neutral-900 last-of-type:before:font-normal last-of-type:before:text-neutral-500 peer-[:nth-of-type(even)]:before:px-2 peer-[:nth-of-type(even)]:before:leading-5 peer-[:nth-of-type(even)]:before:content-['/'] sm:flex"
      >
        <ButtonTmp
          v-if="index < breadcrumbs.length - 1"
          :is="item.link ? NuxtLink : 'div'"
          :to="item.link"
          variant="secondary"
          class="outline-secondary-600 whitespace-nowrap leading-5 text-inherit no-underline hover:underline active:underline"
        >
          {{ item.name }}
        </ButtonTmp>
        <span v-else>
          {{ item.name }}
        </span>
      </li>
    </ol>
  </nav>
</template>
