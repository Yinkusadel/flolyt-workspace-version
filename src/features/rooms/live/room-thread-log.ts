/**
 * Console logging for the Room thread, in the same style as the AI chat's "🔥 SSE ..." lines but with its own marker (🧵), so both can be told
 * apart in one console: `🧵 <what happened>` followed by the details as indented JSON. Always on, on purpose, so what the thread is doing
 * (the feed connecting, every frame, the reducer, a send, a pending message) can be read at any time. Never logs the bearer token. Silent
 * outside a browser, so the node tests stay quiet.
 */
const replacer = (_key: string, value: unknown) => (typeof value === "bigint" ? value.toString() : value);

export function roomLog(label: string, details?: unknown): void {
  if (typeof window === "undefined") return;
  if (details === undefined) console.log(`🧵 ${label}`);
  else console.log(`🧵 ${label}`, JSON.stringify(details, replacer, 2));
}

export function roomWarn(label: string, details?: unknown): void {
  if (typeof window === "undefined") return;
  console.warn(`⚠️ ${label}`, details instanceof Error ? details.message : details === undefined ? "" : JSON.stringify(details, replacer, 2));
}

export function roomError(label: string, error: unknown): void {
  if (typeof window === "undefined") return;
  console.error(`❌ ${label}`, error);
}
