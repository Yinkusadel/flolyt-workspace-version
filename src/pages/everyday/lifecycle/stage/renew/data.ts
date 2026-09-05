/**
 * Mock content for the Renew stage — screens RN01-RN13 in
 * flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/. Numbers and copy
 * are transcribed directly from those SVGs (each one's footer states its
 * id, e.g. "RN06 · Renew · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";
import type { ReForecastBookPreset } from "@/pages/everyday/lifecycle/stage/modals/re-forecast-the-book-modal";

// ---- Definition (RN01) is now the shared DefinitionRoute template — see
// stage/definition/definition-route.tsx. GET .../definition has no field for the renewed/
// cancelled/paused/card-failed/lapsed-silently outcome breakdown below, so it isn't reproducible
// from live data; dropped.

// ---- Overview (RN02) is wired to the shared GET /lifecycle/stages/{stageKey} — see
// overview-tab.tsx's buildStageKpis. Its leak table is wired too, to the same endpoint's
// `departures[]`.

export const RENEW_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Pauses after the delivery fee",
  carriedIn: [
    { label: "Stage", value: "Renew" },
    { label: "Entered", value: "last 90 days" },
    { label: "Paused", value: "true" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "9,100 customers · ₦22M at stake",
  countedNote: "Counted 6 minutes ago · worsening since 4 March",
  participants: [
    { initials: "NB", kind: "human", color: "#2E8B7F" },
    { initials: "IC", kind: "agent" },
  ],
  participantsNote: "Involuntary Churn leads · Ngozi owns the stage, so she owns this",
};

export const RENEW_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Renew · overview · Nigeria",
  snapshotLabel: "Renew · overview · Nigeria · as of 13 Aug 08:12",
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
    "The ₦88M overstatement in the renewal book travels with the file rather than being dropped from it — an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Renewal book (RN03, route path "book") ------------------------------

// GET /lifecycle/renew/renewal-book has no projected-rate/confidence/basis/owner field and no
// per-row drilldown — only raw customer/value counts per band+state+currency. The old KPIs,
// per-row breakdown and warning/closing narrative above aren't reproducible from live data;
// dropped. See renewal-book-tab.tsx.

export const RENEW_REFORECAST_PRESET: ReForecastBookPreset = {
  description: "Four days overdue · everyone downstream is using the old figure",
  currentAssumptionsEyebrow: "What the book currently assumes",
  currentAssumptions: [
    { label: "90-day repeat rate", value: "37.4% · measured February" },
    { label: "Built", value: "July, from a June extract" },
    { label: "Known wrong since", value: "2 August · room 8f2c" },
  ],
  rebuildEyebrow: "Rebuild it on",
  options: [
    { id: "current-repeat-rate", title: "The current repeat rate · 27.2%", subtitle: "What is actually happening today", selected: true },
    { id: "blended-rate", title: "A blended rate · 31.1%", subtitle: "Weights pre and post March cohorts by how many renew when" },
    { id: "post-fix-projection", title: "Post-fix projection · 33.4%", subtitle: "Assumes the 7 August basket fix works · not yet measured" },
  ],
  numberChange: {
    from: "₦608M",
    to: "₦520M",
    delta: "−₦88M · flows into Ada's projection, the board pack and Finance",
    note: "Everyone currently using the old figure is told, with the reason",
  },
  warningTitle: "The third option is offered and is not the default",
  warningBody:
    "Assuming the August fix works would produce a friendlier number that nobody can defend yet. Flolyt will build it if Kunle chooses it, labelled as a projection on an unmeasured change — but the default is what is currently true.",
};

// ---- Dunning (RN04) ------------------------------------------------------

// GET /lifecycle/renew/dunning has no per-retry-window attempts/cleared/rate breakdown and no
// "what the closed room recovered" figure — only failed payments banded by how long they took to
// clear (or never). The old KPIs, per-window table and recovery bars above aren't reproducible
// from live data; dropped. See dunning-tab.tsx.

export const RENEW_DUNNING_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Expired cards, never prompted",
  carriedIn: [
    { label: "Stage", value: "Renew" },
    { label: "Entered", value: "last 12 months" },
    { label: "Card expired", value: "true" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "14,200 customers · ₦19M at stake",
  countedNote: "Counted 6 minutes ago · the cheapest outstanding recovery in the lifecycle",
  participants: [
    { initials: "NB", kind: "human", color: "#2E8B7F" },
    { initials: "IC", kind: "agent" },
  ],
  participantsNote: "Involuntary Churn leads · Ngozi owns the stage, so she owns this",
};

// ---- Pauses (RN05) --------------------------------------------------------

// GET /lifecycle/renew/pauses's own doc note is explicit: "nothing in the schema carries a pause
// status or reason" — a pause is a gap, not a recorded event, so the old mock's entire
// reason-based breakdown (KPIs, return-rate bars, per-reason table, closing narrative) is
// fabricated for this endpoint and isn't reproducible from live data; dropped. See pauses-tab.tsx.

export const RENEW_PAUSES_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Paused, cited “too expensive” since 4 March",
  carriedIn: [
    { label: "Stage", value: "Renew" },
    { label: "Entered", value: "since 4 March" },
    { label: "Reason", value: "too expensive" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "4,900 customers · +18 pts share since February",
  countedNote: "Counted 6 minutes ago · describing the delivery fee, not the subscription price",
  participants: [
    { initials: "NB", kind: "human", color: "#2E8B7F" },
    { initials: "CH", kind: "agent" },
  ],
  participantsNote: "Churn Reason leads · Ngozi owns the stage, so she owns this",
};

// ---- Cohorts (RN06) is wired to the shared GET /lifecycle/stages/{stageKey}/cohorts — see
// acquire/data.ts's Cohorts note and cohorts-tab.tsx.

// ---- Markets (RN07) is wired to the shared GET /lifecycle/stages/{stageKey}/markets — see
// acquire/data.ts's Markets note and markets-tab.tsx.

// ---- What changed (RN08) ---------------------------------------------------
// Wired live (see stage/changes/changes-tab.tsx, GET /lifecycle/stages/{stageKey}/change-registry)
// — no mock export here anymore.

// ---- Agents (RN09) is wired to the shared GET /lifecycle/stages/{stageKey}/agents — see
// acquire/data.ts's Agents note and agents-tab.tsx.

export const RENEW_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "A fix is not rolled out to every market", note: "a change proven to work in one market has not reached another" },
  byMoreThan: { label: "By more than", value: "14 days after the first", note: "the gap between when it worked somewhere and everywhere" },
  sustainedFor: { label: "Sustained for", value: "0 days", note: "opens immediately once the 14-day window passes" },
  segmentedBy: { label: "Segmented by", value: "market, fix", note: "so a single market's gap is findable, not averaged away" },
  routesTo: { name: "The Renew stage owner · Ngozi Bello" },
  simulation: {
    title: "Against the last twelve months, this would have fired once",
    body: "On 2 April, when the retry-window fix rolled out everywhere except Ghana — 134 days ago and still unrouted. It is why Ghana is still retrying cards at midnight.",
  },
};

// ---- History (RN10) is wired to the shared GET /lifecycle/stages/{stageKey}/history — see
// acquire/data.ts's History note and history-tab.tsx.

// ---- Compare periods (RN11) is wired to the shared GET /lifecycle/stages/{stageKey}/compare —
// see acquire/data.ts's Compare note and compare-route.tsx.

// ---- One account (RN13, /lifecycle/renew/book/:id) -------------------------

export type RenewAccountEvent = {
  id: string;
  date: string;
  title: string;
  titleTone: "teal" | "amber" | "rose";
  body: string;
  actor: string;
};

export type RenewAccountDetail = {
  title: string;
  subtitle: string;
  modeBadge: string;
  kpis: Kpi[];
  timelineEyebrow: string;
  events: RenewAccountEvent[];
  closingTitle: string;
  closingBody: string;
};

export const RENEW_ACCOUNT_DETAILS: Record<string, RenewAccountDetail> = {
  "kano-textiles": {
    title: "Kano Textiles",
    subtitle: "₦2.1M · 120 seats · utilisation 71% → 34% since March · renews in 31 days",
    modeBadge: "Accounts mode · one business, not a cohort",
    kpis: [
      { eyebrow: "Annual value", value: "₦2.1M", note: "120 seats" },
      { eyebrow: "Renews", value: "14 September", tone: "amber", note: "31 days" },
      { eyebrow: "Seat utilisation", value: "34%", tone: "rose", note: "41 of 120 ordered this month" },
      { eyebrow: "Health", value: "At risk", tone: "rose", note: "since 4 March" },
    ],
    timelineEyebrow: "What happened to this account, in order",
    events: [
      { id: "signed", date: "Jan 2026", title: "Signed · 120 seats", titleTone: "teal", body: "₦2.1M annual", actor: "Tunde Bakare" },
      { id: "utilisation-71", date: "Feb", title: "Seat utilisation 71%", titleTone: "teal", body: "85 of 120 ordering", actor: "—" },
      { id: "fee-moved", date: "4 Mar", title: "Delivery fee moved to checkout", titleTone: "rose", body: "Every order now shows a fee", actor: "Engineering" },
      { id: "utilisation-52", date: "Apr", title: "Utilisation 52%", titleTone: "amber", body: "62 of 120 ordering", actor: "—" },
      { id: "office-manager-asked", date: "Jun", title: "Office manager asked about the fee", titleTone: "amber", body: "Answered in 3 min · resolved · no escalation", actor: "Support" },
      { id: "utilisation-34", date: "Aug", title: "Utilisation 34%", titleTone: "rose", body: "41 of 120 · below the renewal threshold", actor: "—" },
      { id: "renews", date: "14 Sep", title: "Renews", titleTone: "rose", body: "No conversation has happened yet", actor: "Tunde Bakare" },
    ],
    closingTitle: "A 120-seat account has been quietly halving since March and the only human contact was a three-minute support ticket",
    closingBody:
      "Everything Flolyt needed was in the data from April. Seat utilisation is a stage metric, the fee is a release, the support ticket is a contact driver — three signals in three stages, one account, and no room. It renews in 31 days.",
  },
};

export const RENEW_ACCOUNT_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Seat utilisation halved since a fee changed, no conversation yet",
  carriedIn: [
    { label: "Account", value: "Kano Textiles" },
    { label: "Renews", value: "14 September · 31 days" },
    { label: "Utilisation", value: "34% · was 71%" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "₦2.1M annual · 120 seats",
  countedNote: "Counted 6 minutes ago · at risk since 4 March",
  participants: [
    { initials: "TB", kind: "human", color: "#B4568F" },
    { initials: "IC", kind: "agent" },
  ],
  participantsNote: "Involuntary Churn leads · Tunde owns the account",
};
