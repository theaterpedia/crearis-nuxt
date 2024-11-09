<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import type { Category } from '~/graphql'
import { NuxtLink } from '#components'

const { isOpen, toggle, close } = useDisclosure()

const menuRef = ref()
const drawerRef = ref()
const formSearchTemplateRef = ref(null)

const {
  searchInputValue,
  highlightedIndex,
  search,
  searchHits,
  selectHit,
  enterPress,
  showResultSearch,
  isSearchModalOpen,
} = useSearch(formSearchTemplateRef)

const router = useRouter()
const filteredCategories = inject<Category[]>('filteredTopCategories')

const goTo = (slug: string) => {
  close()
  router.push(slug)
}

useTrapFocus(drawerRef, {
  activeState: isOpen,
  arrowKeysUpDown: true,
  initialFocus: 'container',
})

onClickOutside(menuRef, () => {
  close()
})
</script>

<template>
  <div>
    <div
      v-if="isOpen || isSearchModalOpen"
      class="top-index fixed inset-0 !h-screen !w-screen bg-neutral-500 bg-opacity-50 transition-opacity duration-1000"
    />
    <header
      ref="menuRef"
      class="z-50 flex h-14 w-full flex-wrap border-0 border-neutral-200 bg-primary-700 py-2 text-white md:sticky md:top-0 md:z-10 md:h-20 md:flex-nowrap md:py-5 md:shadow-md"
    >
      <div class="jfustify-between narrow-container flex h-full w-full items-center lg:justify-start">
        <NuxtLink aria-label="Sf Homepage" to="/" class="-mt-1.5 h-6 md:h-7">
          <UiLogo />
        </NuxtLink>
        <SfButton
          :aria-expanded="isOpen"
          :aria-haspopup="true"
          @click="toggle()"
          square
          type="button"
          variant="tertiary"
          class="ml-6 hidden bg-transparent font-body text-white hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white lg:flex"
        >
          <template #suffix>
            <SfIconShoppingCart />
          </template>
          <span class="hidden whitespace-nowrap px-2 md:inline-flex">Browse products</span>
        </SfButton>
        <nav>
          <ul>
            <li role="none">
              <transition
                enter-active-class="transform transition duration-300 ease-in-out"
                enter-from-class="-translate-x-full md:translate-x-0 md:opacity-0"
                enter-to-class="translate-x-0 md:translate-x-0 md:opacity-100"
                leave-active-class="transform transition duration-100 ease-in-out"
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
                    <div
                      v-for="{ name, childs, id } in filteredCategories"
                      :key="id"
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
                        <li v-for="child in childs" :key="child.id">
                          <SfListItem
                            v-if="child.childs !== null"
                            :to="child.slug"
                            @click="goTo(child.slug)"
                            role="none"
                            size="sm"
                            tag="span"
                            class="typography-text-base lg:typography-text-sm py-4 lg:py-1.5"
                          >
                            {{ child.name }}
                          </SfListItem>
                        </li>
                      </ul>
                    </div>
                    <div
                      class="flex grow flex-col items-center justify-center overflow-hidden border-neutral-300 bg-neutral-100 lg:rounded-md"
                    >
                      <NuxtImg alt="New in designer watches" src="/images/watch.png" class="object-contain" />
                      <p class="typography-text-base mb-4 mt-4 px-4 text-center font-medium text-black">
                        New in designer watches
                      </p>
                    </div>
                    <SfButton
                      @click="close()"
                      aria-label="Close navigation menu"
                      size="sm"
                      square
                      variant="tertiary"
                      class="hover:bg-white active:bg-white lg:absolute lg:right-0 lg:top-0"
                    >
                      <SfIconSearch />
                    </SfButton>
                  </div>
                </SfDrawer>
              </transition>
            </li>
          </ul>
        </nav>
        <form
          @submit.prevent
          ref="formSearchTemplateRef"
          role="search"
          class="relative mt-2 hidden w-full flex-[100%] pb-2 md:ml-10 md:mt-0 md:pb-0 lg:flex"
        >
          <SfInput
            v-model="searchInputValue"
            @input="search()"
            @keydown.enter.prevent="enterPress(searchHits[highlightedIndex])"
            placeholder="Search"
            size="base"
            type="text"
            wrapper-class="flex-1 h-10 pr-0"
            class="[&::-webkit-search-cancel-button]:appearance-none"
          >
            <template #suffix>
              <span class="flex items-center">
                <SfButton
                  aria-label="search"
                  square
                  type="submit"
                  variant="tertiary"
                  class="rounded-l-none hover:bg-transparent active:bg-transparent"
                >
                  <SfIconSearch />
                </SfButton>
              </span>
            </template>
          </SfInput>

          <transition
            enter-active-class="transform transition duration-500 ease-in-out"
            enter-from-class="-translate-x-full md:translate-x-0 md:opacity-0"
            enter-to-class="translate-x-0 md:translate-x-0 md:opacity-100"
            leave-active-class="transform transition duration-500 ease-in-out"
            leave-from-class="translate-x-0 md:opacity-100"
            leave-to-class="-translate-x-full md:translate-x-0 md:opacity-0"
          >
            <DesktopSearchList
              v-if="showResultSearch"
              :hits="searchHits"
              :search-text="searchInputValue"
              @select="selectHit"
            />
          </transition>
        </form>
        <nav aria-label="SF Navigation" class="hidden flex-nowrap items-center justify-end gap-x-1 md:ml-10 lg:flex">
          <HeaderButtonWishlist />
          <HeaderButtonCart />
          <HeaderButtonLogin />
        </nav>
      </div>
    </header>
  </div>
</template>
