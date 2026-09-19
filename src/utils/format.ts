import type { ContentBylineCredit } from "emdash";

export function formatDate(date: Date | null | undefined) {
	return date?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * "Mara Okafor and Daniel Reyes" for cards and lists. Credits with a role label
 * ("Additional reporting") belong on the article page, not on the card.
 */
export function bylineNames(credits: ContentBylineCredit[] | undefined) {
	const authors = credits?.filter((c) => !c.roleLabel) ?? [];
	const names = (authors.length ? authors : (credits ?? [])).map((c) => c.byline.displayName);
	return names.length ? new Intl.ListFormat("en").format(names) : undefined;
}

/**
 * Absolute URL for an image or file field. Values have `src` when external and
 * only `meta.storageKey` when uploaded to this site's storage.
 */
export function mediaUrl(value: unknown, origin: string) {
	if (!value || typeof value !== "object") return undefined;
	const media = value as { src?: unknown; id?: unknown; meta?: { storageKey?: unknown } };
	if (typeof media.src === "string" && media.src) {
		return media.src.startsWith("http") ? media.src : `${origin}${media.src}`;
	}
	const key = media.meta?.storageKey ?? media.id;
	return typeof key === "string" && key ? `${origin}/_emdash/api/media/file/${key}` : undefined;
}

const XML_ESCAPES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&apos;",
};

export function escapeXml(str: string) {
	return str.replace(/[&<>"']/g, (c) => XML_ESCAPES[c]!);
}
