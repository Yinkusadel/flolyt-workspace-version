/**
 * Console logging for the close page, in the same style as the thread's 🧵 lines but with its own marker (🚪): `🚪 <what happened>` then the
 * details as indented JSON. Always on, on purpose, so what the form holds, what is still missing and the exact body that would be (or was)
 * sent can be read at any time.
 */
export function closeLog(label: string, details?: unknown): void {
  if (typeof window === "undefined") return;
  if (details === undefined) console.log(`🚪 ${label}`);
  else console.log(`🚪 ${label}`, JSON.stringify(details, null, 2));
}
