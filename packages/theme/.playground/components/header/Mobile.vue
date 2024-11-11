<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import type { Category } from '~/graphql'

const { isOpen, toggle, close } = useDisclosure()
const { searchModalToggle } = useSearch()

const NuxtLink = resolveComponent('NuxtLink')

const menuRef = ref()
const drawerRef = ref()
const searchRef = ref()
const showSearchClerkRef = ref()

useTrapFocus(drawerRef, {
  activeState: isOpen,
  arrowKeysUpDown: true,
  initialFocus: 'container',
})

onClickOutside(menuRef, () => {
  close()
})

onClickOutside(searchRef, () => {
  showSearchClerkRef.value = false
})

const filteredCategories = inject<Category[]>('filteredTopCategories')

const bannerDetails = {
  image: '/images/watch.png',
  title: 'New in designer watches',
}
</script>

<template>
  <header
    ref="menuRef"
    :class="[
      'z-50 flex h-14 w-full flex-wrap border-0 border-neutral-200 bg-primary-700 py-2 text-white md:sticky md:top-0 md:z-10 md:h-20 md:flex-nowrap md:py-5 md:shadow-md',
    ]"
  >
    <div class="narrow-container flex h-full w-full items-center justify-between lg:justify-start">
      <NuxtLink aria-label="Sf Homepage" to="/" class="-mt-1.5 h-6 md:h-7">
        <VsfLogo />
      </NuxtLink>
      <nav>
        <ul>
          <li role="none">
            <transition
              enter-active-class="transform transition duration-500 ease-in-out"
              enter-from-class="-translate-x-full md:translate-x-0 md:opacity-0"
              enter-to-class="translate-x-0 md:translate-x-0 md:opacity-100"
              leave-active-class="transform transition duration-500 ease-in-out"
              leave-from-class="translate-x-0 md:opacity-100"
              leave-to-class="-translate-x-full md:translate-x-0 md:opacity-0"
            >
              <SfDrawer
                v-model="isOpen"
                disable-click-away
                placement="top"
                ref="drawerRef"
                class="top-index max-h-screen max-w-full overflow-y-auto bg-white p-0 lg:!absolute lg:!top-[5rem] lg:p-6"
              >
                <div class="lg:narrow-container grid grid-cols-1 lg:relative lg:grid-cols-3 lg:gap-x-6">
                  <div class="sticky top-0 flex w-full items-center justify-between bg-primary-700 px-4 py-2">
                    <div class="typography-text-lg flex items-center font-medium text-white">Browse products</div>
                    <SfButton
                      @click="close()"
                      @keydown.enter.space="close()"
                      aria-label="Close navigation menu"
                      square
                      variant="tertiary"
                      class="ml-2 text-white"
                    >
                      <SfIconClose />
                    </SfButton>
                  </div>
                  <div
                    v-for="{ name, childs } in filteredCategories"
                    :key="name"
                    class="pt-6 text-black md:pt-0 [&:nth-child(2)]:pt-0"
                  >
                    <h2
                      role="presentation"
                      class="typography-text-base whitespace-nowrap p-4 font-medium text-neutral-900 lg:py-1.5"
                    >
                      {{ name }}
                    </h2>
                    <hr class="mb-3.5" />
                    <ul>
                      <li v-for="{ name, slug, childs: subcategory } in childs" :key="name">
                        <SfListItem
                          v-if="subcategory !== null"
                          :href="slug"
                          role="none"
                          size="sm"
                          tag="a"
                          class="typography-text-base lg:typography-text-sm py-4 lg:py-1.5"
                        >
                          {{ name }}
                        </SfListItem>
                      </li>
                    </ul>
                  </div>
                  <div
                    class="flex grow flex-col items-center justify-center overflow-hidden border-neutral-300 bg-neutral-100 lg:rounded-md"
                  >
                    <NuxtImg :alt="bannerDetails.title" :src="bannerDetails.image" class="object-contain" />
                    <p class="typography-text-base mb-4 mt-4 px-4 text-center font-medium text-black">
                      {{ bannerDetails.title }}
                    </p>
                  </div>
                </div>
              </SfDrawer>
            </transition>
          </li>
        </ul>
      </nav>

      <div class="flex justify-end">
        <SfButton
          @click="searchModalToggle"
          square
          variant="tertiary"
          class="relative rounded-md text-white hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
        >
          <SfIconSearch />
        </SfButton>
        <SfButton
          :aria-expanded="isOpen"
          :aria-haspopup="true"
          @click="toggle()"
          square
          type="button"
          variant="tertiary"
          class="block self-end bg-transparent font-body text-white hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
        >
          <SfIconMenu class="text-white" />
        </SfButton>
      </div>
    </div>
    <MobileSearchList search-text="123" />
  </header>
</template>
