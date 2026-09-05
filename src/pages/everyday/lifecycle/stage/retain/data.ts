/**
 * Mock content for the Retain stage — screens RT01-RT13 in
 * flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/. Numbers and copy
 * are transcribed directly from those SVGs (each one's footer states its
 * id, e.g. "RT07 · Retain · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";

// ---- Definition (RT01) is now the shared DefinitionRoute template — see
// stage/definition/definition-route.tsx. GET .../definition has no field for the reachability-
// by-window table below (0-30 through 121+ days), so it isn't reproducible from live data; dropped.

// ---- Overview (RT02) is wired to the shared GET /lifecycle/stages/{stageKey} — see
// overview-tab.tsx's buildStageKpis. Its leak table is wired too, to the same endpoint's
// `departures[]`.

export const RETAIN_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Acquired Mar–May · the fee cohort",
  carriedIn: [
    { label: "Stage", value: "Retain" },
    { label: "Entered", value: "Mar–May" },
    { label: "Placed a second order", value: "false" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "148,000 customers · ₦412M at stake",
  countedNote: "Counted 6 minutes ago · 94% still reachable inside the window",
  participants: [
    { initials: "IN", kind: "human", color: "#79883A" },
    { initials: "RD", kind: "agent" },
  ],
  participantsNote: "Repeat & Decay leads · Ifeoma owns the stage, so she owns this",
};

export const RETAIN_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Retain · overview · Nigeria",
  snapshotLabel: "Retain · overview · Nigeria · as of 13 Aug 08:12",
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
    "142,000 of these customers cannot be contacted by anybody, ever — that travels with the file rather than being dropped from it. An export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Repeat curve (RT03) is now wired to GET /lifecycle/retain/repeat-curve — see
// repeat-curve-tab.tsx. That endpoint has no before/after comparison field, so the old mock's
// "curve before and after 4 March" table isn't reproducible from live data.

// ---- Segments (RT04) is now wired to GET /lifecycle/retain/segments — see segments-tab.tsx.
// That endpoint has no blended "vs base" baseline or single "At stake" money figure per segment,
// so those columns aren't reproducible from live data. One-segment drilldown (RT05) below is
// unrelated to this endpoint and stays its own mock.

export type RetainSegmentDetailRow = {
  id: string;
  subSegment: string;
  customers: string;
  reachable: string;
  reachableTone: "teal" | "rose";
  expectedResponse: string;
  expectedResponseTone: "teal" | "amber" | "neutral";
  recoverableValue: string;
  recoverableValueTone: "teal" | "amber" | "rose";
  inTheWave: string;
  inTheWaveTone: ChipTone;
};

export type RetainSegmentDetail = {
  title: string;
  headline: string;
  kpis: Kpi[];
  tableEyebrow: string;
  rows: RetainSegmentDetailRow[];
  closingTitle: string;
  closingBody: string;
  costEyebrow: string;
  costRows: { label: string; value: string; percent: number; tone: BarTone }[];
  finalTitle: string;
  finalBody: string;
};

export const RETAIN_SEGMENT_DETAILS: Record<string, RetainSegmentDetail> = {
  "acquired-mar-may": {
    title: "Acquired March to May",
    headline: "148,000 customers · 100,000 actually reachable · ₦2.1M a day of decay",
    kpis: [
      { eyebrow: "Customers", value: "148,000", note: "acquired 1 Mar – 31 May" },
      { eyebrow: "Placed a second order", value: "0", tone: "rose", note: "by definition" },
      { eyebrow: "At stake", value: "₦412M", tone: "rose", note: "over 90 days" },
      { eyebrow: "Ageing out", value: "4,100 / day", tone: "rose", note: "past the 90-day cliff" },
    ],
    tableEyebrow: "Who is actually in the 148,000",
    rows: [
      { id: "ordinary", subSegment: "Ordinary · fee is the only known cause", customers: "71,000", reachable: "98%", reachableTone: "teal", expectedResponse: "16.1%", expectedResponseTone: "teal", recoverableValue: "₦198M", recoverableValueTone: "teal", inTheWave: "yes", inTheWaveTone: "teal" },
      { id: "guest-checkout", subSegment: "Guest checkout · no contact details", customers: "42,000", reachable: "0%", reachableTone: "rose", expectedResponse: "—", expectedResponseTone: "neutral", recoverableValue: "₦0", recoverableValueTone: "rose", inTheWave: "dropped at send", inTheWaveTone: "rose" },
      { id: "late-or-failed-delivery", subSegment: "Late or failed first delivery", customers: "18,000", reachable: "91%", reachableTone: "teal", expectedResponse: "9.1%", expectedResponseTone: "amber", recoverableValue: "₦41M", recoverableValueTone: "amber", inTheWave: "yes · different message", inTheWaveTone: "amber" },
      { id: "bought-at-20-off", subSegment: "Bought at 20% off", customers: "11,000", reachable: "88%", reachableTone: "teal", expectedResponse: "11.1%", expectedResponseTone: "amber", recoverableValue: "₦19M", recoverableValueTone: "amber", inTheWave: "yes · no offer", inTheWaveTone: "amber" },
      { id: "already-in-thursday", subSegment: "Already in Thursday's win-back", customers: "6,000", reachable: "100%", reachableTone: "teal", expectedResponse: "—", expectedResponseTone: "neutral", recoverableValue: "—", recoverableValueTone: "amber", inTheWave: "excluded · cap", inTheWaveTone: "rose" },
    ],
    closingTitle: "The room says 148,000. The wave will reach 100,000.",
    closingBody:
      "42,000 have no contact details and 6,000 would breach the frequency cap. Neither number appears on the room header and both are known before anything sends. A play that says 148,000 and delivers to 100,000 is how a 16% response rate quietly becomes an 11% one in the review.",
    costEyebrow: "What the cost of waiting actually is",
    costRows: [
      { label: "Recoverable today · 100,000 reachable", value: "₦258M at 16.1% response", percent: 100, tone: "teal" },
      { label: "In 14 days · 57,400 age out", value: "₦110M", percent: 43, tone: "amber" },
      { label: "In 30 days · 100% past the cliff", value: "₦18M at 4.2% response", percent: 7, tone: "rose" },
    ],
    finalTitle: "₦2.1M a day, and it is not linear",
    finalBody:
      "About 4,100 customers cross the 90-day line daily and their response rate falls from 16.1% to 4.2% the moment they do. The approval has been waiting nineteen hours, which is roughly 3,300 customers and ₦8M already past saving.",
  },
};

// ---- Reactivation (RT06) is now wired to GET /lifecycle/retain/reactivation — see
// reactivation-tab.tsx. That endpoint has no "sent"/"window"/"offer" fields or the three
// narrative agent cards below, so those aren't reproducible from live data. Build an audience
// (RT13) below is a separate, still-unwired mutation flow and stays its own mock.

export type BuildAudienceCriteriaRow = { label: string; value: string };
export type BuildAudienceExclusionRow = { label: string; value: string; note?: string; final?: boolean };

export type BuildAudiencePreset = {
  subtitle: string;
  criteriaEyebrow: string;
  criteria: BuildAudienceCriteriaRow[];
  exclusionsEyebrow: string;
  matchedLabel: string;
  matchedValue: string;
  exclusions: BuildAudienceExclusionRow[];
  finalLabel: string;
  finalValue: string;
  summaryTitle: string;
  summaryBody: string;
  closingTitle: string;
  closingBody: string;
};

export const RETAIN_BUILD_AUDIENCE_PRESET: BuildAudiencePreset = {
  subtitle: "Exclusions are applied and shown before you build, not at send",
  criteriaEyebrow: "Who",
  criteria: [
    { label: "Acquired between", value: "1 Mar and 31 May" },
    { label: "Orders placed", value: "exactly 1" },
    { label: "Days since first order", value: "7 to 90 · inside the window" },
    { label: "Markets", value: "Nigeria" },
  ],
  exclusionsEyebrow: "Who drops out, and why · shown before you build",
  matchedLabel: "Matched the condition",
  matchedValue: "148,000",
  exclusions: [
    { label: "No contact details · guest checkout", value: "−42,000", note: "cannot be reached by anyone" },
    { label: "Frequency cap · Thursday win-back", value: "−6,000", note: "would be a second message in 48 hrs" },
    { label: "Opted out or erasure requested", value: "−2,400", note: "excluded permanently" },
  ],
  finalLabel: "Will actually receive it",
  finalValue: "100,000",
  summaryTitle: "100,000 reachable · ₦258M recoverable",
  summaryBody: "At 16.1% response · three waves of 33,000 · 10% held back",
  closingTitle: "The audience number is the reachable one, everywhere",
  closingBody:
    "The room header, the play, the approval and the result all say 100,000. Building an audience that quietly shrinks by a third between approval and send is how a campaign that worked gets reviewed as one that did not.",
};

// ---- Cohorts (RT07) is wired to the shared GET /lifecycle/stages/{stageKey}/cohorts — see
// acquire/data.ts's Cohorts note and cohorts-tab.tsx.

// ---- Markets (RT08) is wired to the shared GET /lifecycle/stages/{stageKey}/markets — see
// acquire/data.ts's Markets note and markets-tab.tsx.

// ---- What changed (RT09) ---------------------------------------------------
// Wired live (see stage/changes/changes-tab.tsx, GET /lifecycle/stages/{stageKey}/change-registry)
// — no mock export here anymore.

// ---- Agents (RT10) is wired to the shared GET /lifecycle/stages/{stageKey}/agents — see
// acquire/data.ts's Agents note and agents-tab.tsx.

export const RETAIN_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "Repeat rate falls", note: "second orders ÷ acquired, 90-day window" },
  byMoreThan: { label: "By more than", value: "2 percentage points", note: "against the trailing 28-day average" },
  sustainedFor: { label: "Sustained for", value: "7 days", note: "one bad week is noise and will not open a room" },
  segmentedBy: { label: "Segmented by", value: "market, cohort", note: "so a single market's drift is findable, not averaged away" },
  routesTo: { name: "The Retain stage owner · Ifeoma Nwosu" },
  simulation: {
    title: "Against the last twelve months, this would have fired twice",
    body: "Once on 4 March, when the delivery fee shipped — still open. Once on 9 June, when Kenya shipped the same change — still open. No other week in the trailing year crossed the threshold.",
  },
};

// ---- History (RT11) is wired to the shared GET /lifecycle/stages/{stageKey}/history — see
// acquire/data.ts's History note and history-tab.tsx.

// ---- Compare periods (RT12) is wired to the shared GET /lifecycle/stages/{stageKey}/compare —
// see acquire/data.ts's Compare note and compare-route.tsx.
