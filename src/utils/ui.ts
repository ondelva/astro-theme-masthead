/**
 * Every word the theme prints, in one place. The site's title and tagline come from the admin
 * (Settings). To publish in another language, set `locale` and translate `ui`. Counts are
 * functions, so plurals stay right. Strings marked HTML carry a link and are printed as markup:
 * keep the tags when you translate them.
 */

/** BCP 47: `<html lang>`, the feeds' <language>, and how dates and name lists are written. */
export const locale = "en";

export const ui = {
	skipToContent: "Skip to content",
	nav: { primary: "Primary", sections: "Sections", footer: "Footer", social: "Social" }, // read out
	searchPlaceholder: "Search", // the header's instant search
	edition: (volume: number, number: number) => `Vol. ${volume}, No. ${number}`,
	publishedWith: "Published with", // before the EmDash link in the footer
	theme: {
		label: "Color scheme",
		light: "Light mode",
		dark: "Dark mode",
		system: "System theme",
	},
	by: (names: string) => `By ${names}`,
	minutesRead: (minutes: number) => `${minutes} min read`,
	moreIn: (section: string) => `More in ${section}`,
	untitled: "Untitled",
	archive: {
		empty: "Nothing here yet.",
		pages: "Pages", // read out for the pager
		newest: "Newest",
		older: "Older articles",
	},
	home: {
		empty: "Nothing published yet",
		// HTML
		emptyText:
			'Write the first article in the <a href="/_emdash/admin/content/posts/new">admin</a>. It will lead this page until you mark another one as the lead.',
		front: "Front page", // read out
		continue: "Continue reading",
		latest: "Latest",
		all: "All articles",
		opinion: "Opinion", // the column's heading when the sections menu has no Opinion item
	},
	posts: {
		title: "All articles",
		description: "Every article, newest first.",
		empty: "Nothing published yet.",
	},
	post: {
		by: "By",
		roleBy: (role: string) => `${role} by`, // "Additional reporting by"
		and: " and ", // between the last two names
		updated: "Updated",
		correction: "Correction:",
		correctionLabel: "Correction", // read out
		filedUnder: "Filed under",
		tags: "Tags", // read out
		aboutAuthor: (count: number) => (count === 1 ? "About the author" : "About the authors"),
	},
	author: {
		contributor: "Contributor",
		staff: "Staff",
		empty: (name: string) => `No stories by ${name} yet.`,
	},
	category: {
		description: (section: string) => `${section} coverage, newest first.`,
		empty: (section: string) => `No ${section} stories yet.`,
	},
	tag: {
		eyebrow: "Tag",
		description: (tag: string) => `Stories tagged ${tag}.`,
		empty: (tag: string) => `No stories tagged ${tag} yet.`,
	},
	search: {
		title: "Search",
		titleFor: (query: string) => `Search: ${query}`,
		description: "Search the archive",
		label: "Search articles and pages",
		placeholder: "Seawall, ferry, Harbor Days",
		button: "Search",
		none: (query: string) => `Nothing matched “${query}”. Try a shorter word or a street name.`,
		results: (count: number, query: string) =>
			`${count} result${count === 1 ? "" : "s"} for “${query}”`,
	},
	notFound: {
		title: "Page not found",
		heading: "This page didn't make the paper",
		// HTML
		text: 'The link may be old, or the story may have moved. Try the <a href="/">front page</a>, the <a href="/posts">full archive</a>, or search for it.',
		label: "Search articles",
		placeholder: "Search articles",
		button: "Search",
	},
};
