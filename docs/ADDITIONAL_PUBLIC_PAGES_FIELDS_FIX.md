# additionalPublicPagesFields Fix - Missing Header Fields

## Problem Description

Even after fixing the `usePage()` reactive reference issue, the `headerType` and `headerSize` fields were still not available in the page object. The fields were present in the database and defined in the collections, but `page.value?.fields` only contained some fields like `author`, `heading`, `imgTmp`, and `teaser` - NOT `headerType` and `headerSize`.

**Symptoms:**
- ✅ `page.value?.fields.heading` - Available
- ✅ `page.value?.fields.imgTmp` - Available  
- ✅ `page.value?.fields.teaser` - Available
- ❌ `page.value?.fields.headerType` - **Missing** (defaulted to 'simple')
- ❌ `page.value?.fields.headerSize` - **Missing** (defaulted to 'mini')

## Root Cause

In Pruvious page-like collections, **additional fields are NOT automatically exposed** to public pages. You must explicitly list which additional fields should be available through the `usePage()` composable by adding them to the `additionalPublicPagesFields` array.

From [Pruvious documentation on page-like collections](https://pruvious.com/docs/collections#page-like-collections):

> The `additionalPublicPagesFields` option specifies which additional fields should be publicly accessible in the page data. Only fields listed here will be available through `usePage()`.

## Solution

Add `additionalPublicPagesFields` array to all page-like collections, including the missing `headerType`, `headerSize`, and `formatOptions` fields.

### Files Fixed

#### 1. `/collections/stories.ts`

**Before:**
```typescript
const stories = pageLikeCollection({
  name: 'stories',
  icon: 'Pencil',
  allowedLayouts: ['default'],
  additionalPublicPagesFields: [
    'author',
    'imgTmp',
    'heading',
    'teaser',
    'inBanner',
    // ... other fields
    // ❌ headerType NOT listed
    // ❌ headerSize NOT listed
    // ❌ formatOptions NOT listed
  ],
  additionalFields: {
    // ... headerType, headerSize defined here
  }
})
```

**After:**
```typescript
const stories = pageLikeCollection({
  name: 'stories',
  icon: 'Pencil',
  allowedLayouts: ['default'],
  additionalPublicPagesFields: [
    'author',
    'imgTmp',
    'heading',
    'teaser',
    'headerType',      // ✅ Added
    'headerSize',      // ✅ Added
    'formatOptions',   // ✅ Added
    'inBanner',
    // ... other fields
  ],
  additionalFields: {
    // ... definitions remain the same
  }
})
```

#### 2. `/collections/posts.ts`

**Before:**
```typescript
const posts = pageLikeCollection({
  name: 'posts',
  pathPrefix: 'blog',
  icon: 'Pin',
  allowedLayouts: ['post'],
  // ❌ No additionalPublicPagesFields at all!
  additionalFields: {
    // ... headerType, headerSize defined here
  }
})
```

**After:**
```typescript
const posts = pageLikeCollection({
  name: 'posts',
  pathPrefix: 'blog',
  icon: 'Pin',
  allowedLayouts: ['post'],
  additionalPublicPagesFields: [    // ✅ Added entire array
    'author',
    'overline',
    'teaserText',
    'md',
    'cimg',
    'headerType',
    'headerSize',
    'formatOptions',
  ],
  additionalFields: {
    // ... definitions remain the same
  }
})
```

#### 3. `/collections/events.ts`

**Before:**
```typescript
const events = pageLikeCollection({
  name: 'events',
  pathPrefix: 'events',
  icon: 'CalendarEvent',
  allowedLayouts: ['event'],
  // ❌ No additionalPublicPagesFields at all!
  additionalFields: {
    // ... headerType, headerSize defined here
  }
})
```

**After:**
```typescript
const events = pageLikeCollection({
  name: 'events',
  pathPrefix: 'events',
  icon: 'CalendarEvent',
  allowedLayouts: ['event'],
  additionalPublicPagesFields: [    // ✅ Added entire array
    'editMode',
    'overline',
    'templateCode',
    'teaserText',
    'md',
    'cimg',
    'headerType',
    'headerSize',
    'formatOptions',
    'dateBegin',
    'dateEnd',
  ],
  additionalFields: {
    // ... definitions remain the same
  }
})
```

## How Pruvious Page-Like Collections Work

### Field Visibility Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Collection Definition (e.g., posts.ts)                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  additionalFields: {                                     │
│    headerType: { ... },      ← Defines field in DB      │
│    headerSize: { ... },                                  │
│  }                                                       │
│                                                           │
│  additionalPublicPagesFields: [                          │
│    'headerType',             ← Exposes to usePage()     │
│    'headerSize',                                         │
│  ]                                                       │
│                                                           │
└─────────────────────────────────────────────────────────┘
         ↓                              ↓
    [Database]                    [Public API]
         ↓                              ↓
   All fields stored          Only exposed fields available
   in the database            through usePage() composable
```

### Why Two Lists?

1. **`additionalFields`** - Defines the schema and behavior
   - Creates database columns
   - Defines field types and validation
   - Sets up dashboard UI
   - Handles all CRUD operations

2. **`additionalPublicPagesFields`** - Controls public visibility
   - Security: Prevents exposing sensitive fields
   - Performance: Reduces payload size
   - Explicit control over public API surface

### Example: Protected vs Public Fields

```typescript
additionalFields: {
  // Internal field - stored but not exposed
  internalNotes: { type: 'text' },
  
  // Public field - must be in additionalPublicPagesFields
  headerType: { type: 'select' },
}

additionalPublicPagesFields: [
  'headerType',  // ✅ Exposed to frontend
  // 'internalNotes' NOT listed - remains private
]
```

## Testing After Fix

### Before Fix
```typescript
const page = usePage()
console.log(page.value?.fields)
// Output:
// {
//   author: {...},
//   heading: "My Story",
//   imgTmp: "/uploads/hero.jpg",
//   teaser: "This is a story",
//   // ❌ headerType: undefined
//   // ❌ headerSize: undefined
// }
```

### After Fix
```typescript
const page = usePage()
console.log(page.value?.fields)
// Output:
// {
//   author: {...},
//   heading: "My Story",
//   imgTmp: "/uploads/hero.jpg",
//   teaser: "This is a story",
//   headerType: "columns",      // ✅ Now available!
//   headerSize: "prominent",    // ✅ Now available!
//   formatOptions: "{...}",     // ✅ Now available!
// }
```

## Common Pitfalls

### ❌ Defining field but not exposing it
```typescript
additionalFields: {
  myNewField: { type: 'text' },
}
// Missing from additionalPublicPagesFields
// Result: Field exists in DB but NOT available via usePage()
```

### ✅ Correct pattern
```typescript
additionalPublicPagesFields: [
  'myNewField',  // Expose it
],
additionalFields: {
  myNewField: { type: 'text' },  // Define it
}
```

## Restart Required

**Important:** After modifying collection definitions, you must restart the Nuxt dev server:

```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

Pruvious rebuilds the collection schema on server start. Changes won't take effect until restart.

## Verification Checklist

After applying this fix and restarting:

- [ ] Restart Nuxt dev server
- [ ] Navigate to a story/post/event page
- [ ] Open browser DevTools console
- [ ] Check `page.value?.fields.headerType` - should NOT be undefined
- [ ] Check `page.value?.fields.headerSize` - should NOT be undefined
- [ ] Verify Header component receives correct props
- [ ] Test setting `headerType: 'columns'` - should render TextImage
- [ ] Test setting `headerSize: 'prominent'` - should render correct height

## Related Issues

This fix works in combination with:
1. **usePage() reactive reference fix** (see `USEPAGE_COMPOSABLE_FIX.md`)
2. **TextImage component integration** (see `TEXTIMAGE_HEADER_INTEGRATION.md`)

All three fixes are required for the complete feature to work:
- Fix 1: Keep `usePage()` reactive
- Fix 2: Expose fields in `additionalPublicPagesFields`
- Fix 3: Use fields in Header.vue to render TextImage

## Related Documentation

- [Pruvious Collections](https://pruvious.com/docs/collections)
- [Pruvious Page-like Collections](https://pruvious.com/docs/collections#page-like-collections)
- [Pruvious usePage() Composable](https://pruvious.com/docs/composables#usepage)
- [Pruvious Tutorial - Blog](https://pruvious.com/tutorial/05-blog)

---

**Fixed By:** GitHub Copilot  
**Date:** October 6, 2025  
**Branch:** 1.0_beta/userpage  
**Impact:** Critical - Exposes headerType/headerSize fields to frontend
