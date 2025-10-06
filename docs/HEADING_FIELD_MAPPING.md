# Heading Field Mapping: Odoo 'heading' ↔ Pruvious 'title'

## Overview
Established a consistent mapping between Odoo's 'heading' field and Pruvious's standard 'title' field. This allows Odoo to use its preferred field name while Pruvious uses the standard CMS field name.

## Field Mapping Strategy

```
┌─────────────────┐              ┌─────────────────┐
│  Odoo Database  │              │    Pruvious     │
│                 │              │                 │
│  'heading'      │ ◄─────────► │    'title'      │
│  field          │   Mapping    │    field        │
└─────────────────┘              └─────────────────┘
```

**Key Principle:**
- **Odoo side**: Always uses `heading` field name
- **Pruvious side**: Always uses `title` field name (standard Pruvious field)
- **Mapping**: Happens in `SyncableOdooCollection.ts`

## Comment Convention

All mapping locations include this comment:
```typescript
// Simplified heading-logic > could be extended to fullstyle headings
```

This indicates where the mapping occurs and notes that the system could be extended in the future to support more complex heading structures (e.g., separate heading, overline, subtitle fields).

## Implementation Details

### 1. GraphQL Fragments - Query 'heading' from Odoo

#### `/server/fragments/postFragment.ts`
```typescript
// Simplified heading-logic > could be extended to fullstyle headings
// Odoo uses 'heading' field, which gets mapped to Pruvious 'title' field in SyncableOdooCollection
export default `
  cid
  id
  // ...
  heading       // ✅ Query 'heading' from Odoo
  teasertext
  blocks
  // ...
`
```

#### `/server/fragments/eventFragment.ts`
```typescript
// Simplified heading-logic > could be extended to fullstyle headings
// Odoo uses 'heading' field, which gets mapped to Pruvious 'title' field in SyncableOdooCollection
export default `
  cid
  slug
  // ...
  heading       // ✅ Query 'heading' from Odoo
  teasertext
  md
  // ...
`
```

### 2. Odoo → Pruvious Sync (mapOdooToPruviousFields)

#### Posts Collection
```typescript
if (this.collection === 'posts') {
  return {
    ...base,
    // Simplified heading-logic > could be extended to fullstyle headings
    // Map Odoo 'heading' field to Pruvious 'title' field
    title: odooRecord.heading || '',  // ✅ Odoo 'heading' → Pruvious 'title'
    // ...
  }
}
```

#### Events Collection
```typescript
else if (this.collection === 'events') {
  return {
    ...base,
    // Simplified heading-logic > could be extended to fullstyle headings
    // Map Odoo 'heading' field to Pruvious 'title' field
    title: odooRecord.heading || '',  // ✅ Odoo 'heading' → Pruvious 'title'
    // ...
  }
}
```

### 3. Pruvious → Odoo Sync (mapPruviousToOdooFields)

#### Posts Collection
```typescript
if (this.collection === 'posts') {
  return {
    ...base,
    // Simplified heading-logic > could be extended to fullstyle headings
    // Map Pruvious 'title' field to Odoo 'heading' field
    heading: record.title,  // ✅ Pruvious 'title' → Odoo 'heading'
    // ...
  }
}
```

#### Events Collection
```typescript
else if (this.collection === 'events') {
  return {
    ...base,
    // Simplified heading-logic > could be extended to fullstyle headings
    // Map Pruvious 'title' field to Odoo 'heading' field
    heading: record.title,  // ✅ Pruvious 'title' → Odoo 'heading'
    // ...
  }
}
```

## Data Flow with Mapping

### FROM Odoo TO Pruvious

```
┌─────────────────────────────────────────────────────────────┐
│ Odoo Database                                               │
│ - Post/Event with 'heading' field                          │
└──────────────────┬──────────────────────────────────────────┘
                   │ GraphQL Query
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ GraphQL Fragment (postFragment/eventFragment)               │
│ - Requests 'heading' field from Odoo                        │
└──────────────────┬──────────────────────────────────────────┘
                   │ odooRecord.heading
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ SyncableOdooCollection.mapOdooToPruviousFields()            │
│ 📍 MAPPING POINT 1                                          │
│ // Simplified heading-logic > could be extended             │
│ title: odooRecord.heading || ''                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ Pruvious 'title' field
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Pruvious Collection (posts/events)                          │
│ - Stores in standard 'title' field                          │
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
│ - User edits standard 'title' field                         │
└──────────────────┬──────────────────────────────────────────┘
                   │ record.title
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ SyncableOdooCollection.mapPruviousToOdooFields()            │
│ 📍 MAPPING POINT 2                                          │
│ // Simplified heading-logic > could be extended             │
│ heading: record.title                                       │
└──────────────────┬──────────────────────────────────────────┘
                   │ Odoo 'heading' field
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ GraphQL Mutation (UpdatePostInput/UpdateEventInput)         │
│ - Sends 'heading' field to Odoo                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ GraphQL API call
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ Odoo Database                                               │
│ - Updates 'heading' field                                   │
└─────────────────────────────────────────────────────────────┘
```

## Mapping Points Summary

| Location | Direction | Mapping | Comment Location |
|----------|-----------|---------|------------------|
| **GraphQL Fragments** | Query | Odoo `heading` | postFragment.ts, eventFragment.ts (top of file) |
| **mapOdooToPruviousFields** (Posts) | FROM Odoo | `odooRecord.heading` → `title` | Line ~220 |
| **mapOdooToPruviousFields** (Events) | FROM Odoo | `odooRecord.heading` → `title` | Line ~242 |
| **mapPruviousToOdooFields** (Posts) | TO Odoo | `record.title` → `heading` | Line ~316 |
| **mapPruviousToOdooFields** (Events) | TO Odoo | `record.title` → `heading` | Line ~332 |

## Why This Approach?

### Benefits
1. **Odoo Independence** - Odoo can use its preferred field naming (`heading`)
2. **Pruvious Standards** - Pruvious uses standard CMS field (`title`)
3. **Clear Mapping** - All mapping happens in one place with clear comments
4. **Future Extensibility** - Can be extended to support complex heading structures

### Pruvious Standard Field Advantages
- ✅ Built into all page-like collections
- ✅ No custom field configuration needed
- ✅ Works with all Pruvious features
- ✅ Consistent with CMS best practices

### Odoo Custom Field Advantages
- ✅ Matches existing Odoo schema
- ✅ Can be extended with additional fields (overline, subtitle, etc.)
- ✅ No changes needed to Odoo codebase

## Future Extension Possibilities

The "Simplified heading-logic" comment indicates this could be extended to:

### Option 1: Full Heading Structure
```typescript
// Odoo side
{
  overline: "Breaking News",
  heading: "Major Event Announced",
  subtitle: "Details revealed today"
}

// Could map to Pruvious
{
  title: "Breaking News: Major Event Announced - Details revealed today"
  // or store in separate fields if needed
}
```

### Option 2: Multiple Title Variations
```typescript
// Odoo side
{
  heading: "Main Title",
  headingShort: "Short Title",
  headingSeo: "SEO Optimized Title"
}

// Could map to Pruvious
{
  title: "Main Title",
  // with logic to choose which variant to use
}
```

## Pruvious Collections Configuration

Both collections have the custom 'heading' field **commented out**:

### `/collections/posts.ts`
```typescript
additionalFields: {
  /* heading: {  // Not needed - using standard 'title' field
    type: 'text',
    options: {},
  }, */
}
```

### `/collections/events.ts`
```typescript
additionalFields: {
  /* heading: {  // Not needed - using standard 'title' field
    type: 'text',
    options: {},
  }, */
}
```

## Odoo Schema Requirements

Your Odoo GraphQL schema must have:
- ✅ `heading` field in Post type
- ✅ `heading` field in Event type
- ✅ Standard string/text type for these fields

## Testing Checklist

### Posts
- [ ] Sync from Odoo - verify Odoo `heading` maps to Pruvious `title`
- [ ] Create post in Pruvious with title
- [ ] Sync to Odoo - verify Pruvious `title` maps to Odoo `heading`
- [ ] Update post title in Pruvious
- [ ] Sync to Odoo - verify Odoo `heading` updated
- [ ] Update post heading in Odoo
- [ ] Sync from Odoo - verify Pruvious `title` updated

### Events
- [ ] Sync from Odoo - verify Odoo `heading` maps to Pruvious `title`
- [ ] Create event in Pruvious with title
- [ ] Sync to Odoo - verify Pruvious `title` maps to Odoo `heading`
- [ ] Update event title in Pruvious
- [ ] Sync to Odoo - verify Odoo `heading` updated
- [ ] Update event heading in Odoo
- [ ] Sync from Odoo - verify Pruvious `title` updated

### Mapping Verification
- [ ] Check all mapping points have the comment
- [ ] Verify GraphQL queries request `heading` from Odoo
- [ ] Verify GraphQL mutations send `heading` to Odoo
- [ ] Confirm Pruvious internally uses `title` field
- [ ] Verify frontend displays `page?.title` correctly

## Files Modified

**GraphQL Fragments:**
- `/server/fragments/postFragment.ts` - Query `heading`, added mapping comment
- `/server/fragments/eventFragment.ts` - Query `heading`, added mapping comment

**Sync Utility:**
- `/utils/SyncableOdooCollection.ts` - All 4 mapping points documented:
  - mapOdooToPruviousFields for posts (Odoo `heading` → Pruvious `title`)
  - mapOdooToPruviousFields for events (Odoo `heading` → Pruvious `title`)
  - mapPruviousToOdooFields for posts (Pruvious `title` → Odoo `heading`)
  - mapPruviousToOdooFields for events (Pruvious `title` → Odoo `heading`)

**Collections:**
- `/collections/posts.ts` - Custom `heading` field commented out (using standard `title`)
- `/collections/events.ts` - Custom `heading` field commented out (using standard `title`)

**Layouts:**
- `/layouts/post.vue` - Uses `page?.title`
- `/layouts/event.vue` - Uses `page.value?.title`

## Related Documentation

- `/docs/ADDITIONAL_PUBLIC_PAGES_FIELDS_FIX.md` - Field exposure requirements
- `/docs/USEPAGE_COMPOSABLE_FIX.md` - Reactive data handling
- `/docs/MD_FIELD_VERIFICATION.md` - MD field sync verification

---

**Updated By:** GitHub Copilot  
**Date:** October 6, 2025  
**Branch:** 1.0_beta/userpage  
**Impact:** Medium - Establishes clear field mapping between Odoo and Pruvious
**Future:** Can be extended to fullstyle headings (overline, heading, subtitle)
