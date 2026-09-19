# Customization

Masthead is an EmDash site: content, navigation, and site identity live in the database, not in code. You mostly edit through the admin UI (`/_emdash/admin`); the files below are for what the admin UI doesn't cover.

## Site identity and navigation

Admin UI → **Settings**: site title, tagline, logo, favicon. Read in code with `getSiteSettings()`.
Admin UI → **Menus**: header links, footer links, social links. Read with `getMenu()`.

Section rails on the home page come from the `category` taxonomy. If you install without sample content, create your sections in the admin UI first — the home page hides any section with no published terms, so an empty install shows no rails until you add them.

## Colors, rules, and type

`src/styles/theme.css` overrides the tokens defined in `src/styles/tokens.css` (don't edit that file directly). The palette is one accent color on ink and paper — don't add a second accent or colored section backgrounds. Preview changes at `/styleguide` (dev only, 404s in production).

After any color change, run `pnpm check:contrast` — it checks every text token against every background token, light and dark, for WCAG AA (4.5:1).

## Webfonts

Declared under `fonts:` in `astro.config.mjs`, bound to `--font-body`, `--font-heading`, and `--font-display` CSS variables. All three are served from Fontsource (no external font CDN links). Swapping a font is a matter of changing the `name` and matching CSS variable in `theme.css`; check licensing before adding a non-OFL font (see `THIRD-PARTY-NOTICES.md`).

## Publication line (Vol./No. and date)

`src/utils/edition.ts`, the `FOUNDED` constant — set it to your first issue date. The footer line ("Friday, September 18, 2026 · Vol. 1, No. 257") computes the volume (turns over every year since `FOUNDED`) and issue number (one per day since `FOUNDED`, the way daily papers count) from that single date, in UTC.

## Caching

Public pages are cached at the edge by Workers Caching (`"cache": { "enabled": true }` in `wrangler.jsonc`, the `cacheCloudflare()` provider in `astro.config.mjs`). A page opts in by calling `Astro.cache.set(...)` with its query's `cacheHint` and `PAGE_CACHE` from `src/utils/cache.ts` (an hour, then served stale for up to a day while it refreshes in the background). Editing content purges the pages tagged with it, so the TTL mainly limits how long the footer's edition date can lag.

Everything else is marked `Cache-Control: private, no-store` in `src/worker.ts`, because Workers Caching also stores responses that carry no cache headers. Keep it that way: a cached page is served to every visitor, so a page that opts in must not depend on who is signed in.

EmDash's editor toolbar follows the same rule. `toolbar: "client"` in `astro.config.mjs` keeps public HTML identical for everyone; browsers signed in to the admin get a small Edit pill that reloads the page with an `_edit` parameter, which is never cached and carries the full toolbar. With the default `"server"` mode EmDash keeps toolbar pages out of the cache itself, but editors then see the toolbar only on pages that were not already cached.

## Schema, taxonomies, and sample content

`seed/seed.json` — collections, fields, taxonomies, bylines, menus, and demo content. It's applied once, at setup, not on every deploy. To change the schema after setup you need a fresh database (`pnpm reset` locally); in production that means a new D1 database. A field removed from the seed drops its column and every value in it. Field types can only be changed among `string`, `text`, and `slug` — anything else is a content migration. New fields must be optional so existing rows stay valid.
