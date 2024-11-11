<script lang="ts" setup>
const route = useRoute()
const router = useRouter()

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  maxVisiblePages: {
    type: Number,
    required: true,
  },
})

const pagination = computed<any>(() =>
  reactive(
    usePagination({
      totalItems: props?.totalItems,
      currentPage: props?.currentPage,
      pageSize: props?.pageSize,
      maxPages: props?.maxVisiblePages,
    }),
  ),
)

const setParams = (filter: any) => {
  router.push({ query: { ...route.query, ...filter } })
}

onMounted(() => {
  pagination.value?.setPage(route.query.page ? Number(route.query.page) : 1)
})
</script>

<template>
  <nav
    aria-label="pagination"
    data-testid="pagination"
    role="navigation"
    class="flex items-end justify-between border-t border-neutral-200"
  >
    <SfButton
      :disabled="pagination.selectedPage <= 1"
      @click="
        pagination.prev()
        setParams({ ['page']: pagination.selectedPage })
      "
      aria-label="Go to previous page"
      size="lg"
      type="button"
      variant="tertiary"
      class="gap-3"
    >
      <template #prefix>
        <SfIconChevronLeft />
      </template>
      <span class="hidden sm:inline-flex">Previous</span>
    </SfButton>
    <ul class="flex justify-center">
      <li v-if="!pagination.pages.includes(1)">
        <div
          :class="[
            'flex border-t-4 border-transparent pt-1',
            {
              '!border-primary-500 border-t-4 font-medium': pagination.selectedPage === 1,
            },
          ]"
        >
          <button
            :aria-current="pagination.selectedPage === 1"
            @click="
              pagination.setPage(1)
              setParams({ ['page']: 1 })
            "
            type="button"
            class="hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 rounded-md px-4 py-3 text-neutral-500 md:w-12"
          >
            1
          </button>
        </div>
      </li>
      <li v-if="pagination.startPage > 2">
        <div class="flex border-t-4 border-transparent pt-1">
          <button aria-hidden="true" disabled type="button" class="rounded-md px-4 py-3 text-neutral-500 md:w-12">
            ...
          </button>
        </div>
      </li>
      <li v-if="maxVisiblePages === 1 && pagination.selectedPage === pagination.totalPages">
        <div class="flex border-t-4 border-transparent pt-1">
          <button
            :aria-current="pagination.endPage - 1 === pagination.selectedPage"
            @click="
              pagination.setPage(pagination.endPage - 1)
              setParams({ ['page']: pagination.selectedPage })
            "
            type="button"
            class="hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 rounded-md px-4 py-3 text-neutral-500 md:w-12"
          >
            {{ pagination.endPage - 1 }}
          </button>
        </div>
      </li>
      <li v-for="page in pagination.pages" :key="`page-${page}`">
        <div
          :class="[
            'flex border-t-4 border-transparent pt-1',
            {
              '!border-primary-700 border-t-4 font-medium': pagination.selectedPage === page,
            },
          ]"
        >
          <button
            :aria-current="pagination.selectedPage === page"
            @click="
              pagination.setPage(page)
              setParams({ ['page']: page })
            "
            type="button"
            :class="[
              'hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 rounded-md px-4 py-3 text-neutral-500 md:w-12',
              {
                'hover:!text-primary-800 active:!text-primary-900 !text-neutral-900': pagination.selectedPage === page,
              },
            ]"
          >
            {{ page }}
          </button>
        </div>
      </li>
      <li v-if="maxVisiblePages === 1 && pagination.selectedPage === 1">
        <div class="flex border-t-4 border-transparent pt-1">
          <button
            @click="
              pagination.setPage(2)
              setParams({ ['page']: 2 })
            "
            aria-label="Second page"
            type="button"
            class="hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 rounded-md px-4 py-3 text-neutral-500 md:w-12"
          >
            2
          </button>
        </div>
      </li>
      <li v-if="pagination.endPage < pagination.totalPages - 1">
        <div class="flex border-t-4 border-transparent pt-1">
          <button aria-hidden="true" disabled type="button" class="rounded-md px-4 py-3 text-neutral-500 md:w-12">
            ...
          </button>
        </div>
      </li>
      <li v-if="!pagination.pages.includes(pagination.totalPages)">
        <div
          :class="[
            'flex border-t-4 border-transparent pt-1',
            {
              '!border-primary-500 border-t-4 font-medium': pagination.selectedPage === pagination.totalPages,
            },
          ]"
        >
          <button
            :aria-current="pagination.totalPages === pagination.selectedPage"
            @click="
              pagination.setPage(pagination.totalPages)
              setParams({ ['page']: pagination.totalPages })
            "
            type="button"
            class="hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 rounded-md px-4 py-3 text-neutral-500 md:w-12"
          >
            {{ pagination.totalPages }}
          </button>
        </div>
      </li>
    </ul>
    <SfButton
      :disabled="pagination.selectedPage >= pagination.totalPages"
      @click="
        pagination.next()
        setParams({ ['page']: pagination.selectedPage })
      "
      aria-label="Go to next page"
      size="lg"
      type="button"
      variant="tertiary"
      class="gap-3"
    >
      <span class="hidden sm:inline-flex">Next</span>
      <template #suffix>
        <SfIconChevronRight />
      </template>
    </SfButton>
  </nav>
</template>
