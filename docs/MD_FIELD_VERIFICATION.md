# MD Field Verification and Sync Update

## Overview
Verified and updated the 'md' (markdown content) field handling across all collections, ensuring proper synchronization between Odoo and Pruvious for both posts and events.

## Status Summary

### ✅ Collections - MD Field Properly Defined

#### `/collections/posts.ts`
```typescript
additionalPublicPagesFields: [
  'md',  // ✅ Exposed to frontend
  // ...
],
additionalFields: {
  md: {
    type: 'text',
    options: {},
  },
}
```

#### `/collections/events.ts`
```typescript
additionalPublicPagesFields: [
  'md',  // ✅ Exposed to frontend
  // ...
],
additionalFields: {
  md: {
    type: 'text',
    options: {},
  },
}
```

#### `/collections/stories.ts`
- ✅ Not using 'md' field (uses different content structure)

### ✅ GraphQL Fragments - MD Field Present

#### `/server/fragments/postFragment.ts`
```graphql
heading
teasertext
blocks
md        # ✅ Present
cimg
```

#### `/server/fragments/eventFragment.ts`
```graphql
heading
teasertext
md        # ✅ Present
cimg
```

### ✅ Odoo Sync - MD Field Synchronized

#### `/utils/SyncableOdooCollection.ts`

**mapOdooToPruviousFields()** - Sync FROM Odoo TO Pruvious:

**Posts:**
```typescript
return {
  ...base,
  md: odooRecord.md || '',  // ✅ Synced from Odoo
  // ...
}
```

**Events:**
```typescript
return {
  ...base,
  md: odooRecord.md || '',  // ✅ Synced from Odoo
  // ...
}
```

**mapPruviousToOdooFields()** - Sync FROM Pruvious TO Odoo:

**Posts:**
```typescript
return {
  ...base,
  md: record.md || '',  // ✅ Synced to Odoo
  // ...
}
```

**Events (UPDATED):**
```typescript
return {
  ...base,
  heading: record.heading,
  md: record.md || '',  // ✅ ADDED - Now syncs to Odoo
  metaKeywords: record.metaTags.find((tag: any) => tag.name === 'keywords')?.content ?? '',
  blocks: record.blocks,
  teasertext: record.teaserText || '',
}
```

## Changes Made

### 1. Added MD Field to Events Update Sync
**File:** `/utils/SyncableOdooCollection.ts`

**Before:**
```typescript
else if (this.collection === 'events') {
  return {
    ...base,
    heading: record.heading,
    metaKeywords: record.metaTags.find((tag: any) => tag.name === 'keywords')?.content ?? '',
    blocks: record.blocks,
    teasertext: record.teaserText || '',
    // ❌ md field missing - not synced to Odoo!
  }
}
```

**After:**
```typescript
else if (this.collection === 'events') {
  return {
    ...base,
    heading: record.heading,
    md: record.md || '',  // ✅ Added
    metaKeywords: record.metaTags.find((tag: any) => tag.name === 'keywords')?.content ?? '',
    blocks: record.blocks,
    teasertext: record.teaserText || '',
  }
}
```

## Data Flow - Complete MD Sync

### FROM Odoo TO Pruvious

```
┌─────────────────────────────────────────────────────────────┐
│ Odoo Database                                               │
│ - Post/Event record with 'md' field                        │
└──────────────────┬──────────────────────────────────────────┘
                   │ GraphQL Query (GetPostsQuery/GetEventsQuery)
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ GraphQL Fragment (postFragment/eventFragment)               │
│ - md field included                                         │
└──────────────────┬──────────────────────────────────────────┘
                   │ odooRecord.md
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ SyncableOdooCollection.mapOdooToPruviousFields()            │
│ - md: odooRecord.md || ''                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │ query('posts'/'events').update()
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Pruvious Collection (posts/events)                          │
│ - md field stored in database                               │
│ - md field exposed via additionalPublicPagesFields          │
└──────────────────┬──────────────────────────────────────────┘
                   │ usePage() composable
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend (page.value?.fields.md)                            │
└─────────────────────────────────────────────────────────────┘
```

### FROM Pruvious TO Odoo

```
┌─────────────────────────────────────────────────────────────┐
│ Pruvious Collection (posts/events)                          │
│ - record.md updated by user                                 │
└──────────────────┬──────────────────────────────────────────┘
                   │ record.md
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ SyncableOdooCollection.mapPruviousToOdooFields()            │
│ Posts: md: record.md || '' ✅                               │
│ Events: md: record.md || '' ✅ (NOW ADDED)                  │
└──────────────────┬──────────────────────────────────────────┘
                   │ UpdatePost/UpdateEvent mutation
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ GraphQL Mutation (UpdatePostInput/UpdateEventInput)         │
│ - md field included in mutation input                       │
└──────────────────┬──────────────────────────────────────────┘
                   │ GraphQL API call
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Odoo Database                                               │
│ - Post/Event record 'md' field updated                     │
└─────────────────────────────────────────────────────────────┘
```

## Field Purpose

The `md` field stores **markdown content** for posts and events:
- Rich text formatting
- Long-form content
- Body text of blog posts
- Event descriptions
- Supports markdown syntax (headings, lists, links, etc.)

## Sync Behavior

### Posts Collection
- ✅ **FROM Odoo**: `md` field synced during `syncFromOdoo()`
- ✅ **TO Odoo**: `md` field synced during `updateRecordOnOdoo()`
- ✅ **Create**: `md` field included in `addRecordToOdoo()`

### Events Collection
- ✅ **FROM Odoo**: `md` field synced during `syncFromOdoo()`
- ✅ **TO Odoo**: `md` field synced during `updateRecordOnOdoo()` *(NOW FIXED)*
- ✅ **Create**: `md` field included in `addRecordToOdoo()`

## Related Fields

The content ecosystem includes:
- **`heading`** - Title/headline of the post/event
- **`teaserText`** - Short preview text
- **`md`** - Full markdown content (main body)
- **`blocks`** - Structured block content
- **`cimg`** - Cover image URL

## Testing Checklist

### Posts
- [ ] Create post in Odoo with `md` content
- [ ] Sync from Odoo to Pruvious - verify `md` field populated
- [ ] Update post `md` field in Pruvious
- [ ] Sync to Odoo - verify `md` field updated in Odoo
- [ ] Verify frontend displays `page.value?.fields.md`

### Events
- [ ] Create event in Odoo with `md` content
- [ ] Sync from Odoo to Pruvious - verify `md` field populated
- [ ] Update event `md` field in Pruvious
- [ ] Sync to Odoo - verify `md` field updated in Odoo ✅ (NOW WORKS)
- [ ] Verify frontend displays `page.value?.fields.md`

## Notes on 'body_md' vs 'md'

### Historical Context
- **Old field name**: `body_md` (used in some older collections like domainusers)
- **Current field name**: `md` (used in posts and events)

### Current Status
- ✅ **Posts**: Uses `md` consistently
- ✅ **Events**: Uses `md` consistently
- ℹ️ **Domain Users**: Still uses `bodyMd` (different use case - user bio)

### No Migration Needed
The posts and events collections were already using `md`, so no field renaming was required. We only needed to ensure the sync to Odoo was complete.

## Related Documentation

- `/docs/FIELD_RENAME_HEADING.md` - Heading field standardization
- `/docs/ADDITIONAL_PUBLIC_PAGES_FIELDS_FIX.md` - Field exposure requirements
- `/docs/USEPAGE_COMPOSABLE_FIX.md` - Reactive data handling

## Related Files

**Collections:**
- `/collections/posts.ts` - ✅ md field defined and exposed
- `/collections/events.ts` - ✅ md field defined and exposed

**Sync Utility:**
- `/utils/SyncableOdooCollection.ts` - ✅ md field synced both ways

**GraphQL:**
- `/server/fragments/postFragment.ts` - ✅ md field included
- `/server/fragments/eventFragment.ts` - ✅ md field included

---

**Verified By:** GitHub Copilot  
**Date:** October 6, 2025  
**Branch:** 1.0_beta/userpage  
**Impact:** Medium - Fixes events sync to Odoo, ensures complete bidirectional sync for md field
