<template>
  <div class="catalog">
    <slot></slot>
  </div>
</template>

<style scoped>
.catalog :deep() > ul > li {
  display: flex;
  align-items: flex-end;
  white-space: nowrap;
}

.catalog :deep() > ul > li + li {
  margin-top: 0.25rem;
}

.catalog :deep() > ul > li > :where(strong, mark):first-child {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: transparent;
  font-weight: 400;
}

.catalog :deep() > ul > li > strong:first-child::after {
  content: '';
  flex: 1;
  display: block;
  min-width: 1rem;
  height: 1px;
  margin: 0 0.5rem;
  background-color: hsl(var(--border));
}

.catalog :deep() > ul > li > mark:first-child {
  margin-top: 0.5rem;
}

.catalog :deep() > ul > li svg {
  font-size: 1.5em;
}
</style>
