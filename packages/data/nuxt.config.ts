// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

// we want different behaviour if the package name is data-dev or theme-dev or studio-dev
const pkgName = process.env.npm_package_name
const isDevDir = (pkgName === 'data-dev' || pkgName === 'theme-dev' || pkgName === 'studio-dev')

export default defineNuxtConfig({
  typescript: {
    typeCheck: true,
  },
  imports: {
    dirs: ['composables/**', 'utils/**'],
  },
  // we don't want pruvious in dev mode when we are working on the boilerplate from vsf or odoogap
  modules: isDevDir ? [ '@vite-pwa/nuxt', '@vue-storefront/nuxt' ] : [ '@vite-pwa/nuxt', '@vue-storefront/nuxt', 'pruvious'  ],
  nitro: {
    prerender: {
      crawlLinks: false,
      ignore: ['/shop'],
    },
    compressPublicAssets: true,
    /* storage: {
      cache: {
        driver: "redis",
        url: process.env.REDIS_URL,
      },
    },
    devStorage: {
      cache: {
        driver: "redis",
        url: process.env.REDIS_URL,
      },
    },    */
  },
  vsf: {
    middleware: {
      apiUrl: 'http://localhost:3000',
    },
  },
  vite: {
    optimizeDeps: {
      include: ['lodash-es'],
    },
  },
  build: {
    transpile: [
      'tslib',
      '@apollo/client',
      '@apollo/client/core',
      '@vue/apollo-composable',
      '@vue/apollo-option',
      'ts-invariant',
      '@erpgap/odoo-sdk-api-client'
    ]
  },
  runtimeConfig: {
    redis: {
      host: "localhost",
      port: 6379,
    },
    redisLogUrl: 'redis://127.0.0.1:6379/2',
    // see: ThemeConfig
    public: {
      odooBaseImageUrl: "",
      odooBaseUrl: "",
    },
  },
  routeRules: {
    // #TODO: Check whether odoogap-config is working
    /* 
    "/": { swr: true },
    "/icons/**": {
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    },
    "/favicon.ico": {
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    }, */
  },   
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: null,
      globPatterns: ['**/*.{js,json,css,html,ico,svg,png,webp,ico,woff,woff2,ttf,eit,otf}', 'icons/*'],
      globIgnores: ['manifest**.webmanifest'],
      additionalManifestEntries: [
        {
          url: '/offline',
          revision: Math.random().toString(32),
        },
      ],
      navigationPreload: true,
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkOnly',
          options: {
            precacheFallback: {
              fallbackURL: '/offline',
            },
          },
        },
      ],
      cleanupOutdatedCaches: true,
    },
    manifest: {
      name: 'VSF x Nuxt3 (Boilerplate)',
      short_name: 'VSFNuxt3Boilerplate',
      theme_color: '#018937',
      icons: [
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512x512.maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    registerWebManifestInRouteRules: true,
  },
  pruvious: {
    api: {
      routes: {
        'login.post': false,
        'logout.post': false,
        'logout-all.post': false,
        'logout-others.post': false,
        'renew-token.post': false,
      },
    },
    dashboard: {
      baseComponents: {
        misc: {
          QuickActions: './components/DashboardSyncMicrosoftCollections.vue',
        },
      },
    },
    standardMiddleware: {
      client: {
        auth: false,
      },
      server: {
        auth: false,
      },
    },
  },
});
