# usePage() Composable Fix - Reactive Data Issue

## Problem Description

In all layout files (`post.vue`, `default.vue`, `contact.vue`, `event.vue`), the `usePage()` composable was being immediately unwrapped with `unref()`:

```typescript
const page = unref(usePage()) // ❌ Wrong - loses reactivity
```

This caused **critical issues**:
1. **Props received default values instead of database values** - Even when a post was configured with `headerType: 'columns'` and `headerSize: 'prominent'`, the Header component would receive the defaults (`'simple'` and `'mini'`)
2. **Data not available during initial render** - The page data wasn't loaded yet when `unref()` was called
3. **No reactivity** - Changes to page data wouldn't trigger updates

## Root Cause

According to [Pruvious documentation](https://pruvious.com/docs/composables#usepage):

> The `usePage()` composable returns a **reactive reference** (`Ref<PruviousPage | null>`) that is populated during SSR or client-side navigation.

When you call `unref()` immediately, you're capturing the **initial state** (usually `null` or default values) before the actual page data is loaded. This snapshot doesn't update when the real data arrives.

## Solution

Keep `page` as a reactive reference and access it with `.value` in the script:

```typescript
// ✅ Correct - maintains reactivity
const page = usePage()

// Access fields in script with .value
const heading = page.value?.fields.title
const imgTmp = page.value?.fields.imgTmp
const headerType = page.value?.fields.headerType

// In template, Vue automatically unwraps refs
<Header
  :headerType="page?.fields?.headerType"
  :headerSize="page?.fields?.headerSize"
/>
```

## Files Fixed

### 1. `/layouts/post.vue`
**Before:**
```typescript
const page = unref(usePage())
const heading = page?.fields.title ? ... : 'Post ohne Titel'
const imgTmp = page?.fields.imgTmp
const scrollBreak = page?.fields.headerSize === 'full' ? 400 : 250
```

**After:**
```typescript
const page = usePage()
const heading = page.value?.fields.title ? ... : 'Post ohne Titel'
const imgTmp = page.value?.fields.imgTmp
const scrollBreak = page.value?.fields.headerSize === 'full' ? 400 : 250
```

### 2. `/layouts/default.vue`
**Before:**
```typescript
const page = unref(usePage())
const showHeader = page?.fields?.imgTmp && page?.fields?.headerType !== 'simple'
const scrollBreak = page?.fields.headerSize === 'full' ? 400 : 250
```

**After:**
```typescript
const page = usePage()
const showHeader = page.value?.fields?.imgTmp && page.value?.fields?.headerType !== 'simple'
const scrollBreak = page.value?.fields.headerSize === 'full' ? 400 : 250
```

### 3. `/layouts/contact.vue`
Fixed same pattern - removed `unref()` and added `.value` access

### 4. `/layouts/event.vue`
Fixed same pattern - removed `unref()` and added `.value` access

## How Vue Refs Work in Templates vs Script

| Context | Syntax | Auto-unwrap? |
|---------|--------|--------------|
| **Template** | `{{ page?.fields?.title }}` | ✅ Yes - Vue automatically unwraps refs |
| **Script** | `page.value?.fields.title` | ❌ No - must use `.value` |
| **Props binding** | `:headerType="page?.fields?.headerType"` | ✅ Yes - auto-unwrapped |

**Why this works:**
- Templates in Vue 3 have built-in ref unwrapping
- Script code requires explicit `.value` access
- Props passed to components are automatically unwrapped

## Testing Checklist

After this fix, verify:

- [x] TypeScript compilation errors resolved
- [ ] Post with `headerType: 'columns'` renders TextImage component
- [ ] Post with `headerType: 'cover'` renders Hero component  
- [ ] Post with `headerSize: 'prominent'` shows correct height
- [ ] Post with `headerSize: 'mini'` shows correct height
- [ ] Default values ('simple', 'mini') only used when fields are empty
- [ ] Page data reactively updates on navigation
- [ ] SSR renders correct initial values

## Related Documentation

- [Pruvious usePage() Composable](https://pruvious.com/docs/composables#usepage)
- [Pruvious Page-like Collections](https://pruvious.com/docs/collections#page-like-collections)
- [Pruvious Layouts](https://pruvious.com/docs/layouts)
- [Pruvious Tutorial - Blog](https://pruvious.com/tutorial/05-blog)
- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)

## Why This Pattern Exists

The `usePage()` composable is designed to work across:
1. **Server-Side Rendering (SSR)** - Pre-renders page with data
2. **Client-Side Navigation** - Updates reactively when navigating
3. **Hydration** - Seamlessly connects SSR to client state

Keeping it as a Ref ensures the data flows correctly through all these phases.

## Alternative Approach (Not Recommended)

You could use `toRefs()` to destructure individual reactive properties:

```typescript
const page = usePage()
const { fields } = toRefs(page.value || {})
const headerType = fields.value?.headerType
```

However, this is more verbose and doesn't provide significant benefits over the simple `.value` access pattern.

---

**Fixed By:** GitHub Copilot  
**Date:** October 6, 2025  
**Branch:** 1.0_beta/userpage  
**Impact:** Critical - Fixes prop passing for all page layouts
