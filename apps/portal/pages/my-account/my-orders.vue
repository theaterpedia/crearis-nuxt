<template>
  <UiDivider class="-mx-4 w-screen md:col-span-3 md:mx-0 md:w-auto" />
  <h2 class="typography-headline-4 mx-4 hidden font-bold capitalize md:block">
    {{ $t('account.ordersAndReturns.myOrders') }}
  </h2>
  <div v-if="!data" class="col-span-3 mt-8 text-center">
    <NuxtImg
      :alt="$t('account.ordersAndReturns.noOrdersAltText')"
      height="192"
      loading="lazy"
      src="/images/empty-cart.svg"
      width="192"
      class="mx-auto"
    />
    <h3 class="typography-headline-3 mb-4 mt-6 font-bold">
      {{ $t('account.ordersAndReturns.noOrders') }}
    </h3>
    <ButtonTmp variant="plain" class="!ring-neutral-200">{{ $t('account.ordersAndReturns.continue') }}</ButtonTmp>
  </div>
  <div v-else class="col-span-3">
    <ul v-for="{ id, date, paymentAmount, status } in data" :key="id" class="my-4 last-of-type:mb-0 md:hidden">
      <li>
        <p class="typography-text-sm block font-medium">
          {{ $t('account.ordersAndReturns.orderId') }}
        </p>
        <span class="typography-text-sm mb-2 block">{{ id }}</span>
      </li>
      <li>
        <p class="typography-text-sm block font-medium">
          {{ $t('account.ordersAndReturns.orderDate') }}
        </p>
        <span class="typography-text-sm mb-2 block">{{ date }}</span>
      </li>
      <li>
        <p class="typography-text-sm block font-medium">
          {{ $t('account.ordersAndReturns.amount') }}
        </p>
        <span class="typography-text-sm mb-2 block">${{ paymentAmount }}</span>
      </li>
      <li class="mb-2 flex flex-wrap items-center">
        <p class="typography-text-sm -mb-1.5 block flex-[100%] font-medium">
          {{ $t('account.ordersAndReturns.status') }}
        </p>
        <span class="typography-text-sm block flex-1">{{ status }}</span>
        <SfButton :tag="NuxtLink" :to="`'/my-account/my-orders/'${id}`" size="sm" variant="tertiary">
          {{ $t('account.ordersAndReturns.details') }}
        </SfButton>
      </li>
      <UiDivider class="-mx-4 w-screen md:col-span-3 md:mx-0 md:w-auto" />
    </ul>
    <table class="typography-text-sm mx-4 hidden text-left md:block">
      <caption class="hidden">List of orders</caption>
      <thead class="border-b-2 border-neutral-200">
        <tr>
          <th class="py-4 pr-4 font-medium">
            {{ $t('account.ordersAndReturns.orderId') }}
          </th>
          <th class="px-4 py-4 font-medium lg:whitespace-nowrap">
            {{ $t('account.ordersAndReturns.orderDate') }}
          </th>
          <th class="px-4 py-4 font-medium">
            {{ $t('account.ordersAndReturns.amount') }}
          </th>
          <th class="px-4 py-4 font-medium">
            {{ $t('account.ordersAndReturns.status') }}
          </th>
          <th class="py-4 pl-4"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ id, date, paymentAmount, status } in data" :key="id" class="border-b border-neutral-200">
          <td class="py-4 pr-4 lg:whitespace-nowrap">{{ id }}</td>
          <td class="p-4 lg:whitespace-nowrap">{{ date }}</td>
          <td class="p-4">${{ paymentAmount }}</td>
          <td :class="['p-4', { 'text-negative-700': status === 'Cancelled' }]">
            {{ status }}
          </td>
          <td class="w-full py-1.5 pl-4 text-right">
            <SfButton :tag="NuxtLink" size="sm" variant="tertiary">
              {{ $t('account.ordersAndReturns.details') }}
            </SfButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import ButtonTmp from '../../components/ButtonTmp.vue'

definePageMeta({
  layout: 'account',
})

const data = ref([
  {
    id: '0e4fec5a-61e6-48b8-94cc-d5f77687e2b0	',
    date: '2022-08-11',
    paymentAmount: '295.87',
    status: 'Completed',
  },
  {
    id: '0e4fec5a-61e6-48b8-94cc-d5f77687e2b0	',
    date: '2022-08-11	',
    paymentAmount: '295.87',
    status: 'Completed',
  },
  {
    id: '0e4fec5a-61e6-48b8-94cc-d5f77687e2b0	',
    date: '2022-08-11	',
    paymentAmount: '295.87',
    status: 'Open',
  },
  {
    id: '0e4fec5a-61e6-48b8-94cc-d5f77687e2b0	',
    date: '2022-08-11	',
    paymentAmount: '295.87',
    status: 'Cancelled',
  },
])

const NuxtLink = resolveComponent('NuxtLink')
</script>
