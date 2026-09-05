/**
 * Mock content for the Adopt stage — screens AD01-AD13 in
 * flolyt-figma-designs/flolyt-lifecycle/. Numbers and copy are transcribed
 * directly from those SVGs (each one's footer states its id, e.g.
 * "AD07 · Adopt · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";

// ---- Definition (AD01) is now the shared DefinitionRoute template — see
// stage/definition/definition-route.tsx. GET .../definition has no field for the feature-count
// verdict table below (0 through 4+ features vs. still-ordering-at-90-days), so it isn't
// reproducible from live data; dropped.

// ---- Overview (AD02) is wired to the shared GET /lifecycle/stages/{stageKey} — see
// overview-tab.tsx's buildStageKpis. Its leak table is wired too, to the same endpoint's
// `departures[]`.

export const ADOPT_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Ordered twice, never explored a second feature",
  carriedIn: [
    { label: "Stage", value: "Adopt" },
    { label: "Entered", value: "last 12 months" },
    { label: "Explored a feature", value: "false" },
    { label: "Markets", value: "all four" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "312,000 customers · ₦38M at stake",
  countedNote: "Counted 6 minutes ago · no prompt exists for this group",
  participants: [
    { initials: "ZY", kind: "human", color: "#7A5AA8" },
    { initials: "PR", kind: "agent" },
  ],
  participantsNote: "Product Reason leads · Zainab owns the stage, so she owns this",
};

export const ADOPT_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Adopt · overview · Nigeria",
  snapshotLabel: "Adopt · overview · Nigeria · as of 13 Aug 08:12",
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
    "Loyalty tiers is unavailable everywhere on this screen — it travels with the file rather than being dropped from it, an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Features (AD03) is now wired to GET /lifecycle/adopt/features — see features-tab.tsx. That
// endpoint has no orders/month-after, ship date, or verdict field per feature, so those columns
// and the narrative "insight cards" below aren't reproducible from live data. One-feature
// drilldown (AD04) below keeps its own unrelated mock — see [[flag_unreachable_routes]], now
// unreachable (no per-feature endpoint to key it off).

export type AdoptOutcomeRow = {
  id: string;
  whatTheyDidInstead: string;
  customers: string;
  ordersPerMonthNow: string;
  ordersNowTone: "ink" | "teal" | "amber" | "rose";
  was: string;
  stillCustomer90d: string;
  stillCustomerTone: "ink" | "teal" | "amber" | "rose";
};

export type FeatureDetail = {
  feature: string;
  headline: string;
  kpis: Kpi[];
  frictionEyebrow: string;
  frictionTitle: string;
  frictionRows: { label: string; value: string; percent: number; tone: BarTone }[];
  frictionCauseTitle: string;
  frictionCauseBody: string;
  outcomeEyebrow: string;
  outcomeRows: AdoptOutcomeRow[];
  closingTitle: string;
  closingBody: string;
};

export const ADOPT_FEATURE_DETAILS: Record<string, FeatureDetail> = {
  "scheduled-delivery": {
    feature: "Scheduled delivery",
    headline: "241,000 ever used · second use fell from 71% to 45% in the week of 4 March",
    kpis: [
      { eyebrow: "Ever used", value: "241,000", note: "20% of eligible customers" },
      { eyebrow: "Still using", value: "45.2%", tone: "rose", note: "was 71.4% before 4 March" },
      { eyebrow: "Orders per month while using", value: "8.9", tone: "teal", note: "highest of any feature" },
      { eyebrow: "At stake", value: "₦24M", tone: "rose", note: "and compounding" },
    ],
    frictionEyebrow: "The same change, felt seven times harder",
    frictionTitle: "The same change, felt seven times harder",
    frictionRows: [
      { label: "One-off orderer · sees the fee", value: "once per order · 1.4 orders/month", percent: 14, tone: "amber" },
      { label: "Scheduled weekly · sees the fee", value: "every week · 4.3 orders/month", percent: 43, tone: "rose" },
      { label: "Scheduled twice weekly", value: "every time · 8.9 orders/month", percent: 89, tone: "rose" },
    ],
    frictionCauseTitle: "A recurring customer meets a new fee more often than anyone else",
    frictionCauseBody:
      "The 4 March change added ₦350 at checkout. A weekly scheduled customer met it 22 times before June. Someone ordering occasionally met it four times. Scheduled delivery is the feature that most predicts retention and it took the largest share of the damage — which is the opposite of what anyone would have designed.",
    outcomeEyebrow: "What happened to the 132,000 who stopped scheduling",
    outcomeRows: [
      { id: "switched-one-off", whatTheyDidInstead: "Switched to one-off ordering", customers: "71,000", ordersPerMonthNow: "2.1", ordersNowTone: "amber", was: "8.4", stillCustomer90d: "64.1%", stillCustomerTone: "amber" },
      { id: "stopped-entirely", whatTheyDidInstead: "Stopped ordering entirely", customers: "41,000", ordersPerMonthNow: "0", ordersNowTone: "rose", was: "9.1", stillCustomer90d: "0%", stillCustomerTone: "rose" },
      { id: "moved-competitor", whatTheyDidInstead: "Moved to a competitor · inferred", customers: "Unavailable", ordersPerMonthNow: "—", ordersNowTone: "ink", was: "—", stillCustomer90d: "no source", stillCustomerTone: "ink" },
      { id: "reduced-monthly", whatTheyDidInstead: "Reduced to monthly scheduling", customers: "20,000", ordersPerMonthNow: "1.9", ordersNowTone: "amber", was: "8.8", stillCustomer90d: "81.4%", stillCustomerTone: "teal" },
    ],
    closingTitle: "41,000 of the company's best customers left without a single support ticket",
    closingBody:
      "They had the highest order frequency in the base and they did not complain, cancel a subscription or contact anyone. They stopped scheduling and then stopped ordering. Nothing in any tool at Lagos Foods would have flagged this — the only visible signal was a feature-usage number on a screen nobody owned.",
  },
};

// ---- Depth (AD05) is now wired to GET /lifecycle/adopt/depth — see depth-tab.tsx. That endpoint
// bands customers by total feature count only, with no first/second-feature pairing field, so the
// old mock's "which second feature matters most" table isn't reproducible from live data.

// ---- Not instrumented / blind spots (AD06) is now wired to GET /lifecycle/instrumentation — see
// blind-spots-tab.tsx. That's a workspace-wide endpoint (every gap names which stages it blocks),
// filtered there to this stage. No field estimates a per-gap cost the way the old mock's cards
// claimed to, so those aren't reproducible from live data.

// ---- Cohorts (AD07) is wired to the shared GET /lifecycle/stages/{stageKey}/cohorts — see
// acquire/data.ts's Cohorts note and cohorts-tab.tsx.

// ---- Markets (AD08) is wired to the shared GET /lifecycle/stages/{stageKey}/markets — see
// acquire/data.ts's Markets note and markets-tab.tsx.

// ---- What changed (AD09) ---------------------------------------------------
// Wired live (see stage/changes/changes-tab.tsx, GET /lifecycle/stages/{stageKey}/change-registry)
// — no mock export here anymore.

// ---- Agents (AD10) is wired to the shared GET /lifecycle/stages/{stageKey}/agents — see
// acquire/data.ts's Agents note and agents-tab.tsx.

export const ADOPT_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "Average features per customer falls", note: "features used ÷ eligible customers" },
  byMoreThan: { label: "By more than", value: "0.3 features", note: "against the trailing 28-day average" },
  sustainedFor: { label: "Sustained for", value: "7 days", note: "one bad week is noise and will not open a room" },
  segmentedBy: { label: "Segmented by", value: "market, feature", note: "so a single feature's drift is findable, not averaged away" },
  routesTo: { name: "The Adopt stage owner · Zainab Yusuf" },
  simulation: {
    title: "Against the last twelve months, this would have fired once",
    body: "On 4 March, when the delivery fee shipped and scheduled delivery broke — still open. No other week in the trailing year crossed the threshold.",
  },
};

// ---- History (AD11) is wired to the shared GET /lifecycle/stages/{stageKey}/history — see
// acquire/data.ts's History note and history-tab.tsx.

// ---- Compare periods (AD12) is wired to the shared GET /lifecycle/stages/{stageKey}/compare —
// see acquire/data.ts's Compare note and compare-route.tsx.

// ---- Request instrumentation (AD13, stage-specific modal) -----------------

export type ProposedEvent = { id: string; name: string; description: string };
export type UnblockRow = { label: string; value: string; tone: "neutral" | "amber" | "rose" };

export type RequestInstrumentationPreset = {
  subtitle: string;
  invisibleTitle: string;
  invisibleBody: string;
  needsEyebrow: string;
  events: ProposedEvent[];
  unblockEyebrow: string;
  unblockRows: UnblockRow[];
  obligationTitle: string;
  obligationBody: string;
};

export const ADOPT_REQUEST_INSTRUMENTATION_PRESET: RequestInstrumentationPreset = {
  subtitle: "Loyalty tiers · live 118 days with no reading",
  invisibleTitle: "Loyalty tiers · renamed 19 April",
  invisibleBody: "118 days live · no event · cannot be evaluated at all",
  needsEyebrow: "What Flolyt needs",
  events: [
    { id: "tier-shown", name: "loyalty.tier_shown", description: "when a customer sees their tier" },
    { id: "tier-changed", name: "loyalty.tier_changed", description: "when they move between tiers" },
    { id: "reward-redeemed", name: "loyalty.reward_redeemed", description: "when a tier benefit is used" },
  ],
  unblockEyebrow: "What this would unblock",
  unblockRows: [
    { label: "Adopt · features", value: "one of seven rows stops reading unavailable", tone: "neutral" },
    { label: "Adopt · what changed", value: "the April rename becomes evaluable", tone: "amber" },
    { label: "Advocate", value: "tier-driven referral behaviour, currently invisible", tone: "amber" },
    { label: "A 2026 decision", value: "whether to keep the rename or revert it", tone: "rose" },
  ],
  obligationTitle: "This becomes an obligation, not a message",
  obligationBody:
    "It goes to Engineering with an owner, a date and a state, and it appears on their handoff load. Engineering currently holds 41 obligations, 14 of them overdue and 11 of those instrumentation — which is context this request will arrive with.",
};
