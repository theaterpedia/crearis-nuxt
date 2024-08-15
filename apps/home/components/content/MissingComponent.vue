<template>
  <prose class="error">
    <h3>
      <strong>Missing component: {{ compName }}</strong>
      <span v-if="title">{{ title }}</span>
    </h3>
    <ContentSlot />
  </prose>
</template>

<script lang="ts" setup>
defineProps({
  /**
   * Specifies whether the banner background is slightly transparent.
   */
  compName: {
    type: String,
  },
  title: {
    type: String,
  },
})
</script>

<style scoped>
.error {
  background-color: red;
  color: white;
  padding: 10px;
  text-align: center;
}
</style>
