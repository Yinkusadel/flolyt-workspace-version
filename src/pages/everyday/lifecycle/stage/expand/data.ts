/**
 * Mock content for the Expand stage — screens EX01-EX13 in
 * flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/. Numbers and copy
 * are transcribed directly from those SVGs (each one's footer states its
 * id, e.g. "EX07 · Expand · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { InsightCard } from "@/pages/everyday/lifecycle/stage/activate/data";
import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";
import type { RequestInstrumentationPreset } from "@/pages/everyday/lifecycle/stage/adopt/data";

// ---- Definition (EX01) is now the shared DefinitionRoute template — see
// stage/definition/definition-route.tsx. GET .../definition has no field for the basket/plan/
// account/category breakdown below, so it isn't reproducible from live data; dropped.

// ---- Overview (EX02) is wired to the shared GET /lifecycle/stages/{stageKey} — see
// overview-tab.tsx's buildStageKpis. Its leak table is wired too, to the same endpoint's
// `departures[]`.

export const EXPAND_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Never prompted to upgrade · high-frequency",
  carriedIn: [
    { label: "Stage", value: "Expand" },
    { label: "Entered", value: "active in 90 days" },
    { label: "Past plan break-even", value: "true" },
    { label: "Ever prompted", value: "false" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "94,000 customers · ₦31M at stake",
  countedNote: "Counted 6 minutes ago · no prompt exists anywhere in the product",
  participants: [
    { initials: "TB", kind: "human", color: "#B4568F" },
    { initials: "EX", kind: "agent" },
  ],
  participantsNote: "Expansion leads · Tunde owns the stage, so he owns this",
};

export const EXPAND_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Expand · overview · Nigeria",
  snapshotLabel: "Expand · overview · Nigeria · as of 13 Aug 08:12",
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
    "Category expansion is unavailable everywhere on this screen — it travels with the file rather than being dropped from it, an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Upgrade paths (EX03) + one-path drilldown (EX04) ---------------------

// GET /lifecycle/expand/upgrade-paths has no eligible/upgraded/rate/value-per-upgrade/prompted/
// verdict field, and can't tell an upgrade from a downgrade without plan pricing (its own callout
// says so) — the old mock's table and insight cards above aren't reproducible from live data;
// dropped. See upgrade-paths-tab.tsx.

export type UpgradePathDetailRow = {
  id: string;
  ordersPerMonth: string;
  customers: string;
  paysNow: string;
  wouldPay: string;
  wouldPayTone: "teal" | "rose";
  saves: string;
  savesTone: "teal" | "neutral";
  upgraded: string;
  upgradedTone: "teal" | "amber" | "rose" | "neutral";
  everPrompted: string;
  everPromptedTone: ChipTone;
};

export type UpgradePathDetail = {
  fromTo: string;
  headline: string;
  kpis: Kpi[];
  tableEyebrow: string;
  rows: UpgradePathDetailRow[];
  closingTitle: string;
  closingBody: string;
  cardsEyebrow: string;
  cards: InsightCard[];
};

export const EXPAND_UPGRADE_PATH_DETAILS: Record<string, UpgradePathDetail> = {
  "pay-as-you-go-lagos-plus": {
    fromTo: "Pay as you go → Lagos Plus",
    headline: "94,000 customers would save money today · none of them have ever been told",
    kpis: [
      { eyebrow: "Eligible", value: "612,000", note: "pay-as-you-go, active" },
      { eyebrow: "Upgraded · 12 months", value: "31,000", tone: "amber", note: "5.1%" },
      { eyebrow: "Already past break-even", value: "94,000", tone: "rose", note: "6+ orders a month" },
      { eyebrow: "At stake", value: "₦31M", tone: "rose", note: "on those 94,000 alone" },
    ],
    tableEyebrow: "The 94,000 who would save money today",
    rows: [
      { id: "6-8", ordersPerMonth: "6–8", customers: "51,000", paysNow: "₦3,210", wouldPay: "₦2,500", wouldPayTone: "teal", saves: "₦710/mo", savesTone: "teal", upgraded: "4.1%", upgradedTone: "rose", everPrompted: "no", everPromptedTone: "rose" },
      { id: "9-12", ordersPerMonth: "9–12", customers: "29,000", paysNow: "₦4,890", wouldPay: "₦2,500", wouldPayTone: "teal", saves: "₦2,390/mo", savesTone: "teal", upgraded: "6.8%", upgradedTone: "rose", everPrompted: "no", everPromptedTone: "rose" },
      { id: "13-19", ordersPerMonth: "13–19", customers: "11,000", paysNow: "₦7,140", wouldPay: "₦2,500", wouldPayTone: "teal", saves: "₦4,640/mo", savesTone: "teal", upgraded: "9.1%", upgradedTone: "amber", everPrompted: "no", everPromptedTone: "rose" },
      { id: "20-plus", ordersPerMonth: "20+", customers: "3,000", paysNow: "₦11,200", wouldPay: "₦2,500", wouldPayTone: "teal", saves: "₦8,700/mo", savesTone: "teal", upgraded: "14.1%", upgradedTone: "amber", everPrompted: "no", everPromptedTone: "rose" },
      { id: "under-6", ordersPerMonth: "Under 6 · not eligible to save", customers: "518,000", paysNow: "₦1,410", wouldPay: "₦2,500", wouldPayTone: "rose", saves: "—", savesTone: "neutral", upgraded: "3.1%", upgradedTone: "neutral", everPrompted: "correctly not", everPromptedTone: "teal" },
    ],
    closingTitle: "The customers who would benefit most are the least likely to have found it",
    closingBody:
      "Upgrade rate rises with order frequency — from 4.1% to 14.1% — which means the offer is working entirely on people who went looking. Nobody heavy enough to save ₦8,700 a month has been told they could. The prompt does not exist in any surface of the product.",
    cardsEyebrow: "What a prompt would be worth, and what it would cost",
    cards: [
      {
        id: "20-percent-upgrade",
        agentTag: "EX",
        meta: "If 20% of the 94,000 upgrade",
        title: "₦31M a year in plan revenue",
        body: "Conservative against the 14.1% who already self-serve at the heaviest tier. It is plan revenue, not incremental orders — these customers already order.",
        footnote: "measurable with a holdout",
        tone: "teal",
      },
      {
        id: "catch-nobody-can-price",
        agentTag: "PX",
        meta: "The catch nobody can price",
        title: "They would pay us less per order",
        body: "A customer saving ₦2,390 a month is a customer we collect ₦2,390 less from. Whether that is good depends on contribution margin, which is unavailable.",
        footnote: "blocked · needs COGS",
        tone: "amber",
      },
      {
        id: "measurable-now",
        agentTag: "RD",
        meta: "What is measurable now",
        title: "Retention, not margin",
        body: "Lagos Plus customers order 6.1 times a month against 1.4, and retain at 61%. Even without margin, moving a heavy user onto a plan is defensible on retention alone.",
        footnote: "the honest partial answer",
        tone: "teal",
      },
    ],
  },
};

// ---- Basket (EX05) ---------------------------------------------------------

// GET /lifecycle/expand/basket actually returns a real monthly revenue/basket-size/order-
// frequency trend (months[]/movement[]) independently of order_lines — only item-level
// composition (lines[]) needs that field. The old mock treated the whole screen as blocked, which
// this endpoint contradicts; its specific "before/after the fee" narrative numbers above aren't
// reproducible from live data either way. See basket-tab.tsx.

export const EXPAND_REQUEST_INSTRUMENTATION_PRESET: RequestInstrumentationPreset = {
  subtitle: "order_lines · 41 days overdue, blocks four stages",
  invisibleTitle: "Basket composition · never instrumented",
  invisibleBody: "No items feed · items, categories and attach rate all unavailable",
  needsEyebrow: "What Flolyt needs",
  events: [
    { id: "order-line-item", name: "order_lines.item_id", description: "one row per item in a basket" },
    { id: "order-line-category", name: "order_lines.category", description: "so category expansion becomes measurable" },
    { id: "order-line-unit-cost", name: "order_lines.unit_cost", description: "shared with Price's margin request" },
  ],
  unblockEyebrow: "What this would unblock",
  unblockRows: [
    { label: "Expand · basket", value: "items, categories and attach rate stop reading unavailable", tone: "neutral" },
    { label: "Expand · definition", value: "category expansion becomes measurable", tone: "amber" },
    { label: "Price · margin", value: "the same field this stage already needs", tone: "amber" },
    { label: "Acquire · payback", value: "true payback per channel", tone: "rose" },
  ],
  obligationTitle: "This becomes an obligation, not a message",
  obligationBody:
    "It goes to Engineering with an owner, a date and a state, and it appears on their handoff load. `order_lines` has been requested since 28 July and is already 41 days overdue — this adds Expand's name to a request that three other stages are also waiting on.",
};

// ---- Accounts (EX06) --------------------------------------------------------

// GET /lifecycle/expand/accounts has no seats, blended "health" score, or general business-
// account book — it's narrower than the old mock's "accounts mode" reframing of the whole
// consumer base: only subscriptions renewing soon with a real risk signal, since nothing in the
// semantic layer groups customers into a corporate account (confirmed by this endpoint's own
// note — no seat/headcount concept exists at all). The banner, KPIs, per-account table and risk
// breakdown above aren't reproducible from live data; dropped. See accounts-tab.tsx.

// ---- Cohorts (EX07) is wired to the shared GET /lifecycle/stages/{stageKey}/cohorts — see
// acquire/data.ts's Cohorts note and cohorts-tab.tsx.

// ---- Markets (EX08) is wired to the shared GET /lifecycle/stages/{stageKey}/markets — see
// acquire/data.ts's Markets note and markets-tab.tsx.

// ---- What changed (EX09) ---------------------------------------------------
// Wired live (see stage/changes/changes-tab.tsx, GET /lifecycle/stages/{stageKey}/change-registry)
// — no mock export here anymore.

// ---- Agents (EX10) is wired to the shared GET /lifecycle/stages/{stageKey}/agents — see
// acquire/data.ts's Agents note and agents-tab.tsx.

export const EXPAND_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "Customers past plan break-even, unprompted", note: "6+ orders/month on pay-as-you-go ÷ never shown the plan page" },
  byMoreThan: { label: "By more than", value: "10,000 customers", note: "against the trailing 28-day average" },
  sustainedFor: { label: "Sustained for", value: "7 days", note: "one bad week is noise and will not open a room" },
  segmentedBy: { label: "Segmented by", value: "order frequency tier, market", note: "so the heaviest tier is findable, not averaged away" },
  routesTo: { name: "The Expand stage owner · Tunde Bakare" },
  simulation: {
    title: "Against the last twelve months, this would have fired once and stayed open",
    body: "94,000 customers have been past break-even for the entire measured period, with no date it started — this is a standing condition, not a dated event.",
  },
};

// ---- History (EX11) is wired to the shared GET /lifecycle/stages/{stageKey}/history — see
// acquire/data.ts's History note and history-tab.tsx.

// ---- Compare periods (EX12) is wired to the shared GET /lifecycle/stages/{stageKey}/compare —
// see acquire/data.ts's Compare note and compare-route.tsx.

// ---- Model an upgrade offer (EX13, stage-specific modal) -------------------

export type ModelUpgradeCriteriaRow = { label: string; value: string };
export type ModelUpgradeTellRow = { label: string; value: string; tone: "teal" | "amber" | "rose" };

export type ModelUpgradePreset = {
  subtitle: string;
  criteriaEyebrow: string;
  criteria: ModelUpgradeCriteriaRow[];
  summaryTitle: string;
  summaryBody: string;
  tellEyebrow: string;
  tellRows: ModelUpgradeTellRow[];
  closingTitle: string;
  closingBody: string;
};

export const EXPAND_MODEL_UPGRADE_PRESET: ModelUpgradePreset = {
  subtitle: "What is known, what is not, and what a holdout would settle",
  criteriaEyebrow: "Who would be offered it",
  criteria: [
    { label: "On", value: "Pay as you go" },
    { label: "Ordering at least", value: "6 per month, 3 months running" },
    { label: "Never seen the plan page", value: "true" },
    { label: "Markets", value: "Nigeria and Kenya" },
  ],
  summaryTitle: "94,000 customers · 10% held back",
  summaryBody: "None have ever been prompted · this is a clean test",
  tellEyebrow: "What Flolyt can and cannot tell you",
  tellRows: [
    { label: "Plan revenue if 20% accept", value: "+₦31M / year", tone: "teal" },
    { label: "Order revenue those customers give up", value: "−₦18M / year", tone: "amber" },
    { label: "Net revenue effect", value: "+₦13M / year", tone: "teal" },
    { label: "Retention effect", value: "+31 pts, from Retain's segment reading", tone: "teal" },
    { label: "Contribution margin effect", value: "Unavailable · no COGS source", tone: "rose" },
    { label: "Whether this is actually good", value: "Unavailable · depends on the row above", tone: "rose" },
  ],
  closingTitle: "Flolyt will build this and will not recommend it",
  closingBody:
    "The revenue arithmetic is positive and the retention case is strong, but the margin question is genuinely open and no honest answer exists today. A holdout of 9,400 costs nothing and settles it in six weeks — which is the recommendation, rather than the offer itself.",
};
