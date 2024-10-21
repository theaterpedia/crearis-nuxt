<template>
  <div class="catalog">
    <slot></slot>
  </div>
</template>

<style scoped>
.catalog :deep() > .prose > ul > li {
  display: flex;
  align-items: flex-end;
  white-space: nowrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.catalog :deep() > .prose > ul > li + li {
  margin-top: 0.25rem;
}

.catalog :deep() > .prose > ul > li > :where(strong, mark):first-child {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: transparent;
  font-weight: 400;
}

.catalog :deep() > .prose > ul > li > strong:first-child::after {
  content: '';
  flex: 1;
  display: block;
  min-width: 1rem;
  height: 1px;
  margin: 0 0.5rem;
  background-color: hsl(var(--border));
}

.catalog .prose :deep() > ul > li > mark:first-child {
  margin-top: 0.5rem;
}

.catalog :deep() > .prose > ul > li svg {
  font-size: 1.5em;
}
</style>
