# Deploy

Masthead is server-rendered and runs on Cloudflare Workers, backed by D1 (database) and R2 (media storage). There is no static build to host elsewhere.

## Requirements

- A Cloudflare account on the **Workers Paid** plan. The bundle is over the 3 MiB Workers free-plan limit.
- Node.js 22.12 or later, pnpm 11.
- Tested with emdash 0.38.x. Dependencies are pinned to exact versions; EmDash is in beta and ships weekly, so don't bump them casually.

## Before you deploy

1. Create the R2 bucket first: `wrangler r2 bucket create masthead-media`. `wrangler deploy` creates the D1 database and KV namespace automatically, but not R2 — a first deploy that fails on a missing bucket can leave a KV namespace behind with no id recorded, which makes the next deploy fail with "already exists"; if that happens, copy the id `wrangler` reports into `kv_namespaces` in `wrangler.jsonc` by hand.
2. Set the `EMDASH_SITE_URL` environment variable to your production URL, both as a Workers Build variable and wherever you run `wrangler deploy` from. It's read at build time (not runtime) for two things: Astro's image optimizer only resizes images from known origins, and EmDash's `siteUrl` (unresizable images otherwise get served full-size). If you're also using passkeys, this is the same value as the passkey `rpId` — it must match the domain you actually deploy to.

## Build and deploy

```sh
pnpm install
pnpm deploy   # astro build && wrangler deploy
```

## Finish setup immediately

A freshly deployed site has a public, unauthenticated `/_emdash/api/setup` until the first admin account is created — the lock is "does a user row exist," not a flag. Open the site right after the first deploy and complete the setup wizard (site info, admin account, passkey) before telling anyone the URL.

## Secrets

`EMDASH_ENCRYPTION_KEY` (in your local `.env`; create it with `npx emdash secrets generate --write .env`) must be set as a Workers secret in production: `wrangler secret put EMDASH_ENCRYPTION_KEY`. Never commit it.

## CI

`.github/workflows/ci.yml` runs on push to `main`: typecheck, `check:contrast`, lint, seed a local database, build, `pnpm preview`, Lighthouse (LHCI), and an internal link check. Use it as a reference for what to verify before shipping a change.
