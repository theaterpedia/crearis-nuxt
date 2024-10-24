<script lang="ts" setup>
import { SfButton, SfDropdown, SfIconMoreHoriz, SfLink } from '@crearis/vue'
import { defineBlock, repeaterField, textSubfield } from '#pruvious'

defineBlock({
  icon: 'Pencil',
  label: 'Breadcrumbs',
})

// eslint-disable-next-line vue/define-macros-order
defineProps({
  breadcrumbs: repeaterField({
    subfields: {
      name: textSubfield(),
      link: textSubfield({ placeholder: 'Enter url' }),
    },
    addLabel: 'Add breadcrumb',
  }),
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
  <NarrowContainer>
    <nav data-testid="breadcrumbs" class="font-body inline-flex items-center text-sm font-normal">
      <ol class="group flex w-auto leading-none md:flex-wrap">
        <li class="z-10 flex items-center text-neutral-500 sm:hidden">
          <NuxtLazyHydrate :on-interaction="['click', 'touchstart']">
            <SfDropdown
              v-model="dropdownOpened"
              @update:model-value="close"
              placement="bottom-start"
              strategy="absolute"
            >
              <template #trigger>
                <SfButton
                  :aria-label="$t('breadcrumbsDropdownText')"
                  @click="toggle"
                  data-testid="breadcrumbs-dropdown-button"
                  square
                  variant="tertiary"
                  class="outline-secondary-600 relative h-5 w-5 rounded-sm !p-0 hover:bg-transparent active:bg-transparent"
                >
                  <template #prefix>
                    <SfIconMoreHoriz
                      size="sm"
                      class="hover:text-primary-700 active:text-primary-800 text-neutral-500 active:bg-transparent"
                    />
                  </template>
                </SfButton>
              </template>
              <ol data-testid="breadcrumbs-dropdown" class="rounded-md border-neutral-100 bg-white px-4 py-2 shadow-md">
                <li v-for="item in breadcrumbs" :key="item.name" class="py-2 last-of-type:hidden">
                  <SfLink
                    :tag="NuxtLink"
                    :to="item.link"
                    variant="secondary"
                    class="outline-secondary-600 whitespace-nowrap leading-5 text-inherit no-underline hover:underline active:underline"
                  >
                    {{ item.name }}
                  </SfLink>
                </li>
              </ol>
            </SfDropdown>
          </NuxtLazyHydrate>
        </li>
        <li
          v-for="(item, index) in breadcrumbs"
          :key="item.name"
          class="peer hidden items-center text-neutral-500 last-of-type:flex last-of-type:font-medium last-of-type:text-neutral-900 last-of-type:before:font-normal last-of-type:before:text-neutral-500 peer-[:nth-of-type(even)]:before:px-2 peer-[:nth-of-type(even)]:before:leading-5 peer-[:nth-of-type(even)]:before:content-['/'] sm:flex"
        >
          <SfLink
            v-if="index < breadcrumbs.length - 1"
            :tag="NuxtLink"
            :to="item.link"
            variant="secondary"
            class="outline-secondary-600 whitespace-nowrap leading-5 text-inherit no-underline hover:underline active:underline"
          >
            {{ item.name }}
          </SfLink>
          <span v-else>
            {{ item.name }}
          </span>
        </li>
      </ol>
    </nav>
  </NarrowContainer>
</template>
