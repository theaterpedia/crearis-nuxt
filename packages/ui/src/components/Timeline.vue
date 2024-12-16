<template>
  <ul class="timeline">
    <slot />
  </ul>
</template>

<style scoped>
.timeline {
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  width: 1px;
  height: 100%;
  background-color: var(--color-border);
}

.timeline :deep() > li {
  position: relative;
}

.timeline :deep() > li > mark {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  background-color: var(--color-bg);
  padding: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transform: translate3d(-50%, -50%, 0);
}

.timeline :deep() > li > div {
  width: calc(50% - 3rem);
  padding: 1rem;
  border: 1px solid var(--color-border);
}

.timeline :deep() > li:nth-child(even) > div {
  margin-left: auto;
}

@media (max-width: 767px) {
  .timeline::before {
    display: none;
  }

  .timeline :deep() > li + li {
    margin-top: 2rem;
  }

  .timeline :deep() > li > mark {
    position: relative;
    top: auto;
    left: auto;
    margin-bottom: 0.5rem;
    background-color: transparent;
    padding: 0;
    transform: none;
  }

  .timeline :deep() > li > div {
    width: 100%;
  }
}
</style>
