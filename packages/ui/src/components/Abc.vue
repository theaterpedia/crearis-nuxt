<template>
  <Prose class="abc">
    <slot />
  </Prose>
</template>

<script lang="ts" setup>
import Prose from './Prose.vue'
</script>

<style scoped>

/**
 * Special Setting for abc
 */

.abc :deep() > :is(h2, h3, h4, h5, .h2, .h3, .h4, .h5) {
  padding: 0.5rem;
  padding-left: 9.5rem;
}

.abc :deep() > :is(h3, h4, h5, .h2, .h3, .h4, .h5) > strong {
  padding-left: 0rem;
}

.abc :deep() > :is(h2, .h2) {
  padding-left: 0.5rem;
  margin: 0rem;
  padding-top: 2rem;
  margin-bottom: 0.25rem;
  background-color: white;
}

.abc :deep() > :is(h3, h4, h5, .h3, .h4, .h5) > em {
  margin-left: -8.5rem;
  margin-right: 5.5rem;
  font-style: normal;  
}

.abc :deep() > p, .abc :deep() > ul  {
  margin-top:0rem;
  padding-top: 0.5rem;
  line-height: 1.5;
  padding-left: 9.5rem;
  margin-right: 0.25rem;
  padding-right: 12rem;
}

.abc :deep() > h2 + p {
  margin-left: 0.25rem;
  margin-bottom: 0.25rem;
}

.abc :deep() p:has(em, mark) {
  display: flex;
  align-items: flex-start;
  white-space: initial;
}

.abc :deep() > ul {
  font-size: 0.825em;
  padding-left: 8.5rem;
}

.abc :deep() > p:has(mark) {
  padding-right:0.5rem;
}

.abc :deep() > p > em {
  min-width: 8.5rem;
  max-width: 8.5rem;
  align-items: center;
  background-color: transparent;
  font-weight: 200;
  margin-left: -8.5rem;
  font-style:normal;
}

.abc :deep() > p > mark {
  min-width: 12rem;
  max-width: 12rem;
  padding-left: 0.5rem;
  line-height: 1.2;
  font-size: 0.8em;
  align-items: center;
  background-color: transparent;
  font-weight: 200;
}

.abc :deep() > :is(h3, h4) ~ p > em {
  padding-left: 0rem;
  font-size: 0.9em;
  margin-left: -7.5rem;
  min-width: 7.5rem;
  max-width: 7.5rem;
}

.abc :deep() > :is(h3, h4) ~ h2 ~ p > em {
  padding-left: 0rem;
  font-size: 1em;
  margin-left: -8.5rem;
  min-width: 8.5rem;
  max-width: 8.5rem;
}

.abc :deep() > :is(h3, h4) ~ h2 ~ :is(h3, h4) ~ p > em {
  padding-left: 0rem;
  font-size: 0.9em;
  margin-left: -7.5rem;
  min-width: 7.5rem;
  max-width: 7.5rem;
}


.abc :deep() > :is(h3, h4) ~ h2 ~ :is(h3, h4) ~ h2 ~ p > em {
  padding-left: 0rem;
  font-size: 1em;
  margin-left: -8.5rem;
  min-width: 8.5rem;
  max-width: 8.5rem;
}

.abc :deep() > :is(h3, h4) + p::before {
  content: "->";
  font-size: 0.8em;
  padding-left: 1.4rem;
  width:13.2rem;
  padding-right: 4rem;
  margin-left: -10rem;
}

.abc :deep() > :is(h3, h4) + p > em {
  padding-left: 0rem;
  margin-left: -7.5rem;
  min-width: 7.5rem;
  max-width: 7.5rem;
}


</style>