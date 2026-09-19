# Masthead — Guide for AI agents

This is the first file AI agents (Claude Code, Cursor, etc.) should read before editing this theme.
Humans can read it too, but sentences are written so an agent can act on them without guessing.

Masthead is an EmDash site -- a CMS built on Astro with a full admin UI.

## Commands

```bash
pnpm install
pnpm dev              # http://localhost:4321, admin at /_emdash/admin
pnpm reset            # Wipe local D1 + R2 uploads and start dev, so setup and the seed run again
pnpm build
pnpm typecheck        # astro check
pnpm lint
pnpm format
pnpm check:contrast   # WCAG AA for every color token, light and dark
npx emdash types      # Regenerate TypeScript types from a running site
```

After any change, `pnpm typecheck && pnpm build` must pass.

## Key Files

| File                     | Purpose                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `astro.config.mjs`       | Astro config with `emdash()` integration, database, and storage                    |
| `src/live.config.ts`     | EmDash loader registration (boilerplate -- don't modify)                           |
| `seed/seed.json`         | Schema definition + demo content (collections, fields, taxonomies, menus, bylines) |
| `emdash-env.d.ts`        | Generated types for collections (auto-regenerated on dev server start)             |
| `src/layouts/Base.astro` | Base layout with EmDash wiring (menus, search, page contributions)                 |
| `src/pages/`             | Astro pages -- all server-rendered                                                 |

## Skills

Agent skills are in `.agents/skills/`. Load them when working on specific tasks:

- **building-emdash-site** -- Querying content, rendering Portable Text, schema design, seed files, site features (menus, widgets, search, SEO, comments, bylines). Start here.
- **creating-plugins** -- Building EmDash plugins with hooks, storage, admin UI, API routes, and Portable Text block types.
- **emdash-cli** -- CLI commands for content management, seeding, type generation, and visual editing flow.

## Documentation

The EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. When you need to verify an API, hook, config option, field type, or pattern, call `search_docs` against the live documentation rather than relying on training-data recall. The docs reflect current behaviour; assumptions may not.

This template ships with `.mcp.json`, `.cursor/mcp.json`, and `.vscode/mcp.json` so Claude Code, Cursor, and VS Code auto-discover the docs server. Other tools (OpenCode, Windsurf, etc.) need a manual one-time setup -- see [docs.emdashcms.com/docs-mcp](https://docs.emdashcms.com/docs-mcp).

## Rules

- All content pages must be server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Use `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls like `getEntryTerms`).
- Always call `Astro.cache.set(cacheHint)` on pages that query content.
- Taxonomy names in queries must match the seed's `"name"` field exactly (e.g., `"category"` not `"categories"`).

## This Theme

A newspaper-style news magazine for editorial teams: many authors, sections, and desks. English by default.

The print page is translated for the web, not copied. Scanning density lives on the home page and archives: a column grid split by thin vertical rules. Articles drop the grid and become a single readable column. The rule system is the signature; it repeats on every screen. The full-width nameplate appears large only on the home page and shrinks into a sticky header elsewhere.

## Where to edit

| To change                                       | Edit                            | Notes                                                                                                   |
| ----------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Site title, tagline, logo, favicon              | Admin UI → Settings             | Read with `getSiteSettings()`. Not hardcoded                                                            |
| Navigation                                      | Admin UI → Menus                | Read with `getMenu()`                                                                                   |
| Collections, fields, taxonomies, sample content | `seed/seed.json`                | Applied once at setup. See the schema rules below                                                       |
| Colors, rules, spacing, type scale              | `src/styles/theme.css`          | Override tokens from `src/styles/tokens.css`; don't edit that file. Preview at `/styleguide` (dev only) |
| Webfonts                                        | `fonts:` in `astro.config.mjs`  | Bound to `--font-*` CSS variables                                                                       |
| Header, footer, page shell                      | `src/layouts/Base.astro`        | EmDash wiring (menus, search, page contributions) lives here                                            |
| Post card                                       | `src/components/PostCard.astro` |                                                                                                         |
| Pages                                           | `src/pages/`                    | Server-rendered. See the Rules above                                                                    |
| Publication line (Vol./No., date)               | `src/utils/edition.ts`          | Set `FOUNDED` to the first issue date; volume and issue number are computed from it, in UTC             |

## Schema changes

The seed is applied once, at setup. A field removed from the seed drops its column and every value in it. Field types can only change among `string`, `text`, and `slug`; anything else is a content migration. New fields must be optional.

## Do not

- Add a second accent colour or coloured section backgrounds. Ink, paper, and one red.
- Use justified text. Left-aligned with `hyphens: auto`.
- Put multi-column text inside an article. Columns belong to the home page and archives.
- Replace rules with shadows, rounded cards, gradients, or glass.
- Use small uppercase text with wide letter-spacing as a generic section label.
- Use stock copy ("Welcome to my blog", "Stay tuned for more"). Write in the publication's voice: plain and specific.
- Add React islands to public pages. React is here only for the EmDash admin UI. Use `<script>` tags and CSS.
- Link external CDNs for fonts, scripts, or icons.
- Remove accessibility features (skip link, focus rings, alt text, aria-labels). Breaking at 360px is a bug.
- Add third-party assets not listed in `THIRD-PARTY-NOTICES.md`. If you add one, add the notice.
- Enable comments without a plan to moderate them.
- Read generated files: `emdash-env.d.ts`, `worker-configuration.d.ts`, `node_modules/emdash/**`. Check the `content` section of `seed/seed.json` with `head`, not a full read.
- Write comments, strings, or docs in any language other than English.

## Workflow

1. Find the file in the table above. If the request is not covered, tell the user which file you intend to touch first.
2. Make the change.
3. Run `pnpm typecheck && pnpm build` and report the result.
4. For layout or color changes, run `pnpm dev` and ask the user to verify visually.
