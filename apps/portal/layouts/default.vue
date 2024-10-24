<script setup lang="ts">
import {
  SfBadge,
  SfButton,
  SfDropdown,
  SfIconClose,
  SfIconExpandMore,
  SfIconPerson,
  SfIconSearch,
  SfIconShoppingCart,
  SfListItem,
  SfModal,
  useDisclosure,
} from '@crearis/vue'

// this has to stand on top of the file, see: https://pruvious.com/docs/layouts
import type { DefaultLayoutProps } from './types'
import { defineLayout } from '#pruvious'

defineLayout({
  label: 'default',
  // @ts-expect-error #TODO _05 remove once components are created
  allowedBlocks: ['ProductSlider', 'Display', 'MockImageSection', 'MockBreadcrumbs', 'MockLogo', 'Hero', 'Link', 'Container', 'Image', 'Prose', 'Video'],
  // @ts-expect-error #TODO _05 remove once components are created
  allowedRootBlocks: ['ProductSlider', 'Display', 'MockImageSection', 'MockBreadcrumbs', 'MockLogo', 'Hero', 'Container', 'Image', 'Prose', 'Video'],
})

// eslint-disable-next-line vue/define-macros-order
defineProps<DefaultLayoutProps>()

const { isOpen: isAccountDropdownOpen, toggle: accountDropdownToggle } = useDisclosure()
const { isOpen: isSearchModalOpen, open: searchModalOpen, close: searchModalClose } = useDisclosure()
const { loadCart, cartItemCount } = useCart()
const { user, loadUser, logout } = useUser()

const cartLineItemsCount = computed(
  cartItemCount,
)

const logoutAndToggle = async () => {
  await logout()
  accountDropdownToggle()
}

const accountDropdown = [
  {
    label: 'account.heading',
    link: paths.account,
  },
  {
    label: 'account.ordersAndReturns.section.myOrders',
    link: paths.accountMyOrders,
  },
  {
    label: 'account.ordersAndReturns.section.returns',
    link: paths.accountReturns,
  },
  {
    label: 'account.logout',
    link: '/',
  },
]
const NuxtLink = resolveComponent('NuxtLink')

loadUser()
loadCart()
usePageTitle()

</script>

<template>
  <UiNavbarTop filled extended>
     
    <nav class="hidden md:flex md:flex-row md:flex-nowrap">
      <NuxtLazyHydrate when-visible>
        <SfButton
          v-show="cartLineItemsCount > 0" 
          class="group relative text-black dark:text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 mr-1 -ml-0.5 rounded-md"
          :tag="NuxtLink"
          :to="paths.cart"
          :aria-label="$t('numberInCart', cartLineItemsCount)"
          variant="tertiary"
          square
        >
          <template #prefix>
            <SfIconShoppingCart />
            <SfBadge
              :content="cartLineItemsCount"
              class="outline outline-primary-700 bg-white !text-neutral-900 group-hover:outline-primary-800 group-active:outline-primary-900 flex justify-center"
              data-testid="cart-badge"
            />
          </template>
        </SfButton>
      </NuxtLazyHydrate>
      <NuxtLazyHydrate when-visible>
        <SfDropdown v-model="isAccountDropdownOpen" placement="bottom-end">
          <template #trigger>
            <SfButton
              variant="tertiary"
              class="relative text-black dark:text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md"
              :class="{ 'bg-primary-900': isAccountDropdownOpen }"
              data-testid="account-dropdown-button"
              @click="accountDropdownToggle()"
            >
              <template #prefix>
                <SfIconPerson />
              </template>
              {{ user?.name }}
            </SfButton>
          </template>
          <ul class="rounded bg-white shadow-md border border-neutral-100 text-neutral-900 min-w-[152px] py-2">
            <li v-for="{ label, link } in accountDropdown" :key="label">
              <template v-if="label === 'account.logout'">
                <UiDivider class="my-2" />
                <SfListItem
                  tag="button"
                  class="text-left"
                  data-testid="account-dropdown-list-item"
                  @click="logoutAndToggle()"
                >
                  {{ $t(label) }}
                </SfListItem>
              </template>
              <SfListItem
                v-else
                :tag="NuxtLink"
                :to="link"
                :class="{ 'bg-neutral-200': $route.path === link }"
                data-testid="account-dropdown-list-item"
              >
                {{ $t(label) }}
              </SfListItem>
            </li>
          </ul>
        </SfDropdown>
      </NuxtLazyHydrate>
    </nav>
    <SfButton
      variant="tertiary"
      class="relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md md:hidden"
      square
      :aria-label="$t('openSearchModalButtonLabel')"
      @click="searchModalOpen"
    >
      <SfIconSearch />
    </SfButton>
  </UiNavbarTop>
  <NarrowContainer v-if="breadcrumbs">
    <div class="p-4 md:px-0">
      <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
    </div>
  </NarrowContainer>

  <main>
    <slot />
  </main>
  <NuxtLazyHydrate when-idle>
    <UiNavbarBottom />
  </NuxtLazyHydrate>
  <NuxtLazyHydrate when-visible>
    <UiFooter />
  </NuxtLazyHydrate>
  <NuxtLazyHydrate when-idle>
    <SfModal
      v-model="isSearchModalOpen"
      class="w-full h-full z-50"
      tag="section"
      role="dialog"
      aria-labelledby="search-modal-title"
    >
      <header class="mb-4">
        <SfButton square variant="tertiary" class="absolute right-4 top-2" @click="searchModalClose">
          <SfIconClose class="text-neutral-500" />
        </SfButton>
        <h3 id="search-modal-title" class="absolute left-6 top-4 font-bold typography-headline-4 mb-4">
          {{ $t('search') }}
        </h3>
      </header>
      <UiSearch :close="searchModalClose" />
    </SfModal>
  </NuxtLazyHydrate>
</template>
