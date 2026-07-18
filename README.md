# LocalCatalog AI

LocalCatalog AI is a hackathon ready, mobile first catalog builder for small restaurants and local businesses. Owners can create a profile, add products from photos, review optional AI generated suggestions, choose a theme, publish a public catalog, and share it with a QR code. Customers browse published catalogs without signing in.

The repository includes a clearly marked sample business, **Malabar Bakes**, available at `/shop/malabar-bakes` whenever Supabase is not configured.

## Product flows

1. An owner signs up or opens the demo workspace.
2. They complete business, contact, social, and location details.
3. They upload one or many JPEG, PNG, or WebP product photos up to 8 MB each.
4. When OpenAI and Supabase are configured, the server returns structured, editable suggestions. No price is generated and nothing is silently published.
5. The owner sets prices, availability, and ordering, previews one of three themes, and publishes.
6. Customers use the public link, QR code, WhatsApp, device sharing, call, Instagram, or directions actions.

## Architecture

- Next.js App Router and strict TypeScript provide the UI, server rendering, metadata, route handlers, and Vercel runtime.
- Tailwind CSS provides the responsive design system.
- Supabase Auth handles sessions. PostgreSQL and Row Level Security isolate owner data. Supabase Storage holds catalog images.
- The OpenAI Responses API analyzes images on the server and returns a Zod validated structured result.
- React Hook Form and Zod validate owner forms.
- The `qrcode` package generates high correction PNG QR codes in the browser.
- Demo data is an explicit fallback, not a replacement for production persistence.

Key areas:

- `app/shop/[slug]`: reusable public catalog route
- `app/dashboard`: owner workspace
- `app/api/ai/generate-product`: authenticated AI route
- `lib/ai/generate-product-details.ts`: OpenAI service
- `supabase/migrations`: schema, indexes, RLS, triggers, and storage policies
- `tests`: critical unit and behavior tests

## Local setup

Prerequisites: Node.js 20.9 or newer, npm, and optionally a Supabase project and OpenAI API key.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Without credentials, use any demo sign in values or go directly to `/dashboard`.

## Environment variables

Copy `.env.example` to `.env.local` and replace placeholders locally. Never commit the local file.

| Variable                        | Scope                | Required                            |
| ------------------------------- | -------------------- | ----------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Browser and server   | Production persistence and auth     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser and server   | Production persistence and auth     |
| `OPENAI_API_KEY`                | Server only          | AI suggestions only                 |
| `NEXT_PUBLIC_SITE_URL`          | Public configuration | Recommended for production metadata |

No service role key is required. Owner writes use the authenticated anon client and database policies.

## Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run `supabase/migrations/202607170001_initial_schema.sql`.
3. Confirm the `catalog-images` bucket exists. The migration creates it with an 8 MB limit and JPEG, PNG, and WebP allowlist.
4. Add the project URL and anon key to `.env.local`.
5. In Authentication settings, add local and deployed redirect URLs.
6. Optionally create the demo auth user and matching profile UUID, then run `supabase/seed.sql`. The in app demo requires no database seed.

The migration enables Row Level Security on every application table. Owners can mutate only their own rows. Anonymous users can read only published businesses and available products belonging to a published business. Storage writes are restricted to each authenticated user folder.

## OpenAI setup

Set `OPENAI_API_KEY` only in the server environment. The application uses the official OpenAI JavaScript SDK, Responses API, image input, and strict Zod structured output with `gpt-5.6-luna`, the current cost focused GPT 5.6 model at implementation time.

The AI endpoint verifies the session, verifies business ownership, validates the image type and size, applies a basic rate limit, and returns editable suggestions. It never logs image bytes or secrets. Configure a distributed rate limit such as Vercel KV or Upstash before high traffic production use.

## Demo mode

When Supabase is absent, sign in opens a local sample workspace and public `/shop/malabar-bakes` renders the sample catalog. Owner form changes are stored only in browser local storage where applicable.

When `OPENAI_API_KEY` is absent, the product form displays a nonblocking manual entry message. All non AI flows continue to work. The server endpoint returns a clear unavailable response and does not attempt a network call.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm test
npm run format
npm run format:check
```

## Deploy to Vercel

1. Import the repository into Vercel.
2. Add the environment variables in Project Settings. Keep `OPENAI_API_KEY` server only.
3. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
4. Add the Vercel origin to Supabase Auth redirect URLs.
5. Deploy. The standard `next build` output is Vercel compatible.

## Security notes

- Secrets are ignored by Git and documented only as placeholders.
- OpenAI calls occur only in a Node.js route handler.
- Uploaded files are allowlisted by MIME type and capped at 8 MB in both application and storage configuration.
- HTTP and HTTPS URLs are validated before save.
- RLS is the final authorization boundary. UI checks are not treated as security.
- AI content remains a draft until the owner reviews and saves it.
- Responses avoid sensitive request logging.

## Known limitations

- Demo edits do not modify the server rendered sample catalog.
- The in memory AI rate limiter is per server instance and should be replaced for horizontally scaled traffic.
- Upload progress represents workflow stages because the Supabase JavaScript upload method does not expose byte progress.
- Opening hours use the seeded display object; a production editor can add per day controls.
- Instagram sharing is represented by the profile link because Instagram does not provide a general web share target.
- The current Next.js dependency tree includes a moderate PostCSS advisory. npm does not currently offer a compatible nonbreaking resolution; monitor the Next.js release line and upgrade when its patched PostCSS dependency is available.

## Future enhancements

- Distributed rate limiting and background AI job processing
- Drag sorting with persisted sort order
- Image optimization and background removal
- Catalog analytics and QR scan attribution
- Localization and additional currencies
- Scheduled availability and seasonal collections
