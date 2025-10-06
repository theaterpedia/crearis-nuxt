# Field Rename: 'overline'/'headline' → 'heading'

## Overview
Standardized the field name across all collections to use `heading` consistently, replacing previous uses of `overline` and `headline`. This ensures consistency between Pruvious collections, Odoo synchronization, and GraphQL queries.

## Changes Summary

### 1. Collections Updated

#### `/collections/posts.ts`
- **additionalPublicPagesFields**: `'overline'` → `'heading'`
- **additionalFields**: `overline: {...}` → `heading: {...}`

#### `/collections/events.ts`
- **additionalPublicPagesFields**: `'headline'` → `'heading'`
- **additionalFields**: `headline: {...}` → `heading: {...}`

#### `/collections/stories.ts`
- ✅ Already used `heading` - no changes needed

### 2. Odoo Sync Utility Updated

#### `/utils/SyncableOdooCollection.ts`

**mapOdooToPruviousFields()** - Sync FROM Odoo TO Pruvious:
```typescript
// Posts
title: odooRecord.heading || '',
heading: odooRecord.heading || '',  // ✅ Added
// overline: odooRecord.overline || '',  // ❌ Removed

// Events  
title: odooRecord.heading || '',
heading: odooRecord.heading || '',  // ✅ Added
// overline: odooRecord.overline || '',  // ❌ Removed
```

**mapPruviousToOdooFields()** - Sync FROM Pruvious TO Odoo:
```typescript
// Posts
heading: record.heading,  // ✅ Added
// overline: record.overline,  // ❌ Removed

// Events
heading: record.heading,  // ✅ Added
// name: record.title,  // ❌ Removed
// overline: record.overline,  // ❌ Removed
```

### 3. GraphQL Fragments Updated

#### `/server/fragments/eventFragment.ts`
```graphql
# Before
headline
overline

# After
heading
```

#### `/server/fragments/postFragment.ts`
```graphql
# Before
headline
overline

# After
heading
```

### 4. GraphQL Queries & Mutations (Auto-updated)
These files use the fragments, so they automatically get the updated field:
- ✅ `/server/queries/GetPostsQuery.ts`
- ✅ `/server/queries/GetEventsQuery.ts`
- ✅ `/server/mutations/UpdatePost.ts`
- ✅ `/server/mutations/UpdateEvent.ts`
- ✅ `/server/mutations/AddPost.ts`

### 5. Layout Files Updated

#### `/layouts/post.vue`
```typescript
// Before
const heading = page.value?.fields.title 
  ? page.value?.fields.overline 
    ? `${page.value?.fields.overline} **${page.value?.fields.title}**`
    : page.value?.fields.title
  : 'Post ohne Titel'

// After
const heading = page.value?.fields.heading || page.value?.fields.title || 'Post ohne Titel'
```

#### `/layouts/event.vue`
```typescript
// Before
const heading = page.value?.fields.title 
  ? page.value?.fields.overline 
    ? `${page.value?.fields.overline} **${page.value?.fields.title}**`
    : page.value?.fields.title
  : 'Event ohne Titel'

// After
const heading = page.value?.fields.heading || page.value?.fields.title || 'Event ohne Titel'
```

#### `/layouts/contact.vue`
```typescript
// Before
const heading = page.value?.fields.title
  ? page.value?.fields.overline
    ? `${page.value?.fields.overline} **${page.value?.fields.title}**`
    : page.value?.fields.title
  : 'Contact ohne Titel'

// After
const heading = page.value?.fields.heading || page.value?.fields.title || 'Contact ohne Titel'
```

## Field Hierarchy

The layouts now follow this fallback order:
1. **`heading`** - Custom field from collection (primary)
2. **`title`** - Standard Pruvious page title (fallback)
3. **Default string** - Last resort (e.g., 'Post ohne Titel')

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Odoo Database                                               │
│ - heading field                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ GraphQL Query (GetPostsQuery/GetEventsQuery)
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ GraphQL Fragment (postFragment/eventFragment)               │
│ - heading field                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ SyncableOdooCollection.mapOdooToPruviousFields()
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Pruvious Collection (posts/events/stories)                  │
│ - heading field (defined in additionalFields)               │
│ - heading field (exposed in additionalPublicPagesFields)    │
└──────────────────┬──────────────────────────────────────────┘
                   │ usePage() composable
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Layout (post.vue/event.vue)                                 │
│ - page.value?.fields.heading                                │
└──────────────────┬──────────────────────────────────────────┘
                   │ Prop binding
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Header Component                                            │
│ - :heading="page?.fields?.heading"                          │
└─────────────────────────────────────────────────────────────┘
```

## Reverse Flow (Pruvious → Odoo)

```
┌─────────────────────────────────────────────────────────────┐
│ Pruvious Collection                                         │
│ - record.heading                                            │
└──────────────────┬──────────────────────────────────────────┘
                   │ SyncableOdooCollection.mapPruviousToOdooFields()
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ GraphQL Mutation Input (UpdatePostInput/UpdateEventInput)   │
│ - heading field                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ UpdatePost/UpdateEvent mutation
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Odoo Database                                               │
│ - heading field updated                                     │
└─────────────────────────────────────────────────────────────┘
```

## Why This Change?

### Before: Inconsistent Naming
- `posts.ts` used `overline`
- `events.ts` used `headline`
- `stories.ts` used `heading`
- GraphQL fragments used both `headline` and `overline`

### After: Consistent Naming
- All collections use `heading`
- All GraphQL fragments use `heading`
- All Odoo sync mappings use `heading`
- All layouts reference `heading`

## Breaking Changes

⚠️ **Database Migration Required**

After these changes, you need to:

1. **Restart Nuxt dev server** - Pruvious rebuilds collection schemas
2. **Update existing records** - Migrate data from old field names to `heading`
3. **Update Odoo schema** - Ensure Odoo GraphQL API uses `heading` field
4. **Clear cache** - Clear any cached query results

### Migration SQL (if needed)
```sql
-- For posts collection
UPDATE posts SET heading = overline WHERE heading IS NULL;

-- For events collection  
UPDATE events SET heading = headline WHERE heading IS NULL;
```

## Testing Checklist

- [ ] Restart Nuxt dev server
- [ ] Create new post with `heading` value
- [ ] Verify post displays correct heading in layout
- [ ] Sync post from Odoo → Pruvious (check `heading` field populated)
- [ ] Update post in Pruvious, sync to Odoo (check `heading` field updated)
- [ ] Create new event with `heading` value
- [ ] Verify event displays correct heading in layout
- [ ] Sync event from Odoo → Pruvious (check `heading` field populated)
- [ ] Update event in Pruvious, sync to Odoo (check `heading` field updated)
- [ ] Verify stories still work with `heading` field

## Related Files

**Collections:**
- `/collections/posts.ts`
- `/collections/events.ts`
- `/collections/stories.ts`

**Sync Utility:**
- `/utils/SyncableOdooCollection.ts`

**GraphQL:**
- `/server/fragments/postFragment.ts`
- `/server/fragments/eventFragment.ts`
- `/server/queries/GetPostsQuery.ts`
- `/server/queries/GetEventsQuery.ts`
- `/server/mutations/UpdatePost.ts`
- `/server/mutations/UpdateEvent.ts`
- `/server/mutations/AddPost.ts`

**Layouts:**
- `/layouts/post.vue`
- `/layouts/event.vue`
- `/layouts/contact.vue`

## Related Documentation

- `/docs/ADDITIONAL_PUBLIC_PAGES_FIELDS_FIX.md` - Field exposure requirements
- `/docs/USEPAGE_COMPOSABLE_FIX.md` - Reactive data handling
- `/docs/TEXTIMAGE_HEADER_INTEGRATION.md` - Header component integration

---

**Updated By:** GitHub Copilot  
**Date:** October 6, 2025  
**Branch:** 1.0_beta/userpage  
**Impact:** High - Affects data sync between Odoo and Pruvious, requires Odoo schema update
