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
  color: hsl(var(--muted-foreground));
  font-size: 1em;
  line-height: 1.15;
}

/**
 * Headings
 */

.prose :where(h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6) {
  color: hsl(var(--foreground));
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

.prose :where(h1, h2, h3, .h1, .h2, .h3, .h4, .h5, .h6) :where(small) {
  font-size: 0.875em;
  display: block;
  font-weight: 400;
}

/**
 * Links
 */

.prose :where(:not(:where(h1, h2, h3, h4, h5, h6)[id])) :where(a) {
  color: hsl(var(--link, var(--secondary)));
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
  color: hsl(var(--muted-foreground));
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
  background-color: hsl(var(--muted-foreground));
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
  --foreground: var(--primary);
  color: hsl(var(--primary));
}

.prose :where(.secondary) {
  --foreground: var(--secondary);
  color: hsl(var(--secondary));
}

.prose :where(.dimmed) {
  --foreground: var(--dimmed);
  color: hsl(var(--dimmed));
}

.prose :where(strong) {
  color: hsl(var(--foreground));
}
</style>
