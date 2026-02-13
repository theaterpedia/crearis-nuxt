---
Type: SNAPSHOT
created: 2026-02-13
topic: nuxt-checkout-graphql
session: SPS
task: T5
---
# SNAPSHOT: Nuxt Checkout GraphQL Integration

_Date: 2026-02-13 — Claude-on-Nuxt implementation of T5_

---

## 1. Implementation Summary

### Files Created

| File | Purpose |
|------|---------|
| `apps/home/composables/useCheckout.ts` | GraphQL checkout composable (230 lines) |

### Files Modified

| File | Changes |
|------|---------|
| `apps/home/utils/checkout.ts` | Added 55 lines: `CheckoutInput`, `CheckoutResult`, `CheckoutState`, `CheckoutContactInput` types |
| `apps/home/nuxt.config.ts` | Added `runtimeConfig.public.odooGraphqlUrl` |
| `apps/home/components/content/DataViewDetails.vue` | Wired `useCheckout` with Azure Logic App fallback |

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CHECKOUT FLOW                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   DataViewDetails.vue                                                       │
│         │                                                                   │
│         ├── productRef computed from: sku > meta_product > shortcode > id   │
│         │                                                                   │
│         ▼                                                                   │
│   useCheckout(productRef)                                                   │
│         │                                                                   │
│         ├── IF NUXT_PUBLIC_ODOO_GRAPHQL_URL set:                            │
│         │         │                                                         │
│         │         ▼                                                         │
│         │   POST https://service.dasei.eu/graphql/vsf                       │
│         │         │                                                         │
│         │         ▼                                                         │
│         │   CheckoutMutation → Partner + Order + Registrations + Email      │
│         │                                                                   │
│         └── ELSE (fallback):                                                │
│                   │                                                         │
│                   ▼                                                         │
│           Azure Logic App (legacy)                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Field Mapping (Stepper → GraphQL)

| Stepper field | GraphQL field | Status |
|--------------|---------------|--------|
| `contactInfo.email` | `contact.email` | ✅ |
| `contactInfo.vorname` | `contact.vorname` | ✅ |
| `contactInfo.nachname` | `contact.nachname` | ✅ |
| `contactInfo.strasse` | `contact.strasse` | ✅ |
| `contactInfo.plz` | `contact.plz` | ✅ |
| `contactInfo.ort` | `contact.ort` | ✅ |
| `contactInfo.mobil` | `contact.mobil` | ✅ |
| `checksAndSummary.agb` | `acceptTerms` | ✅ |
| `checksAndSummary.datenschutz` | `acceptPrivacy` | ✅ |
| `checksAndSummary.ruecktritt` | `acceptCancellation` | ✅ |
| `checksAndSummary.anmerkungen` | `notes` | ✅ |
| product SKU | `productRef` | ✅ |
| path selector | `path` | ⏳ stubbed |

---

## 2. Next Actions

### ⬜ N1: Set environment variable on deployment

```bash
# In deployment script or .env
NUXT_PUBLIC_ODOO_GRAPHQL_URL=https://service.dasei.eu/graphql/vsf
```

### ⬜ N2: Add `sku` field to markdown frontmatter

Ensure product markdown files include SKU matching Odoo `default_code`:

```yaml
# content/agenda/einstiege-ins-theaterspiel-m18e.md
---
sku: "MOD-A"   # Must match Odoo product.template.default_code
---
```

### ⬜ N3: Wire path selector to checkout

Currently stubbed in `DataViewDetails.vue`:
```typescript
// TODO: Set path based on user selection (muenchen_block, nuernberg_block, etc.)
// checkout.setPath('muenchen_block')
```

Options:
- Derive from URL/query param
- Add radio button in stepper
- Auto-detect from product metadata

### ⬜ N4: Build and deploy

```bash
cd apps/home
pnpm build
# Deploy .output to server
```

### ⬜ N5: Test checkout end-to-end

1. Navigate to `https://dasei.eu/details?src=/agenda/einstiege-ins-theaterspiel-m18e`
2. Complete stepper form
3. Verify in Odoo:
   - Partner created/found
   - Sale Order with MOD-A line
   - Event registrations created
   - Confirmation email sent

---

## 3. Points for Further Research

### R1: CORS configuration

If Nuxt static site calls cross-origin (dasei.eu → service.dasei.eu):
- Need CORS headers on Odoo NGINX
- Alternative: Proxy via Nitro server route

**Current assumption**: Deployment runs on same server, connecting via loopback (no CORS issue).

### R2: Path auto-detection

The `path` parameter controls location filtering (München/Nürnberg). Options:
1. **Hardcode per product** — Different markdown for each city
2. **User selection** — Radio in stepper UI
3. **Geo-detection** — Based on user location (overkill)

Need business decision: How does the user currently choose location?

### R3: Error handling UX

Current implementation shows generic `alert()` on failure. Consider:
- Inline error message in stepper
- Retry button
- Fallback to email form

### R4: `vsf_checkout_lock_ip` timing

From SPS#S1: Set IP lock after checkout confirmed working. Current status: empty (open for testing).

Lock command:
```
Settings → Technical → Parameters → System Parameters
vsf_checkout_lock_ip = 94.130.134.39
```

### R5: Product SKU resolution fallback chain

Current: `sku > meta_product > shortcode > id`

Risk: If none of these match Odoo's `default_code`, mutation will fail with "Product not found". Need to verify existing markdown frontmatter content.

---

## Related Documents

- [[02-07-SSD_server_deployment#T4 Claude-on-Nuxt Checkout Handoff Brief]] — Original handoff spec
- [[02-06-SNAPSHOT_nuxt_graphql_integration]] — Full integration plan with composable code
- [[02-06-SNAPSHOT_graphql_checkout_mutation]] — Mutation design history
- [[02-13-SPS_prod_stabilisation]] — Parent session

---

## Code Reference

### useCheckout Composable (excerpt)

```typescript
export function useCheckout(productRef: string) {
  const config = useRuntimeConfig()
  const graphqlUrl = config.public.odooGraphqlUrl as string
  
  // ... state, validation, submit logic
  
  const submit = async (): Promise<CheckoutResult> => {
    const input: CheckoutInput = {
      productRef,
      contact: { email, vorname, nachname, ... },
      path: state.path,
      acceptTerms: state.acceptances.terms,
      acceptPrivacy: state.acceptances.privacy,
      acceptCancellation: state.acceptances.cancellation,
    }
    
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: CHECKOUT_MUTATION,
        variables: { checkout: input }
      })
    })
    // ...
  }
}
```

### GraphQL Mutation

```graphql
mutation Checkout($checkout: CheckoutInput!) {
  checkout(checkout: $checkout) {
    success
    error
    order { id name }
    partner { id email }
    registrations
    packageLines
  }
}
```
