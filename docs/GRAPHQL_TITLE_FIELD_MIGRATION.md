# GraphQL Field Migration: 'heading'/'headline' → 'title'

## Overview
Removed all references to custom 'heading' and 'headline' fields from GraphQL queries, mutations, and Odoo synchronization. All communication with Odoo now exclusively uses the standard Pruvious 'title' field.

## Reason for Change
Odoo no longer supports the 'heading' or 'headline' fields. All title data must be stored and retrieved using the standard 'title' field to maintain compatibility with the Odoo GraphQL API.

## Changes Summary

### 1. Collections - Heading Field Removed

#### `/collections/posts.ts`
```typescript
additionalPublicPagesFields: [
  'author',
  // 'heading',  // ❌ Removed - commented out by user
  'teaserText',
  // ...
],
additionalFields: {
  /* heading: {  // ❌ Removed - commented out by user
    type: 'text',
    options: {},
  }, */
}
```

#### `/collections/events.ts`
```typescript
additionalPublicPagesFields: [
  'editMode',
  // 'heading',  // ❌ Removed - commented out by user
  'templateCode',
  // ...
],
additionalFields: {
  /* heading: {  // ❌ Removed - commented out by user
    type: 'text',
    options: {},
  }, */
}
```

### 2. GraphQL Fragments - Using 'title' Only

#### `/server/fragments/postFragment.ts`
**Before:**
```graphql
  public
  publishDate
  visits
  heading      # ❌ Custom field
  teasertext
  blocks
```

**After:**
```graphql
  public
  publishDate
  visits
  title        # ✅ Standard Pruvious field
  teasertext
  blocks
```

#### `/server/fragments/eventFragment.ts`
**Before:**
```graphql
    version
    editMode
    visibility
    heading      # ❌ Custom field
    teasertext
    md
```

**After:**
```graphql
    version
    editMode
    visibility
    title        # ✅ Standard Pruvious field
    teasertext
    md
```

### 3. Odoo Sync Utility - Using 'title' Field

#### `/utils/SyncableOdooCollection.ts`

**mapOdooToPruviousFields()** - Sync FROM Odoo TO Pruvious:

**Posts (Before):**
```typescript
return {
  ...base,
  title: odooRecord.heading || '',    // ❌ Tried to get 'heading' from Odoo
  heading: odooRecord.heading || '',  // ❌ Tried to set custom field
  // ...
}
```

**Posts (After):**
```typescript
return {
  ...base,
  title: odooRecord.title || '',      // ✅ Gets 'title' from Odoo
  // ...
}
```

**Events (Before):**
```typescript
return {
  ...base,
  title: odooRecord.heading || '',    // ❌ Tried to get 'heading' from Odoo
  heading: odooRecord.heading || '',  // ❌ Tried to set custom field
  // ...
}
```

**Events (After):**
```typescript
return {
  ...base,
  title: odooRecord.title || '',      // ✅ Gets 'title' from Odoo
  // ...
}
```

**mapPruviousToOdooFields()** - Sync FROM Pruvious TO Odoo:

**Posts (Before):**
```typescript
return {
  ...base,
  headline: record.title,    // ❌ Sent as 'headline' to Odoo
  heading: record.heading,   // ❌ Sent custom field
  // ...
}
```

**Posts (After):**
```typescript
return {
  ...base,
  title: record.title,       // ✅ Sends 'title' to Odoo
  // ...
}
```

**Events (Before):**
```typescript
return {
  ...base,
  heading: record.heading,   // ❌ Sent custom field
  // ...
}
```

**Events (After):**
```typescript
return {
  ...base,
  title: record.title,       // ✅ Sends 'title' to Odoo
  // ...
}
```

### 4. Layouts - Using Standard 'title' Field

#### `/layouts/post.vue`
```vue
<Header
  :heading="page?.title"           <!-- ✅ Uses standard title -->
  :teaser="page?.fields?.teaser"
  // ...
/>
```

#### `/layouts/event.vue`
```typescript
// Before
// const heading = page.value?.fields.heading || page.value?.fields.title || 'Event ohne Titel'

// After
const heading = page.value?.title || 'Event ohne Titel'  // ✅ Uses standard title
```

## Data Flow - Complete Title Sync

### FROM Odoo TO Pruvious

```
┌─────────────────────────────────────────────────────────────┐
│ Odoo Database                                               │
│ - Post/Event record with 'title' field                     │
└──────────────────┬──────────────────────────────────────────┘
                   │ GraphQL Query (GetPostsQuery/GetEventsQuery)
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ GraphQL Fragment (postFragment/eventFragment)               │
│ - title field requested                                     │
└──────────────────┬──────────────────────────────────────────┘
                   │ odooRecord.title
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ SyncableOdooCollection.mapOdooToPruviousFields()            │
│ - title: odooRecord.title || ''                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ query('posts'/'events').update()
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Pruvious Collection (posts/events)                          │
│ - title field (standard Pruvious field)                     │
└──────────────────┬──────────────────────────────────────────┘
                   │ usePage() composable
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Frontend (page?.title or page.value?.title)                 │
└─────────────────────────────────────────────────────────────┘
```

### FROM Pruvious TO Odoo

```
┌─────────────────────────────────────────────────────────────┐
│ Pruvious Collection (posts/events)                          │
│ - record.title (standard Pruvious field)                    │
└──────────────────┬──────────────────────────────────────────┘
                   │ record.title
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ SyncableOdooCollection.mapPruviousToOdooFields()            │
│ Posts: title: record.title ✅                               │
│ Events: title: record.title ✅                              │
└──────────────────┬──────────────────────────────────────────┘
                   │ UpdatePost/UpdateEvent mutation
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ GraphQL Mutation (UpdatePostInput/UpdateEventInput)         │
│ - title field in mutation input                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ GraphQL API call
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Odoo Database                                               │
│ - Post/Event record 'title' field updated                  │
└─────────────────────────────────────────────────────────────┘
```

## Field Comparison

| Field Name | Status | Location | Purpose |
|------------|--------|----------|---------|
| `heading` | ❌ Removed | Custom field in posts/events | Previously used for titles |
| `headline` | ❌ Removed | GraphQL (Odoo) | Previously used for titles |
| `title` | ✅ Active | Standard Pruvious field | Standard page title |

## Breaking Changes

### ⚠️ Database Migration Required

If you have existing data with the 'heading' field:

1. **Backup your data first!**
2. **Migrate heading data to title field:**
   ```sql
   -- For posts (if heading field exists)
   UPDATE posts 
   SET title = COALESCE(NULLIF(title, ''), heading) 
   WHERE heading IS NOT NULL AND heading != '';

   -- For events (if heading field exists)
   UPDATE events 
   SET title = COALESCE(NULLIF(title, ''), heading) 
   WHERE heading IS NOT NULL AND heading != '';
   ```

3. **Restart Nuxt dev server** - Pruvious rebuilds collection schemas
4. **Re-sync from Odoo** - Ensure Odoo uses 'title' field
5. **Verify all records** - Check that titles display correctly

### Odoo Schema Requirements

Your Odoo GraphQL schema **MUST** now include:
- ✅ `title` field in Post type
- ✅ `title` field in Event type
- ❌ No `heading` or `headline` fields

If your Odoo still has `heading`/`headline` fields, you need to:
1. Migrate data in Odoo from `heading`/`headline` to `title`
2. Update Odoo GraphQL schema to remove old fields
3. Redeploy Odoo GraphQL API

## Testing Checklist

### Posts
- [ ] Sync from Odoo - verify `title` field populated (not `heading`)
- [ ] Create new post in Pruvious with title
- [ ] Update post title in Pruvious
- [ ] Sync to Odoo - verify `title` field updated (not `headline`)
- [ ] Verify frontend displays `page?.title` correctly
- [ ] Check GraphQL queries don't reference `heading` or `headline`

### Events
- [ ] Sync from Odoo - verify `title` field populated (not `heading`)
- [ ] Create new event in Pruvious with title
- [ ] Update event title in Pruvious
- [ ] Sync to Odoo - verify `title` field updated (not `heading`)
- [ ] Verify frontend displays `page?.title` or `page.value?.title` correctly
- [ ] Check GraphQL queries don't reference `heading` or `headline`

### GraphQL Verification
- [ ] Run GetPostsQuery - should include `title` field
- [ ] Run GetEventsQuery - should include `title` field
- [ ] Run UpdatePost mutation - should accept `title` input
- [ ] Run UpdateEvent mutation - should accept `title` input
- [ ] Verify no GraphQL errors about missing `heading` or `headline` fields

## Files Modified

**Collections:**
- `/collections/posts.ts` - Removed heading field (commented out by user)
- `/collections/events.ts` - Removed heading field (commented out by user)

**GraphQL Fragments:**
- `/server/fragments/postFragment.ts` - Changed `heading` → `title`
- `/server/fragments/eventFragment.ts` - Changed `heading` → `title`

**Sync Utility:**
- `/utils/SyncableOdooCollection.ts` - Updated all `heading`/`headline` references to `title`

**Layouts:**
- `/layouts/post.vue` - Using `page?.title`
- `/layouts/event.vue` - Using `page.value?.title`

**GraphQL Queries/Mutations (auto-updated via fragments):**
- `/server/queries/GetPostsQuery.ts`
- `/server/queries/GetEventsQuery.ts`
- `/server/mutations/UpdatePost.ts`
- `/server/mutations/UpdateEvent.ts`
- `/server/mutations/AddPost.ts`

## Related Documentation

- `/docs/FIELD_RENAME_HEADING.md` - Previous heading field standardization (now obsolete)
- `/docs/ADDITIONAL_PUBLIC_PAGES_FIELDS_FIX.md` - Field exposure requirements
- `/docs/USEPAGE_COMPOSABLE_FIX.md` - Reactive data handling
- `/docs/MD_FIELD_VERIFICATION.md` - MD field sync verification

## Notes

### Why 'title' Instead of 'heading'?
1. **Standard Pruvious field** - Built into all page-like collections
2. **Odoo compatibility** - Odoo GraphQL API uses 'title'
3. **Consistency** - Matches standard CMS terminology
4. **No custom field needed** - Reduces complexity

### Migration from Previous Setup
If you followed `/docs/FIELD_RENAME_HEADING.md`, you need to:
1. Remove the custom `heading` field from collections
2. Update all references to use standard `title` field
3. Re-sync data between Odoo and Pruvious

---

**Updated By:** GitHub Copilot  
**Date:** October 6, 2025  
**Branch:** 1.0_beta/userpage  
**Impact:** High - Requires Odoo schema update and data migration
