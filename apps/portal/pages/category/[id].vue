<script lang="ts" setup>
import { SfIconTune, useDisclosure } from '@crearis/vue'
import type { Product } from '@crearis/data/graphql'
import ButtonTmp from '../../components/ButtonTmp.vue'

const route = useRoute()
const breadcrumbs = [
  { name: 'Home', link: '/' },
  { name: 'Category', link: `Category/${route.params.id}` },
]

const { isOpen, open, close } = useDisclosure()
const { loadProductTemplateList, organizedAttributes, loading, productTemplateList, totalItems, categories } =
  useProductTemplateList(String(route.fullPath))
const { getRegularPrice, getSpecialPrice } = useProductAttributes()
const { getFacetsFromURL } = useUiHelpers()

const maxVisiblePages = ref(1)
const setMaxVisiblePages = (isWide: boolean) => (maxVisiblePages.value = isWide ? 5 : 1)

watch(isWideScreen, (value) => setMaxVisiblePages(value))
watch(isTabletScreen, (value) => {
  if (value && isOpen.value) {
    close()
  }
})

watch(
  () => route,
  async () => {
    await loadProductTemplateList(getFacetsFromURL(route.query))
  },
  { deep: true, immediate: true },
)

const pagination = computed(() => ({
  currentPage: route?.query?.page ? Number(route.query.page) : 1,
  totalPages: Math.ceil(totalItems.value / 12) || 1,
  totalItems: totalItems.value,
  itemsPerPage: 12,
  pageOptions: [5, 12, 15, 20],
}))

onMounted(() => {
  setMaxVisiblePages(isWideScreen.value)
})
</script>

<template>
  <!-- #TODO _7 ReEnable SfContent-Logic></! -->
  <!-- div v-for="(component, index) in content" :key="`${component.fields.component}-${index}`">
    <RenderContent :content="component.fields.content" />
  </! -->
  <NuxtLayout :breadcrumbs="breadcrumbs">
    <SectionContainer>
      <h1 class="typography-headline-3 md:typography-headline-2 mb-10 font-bold">All products</h1>
      <div class="grid grid-cols-12 lg:gap-x-6">
        <div class="col-span-12 lg:col-span-4 xl:col-span-3">
          <CategoryFilterSidebar :attributes="organizedAttributes" :categories="categories" class="hidden lg:block" />
          <LazyCategoryMobileSidebar :is-open="isOpen" @close="close">
            <template #default>
              <CategoryFilterSidebar
                :attributes="organizedAttributes"
                :categories="categories"
                @close="close"
                class="block lg:hidden"
              />
            </template>
          </LazyCategoryMobileSidebar>
        </div>
        <div class="col-span-12 lg:col-span-8 xl:col-span-9">
          <template v-if="!loading">
            <div class="mb-6 flex items-center justify-between">
              <span class="font-headings font-bold md:text-lg">{{ totalItems }} Products</span>
              <ButtonTmp @click="open" variant="tertiary" class="whitespace-nowrap lg:hidden">
                <template #prefix>
                  <SfIconTune />
                </template>
                Filter
              </ButtonTmp>
            </div>
            <section
              v-if="productTemplateList.length > 0"
              class="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4"
            >
              <LazyUiProductCard
                v-for="productTemplate in productTemplateList"
                :first-variant="productTemplate.firstVariant as Product"
                :image-alt="productTemplate?.name || ''"
                :image-url="$getImage(String(productTemplate.image), 370, 370, String(productTemplate.imageFilename))"
                :key="productTemplate.id"
                :name="productTemplate?.name || ''"
                :rating="Number(4)"
                :rating-count="123"
                :regular-price="getRegularPrice(productTemplate.firstVariant as Product) || 250"
                :slug="mountUrlSlugForProductVariant((productTemplate.firstVariant || productTemplate) as Product)"
                :special-price="getSpecialPrice(productTemplate.firstVariant as Product)"
                loading="eager"
              />
            </section>
            <CategoryEmptyState v-else />
            <LazyUiPagination
              v-if="pagination.totalPages > 1"
              :current-page="pagination.currentPage"
              :max-visible-pages="maxVisiblePages"
              :page-size="pagination.itemsPerPage"
              :total-items="pagination.totalItems"
              class="mt-5"
            />
          </template>
          <template>
            <div class="w-full text-center">Loading Products...</div>
          </template>
        </div>
      </div>
    </SectionContainer>
  </NuxtLayout>
  <!-- ContentDoc / -->
</template>
