# Domainusers Description and TeaserText Mapping

## Overview
This document describes the intelligent description and teaserText field mapping for the `domainusers` collection, matching the pattern used in `posts` and `events` collections.

## Changes Made

### 1. GraphQL Fragment Update
**File:** `server/fragments/domainUserFragment.ts`

Added `teasertext` field to the GraphQL query to enable fallback functionality:

```graphql
export default `
  syncId
  id
  role
  slug
  description
  teasertext      # ← Added for fallback
  version
  user { id, name, email, partner { firstname, lastname, street, street2, zip, city, mobile, image, bodyMd } }
`
```

### 2. Enhanced mapDescription Helper
**File:** `utils/SyncableOdooCollection.ts`

Updated the `mapDescription()` helper method to support both patterns:

- **Posts/Events:** Uses `metaDescription` as primary source
- **Domainusers:** Uses `description` as primary source (via `useDescriptionField` parameter)
- **Fallback:** All collections fall back to `teasertext` (max 200 characters)

```typescript
private mapDescription(odooRecord: Record<string, any>, useDescriptionField: boolean = false): string {
  // For domainusers: prefer 'description' field if it has content
  // For posts/events: prefer 'metaDescription' field if it has content
  const primaryField = useDescriptionField ? odooRecord.description : odooRecord.metaDescription
  if (primaryField && primaryField.trim().length > 0) {
    return primaryField
  }
  
  // Fallback to teasertext, shortened to 200 chars
  if (odooRecord.teasertext && odooRecord.teasertext.trim().length > 0) {
    const teaser = odooRecord.teasertext.trim()
    return teaser.length > 200 ? teaser.substring(0, 200) + '...' : teaser
  }
  
  return ''
}
```

### 3. Downsync Mapping (Odoo → Pruvious)
**File:** `utils/SyncableOdooCollection.ts` - `mapOdooToPruviousFields()`

Updated the domainusers section to use intelligent description mapping:

```typescript
// Intelligent description mapping: prefer description, fallback to teasertext (max 200 chars)
description: this.mapDescription(odooRecord, true),
teaserText: odooRecord.teasertext || '',
```

**Key differences from posts/events:**
- Uses `useDescriptionField: true` to map Odoo's root `description` field (not `metaDescription`)
- Also explicitly maps `teasertext` to `teaserText` field for direct access

### 4. Upsync Mapping (Pruvious → Odoo)
**File:** `utils/SyncableOdooCollection.ts` - `mapPruviousToOdooFields()`

Added domainusers case with TODO comments for future implementation:

```typescript
} else if (this.collection === 'domainusers') {
  return {
    ...base,
    // TODO: Implement full upsync for domainusers if needed
    // TODO: Synchronize Pruvious 'description' field to Odoo 'description' field
    // TODO: Synchronize Pruvious 'teaserText' field to Odoo 'teasertext' field
    role: record.role || '',
    // Note: Other domainuser fields may need to be mapped here for upsync
  }
}
```

## Field Mapping Summary

### Odoo → Pruvious (Downsync)
| Odoo Field | Pruvious Field | Logic |
|------------|----------------|-------|
| `description` | `description` | Primary source, uses intelligent mapping |
| `teasertext` | `description` | Fallback if `description` is empty (max 200 chars) |
| `teasertext` | `teaserText` | Direct mapping for preservation |

### Pruvious → Odoo (Upsync)
**Status:** Not yet implemented - marked with TODO comments

When implemented, should map:
- Pruvious `description` → Odoo `description`
- Pruvious `teaserText` → Odoo `teasertext`

## Comparison with Posts/Events

### Similarities
✅ Uses intelligent fallback logic with preference order
✅ Fallback to `teasertext` with 200 character limit
✅ Both fields preserved in Pruvious for direct access
✅ TODO comments for upsync implementation

### Differences
- **Primary field:** Domainusers uses root `description` instead of `metaDescription`
- **GraphQL structure:** Domainusers `description` is at root level, not nested in meta fields

## Testing Recommendations

1. **Downsync with description:**
   - Verify Odoo domainuser with `description` content syncs correctly
   - Confirm `description` populates Pruvious `description` field

2. **Downsync with teasertext fallback:**
   - Verify Odoo domainuser with empty `description` but filled `teasertext`
   - Confirm `teasertext` (truncated to 200 chars) populates Pruvious `description`
   - Confirm full `teasertext` populates Pruvious `teaserText` field

3. **Downsync with both fields:**
   - Verify `description` takes priority over `teasertext`
   - Confirm both fields are preserved in their respective Pruvious fields

## Future Work

- [ ] Implement upsync mapping from Pruvious to Odoo
- [ ] Add validation to ensure description field integrity during sync
- [ ] Consider adding sync direction indicators in the Pruvious UI
