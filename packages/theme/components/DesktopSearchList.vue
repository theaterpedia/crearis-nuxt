<script lang="ts" setup>
type SearchHitEmit = (event: 'select', parameter: any) => void
type SearchClerkProps = {
  hits?: any[]
  searchText: string
}

const props = defineProps<SearchClerkProps>()
defineEmits<SearchHitEmit>()

const makeSearchBold = (text: string) => {
  return text
    .toLocaleLowerCase()
    .replace(props.searchText, `<b class='font-extrabold text-[16px] capitalize'>${props.searchText}</b>`)
}
</script>
<template>
  <ul role="listbox" tabindex="-1" class="absolute top-12 w-full overflow-hidden rounded-md bg-white shadow-md">
    <li
      v-for="(product, index) in hits"
      :key="product.id"
      @click="$emit('select', product)"
      role="option"
      class="cursor-pointer px-4 py-2 hover:bg-gray-100"
    >
      <span v-html="makeSearchBold(product.name)" class="text-sm font-medium capitalize text-black"></span>
    </li>
  </ul>
</template>
