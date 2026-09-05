/**
 * Mock content for the Price stage — screens PR01-PR13 in
 * flolyt-figma-designs/flolyt-lifecycle/. Numbers and copy are transcribed
 * directly from those SVGs (each one's footer states its id, e.g.
 * "PR07 · Price · cohorts").
 *
 * Price has no funnel and no time-to-value by design (PR01): it is a
 * condition every customer is permanently in, not a stage they pass
 * through. Its numbers are stocks, not flows.
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { CheckedRow, ActionCard } from "@/pages/everyday/lifecycle/stage/detail/detail-drilldown";
import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";

// ---- Definition (PR01) is now the shared DefinitionRoute template — see
// stage/definition/definition-route.tsx. GET .../definition has no field for the "what this stage
// needs, and what it has" checklist below, so it isn't reproducible from live data; dropped.

// ---- Overview (PR02) is wired to the shared GET /lifecycle/stages/{stageKey} — see
// overview-tab.tsx's buildStageKpis. Its leak table is wired too, to the same endpoint's
// `departures[]`.

export const PRICE_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Discount-only buyers pay less every time",
  carriedIn: [
    { label: "Stage", value: "Price" },
    { label: "Group", value: "Discount-only buyers" },
    { label: "Discounted orders", value: "100%" },
    { label: "Markets", value: "all four" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "94,000 customers · ₦31M at stake",
  countedNote: "Counted 6 minutes ago · trend worsening",
  participants: [
    { initials: "RM", kind: "human", color: "#5D6BB8" },
    { initials: "PX", kind: "agent" },
  ],
  participantsNote: "Price & Margin leads · Ravi owns the stage, so he owns this",
};

export const PRICE_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Price · overview · Nigeria",
  snapshotLabel: "Price · overview · Nigeria · as of 13 Aug 08:12",
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
    "Contribution margin is unavailable everywhere on this screen. It travels with the file rather than being dropped from it — an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Plans (PR03) is now wired to GET /lifecycle/price/plans — see plans-tab.tsx. That endpoint
// has no per-plan sticker price, orders/month, margin, or state field, so those columns and the
// narrative "decision cards" aren't reproducible from live data. One-plan drilldown (PR04) below
// keeps its own unrelated mock — see [[flag_unreachable_routes]], now unreachable (no per-plan
// endpoint to key it off).

export type PlanDetail = {
  plan: string;
  headline: string;
  kpis: Kpi[];
  eyebrow: string;
  checkedRows: CheckedRow[];
  causeTitle: string;
  causeBody: string;
  actionCards: ActionCard[];
};

export const PRICE_PLAN_DETAILS: Record<string, PlanDetail> = {
  "legacy-unlimited": {
    plan: "Legacy Unlimited",
    headline: "3,100 customers · ₦1,800/mo since 2022 · ₦93 revenue against ₦410 delivery per order",
    kpis: [
      { eyebrow: "Customers", value: "3,100", note: "0.07% of the base" },
      { eyebrow: "Price", value: "₦1,800/mo", tone: "rose", note: "unchanged since March 2022" },
      { eyebrow: "Orders per month", value: "19.4", tone: "rose", note: "2.2× the next heaviest plan" },
      { eyebrow: "Contribution", value: "Unavailable", tone: "amber", note: "the whole question" },
    ],
    eyebrow: "What can be said without cost of goods",
    checkedRows: [
      { id: "revenue-per-customer-year", question: "Revenue per customer per year", finding: "₦21,600 · billing", verdict: "measured", verdictTone: "teal" },
      { id: "orders-per-customer-year", question: "Orders per customer per year", finding: "233 · orders", verdict: "measured", verdictTone: "teal" },
      { id: "revenue-per-order", question: "Revenue per order", finding: "₦93 · computed", verdict: "measured", verdictTone: "teal" },
      { id: "revenue-per-order-other-plans", question: "Revenue per order · every other plan", finding: "₦1,180 – ₦2,140 · computed", verdict: "measured", verdictTone: "teal" },
      { id: "delivery-cost-nigeria", question: "Delivery cost per order · Nigeria", finding: "₦410 · delivery feed", verdict: "measured", verdictTone: "teal" },
      { id: "cogs-per-order", question: "Cost of goods per order", finding: "nothing connected", verdict: "unavailable", verdictTone: "rose" },
      { id: "contribution-per-order", question: "Contribution per order", finding: "blocked on the row above", verdict: "unavailable", verdictTone: "rose" },
    ],
    causeTitle: "Delivery alone costs ₦410 an order against ₦93 of revenue",
    causeBody:
      "That single comparison does not need cost of goods. Before a customer has eaten anything, every Legacy Unlimited order is ₦317 down on delivery. Three thousand one hundred customers placing 233 orders a year is roughly ₦229M of delivery cost against ₦67M of revenue.",
    actionCards: [
      {
        id: "blocker-that-was",
        eyebrow: "The blocker that was",
        tone: "amber",
        title: "“We cannot prove it without margin”",
        body: "Raised in a 2024 review and accepted. True of the full margin picture, and it stopped anyone from noticing that delivery cost alone already settles the question.",
        footnote: "two years, unrevisited",
      },
      {
        id: "real-constraint",
        eyebrow: "The real constraint",
        tone: "amber",
        title: "These are the loudest 3,100 customers",
        body: "Legacy Unlimited holders refer at 4.1× the base rate and 611 of them are in the top decile of the referral programme. Repricing them is not only a pricing decision.",
        footnote: "Advocate has no owner",
      },
      {
        id: "what-a-room-would-do",
        eyebrow: "What a room would do",
        tone: "teal",
        title: "Price the trade, do not assume it",
        body: "Model repricing against referral loss with a holdout of 300. Nobody has ever measured what these customers are worth in acquisition, only what they cost in delivery.",
        footnote: "₦0 to find out",
      },
    ],
  },
};

// ---- Margin (PR05) is now wired to GET /lifecycle/price/margin — see margin-tab.tsx. That
// endpoint returns real per-month margin (net of delivery cost, not full COGS-based contribution
// margin) whenever complete months exist — it is not the permanently-blocked screen the old mock
// assumed, so the "what is blocked across the product" table and its cards aren't reproducible
// (and don't apply) against live data.

// ---- Discounting (PR06) is now wired to GET /lifecycle/price/discounting — see
// discounting-tab.tsx. That endpoint has no blended KPI totals, no "full-price orders" field (only
// total orders and discounted orders — subtracting one from the other would be frontend business
// math), no single "at stake"/"verdict" per band, and no business-memory cards; none of those are
// reproducible from live data.

// ---- Cohorts (PR07) is wired to the shared GET /lifecycle/stages/{stageKey}/cohorts — see
// acquire/data.ts's Cohorts note and cohorts-tab.tsx.

// ---- Markets (PR08) is wired to the shared GET /lifecycle/stages/{stageKey}/markets — see
// acquire/data.ts's Markets note and markets-tab.tsx.

// ---- What changed (PR09) ---------------------------------------------------
// Wired live (see stage/changes/changes-tab.tsx, GET /lifecycle/stages/{stageKey}/change-registry)
// — no mock export here anymore.

// ---- Agents (PR10) is wired to the shared GET /lifecycle/stages/{stageKey}/agents — see
// acquire/data.ts's Agents note and agents-tab.tsx.

export const PRICE_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "Discount depth rises", note: "discounted revenue ÷ gross revenue" },
  byMoreThan: { label: "By more than", value: "2 percentage points", note: "against the trailing 28-day average" },
  sustainedFor: { label: "Sustained for", value: "3 days", note: "one bad day is noise and will not open a room" },
  segmentedBy: { label: "Segmented by", value: "plan, market", note: "so a single plan's drift is findable, not averaged away" },
  routesTo: { name: "The Price stage owner · Ravi Mehta" },
  simulation: {
    title: "Against the last twelve months, this would have fired once",
    body: "On 16 March, when discount depth was raised from 15% to 20% — still open. No other week in the trailing year crossed the threshold.",
  },
};

// ---- History (PR11) is wired to the shared GET /lifecycle/stages/{stageKey}/history — see
// acquire/data.ts's History note and history-tab.tsx.

// ---- Compare periods (PR12) is wired to the shared GET /lifecycle/stages/{stageKey}/compare —
// see acquire/data.ts's Compare note and compare-route.tsx.

// ---- Connect a COGS source (PR13, stage-specific modal) — removed along with the Margin tab's
// CTA: GET /lifecycle/price/margin has no boolean gate (like Unit economics' hasMargin) to justify
// showing this unconditionally, and months[] being empty could just as easily mean no order
// history yet, not a missing cost source. connect-a-cogs-source-modal.tsx deleted (this was its
// only caller).
