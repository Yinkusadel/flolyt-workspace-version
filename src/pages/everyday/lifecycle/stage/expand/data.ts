/**
 * Mock content for the Expand stage — screens EX01-EX13 in
 * flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/. Numbers and copy
 * are transcribed directly from those SVGs (each one's footer states its
 * id, e.g. "EX07 · Expand · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";
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

export type UpgradePathRow = {
  id: string;
  fromTo: string;
  eligible: string;
  upgraded: string;
  rate: string;
  rateTone: "teal" | "amber" | "rose" | "neutral";
  valuePerUpgrade: string;
  valuePerUpgradeTone: "teal" | "rose" | "neutral";
  prompted: string;
  promptedTone: ChipTone;
  verdict: string;
  verdictTone: ChipTone;
};

export const EXPAND_UPGRADE_PATH_ROWS: UpgradePathRow[] = [
  { id: "pay-as-you-go-lagos-plus", fromTo: "Pay as you go → Lagos Plus", eligible: "612,000", upgraded: "31,000", rate: "5.1%", rateTone: "amber", valuePerUpgrade: "₦79,200/yr", valuePerUpgradeTone: "teal", prompted: "plan page only", promptedTone: "rose", verdict: "the big one", verdictTone: "rose" },
  { id: "lagos-plus-family", fromTo: "Lagos Plus → Family", eligible: "841,000", upgraded: "8,400", rate: "1.0%", rateTone: "rose", valuePerUpgrade: "₦20,400/yr", valuePerUpgradeTone: "teal", prompted: "no prompt", promptedTone: "rose", verdict: "untouched", verdictTone: "rose" },
  { id: "family-business", fromTo: "Family → Business", eligible: "218,000", upgraded: "1,204", rate: "0.6%", rateTone: "rose", valuePerUpgrade: "₦93,600/yr", valuePerUpgradeTone: "teal", prompted: "sales-led", promptedTone: "amber", verdict: "works, tiny", verdictTone: "amber" },
  { id: "any-student", fromTo: "Any → Student", eligible: "—", upgraded: "11,400", rate: "—", rateTone: "neutral", valuePerUpgrade: "−₦19,200/yr", valuePerUpgradeTone: "rose", prompted: "self-serve, unverified", promptedTone: "rose", verdict: "a downgrade path", verdictTone: "rose" },
  { id: "legacy-unlimited-anything", fromTo: "Legacy Unlimited → anything", eligible: "3,100", upgraded: "0", rate: "0%", rateTone: "rose", valuePerUpgrade: "Unavailable", valuePerUpgradeTone: "neutral", prompted: "never attempted", promptedTone: "rose", verdict: "frozen since 2022", verdictTone: "rose" },
];

export const EXPAND_UPGRADE_PATH_CARDS: InsightCard[] = [
  {
    id: "pay-as-you-go-lagos-plus",
    agentTag: "EX",
    meta: "612,000 eligible · ₦31M",
    title: "Pay as you go → Lagos Plus",
    body: "The upgrade with the highest value and the largest eligible pool converts at 5.1%. The only place it is offered is the plan page, which 91% of customers have never opened.",
    footnote: "no behavioural prompt exists",
    tone: "rose",
  },
  {
    id: "already-order-enough",
    agentTag: "EX",
    meta: "94,000 of them",
    title: "Already order enough to save money",
    body: "At 6 or more orders a month, Lagos Plus is cheaper than paying per order. 94,000 customers are past that line and paying more than they need to. None of them have been told.",
    footnote: "the offer sells itself",
    tone: "amber",
  },
  {
    id: "uncomfortable-one",
    agentTag: "PX",
    meta: "The uncomfortable one",
    title: "11,400 went the other way",
    body: "The Student plan is self-serve and unverified. 6,200 of these came down from Lagos Plus. It is the only fully-automated path in this stage and it runs in reverse.",
    footnote: "the only prompt that works",
    tone: "rose",
  },
];

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

export const EXPAND_BASKET_KPIS: Kpi[] = [
  { eyebrow: "Median basket", value: "₦2,140", note: "unchanged for 3 quarters" },
  { eyebrow: "Baskets that grew", value: "176,000", tone: "teal", note: "16.0% of active" },
  { eyebrow: "Value added", value: "₦41M", tone: "amber", note: "at face value" },
  { eyebrow: "Margin added", value: "Unavailable", tone: "amber", note: "needs order_lines" },
];

export const EXPAND_BASKET_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Jan–Feb · before the fee", value: "₦2,140 median", percent: 31, tone: "teal" },
  { label: "Mar–May · after the fee", value: "₦2,140", percent: 31, tone: "teal" },
  { label: "Jun–Aug", value: "₦2,150", percent: 31, tone: "teal" },
  { label: "Lagos Plus customers", value: "₦2,410", percent: 35, tone: "teal" },
  { label: "Group ordering customers", value: "₦6,890", percent: 100, tone: "teal" },
];

export const EXPAND_BASKET_INSIDE_ROWS: { label: string; value: string; tone: "teal" | "rose" | "amber" }[] = [
  { label: "Median basket", value: "₦2,140 · from order totals", tone: "teal" },
  { label: "Items per basket", value: "Unavailable · order_lines not in the feed", tone: "rose" },
  { label: "Categories per basket", value: "Unavailable", tone: "rose" },
  { label: "Attach rate on sides and drinks", value: "Unavailable", tone: "rose" },
  { label: "What could be answered with one field", value: "all four rows above, plus margin and category expansion", tone: "amber" },
];

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

export const EXPAND_ACCOUNTS_BANNER = "Accounts mode · 1,204 businesses, not 4.2M consumers";

export const EXPAND_ACCOUNTS_KPIS: Kpi[] = [
  { eyebrow: "Business accounts", value: "1,204", note: "0.03% of customers" },
  { eyebrow: "Revenue", value: "₦74M/yr", tone: "teal", note: "6.1% of company revenue" },
  { eyebrow: "Revenue per account", value: "₦61,400", tone: "teal", note: "20× a consumer" },
  { eyebrow: "At renewal risk", value: "312", tone: "rose", note: "26% of accounts" },
];

export type ExpandAccountRow = {
  id: string;
  account: string;
  seats: string;
  annualValue: string;
  annualValueTone: "teal" | "amber";
  ordersPerMonth: string;
  ordersPerMonthTone: "teal" | "amber" | "rose";
  renews: string;
  renewsTone: "ink" | "amber" | "rose" | "neutral";
  health: string;
  healthTone: ChipTone;
  owner?: { name: string; initials: string; color: string };
  noOwner?: boolean;
};

export const EXPAND_ACCOUNT_ROWS: ExpandAccountRow[] = [
  { id: "kano-textiles", account: "Kano Textiles", seats: "120", annualValue: "₦2.1M", annualValueTone: "teal", ordersPerMonth: "410", ordersPerMonthTone: "teal", renews: "14 Sep", renewsTone: "amber", health: "at risk", healthTone: "rose", owner: { name: "Tunde", initials: "TB", color: "#B4568F" } },
  { id: "lagos-legal-partners", account: "Lagos Legal Partners", seats: "64", annualValue: "₦1.4M", annualValueTone: "teal", ordersPerMonth: "188", ordersPerMonthTone: "teal", renews: "2 Oct", renewsTone: "neutral", health: "healthy", healthTone: "teal", owner: { name: "Tunde", initials: "TB", color: "#B4568F" } },
  { id: "ikeja-tech-park", account: "Ikeja Tech Park", seats: "310", annualValue: "₦4.8M", annualValueTone: "teal", ordersPerMonth: "1,120", ordersPerMonthTone: "teal", renews: "11 Nov", renewsTone: "neutral", health: "healthy", healthTone: "teal", owner: { name: "Tunde", initials: "TB", color: "#B4568F" } },
  { id: "nairobi-media-group", account: "Nairobi Media Group", seats: "41", annualValue: "KES 890k", annualValueTone: "teal", ordersPerMonth: "94", ordersPerMonthTone: "amber", renews: "28 Aug", renewsTone: "rose", health: "at risk", healthTone: "rose", noOwner: true },
  { id: "accra-logistics", account: "Accra Logistics", seats: "88", annualValue: "GHS 210k", annualValueTone: "amber", ordersPerMonth: "31", ordersPerMonthTone: "rose", renews: "19 Sep", renewsTone: "rose", health: "at risk", healthTone: "rose", noOwner: true },
];

export const EXPAND_ACCOUNTS_RISK_ROWS: { label: string; value: string; tone: "rose" | "amber" }[] = [
  { label: "Seat utilisation below 40%", value: "188 accounts · people were added and never ordered", tone: "rose" },
  { label: "Order frequency fell after 4 March", value: "94 accounts · the delivery fee, at scale", tone: "rose" },
  { label: "No named owner", value: "119 accounts · all outside Nigeria", tone: "rose" },
  { label: "Renewing within 60 days", value: "212 accounts · ₦31M", tone: "amber" },
  { label: "Accounts with a room open", value: "0 · none of this has a room", tone: "rose" },
];

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
