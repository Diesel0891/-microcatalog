# Microcatalog — Database Schema (Actual)

> Documented: 2026-07-23
> Source of truth: Supabase SQL Editor + runtime verification
> Note: This diverges from the original V1 spec which called for a single `catalog_items` table.

---

## Tables

### 1. `sellers`

Public-facing seller profile. Used in catalog URLs.

| Column | Type | Notes |
|--------|------|-------|
| `uuid` | text (PK) | Public identifier, used in catalog URLs (`/#/c/:uuid`) |
| `phone` | text | WhatsApp number with country code |
| `shop_name` | text | Display name for the catalog |
| `is_pro` | boolean | Premium status (default: false) |
| `max_items` | integer | Item limit (default: 999) |
| `brand_color` | text | Unused (reserved for custom branding) |
| `logo_url` | text | Unused (reserved for custom branding) |
| `passphrase` | text | Unused (legacy from auth experiments) |
| `created_at` | timestamp | Auto-generated |
| `updated_at` | timestamp | Auto-generated |

**RLS Status:** ⚠️ UNVERIFIED — assumed public read, open insert

---

### 2. `catalog_items`

Product data. Directly linked to sellers via `seller_uuid`.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Auto-generated |
| `seller_uuid` | text (FK) | References `sellers.uuid` |
| `image_url` | text | Cloudinary secure URL |
| `title` | text | Product title |
| `price` | text | Price string (e.g., "MK 15,000") |
| `description` | text | Product description |
| `size_specs` | text | Size/specifications |
| `extra_notes` | text | Additional notes |
| `published` | boolean | false = draft, true = live |
| `seller_phone` | text | Cached phone at time of creation |
| `stock_status` | text | `available` | `reserved` | `sold` (default: `available`) |
| `created_at` | timestamp | Auto-generated |

**RLS Status:** ⚠️ UNVERIFIED — assumed public read on published items, open insert

---

### 3. `seller_secrets`

Security table for admin tokens. **CRITICAL: RLS policy currently not blocking access** — table returns 0 rows but is queryable.

| Column | Type | Notes |
|--------|------|-------|
| `seller_uuid` | text (PK, FK) | References `sellers.uuid` |
| `admin_token` | uuid | Unguessable management token |

**RLS Status:** ❌ **BROKEN** — direct anon queries return empty (no rows) but do not error. Policy may not exist or may be misconfigured.

---

## RPC Functions

| Function | Returns | Purpose | Security |
|----------|---------|---------|----------|
| `get_seller_uuid_by_token(p_token uuid)` | text | Translate admin_token → seller_uuid | SECURITY DEFINER |
| `create_seller_with_secret(p_phone text, p_shop_name text)` | TABLE(uuid text, admin_token uuid) | Atomic onboarding | SECURITY DEFINER |

**Status:** ✅ Created in database, but **frontend does not use them** (reverted to `27335c9` baseline).

---

## Schema Evolution Notes

| Version | Changes |
|---------|---------|
| V1 (original spec) | Single `catalog_items` table, no `sellers` table |
| Post-v1 | Added `sellers` table for shop details, phone, limits |
| Stock status feature | Added `stock_status` column to `catalog_items` |
| Security migration (attempted) | Added `seller_secrets`, RPC functions, dropped `admin_token` from `sellers` |
| Current (reverted) | `seller_secrets` exists but unused by frontend |

---

## Security Gaps

1. **`seller_secrets` RLS** — Table is queryable. Must be hardened before storing real admin tokens.
2. **`catalog_items` insert policy** — Open insert assumed. Verify no malicious insert possible.
3. **No auth layer** — UUID obscurity only. Acceptable for single-seller pilot.

---

## Related Files

- `src/lib/supabase.js` — Client initialization
- `src/pages/Upload.jsx` — Writes to `catalog_items`, reads `sellers`
- `src/pages/Catalog.jsx` — Reads `catalog_items` (published=true), `sellers`
- `src/hooks/useStockStatus.js` — Updates `catalog_items.stock_status`


---

## RLS Verification Log

### 2026-07-24: seller_secrets
- **Status:** ✅ SECURED
- **SELECT:** Returns `[]` (200 OK) — no data leaked
- **INSERT:** Blocked with 401 / code 42501
- **Policies:** `Block direct anon access` (qual=false), `secrets_block_all_anon` (qual=false)
- **Table RLS:** `relrowsecurity: true`


### 2026-07-24: catalog_items
- **Status:** ⚠️ APP-LAYER GATED (accepted v1 risk)
- **INSERT:** Allowed with anon key (HTTP 201)
- **SELECT:** Allowed (public catalog)
- **RLS:** Not configured to block inserts
- **Mitigation:** Manage URL entropy (128-bit UUID) + unpublished by default
- **Future:** Migrate to SECURITY DEFINER insert function or auth in v2


### 2026-07-24: sellers
- **Status:** ✅ APP-LAYER GATED (accepted v1 pattern)
- **SELECT:** Allowed (public catalog needs this)
- **INSERT:** Allowed (onboarding mechanism — creates seller on first visit)
- **UPDATE:** Allowed (shop details, phone updates)
- **Mitigation:** UUID entropy + no sensitive data in public fields
- **Future:** Add manage_token + scoped UPDATE policies in v2

