---
Type: SESSION
session-id: SPS
tracker: ^kw07_prod_stab
main:
  - - 02-09___KW07_SPRINT_content_release
created: 2026-02-13
status: active
cssclasses:
  - table-wide
  - wide
---
# _SPS_ PROD STABILISATION
**Parallel tracking through KW07** — open items from SSD (closed 2026-02-13)

| Key | Value |
|-----|-------|
| Server | crearis1 (94.130.134.39), Ubuntu 22.04 |
| Database | odoo_theaterpedia (Odoo 16.0) |
| Predecessor | [[02-07-SSD_server_deployment]] (closed) |
| Sprint | [[02-09___KW07_SPRINT_content_release]] |

---

## Blocking

### 🔄 T5: Wire dasei.eu checkout to GraphQL (Claude-on-Nuxt)

**What**: Nuxt stepper form → `CheckoutMutation` on `/graphql/vsf`

**Status**: Implementation complete, pending deployment + testing

**Snapshot**: [[02-13-SNAPSHOT_nuxt_checkout_graphql]]

Full handoff brief in [[02-07-SSD_server_deployment#T4 Claude-on-Nuxt Checkout Handoff Brief]].

Key facts:
- Endpoint: `POST https://service.dasei.eu/graphql/vsf`
- Products: MOD-A (€1100), MOD-B (€1320), MOD-C (€1320), MOD-D (€1100)
- IP lock: `vsf_checkout_lock_ip` ready (empty now, set to `94.130.134.39` when live — see S1)
- Composable code: [[02-06-SNAPSHOT_nuxt_graphql_integration#3.2]]

**Next Actions** (from snapshot):
1. Set `NUXT_PUBLIC_ODOO_GRAPHQL_URL=https://service.dasei.eu/graphql/vsf`
2. Add `sku` field to markdown frontmatter
3. Wire path selector (currently stubbed)
4. Build and deploy
5. Test end-to-end

---

## Sideline Tasks

### ⬜ S1: Set `vsf_checkout_lock_ip` on production (~FEB 24)
- Set system parameter `vsf_checkout_lock_ip` = `94.130.134.39`
- Only after checkout confirmed working in production
- Settings → Technical → Parameters → System Parameters

### ⬜ S2: Issue-reporting / high-priority log monitoring
- Craft automated solution: critical errors → `hans.doenitz@dasei.eu` (daily/weekly digest)
- Options: (1) Odoo built-in ir.logging, (2) custom cron + log model, (3) journalctl grep + mail
- Priority: medium — after checkout stable

---

## Open Issues (from SSD, non-blocking)

### ⬜ I2: Inconsistent seminarzeiten on SharePoint
- Malformed text entries that don't convert cleanly (e.g. D1_1269)
- Source-data problem, not Odoo bug

### ⬜ I3: domain_code default overrides event.type config
- B2 gets mapped to domaincode 'dasei' (company default wins)

### ⬜ I4: Products tile gives `InvalidButtonParamsError`
- `Missing type for doActionButton request` on service.dasei.eu
- UI bug, non-blocking

### ⬜ I6: Registration deletion doesn't downsync
- Deletions on SharePoint don't propagate to Odoo (e.g. `cs@movement.de`)

### ⬜ SSO/Email: Next-Actions
- Azure client secret expires 11.2028 — need renewal reminder
- `notifications@theaterpedia.org` — second mail server pending
- Prototype Mail-in feature to try

### ⬜ I7: NGINX documentation
- Detailed report exists: [[02-12-SNAPSHOT_NGINX]]
- SSO patches: [[02-12-SNAPSHOT_https-sso-fix]]

### ⬜ I8: NGINX long-term conception
- Current setup differs from what was planned (no vhosts, domain-templates)
- LetsEncrypt as one bundle — may conflict with per-domain routing
- Decision needed: grundlagen.dasei.eu permanent or temporary bridge?

### ⬜ I9: German UI — 851 fields + 7 mail templates
- Detailed status: [[02-12_SNAPSHOT-german-ui]]
- Deferred to KW10

---

## Verification (carry-over from SSD)

| # | Test | Status |
|---|------|--------|
| T1 | dasei1: Purchase Module A (no login) | ⬜ |
| T2 | dasei2: Add B+C+D to cart (€880 discount) | ⬜ |
| T3 | dasei2: Complete Komplett-Paket checkout (€3,740) | ⬜ |
| T4 | GraphQL: query eventPackages | ⬜ |
| T5 | Backend: verify loyalty applied | ⬜ |

- [ ] Monitor server logs (`journalctl -u odoo`)
- [ ] Check email delivery (confirmation emails)
- [ ] Verify GraphQL endpoint: `https://einstiege.dasei.eu/graphql`
- [ ] Tag release in git

---

# Session Close

- **Status**: active
- **Next action**: T5 (Claude-on-Nuxt checkout wiring)
- **Return to**: [[02-09___KW07_SPRINT_content_release#^kw07_prod_stab]]
