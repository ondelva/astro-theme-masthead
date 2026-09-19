/**
 * How long public pages stay in the edge cache. Content edits purge affected pages
 * through their cache tags, so the TTL mostly bounds the footer's edition date,
 * which is computed at render time.
 */
export const PAGE_CACHE = { maxAge: 3600, swr: 86400 };
