<script lang="ts" setup>
import { SfBadge, SfIconHome, SfIconMenu, SfIconPerson, SfIconShoppingCart } from '@crearis/vue'
import ButtonTmp from '../../components/ButtonTmp.vue'

const { t } = useI18n()
const { data: cart } = useSfCart()

const items = [
  {
    label: t('home'),
    icon: SfIconHome,
    link: paths.home,
  },
  {
    label: t('products'),
    icon: SfIconMenu,
    link: paths.category,
  },
  {
    label: t('cart'),
    icon: SfIconShoppingCart,
    link: paths.cart,
  },
  {
    label: t('account.navBarBottomHeading'),
    icon: SfIconPerson,
    link: paths.account,
  },
]

const cartLineItemsCount = computed(
  () => cart.value?.lineItems.reduce((total, { quantity }) => total + quantity, 0) ?? 0,
)
const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <nav data-testid="navbar-bottom" class="fixed bottom-0 left-0 flex w-full flex-row items-stretch md:hidden">
    <ButtonTmp
      v-for="{ label, icon, link } in items"
      :is="NuxtLink"
      :key="label"
      :to="link"
      size="sm"
      variant="tertiary"
      class="bg-primary-700 hover:bg-primary-800 active:bg-primary-900 !font-base flex h-full w-full flex-col rounded-none !p-1 !pt-3 !text-xs text-white hover:text-white active:text-white"
      :class="[{ 'bg-primary-900 text-white': $route.path === link }]"
    >
      <template #prefix>
        <div class="relative">
          <component :is="icon" />
          <SfBadge
            v-if="label === 'cart'"
            :content="cartLineItemsCount"
            class="translate-x-[5px] translate-y-[-3px] bg-white !text-neutral-900 outline-white"
          />
        </div>
      </template>
      {{ label }}
    </ButtonTmp>
  </nav>
</template>
