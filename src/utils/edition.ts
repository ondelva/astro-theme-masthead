/**
 * The publication line under the nameplate: "Friday, September 18, 2026 · Vol. 1, No. 257".
 * Change FOUNDED to your first issue date. Volume turns over every year; the issue
 * number counts every day since the first issue, the way daily papers number them.
 */
export const FOUNDED = "2026-01-05";

const DAY = 86_400_000;

// ponytail: dates are computed in UTC on the server; add a timezone setting if the desk is far from UTC.
export function getEdition(now = new Date()) {
	const days = Math.floor((now.getTime() - Date.parse(FOUNDED)) / DAY);
	return {
		date: now.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			timeZone: "UTC",
		}),
		volume: Math.floor(days / 365) + 1,
		number: days + 1,
	};
}
