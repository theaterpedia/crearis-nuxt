# About CREARIS tailwind-config

This package originates from the similar named code-project crafted by Vuestorefront/Alokai to support the theming of storefront-ui components

Theming / colors was changed from rgba-based fixed palettes to oklch-based dynamic palettes, originally layed out in: 
[article](https://evilmartians.com/chronicles/better-dynamic-themes-in-tailwind-with-oklch-color-magic)
[gh-repo](https://github.com/dkzlv/tw-dynamic-themes)

The intention is to replay Tailwind3-style color-naming/utilities (aka 'bg-lime-200' + 'dark:bg-lime-700') by simplified and themable color-naming/utilities based on the shadcn/ui-logic (bg-muted, bg-primary, bg-accent, bg-negative ...) that takes dark as a second palette