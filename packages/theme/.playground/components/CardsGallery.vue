<template>
  <div>
    <slot name="title" />
    <br v-if="$slots.default" />
    <Columns gap="small" wrap>
      <slot />
    </Columns>
  </div>
</template>

<script lang="ts" setup>
/*
can be a PageComponent Only on Level 0 (we might implement it as a TabComponent as well)
*/

/* Todo: 
- sync code with the data-view-components
- register on component registry
*/

const props = defineProps({
  /**
   * typically undefined (if defined it overwrites the heading-entry of the src)
   */
  header: {
    type: String,
    required: false,
  },
  /**
   *
   *
   * @default 6
   */
  max_items: {
    type: Number,
    default: 9,
  },
  /**
   *
   *
   * @default false
   */
  large: {
    type: Boolean,
    default: false,
  },
  /**
   *
   */
  custom_folder: {
    type: String,
    required: false,
  },
})
</script>
