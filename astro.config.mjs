import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
	output: "server",
	// Edge cache for pages that opt in with Astro.cache.set (see src/utils/cache.ts).
	// Needs "cache": { "enabled": true } in wrangler.jsonc.
	cache: { provider: cacheCloudflare() },
	adapter: cloudflare(),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			// Public origin, read at build time. Astro resizes media only for known
			// origins; without it images are served at full size.
			siteUrl: process.env.EMDASH_SITE_URL || undefined,
			// Public pages stay identical for everyone, so the edge cache holds. Editors get an
			// "Edit" pill that reloads the page uncached with the full toolbar.
			toolbar: "client",
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
		}),
	],
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: "Source Serif 4",
			cssVariable: "--font-body",
			// Static weights: the variable file carries an optical-size axis and is
			// four times larger. Only 400 normal is preloaded (see Base.astro).
			weights: [400, 600, 700],
			styles: ["normal", "italic"],
			subsets: ["latin"],
			fallbacks: ["Georgia", "serif"],
		},
		{
			provider: fontProviders.fontsource(),
			name: "Libre Franklin",
			cssVariable: "--font-heading",
			weights: ["100 900"],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["Arial", "sans-serif"],
		},
		{
			provider: fontProviders.fontsource(),
			name: "Libre Caslon Display",
			cssVariable: "--font-display",
			weights: [400],
			styles: ["normal"],
			subsets: ["latin"],
			fallbacks: ["Georgia", "serif"],
		},
	],
	devToolbar: { enabled: false },
	vite: {
		build: {
			// Keep light-dark() native. Vite's default target makes Lightning CSS lower it
			// to prefers-color-scheme variables, which the footer theme switcher can't override.
			// Older browsers get the light fallback in tokens.css.
			cssTarget: ["chrome123", "edge123", "firefox120", "safari17.5"],
		},
	},
});
