<script lang="ts" setup>
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
</script>

<template>
  <form @submit.prevent ref="formSearchTemplateRef" role="search" class="relative lg:flex">
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
</template>
