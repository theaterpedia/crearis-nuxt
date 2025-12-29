# 🏠 Dasei Home Application

The main dasei.eu website - a Nuxt Content-based static site generator.

## 🎯 Overview

This is the primary web application for dasei.eu, built with:
- **Framework:** Nuxt 3.13.2
- **Content:** Nuxt Content v2.13.1
- **UI Library:** @crearis/ui (workspace dependency)
- **Theme:** @crearis/theme (workspace dependency)
- **Build Mode:** Static Site Generation (SSG)

## 📁 Structure

```
apps/home/
├── content/              # Markdown content files
│   ├── blog/            # Blog posts
│   ├── agenda/          # Events and agenda
│   └── ...
├── components/          # Vue components
├── layouts/             # Layout components
├── pages/               # Nuxt pages
├── public/              # Static assets
├── scripts/             # Deployment scripts
│   └── dasei_rebuild_restart.sh
├── nuxt.config.ts       # Nuxt configuration
├── package.json         # App dependencies
└── .output/             # Build output (after build)
```

## 🚀 Development

### Local Development

```bash
# From workspace root
cd /opt/dasei/source
pnpm dev:home

# Or from app directory
cd /opt/dasei/source/apps/home
pnpm dev
```

This starts a development server with hot module replacement (HMR).

### Build for Production

```bash
# From workspace root (recommended)
cd /opt/dasei/source
pnpm build:home

# This runs the build command and outputs to:
# /opt/dasei/source/apps/home/.output/
```

### Preview Production Build

```bash
cd /opt/dasei/source/apps/home
pnpm preview
```

## 📦 Dependencies

### Workspace Dependencies

This app depends on workspace packages:
- `@crearis/ui` - UI component library (must build first)
- `@crearis/theme` - Theme layer extending UI

These are built automatically via pnpm postinstall hooks.

### Key External Dependencies

- `nuxt` (3.13.2) - Framework
- `@nuxt/content` (^2.13.1) - Content management
- `@nuxt/image` (^1.7.0) - Image optimization
- `radix-vue` (^1.9.11) - UI primitives
- `nuxt-viewport` (^2.2.0) - Responsive utilities

## 🔧 Configuration

### Nuxt Config

See `nuxt.config.ts` for configuration:

```typescript
export default defineNuxtConfig({
  content: { documentDriven: true },
  extends: ['@crearis/theme'],
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/blog', '/agenda'],
      ignore: ['/api', '/details', '/cart']
    }
  }
})
```

### Build Configuration

The app is configured for static site generation:
- All content is pre-rendered at build time
- No server-side database queries
- Lightweight Nitro server serves static files

## 📝 Content Management

### Adding Content

Create markdown files in `content/` directory:

```bash
# Blog post
nano content/blog/my-new-post.md

# Event
nano content/agenda/upcoming-event.md
```

### Markdown Format

```markdown
---
title: My Post Title
description: Post description
date: 2025-11-25
tags: [tag1, tag2]
---

# Content goes here

Your markdown content...
```

### Content Updates

After adding/editing content:

```bash
# Rebuild and deploy
bash scripts/dasei_rebuild_restart.sh
```

## 🚀 Deployment

### Production Server

The application is deployed to `/opt/dasei/` on the production server.

### Initial Deployment

See `/opt/dasei/docs/N-D00-Deployment-Guide-Dasei.md` for initial setup.

### Quick Rebuild (Development)

```bash
# From the scripts directory
cd /opt/dasei/source/apps/home/scripts
bash dasei_rebuild_restart.sh
```

**Options:**
- `--deps` - Rebuild with dependencies
- `--ui` - Rebuild UI package only
- `--no-restart` - Build without PM2 restart

### What Gets Deployed

1. **Build output:** `apps/home/.output/`
2. **Synced to:** `/opt/dasei/live/.output/`
3. **Served by:** PM2 process running Nitro server
4. **Port:** 3200
5. **Proxy:** Nginx reverse proxy with SSL

## 🔍 Scripts

### Development Scripts

Located in `apps/home/scripts/`:

- `dasei_rebuild_restart.sh` - Fast rebuild and restart

### Server Scripts

Located in `source/scripts/` (workspace root):

- `dasei_deploy_initial.sh` - Initial deployment
- `dasei_configure_domain.sh` - Domain/SSL setup
- `switch-cache-mode.sh` - Cache mode switcher

## 📊 Build Process

```
┌─────────────────────────────────┐
│ 1. pnpm install                 │
│    └─> builds @crearis/ui       │
└─────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ 2. pnpm build:home              │
│    └─> nuxt build               │
│        └─> outputs to .output/  │
└─────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ 3. rsync to /opt/dasei/live/    │
└─────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ 4. PM2 restart/reload           │
└─────────────────────────────────┘
```

## 🛠️ Troubleshooting

### Build Fails

```bash
# Clean and rebuild
cd /opt/dasei/source
rm -rf node_modules packages/*/node_modules apps/home/node_modules
pnpm install
pnpm build:home
```

### UI Components Not Found

```bash
# Rebuild UI package
cd /opt/dasei/source
pnpm --filter=ui build
pnpm build:home
```

### Content Not Updating

1. Check markdown file saved
2. Rebuild application: `bash scripts/dasei_rebuild_restart.sh`
3. Clear browser cache: Ctrl+Shift+R
4. Check cache mode: Fast-changing vs Stable-production

## 📚 Documentation

- **Deployment Guide:** `/opt/dasei/docs/N-D00-Deployment-Guide-Dasei.md`
- **Quick Reference:** `/opt/dasei/docs/N-D01-Quick-Reference-Dasei.md`
- **Scripts README:** `/opt/dasei/source/scripts/README.md`

## 🔗 Resources

- [Nuxt Documentation](https://nuxt.com)
- [Nuxt Content Documentation](https://content.nuxtjs.org)
- [Radix Vue Documentation](https://www.radix-vue.com)

---

**Repository:** https://github.com/theaterpedia/crearis-nuxt  
**Branch:** dasei  
**Production:** https://dasei.eu
