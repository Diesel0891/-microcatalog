# Microcatalog

A frictionless WhatsApp-integrated micro-catalog platform for single sellers.

## What it does

- Sellers upload product photos, add titles/prices, and publish a public catalog
- Customers browse the catalog, tap an item, and are redirected to WhatsApp with a pre-filled message

## Tech Stack

- React 19 + Vite 4 + Tailwind CSS 3
- Supabase (database)
- Cloudinary (image hosting)
- Google Gemini (optional AI suggestions)

## Routes

- `/#/` — Landing page
- `/#/u/:sellerUuid` — Seller upload & management
- `/#/c/:sellerUuid` — Public customer catalog

## Development

```bash
pnpm install
pnpm run dev
```

## Build

```bash
pnpm run build
```

## Environment Variables

Create a `.env` file with:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_GEMINI_API_KEY=
```

## License

Private — Infini
