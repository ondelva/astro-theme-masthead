import handler, { createScheduledHandler, PluginBridge } from "@emdash-cms/cloudflare/worker";

export { PluginBridge };

export default {
	...handler,
	async fetch(request, env, ctx) {
		const response = await handler.fetch!(request, env, ctx);
		// Workers Caching also stores responses that carry no cache headers. Only pages that
		// opted in through Astro.cache.set may be shared between visitors; mark the rest private.
		if (
			response.headers.has("Cache-Control") ||
			response.headers.has("Cloudflare-CDN-Cache-Control")
		) {
			return response;
		}
		const privateResponse = new Response(response.body, response);
		privateResponse.headers.set("Cache-Control", "private, no-store");
		return privateResponse;
	},
	scheduled: createScheduledHandler(),
} satisfies ExportedHandler<Env>;
