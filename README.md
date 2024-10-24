# Crearis Nuxt

This monorepo contains [Vue](https://vuejs.org) components and [Nuxt](https://nuxt.com) layers for the [dasei.eu](https://dasei.eu) website.

## System requirements

- **Node.js** - `v20.0.0` or newer.
- **pnpm** - `v9.4.0` or newer (`npm i -g pnpm`).
- **Text editor** - We recommend [Visual Studio Code](https://code.visualstudio.com) with the following extensions:
  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
  - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- **Terminal** - In order to run commands.

## Installation

1. Clone the monorepo: `git clone https://github.com/theaterpedia/crearis-nuxt.git`
2. Install all dependencies: `pnpm i`
3. Start the development servers:
   - `pnpm dev:ui`
   - `pnpm dev:theme`
4. Build the packages (in the specified order):
   - `pnpm build:ui`
   - `pnpm build:theme`

## Structure

This repository contains the following packages:

### 1. `@crearis/ui`

The `@crearis/ui` package is a Vue component library powered by [Vite](https://vite.dev). It includes the following exports:

- `@crearis/ui` - Vue components and composables.
- `@crearis/ui/css/*` - Separate bases styles.
- `@crearis/ui/fonts/*` - Local webfonts.
- `@crearis/ui/nuxt` - Nuxt [module](https://nuxt.com/docs/guide/concepts/modules) that [auto-imports](https://nuxt.com/docs/guide/concepts/auto-imports) all components and composables in a Nuxt project.
- `@crearis/ui/styles` - Bundled base styles.

#### Usage (Nuxt)

Install the package in your Nuxt project.

```bash
npm i @crearis/ui
```

Then, add the module in your `nuxt.config.ts` file:

```ts
defineNuxtConfig({
  modules: ['@crearis/ui/nuxt'],
})
```

### 2. `@crearis/theme`

The `@crearis/theme` package is a Nuxt [layer](https://nuxt.com/docs/getting-started/layers) containing Nuxt-ready components and composables for building the [dasei.eu](https://dasei.eu) website.

#### Usage

Install the layer in your Nuxt project.

```bash
npm i @crearis/theme
```

Then, add the dependency in your `nuxt.config.ts` file:

```ts
defineNuxtConfig({
  extends: ['@crearis/theme'],
})
```

The `@crearis/ui` module is included in the layer, so there's no need to install it separately.
