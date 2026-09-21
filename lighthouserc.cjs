// Lighthouse CI. Every page below is demo content, so the list filters itself: delete a demo
// post and it drops out of the run instead of failing it with a confusing 404. Add your own
// pages here as you write them.
// This theme renders on a server (output: 'server'), so the check is a request, not a file. CI
// starts `astro preview` before running Lighthouse; without a server the list falls back to `/`.
const { spawnSync } = require("node:child_process");

const PAGES = [
	"/",
	"/posts/council-votes-to-rebuild-the-seawall",
	"/category/city",
	"/authors/mara-okafor",
	"/pages/about",
	"/search?q=harbor",
];

const reachable = (p) =>
	spawnSync("curl", ["-sfo", "/dev/null", "--max-time", "10", `http://localhost:4321${p}`])
		.status === 0;
const up = PAGES.filter(reachable);
// Never hand Lighthouse an empty list; without a server nothing answers, so fall back to the home page.
const url = (up.length ? up : ["/"]).map((p) => `http://localhost:4321${p}`);

module.exports = {
	ci: {
		collect: {
			url,
			numberOfRuns: 3,
		},
		assert: {
			assertMatrix: [
				{
					matchingUrlPattern: "^(?!.*/search).*$",
					assertions: {
						"categories:performance": [
							"error",
							{
								minScore: 0.95,
							},
						],
						"categories:accessibility": [
							"error",
							{
								minScore: 0.95,
							},
						],
						"categories:best-practices": [
							"error",
							{
								minScore: 0.95,
							},
						],
						"categories:seo": [
							"error",
							{
								minScore: 0.95,
							},
						],
					},
				},
				{
					matchingUrlPattern: "/search",
					assertions: {
						"categories:performance": [
							"error",
							{
								minScore: 0.95,
							},
						],
						"categories:accessibility": [
							"error",
							{
								minScore: 0.95,
							},
						],
						"categories:best-practices": [
							"error",
							{
								minScore: 0.95,
							},
						],
					},
				},
			],
		},
		upload: {
			target: "filesystem",
			outputDir: ".lighthouseci",
		},
	},
};
