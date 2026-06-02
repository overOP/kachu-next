# API Migration TODO (Products/Admin)

Use this checklist when backend endpoints are ready.

## 1) Backend Contract (must exist first)

- [ ] `GET /products` -> `{ products: Product[] }`
- [ ] `GET /products/:id` -> `{ product: Product }`
- [ ] `GET /products/search?q=...` -> `{ products: Product[] }`
- [ ] `GET /products/category/:slug` -> `{ products: Product[] }`
- [ ] `GET /categories` -> `{ categories: { slug: string; label: string }[] }`
- [ ] `POST /products` (multipart/form-data for image upload) -> `{ product: Product }`
- [ ] Consistent `Product` fields:
  - `id`, `name`, `brand`, `price`, `img`, `rate`, `quantity`, `logo`, `Description`, `categorySlug`

## 2) Env + Config

- [ ] Set `NEXT_PUBLIC_API_URL` in `.env.local` and hosting env.
- [ ] Verify `lib/api/config.ts` points to backend origin (not app origin).
- [ ] Keep `NEXT_PUBLIC_SITE_URL` configured for SEO/sitemap metadata.

## 3) Frontend Data Layer Changes

### `lib/api/user/product-api.ts`
- [ ] Fix endpoint typings (`builder.query<Product[], void>`, etc.).
- [ ] Fix `getProductById` response type to `Product` (not `Product[]`).
- [ ] Rename typo endpoints (`Catagory` -> `Category`).
- [ ] Add `tagTypes: ["Products", "Product", "Categories"]`.
- [ ] Add `providesTags`/`invalidatesTags`.
- [ ] (Recommended) add runtime schema validation in `transformResponse`.

### `lib/services/products.ts`
- [ ] Replace seed/in-memory reads with real `fetch(...)` calls.
- [ ] Use `next: { revalidate: ... }` or `no-store` per route needs.
- [ ] Keep function signatures stable so UI files need minimal edits.

### `lib/services/product-catalog.ts`
- [ ] Remove or keep only as local fallback/dev mock.
- [ ] Stop writing to in-memory list in production path.

## 4) Admin Create Product Flow

### `app/admin/products/actions.ts`
- [ ] Replace local file write + in-memory `addProduct` with backend `POST /products`.
- [ ] Keep server-side validation before sending request.
- [ ] Keep `revalidatePath(...)` after successful mutation.

### `components/admin/AddProductModal.tsx`
- [ ] Keep file input (`imageFile`) and category selector.
- [ ] Confirm backend expects `multipart/form-data`.
- [ ] Map backend validation errors to field-level UI messages.

## 5) Routing Strategy Decision

Pick one per feature (avoid mixing in same page):

- [ ] **Option A (Server-first):** keep App Router server data (`fetchProducts`).
- [ ] **Option B (Client-first):** migrate `/products` and `/product/[id]` to RTK Query hooks.
- [ ] Document chosen approach in README for future contributors.

## 6) Remove Temporary/Dev-Only Behavior

- [ ] Remove "stored in memory" messaging in admin modal.
- [ ] Remove any fallback seed assumptions if backend is mandatory.
- [ ] Verify uploaded product images come from backend storage/CDN URL.

## 7) QA / Acceptance

- [ ] Add product from admin appears in:
  - `/admin/products`
  - `/products`
  - `/product/[id]`
- [ ] Search + category filter works against backend data.
- [ ] Dark mode product image visibility still correct.
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint` (or `npx eslint ...`)

## 8) Optional Hardening (recommended)

- [ ] Add auth guard for `/admin` routes.
- [ ] Add request timeout + retry strategy for product endpoints.
- [ ] Add monitoring/logging for failed product mutations.
- [ ] Add integration test for product create/read flow.

