/**
 * Mock content for the Support stage — screens SU01-SU13 in
 * flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/. Numbers and copy
 * are transcribed directly from those SVGs (each one's footer states its
 * id, e.g. "SU06 · Support · cohorts").
 */

import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";

// ---- Definition (SU01) is now the shared DefinitionRoute template — see
// stage/definition/definition-route.tsx. GET .../definition has no field for the silent-failure
// outcome breakdown below, so it isn't reproducible from live data; dropped.

// ---- Overview (SU02) is wired to the shared GET /lifecycle/stages/{stageKey} — see
// overview-tab.tsx's buildStageKpis.

// Overview (SU02) leak table is wired to GET /lifecycle/stages/{stageKey}'s `departures[]` —
// see overview-tab.tsx.

export const SUPPORT_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Late delivery, no acknowledgement",
  carriedIn: [
    { label: "Stage", value: "Support" },
    { label: "Entered", value: "last 30 days" },
    { label: "Contacted us", value: "false" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "31,400 customers · ₦3M at stake",
  countedNote: "Counted 6 minutes ago · worsening since 4 March",
  participants: [
    { initials: "AO", kind: "human", color: "#C56A2E" },
    { initials: "SS", kind: "agent" },
  ],
  participantsNote: "Support Signal leads · Amara owns the stage, so she owns this",
};

export const SUPPORT_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Support · overview · Nigeria",
  snapshotLabel: "Support · overview · Nigeria · as of 13 Aug 08:12",
  shareOptions: [
    { id: "workspace", title: "Anyone at Lagos Foods with lifecycle access", note: "412 people · the default" },
    { id: "link", title: "This link, for anyone who has it", note: "expires in 7 days · no customer-level data ever travels" },
    { id: "snapshot", title: "A dated snapshot instead", note: "frozen at today's figures · for a board pack" },
  ],
  exportFormats: [
    { id: "csv", label: "CSV", note: "the tables" },
    { id: "pdf", label: "PDF", note: "board-ready" },
    { id: "png", label: "PNG", note: "one chart" },
  ],
  caveatTitle: "Every export carries its own asterisks",
  caveatBody:
    "The ₦38M behind silent failures is not on any support dashboard — it travels with the file rather than being dropped from it, an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Contact drivers (SU03, route path "drivers") --------------------------

// GET /lifecycle/support/contact-drivers has no handle-time, vs-prior-period, repeat-rate-after,
// or "really a ___" reclassification field — the old mock's table and timeline cards above aren't
// reproducible from live data; dropped. See contact-drivers-tab.tsx.

export type ReclassifyOption = { id: string; title: string; body: string; selected?: boolean };

export type ReclassifyPreset = {
  driverSummary: string;
  driverDetail: string;
  optionsEyebrow: string;
  options: ReclassifyOption[];
  effectsEyebrow: string;
  effects: { label: string; value: string; tone: "teal" | "amber" | "neutral" }[];
  closingTitle: string;
  closingBody: string;
};

export const SUPPORT_RECLASSIFY_PRESET: ReclassifyPreset = {
  driverSummary: "Payment failed · 4,100 tickets a month",
  driverDetail: "Handle time 3.1 min · repeat rate after 11.4% · lowest of any driver",
  optionsEyebrow: "Reclassify it as",
  options: [
    { id: "support-issue", title: "A support issue", body: "stays here · measured on cost per contact" },
    { id: "revenue-signal", title: "A revenue signal in this stage", body: "stays here · measured on what happens next" },
    { id: "renew-symptom", title: "A symptom owned by Renew", body: "the cause is involuntary churn · 61,400 cards fail monthly", selected: true },
  ],
  effectsEyebrow: "What reclassifying does",
  effects: [
    { label: "Opens a room", value: "immediately · in Renew, owned by Ravi Mehta", tone: "teal" },
    { label: "Moves the value", value: "₦4M leaves Support's figure and enters Renew's", tone: "amber" },
    { label: "Keeps the tickets here", value: "Support still handles them · only the cause moves", tone: "neutral" },
    { label: "Is logged and reversible", value: "with your name, the date and the reason", tone: "neutral" },
  ],
  closingTitle: "This is the control that did not exist on 11 March",
  closingBody:
    "Support Signal reclassified “where is my order” as a revenue driver in week one and had no way to send it anywhere. This screen is that missing action — and it is deliberately a person's decision, because moving a number out of one team's stage and into another's is not something an agent should do alone.",
};

// ---- Resolution (SU04) -----------------------------------------------------

// GET /lifecycle/support/resolution has no "resolved fast"/"customer satisfied"/repeat-rate-after/
// verdict field — only ticket/resolved/open counts and timing per driver. The old mock's KPIs and
// table above aren't reproducible from live data; dropped. See resolution-tab.tsx.

// GET /lifecycle/support/deflection has no cost-saved, repeat-rate-after, or "vs contacting a
// human" field — the old mock's KPIs and table above aren't reproducible from live data; dropped.
// See deflection-tab.tsx.

// GET /lifecycle/support/silent-failures returns four workspace-wide scalars, not a per-outcome
// breakdown — the old mock's table (by "what happened") and closing cards above have no matching
// field at all; dropped. See silent-failures-route.tsx.

// ---- Cohorts (SU06) is wired to the shared GET /lifecycle/stages/{stageKey}/cohorts — see
// acquire/data.ts's Cohorts note and cohorts-tab.tsx.

// ---- Markets (SU07) is wired to the shared GET /lifecycle/stages/{stageKey}/markets — see
// acquire/data.ts's Markets note and markets-tab.tsx.

// ---- What changed (SU08) ---------------------------------------------------
// Wired live (see stage/changes/changes-tab.tsx, GET /lifecycle/stages/{stageKey}/change-registry)
// — no mock export here anymore.

// ---- Agents (SU09) is wired to the shared GET /lifecycle/stages/{stageKey}/agents — see
// acquire/data.ts's Agents note and agents-tab.tsx.

export const SUPPORT_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "A contact driver is reclassified as revenue", note: "Support Signal's own classification changes" },
  byMoreThan: { label: "By more than", value: "any", note: "any reclassification is worth a look" },
  sustainedFor: { label: "Sustained for", value: "0 days", note: "opens immediately · this is the one rule that fires on day one" },
  segmentedBy: { label: "Segmented by", value: "driver, market", note: "so a single driver's reclassification is findable, not averaged away" },
  routesTo: { name: "The Support stage owner · Amara Okeke" },
  simulation: {
    title: "Against the last twelve months, this would have fired twice",
    body: "Once on 11 March, when “where is my order” was reclassified — 144 days before anyone acted. Once this month, on the payment-failed driver, which is why it opens now instead of waiting.",
  },
};

// ---- History (SU10) is wired to the shared GET /lifecycle/stages/{stageKey}/history — see
// acquire/data.ts's History note and history-tab.tsx.

// ---- Compare periods (SU11) is wired to the shared GET /lifecycle/stages/{stageKey}/compare —
// see acquire/data.ts's Compare note and compare-route.tsx.
