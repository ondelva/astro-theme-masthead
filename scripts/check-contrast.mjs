// Checks WCAG AA (4.5:1) for every text color token on every background token, light and dark. Exits 1 on failure.
// Reads light-dark() pairs from tokens.css, then theme.css overrides on top.
import { readFileSync } from "node:fs";

const read = (f) =>
	readFileSync(new URL(`../src/styles/${f}`, import.meta.url), "utf8").replace(
		/\/\*[\s\S]*?\*\//g,
		"",
	);
const tokens = {};
for (const css of [read("tokens.css"), read("theme.css")]) {
	for (const [, name, light, dark] of css.matchAll(
		/(--color-[\w-]+):\s*light-dark\(\s*(#[0-9a-f]{6})\s*,\s*(#[0-9a-f]{6})\s*\)/gi,
	)) {
		tokens[name] = [light, dark];
	}
}

const luminance = (hex) => {
	const [r, g, b] = [1, 3, 5].map((i) => {
		const c = parseInt(hex.slice(i, i + 2), 16) / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
};

const texts = [
	"--color-text",
	"--color-text-secondary",
	"--color-muted",
	"--color-brand",
	"--color-brand-hover",
];
const backgrounds = ["--color-bg", "--color-bg-subtle", "--color-surface"];
const pairs = [
	...texts.flatMap((t) => backgrounds.map((b) => [t, b])),
	["--color-on-brand", "--color-brand"],
];

let failed = false;
for (const [mode, i] of [
	["light", 0],
	["dark", 1],
]) {
	for (const [fg, bg] of pairs) {
		if (!tokens[fg] || !tokens[bg])
			throw new Error(`Missing light-dark() token: ${tokens[fg] ? bg : fg}`);
		const r = ratio(tokens[fg][i], tokens[bg][i]);
		if (r < 4.5) failed = true;
		console.log(
			`${mode.padEnd(5)}  ${fg.padEnd(24)} on ${bg.padEnd(18)} ${r.toFixed(2)}${r < 4.5 ? " ✗" : ""}`,
		);
	}
}
process.exit(failed ? 1 : 0);
