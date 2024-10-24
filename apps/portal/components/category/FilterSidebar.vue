<script lang="ts" setup>
import {
  SfAccordionItem,
  SfCheckbox,
  SfChip,
  SfIconChevronLeft,
  SfListItem,
  SfRadio,
  SfSelect,
  SfThumbnail,
} from '@crearis/vue'
import ButtonTmp from '../../components/ButtonTmp.vue'

interface ProductFilterType {
  filterName: string
  id: string
  label: string
}

const emit = defineEmits(['close'])
const props = defineProps({
  attributes: {
    type: Array,
    required: true,
  },
  categories: {
    type: Object,
    required: true,
  },
})
const route: any = useRoute()
const router: any = useRouter()
const { changeFilters, facetsFromUrlToFilter } = useUiHelpers()

const sort = ref(route.query?.sort ? route.query?.sort : '')

const parent = computed(() => {
  return {
    label: props.categories?.label?.toLowerCase(),
    slug: props.categories?.slug,
  }
})
const getSortOptions = (searchData: { input: any }) => ({
  options: sortOptions,
  selected: searchData.input.sort || 'name asc',
})
const changeSorting = async (newSort: string) => {
  sort.value = newSort
}
const sortBy = computed(() => getSortOptions({ input: { sort: sort.value } }))
const selectedFilters = ref<any>([])
const isFilterSelected = (option: any) => {
  return selectedFilters.value.some((filter: { id: any }) => String(filter.id) === String(option.value))
}
const isPriceSelected = (option: any) => {
  return selectedFilters.value.some((filter: { id: any }) => String(filter.id) === String(option.values))
}
const isItemActive = (selectedValue: string) => {
  return selectedFilters.value?.includes(selectedValue)
}

const facets: any = computed(() => [
  {
    id: null,
    label: 'Price',
    type: 'price',
    options: [
      { id: 'pr1', label: 'Under $250.00', values: '0-250' },
      { id: 'pr2', label: '$250.00 - $500.00', values: '250-500' },
      { id: 'pr3', label: '$500.00 - $750.00', values: '500-750' },
      { id: 'pr4', label: '$750.00 - $1000.00', values: '750-1000' },
      { id: 'pr5', label: '$1000.00- $1500.00', values: '1000-1500' },
    ],
  },
  ...props.attributes,
])
const opened = ref<boolean[]>(facets.value.map(() => true))

const priceModel = ref<any>('')
const selectPrice = (values: any) => {
  const newValue: any = [values]
  const getIndex = selectedFilters.value.findIndex((item: { filterName: string }) => item?.filterName === 'price')
  if (getIndex > -1) {
    selectedFilters.value[getIndex].id = newValue[0]
  } else {
    selectedFilters.value.push({
      filterName: 'price',
      label: 'Price',
      id: newValue[0],
    })
  }
}
const selectedFilter = (facet: { label: string }, option: { id: string; value: string; label: string }) => {
  const alreadySelectedIndex = selectedFilters.value.findIndex(
    (filter: { id: string }) => String(filter.id) === String(option.value),
  )
  if (alreadySelectedIndex === -1) {
    selectedFilters.value.push({
      filterName: facet?.label,
      label: option?.label,
      id: option?.value,
    })
    return
  }
  selectedFilters.value.splice(alreadySelectedIndex, 1)
}
const applyFilters = () => {
  if (!priceModel.value) {
    selectedFilters.value = selectedFilters.value?.filter((item: ProductFilterType) => {
      return item.filterName !== 'price'
    })
  }
  const filters = selectedFilters.value.filter((item: any) => {
    return typeof item === 'object'
  })
  changeFilters(filters, sort.value)
  emit('close')
  facetsFromUrlToFilter()
}
const clearFilters = () => {
  selectedFilters.value = []
  router.push({ query: {} })
  emit('close')
}

const changeCategory = (categoryId: number) => {
  clearFilters()
  router.push({ path: `/category/${categoryId}` })
}

onMounted(() => {
  selectedFilters.value = facetsFromUrlToFilter()
  const priceFilter = selectedFilters.value?.find((item: ProductFilterType) => {
    return item.filterName === 'price'
  })
  if (priceFilter) {
    priceModel.value = priceFilter.id
  }
})
</script>

<template>
  <aside class="w-full lg:max-w-[376px]">
    <div
      data-testid="category-tree"
      class="typography-headline-6 mb-4 bg-neutral-100 px-4 py-2 font-bold uppercase tracking-widest text-neutral-900 md:rounded-md"
    >
      {{ $t('category') }}
    </div>

    <ul data-testid="categories" class="mb-6 mt-4 md:mt-2">
      <SfListItem
        v-for="(category, index) in categories"
        :key="category.name"
        data-testid="category-tree-item"
        size="lg"
        :class="[
          'md:sf-list-item-sm sf-list-item md:py-1.5',
          {
            'bg-primary-100 hover:bg-primary-100 active:bg-primary-100 font-medium': category.id === route.query.id,
          },
        ]"
      >
        <span @click="changeCategory(category.id)" class="flex items-center gap-2">
          <span
            data-testid="list-item-menu-label"
            class="flex items-center text-base capitalize md:text-sm"
            :class="{
              'font-bold': category.slug === route.path,
            }"
          >
            <slot />
            {{ category.name }}
          </span>
        </span>
      </SfListItem>
    </ul>
    <h5
      class="typography-headline-6 mb-6 bg-neutral-100 px-4 py-2 font-bold uppercase tracking-widest text-neutral-900 md:rounded-md"
    >
      Sort by
    </h5>
    <div class="px-2">
      <SfSelect
        v-model="sortBy.selected"
        :aria-label="$t('sortBy')"
        @update:model-value="changeSorting"
        placeholder="Select sorting"
      >
        <option
          v-for="{ id, value, attrName } in sortBy.options"
          :key="id"
          :selected="sortBy.selected === value"
          :value="value"
        >
          {{ attrName }}
        </option>
      </SfSelect>
    </div>
    <h5
      class="typography-headline-6 mb-4 mt-6 bg-neutral-100 px-4 py-2 font-bold uppercase tracking-widest text-neutral-900 md:rounded-md"
    >
      Filter
    </h5>
    <client-only>
      <ul>
        <li v-for="(facet, index) in facets" :key="index">
          <SfAccordionItem v-model="opened[index]">
            <template #summary>
              <div class="mb-2 flex items-center justify-between p-2">
                <p class="typography-headline-5 p-2 font-medium">
                  {{ facet?.label }}
                </p>
                <SfIconChevronLeft :class="opened[index] ? 'rotate-90' : '-rotate-90'" />
              </div>
            </template>
            <template v-if="facet.type == 'price'">
              <fieldset id="radio-price">
                <SfListItem
                  v-for="{ id, values, label } in facet.options"
                  :key="id"
                  size="sm"
                  tag="label"
                  class="bg-transparent px-1.5 hover:bg-transparent"
                >
                  <template #prefix>
                    <SfRadio
                      v-model="priceModel"
                      :value="values"
                      @click="priceModel = priceModel === values ? '' : values"
                      @update:model-value="selectPrice(values)"
                      name="radio-price"
                      class="flex items-center"
                    />
                  </template>
                  <p>
                    <span :class="['mr-2 text-sm', { 'font-medium': priceModel === values }]">{{ label }}</span>
                  </p>
                </SfListItem>
              </fieldset>
            </template>
            <ul v-if="facet.type === 'select'" class="grid grid-cols-5 gap-2 px-3">
              <li v-for="{ id, value, label } in facet.options" :key="id">
                <SfChip
                  :input-props="{ value }"
                  :model-value="isFilterSelected({ id, value })"
                  @update:model-value="selectedFilter(facet, { id, value, label })"
                  size="sm"
                  class="w-full"
                >
                  {{ label }}
                </SfChip>
              </li>
            </ul>
            <ul v-if="facet.type === 'radio'" class="grid grid-cols-3 gap-2 px-3">
              <li v-for="{ id, value, label } in facet.options" :key="id">
                <SfChip
                  :input-props="{ value }"
                  :model-value="isFilterSelected({ id, value })"
                  @update:model-value="selectedFilter(facet, { id, value, label })"
                  size="sm"
                  class="w-full"
                >
                  {{ label }}
                </SfChip>
              </li>
            </ul>
            <template v-if="facet.type == 'color'">
              <SfListItem
                v-for="{ id, value, label, htmlColor } in facet.options"
                :key="id"
                :selected="isFilterSelected({ id, value })"
                size="sm"
                tag="label"
                :class="[
                  'bg-transparent px-4 hover:bg-transparent',
                  {
                    'font-medium': isFilterSelected({ id, value }),
                  },
                ]"
              >
                <template #prefix>
                  <SfCheckbox
                    :model-value="isFilterSelected({ id, value })"
                    :value="label"
                    @update:model-value="selectedFilter(facet, { id, value, label })"
                    class="peer hidden appearance-none"
                  />
                  <span
                    class="outline-secondary-600 peer-checked:ring-primary-700 peer-hover:bg-primary-100 peer-[&:not(:checked):hover]:ring-primary-200 peer-active:bg-primary-200 peer-active:ring-primary-300 peer-disabled:bg-disabled-100 peer-disabled:ring-disabled-200 peer-disabled:hover:ring-disabled-200 peer-checked:hover:ring-primary-700 peer-checked:active:ring-primary-700 inline-flex cursor-pointer items-center justify-center rounded-full p-1 outline-offset-2 ring-1 ring-inset ring-neutral-200 transition duration-300 peer-checked:ring-2 peer-focus-visible:outline peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-disabled:ring-1"
                  >
                    <SfThumbnail size="sm" :style="{ backgroundColor: htmlColor }" />
                  </span>
                </template>
                <p>
                  <span class="typography-text-sm mr-2">{{ label }}</span>
                </p>
              </SfListItem>
            </template>
          </SfAccordionItem>
          <hr class="my-4" />
        </li>
      </ul>
    </client-only>
    <div class="flex flex-col gap-y-4 px-3 lg:flex-row lg:justify-between lg:gap-y-0 lg:px-0">
      <ButtonTmp @click="clearFilters" variant="plain" class="mr-3 w-full">
        {{ $t('clearFilters') }}
      </ButtonTmp>
      <ButtonTmp @click="applyFilters" class="w-full">{{ $t('showProducts') }}</ButtonTmp>
    </div>
  </aside>
</template>
