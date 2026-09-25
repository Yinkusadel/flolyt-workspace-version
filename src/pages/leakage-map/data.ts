/**
 * Static content for the leakage map, rebuilt from
 * flolyt-figma-designs/New-pages-pattern/leakage-new/svg/01–12. The export's own caption says
 * this is a fixed "live-demo sample" — kept here now only as a record of what the Figma export
 * looked like, and shrinking as each section gets wired to `GET /leakage` (see
 * docs/leakage-map/build-plan.md). Calc mode / Window / Horizon / Severity / Confidence filter
 * option lists used to live here — they're wired now and live in filters.ts instead, sourced from
 * the live response where it supplies them, per [[feedback_retire_mock_options_not_extend]].
 * Coverage panel, actions panel, "how is this calculated", market breakdown, and the shared page
 * footer were all fully mock too — wired (or dropped, for actions/footer, which had no API
 * equivalent at all) as of Step 5.
 */

export type ConfidenceLevel = "low" | "medium" | "high";
export const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = { low: "Low", medium: "Medium", high: "High" };

// ---------------------------------------------------------------------------
// Matrix — the mock's hardcoded 5×5 grid, 5 authored cell states, and per-cell severity/confidence
// ranking are gone as of Step 4 (see docs/leakage-map/build-plan.md): `matrix.tsx` now renders
// `GET /leakage`'s own dynamic `grids[]`, and the server already excludes severity/confidence-
// filtered cells from that response rather than the client hiding them. `HEAT_SCALE`/
// `HEAT_TEXT_CLASS` survive unchanged — purely decorative constants, not mock data — now driven by
// each real cell's own `intensity` field instead of an authored `heat` property.
// ---------------------------------------------------------------------------

/** Sequential rose-tint heat scale for "how much is at risk in this cell" — 0 is the legend's unused LOW swatch. */
export const HEAT_SCALE = ["#F5F5F4", "#FBEBE7", "#F4CFC7", "#E5A79B"] as const;
export const HEAT_TEXT_CLASS = ["text-ink-2", "text-ink-2", "text-ink", "text-ink"] as const;

// ---------------------------------------------------------------------------
// Page states (12-states.svg) — empty/error render as a `PageStateBanner`; loading is now
// `recomputing-toast.tsx`'s own floating toast (a fixed-position overlay, not in-flow, so a
// refetch never shifts the page — see that file).
// ---------------------------------------------------------------------------

export const PAGE_STATES = {
  empty: {
    title: "No leakage data yet",
    body: "Connect at least one source to see your exposure map.",
    footnote: "One source is enough to start; coverage is shown from the first cell.",
    cta: "Connect a source",
  },
  error: {
    title: "Unable to refresh the leakage map",
    body: "Last successful refresh 41 minutes ago. Nothing below has been re-estimated.",
    footnote: "The stale figures stay on screen with their timestamp rather than being blanked.",
    cta: "Retry",
  },
};
