<template>
  <div class="prose">
    <slot />
  </div>
</template>

<style scoped>
.prose {
  max-width: 54rem; /* 864px */
}

/**
 * Paragraphs
 */

.prose :where(p) {
  color: var(--color-muted-contrast);
  font-size: 1em;
  line-height: 1.15;
}

/**
 * Headings
 */

.prose :where(h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6) {
  color: var(--color-contrast);
  font-weight: 500;
}

.prose :where(h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6) :where(strong) {
  display: block;
}

.prose :where(h1, .h1) :where(strong) {
  font-size: 2.7em;
  line-height: 1.2;
}

.prose :where(h2, .h2) :where(strong) {
  font-size: 2.2em;
  line-height: 1.2;
}

.prose :where(h3, .h3) :where(strong) {
  font-size: 1.4em;
  line-height: 1.2;
}

.prose :where(h4, .h4) :where(strong) {
  font-size: 1.2em;
  line-height: 1.2;
}

.prose :where(h5, .h5) :where(strong) {
  font-size: 1em;
  line-height: 1.2;
}

.prose :where(h6, .h6) :where(strong) {
  font-size: 0.875em;
  line-height: 1.2;
}

/* .small to be used from outside via slot */
.prose :where(h1, h2, h3, .h1, .h2, .h3, .h4, .h5, .h6) :where(small) {
  font-size: 0.875em;
  display: block;
  font-weight: 400;
}

/**
 * Links
 */

.prose :where(:not(:where(h1, h2, h3, h4, h5, h6)[id])) :where(a) {
  color: var(--link, var(--color-secondary-base));
  text-decoration: underline;
}

.prose :where(a:hover) {
  text-decoration: none;
}

/**
 * Lists
 */

.prose > * + :where(ul, ol) {
  margin-top: 0.6em;
  color: var(--color-muted-contrast);
}

.prose :where(ul, ol) :where(ul, ol) {
  padding-left: 2.5em;
}

.prose :where(li) {
  position: relative;
  margin-top: 0.4em;
  margin-bottom: 0.4em;
  padding-left: 2.5em;
}

.prose :where(li)::before {
  content: '';
  position: absolute;
  top: 0.575em;
  left: 1.75em;
  width: 0.1875rem;
  height: 0.1875rem;
  margin-top: -0.09375rem;
  border-radius: 50%;
  background-color: var(--color-muted-contrast);
}

/**
 * Spacings
 */

.prose > :where(* + *) {
  margin-top: 1em;
}

.prose :where(:not(.narrow, .h1, .h2, .h3, .h4, .h5, .h6) + p) {
  margin-top: 1.8em;
}

.prose :where(h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6) + :where(:not(.h1, .h2, .h3, .h4, .h5, .h6)) {
  margin-top: 1.3em;
}

.prose :where(:not(.h1, .h2, .h3, .h4, .h5, .h6)) + :where(h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6) {
  margin-top: 1.8em;
}

.prose
  :where(h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6)
  + :where(h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6) {
  margin-top: 0.75rem;
}

.prose :where(* + .narrow, .narrow > p) {
  margin-top: 0.5em;
}

/**
 * Colors
 */
.prose :where(.primary) {
  --color-contrast: var(--color-primary-base);
  color: var(--color-primary-base);
}

.prose :where(.secondary) {
  --color-contrast: var(--secondary);
  color: var(--color-secondary-base);
}

.prose :where(.dimmed) {
  --color-contrast: var(--color-dimmed);
  color: var(--color-dimmed);
}

.prose :where(strong) {
  color: var(--color-contrast);
}
</style>
