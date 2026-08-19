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
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { CheckedRow, ActionCard } from "@/pages/everyday/lifecycle/stage/detail/detail-drilldown";
import type { DefinitionCandidate } from "@/pages/everyday/lifecycle/stage/definition/definition-route";
import type { LeakRow, ChangeRow, AgentCard, ThresholdRow, GoalRow, TriedRow, CompareRow } from "@/pages/everyday/lifecycle/stage/acquire/data";
import type { InsightCard } from "@/pages/everyday/lifecycle/stage/activate/data";
import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";

// ---- Definition (PR01) -----------------------------------------------

export type PriceDefinitionData = {
  title: string;
  subtitle: string;
  insightTitle: string;
  insightBody: string;
  candidatesEyebrow: string;
  candidates: DefinitionCandidate[];
  needsEyebrow: string;
  needsRows: { label: string; value: string; tone: "teal" | "amber" | "rose" }[];
  closingTitle: string;
  closingBody: string;
};

export const PRICE_DEFINITION: PriceDefinitionData = {
  title: "What counts as priced",
  subtitle: "Price · owned by Finance · last changed 12 January by Ravi Mehta",
  insightTitle: "Price is not a moment, it is a condition every customer is permanently in",
  insightBody:
    "Nobody passes through Price on their way somewhere else. Every one of the 4.2M customers is on a plan, at a price, at a margin, right now — which is why this stage has no funnel and no time-to-value, and why its numbers are stocks rather than flows.",
  candidatesEyebrow: "A customer is in Price when",
  candidates: [
    {
      id: "chosen-a-plan",
      label: "They have chosen a plan",
      description: "Excludes 2.9M pay-as-you-go customers, who are the majority.",
      field: "billing.plan_id · 1.31M",
    },
    {
      id: "seen-a-price",
      label: "They have seen a price",
      description: "Everyone. True, and too broad to compute anything against.",
      field: "any order or plan view · 4.2M",
    },
    {
      id: "paid-anything",
      label: "They have paid anything",
      description: "Everyone with revenue attached. The only definition that lets margin be computed per customer.",
      field: "orders or billing · 894,000 ever · 1.1M active",
      selected: true,
    },
  ],
  needsEyebrow: "What this stage needs, and what it has",
  needsRows: [
    { label: "Plan and price per customer", value: "billing feed · connected 12 January", tone: "teal" },
    { label: "Discounts applied", value: "orders feed · connected", tone: "teal" },
    { label: "Currency and FX rate at time of order", value: "orders feed · rate stored per order", tone: "teal" },
    { label: "Cost of goods per order", value: "nothing connected · every margin figure is unavailable", tone: "rose" },
    { label: "Payment processing cost", value: "nothing connected · estimated at 1.9% and marked as an estimate", tone: "amber" },
    { label: "Delivery cost per order", value: "Nigeria and Kenya only · Ghana and UK unavailable", tone: "amber" },
  ],
  closingTitle: "Four of six inputs are present and this stage still cannot answer its own question",
  closingBody:
    "Price exists to tell you whether what you charge covers what it costs. Without cost of goods it can tell you what you charge, what you discount and what you collect — and it says so on every screen rather than quietly reporting revenue where margin belongs.",
};

// ---- Overview (PR02) ---------------------------------------------------

export const PRICE_OVERVIEW_KPIS: Kpi[] = [
  { eyebrow: "Customers with revenue", value: "1.10M", note: "active in 90 days" },
  { eyebrow: "Revenue per active customer", value: "₦3,020", tone: "rose", note: "was ₦4,180" },
  { eyebrow: "At stake", value: "₦46M", tone: "rose", note: "identified · margin figures excluded" },
  { eyebrow: "Contribution margin", value: "Unavailable", tone: "amber", note: "no COGS source" },
];

export const PRICE_OVERVIEW_LEAK_ROWS: LeakRow[] = [
  {
    id: "discount-only-buyers",
    where: "Discount-only buyers",
    customers: "94,000",
    value: "₦31M",
    valueTone: "rose",
    trend: "worsening",
    trendTone: "rose",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "open", tone: "amber" },
  },
  {
    id: "ghana-priced-above-naira",
    where: "Ghana priced 22% above naira equivalent",
    customers: "94,000",
    value: "GHS 2.1M",
    valueTone: "amber",
    trend: "flat",
    trendTone: "neutral",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "none", tone: "neutral" },
  },
  {
    id: "legacy-unlimited-2022-price",
    where: "Legacy Unlimited · 2022 price",
    customers: "3,100",
    value: "Unavailable",
    valueTone: "ink",
    trend: "unknown",
    trendTone: "neutral",
    causeKnown: { label: "needs COGS", tone: "amber" },
    room: { label: "none", tone: "neutral" },
  },
  {
    id: "student-plan-no-verification",
    where: "Student plan · no verification",
    customers: "11,400",
    value: "₦9M",
    valueTone: "amber",
    trend: "worsening",
    trendTone: "rose",
    causeKnown: { label: "causal", tone: "ultra" },
    room: { label: "none", tone: "neutral" },
  },
  {
    id: "delivery-fee-absorbed",
    where: "Delivery fee absorbed on subscriptions",
    customers: "41,000",
    value: "Unavailable",
    valueTone: "ink",
    trend: "unknown",
    trendTone: "neutral",
    causeKnown: { label: "needs COGS", tone: "amber" },
    room: { label: "none", tone: "neutral" },
  },
];

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

// ---- Plans (PR03) + one-plan drilldown (PR04) ---------------------------

export type PlanRow = {
  id: string;
  plan: string;
  customers: string;
  price: string;
  priceTone: "ink" | "amber" | "rose" | "neutral";
  revenuePerCustomer: string;
  revenueTone: "teal" | "amber" | "ink";
  ordersPerMonth: string;
  ordersTone: "teal" | "amber" | "rose" | "ink";
  state: string;
  stateTone: ChipTone;
};

export const PRICE_PLAN_ROWS: PlanRow[] = [
  { id: "pay-as-you-go", plan: "Pay as you go", customers: "2.91M", price: "per order", priceTone: "neutral", revenuePerCustomer: "₦2,140", revenueTone: "ink", ordersPerMonth: "1.4", ordersTone: "ink", state: "default", stateTone: "neutral" },
  { id: "lagos-plus", plan: "Lagos Plus", customers: "841,000", price: "₦2,500/mo", priceTone: "ink", revenuePerCustomer: "₦8,900", revenueTone: "teal", ordersPerMonth: "6.1", ordersTone: "teal", state: "healthy", stateTone: "teal" },
  { id: "family", plan: "Family", customers: "218,000", price: "₦4,200/mo", priceTone: "ink", revenuePerCustomer: "₦11,400", revenueTone: "teal", ordersPerMonth: "8.9", ordersTone: "teal", state: "healthy", stateTone: "teal" },
  { id: "business", plan: "Business", customers: "41,000", price: "₦12,000/mo", priceTone: "ink", revenuePerCustomer: "₦31,200", revenueTone: "teal", ordersPerMonth: "24.1", ordersTone: "teal", state: "healthy", stateTone: "teal" },
  { id: "student", plan: "Student", customers: "11,400", price: "₦900/mo", priceTone: "amber", revenuePerCustomer: "₦2,100", revenueTone: "amber", ordersPerMonth: "4.1", ordersTone: "ink", state: "unverified", stateTone: "amber" },
  { id: "legacy-unlimited", plan: "Legacy Unlimited", customers: "3,100", price: "₦1,800/mo · 2022", priceTone: "rose", revenuePerCustomer: "₦4,100", revenueTone: "amber", ordersPerMonth: "19.4", ordersTone: "rose", state: "grandfathered", stateTone: "rose" },
];

export const PRICE_PLAN_DECISION_CARDS: InsightCard[] = [
  {
    id: "legacy-unlimited",
    agentTag: "PX",
    meta: "3,100 customers · unmeasurable",
    title: "Legacy Unlimited",
    body: "₦1,800 a month, unchanged since 2022, for 19.4 orders. Every other plan averages under 9. These are the heaviest users in the company on the cheapest price and nobody can say what they cost.",
    footnote: "needs COGS to decide anything",
    tone: "rose",
  },
  {
    id: "student-unverified",
    agentTag: "PX",
    meta: "11,400 customers · ₦9M",
    title: "Student, never verified",
    body: "The plan launched in February with verification “to follow”. It never did. 6,200 of these accounts were created by customers who previously paid full price on Lagos Plus.",
    footnote: "measurable · decidable today",
    tone: "amber",
  },
  {
    id: "lagos-plus",
    meta: "841,000 CUSTOMERS",
    title: "Lagos Plus is not the problem",
    body: "Four times the revenue per customer of pay-as-you-go and six times the orders. It is the plan everything else should be trying to move people onto, and it is stated here so it does not get reviewed alongside the two above.",
    footnote: "leave it alone",
    tone: "teal",
  },
];

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

// ---- Margin (PR05) -------------------------------------------------------

export type MarginBlockedRow = {
  id: string;
  what: string;
  where: string;
  currentlyShows: string;
  currentlyTone: "amber" | "neutral";
  wouldShow: string;
  valueOfUnblocking: string;
  valueTone: "amber" | "rose";
};

export const PRICE_MARGIN_BLOCKED_ROWS: MarginBlockedRow[] = [
  { id: "margin-per-plan", what: "Contribution margin per plan", where: "Price · Plans", currentlyShows: "Unavailable ×6", currentlyTone: "neutral", wouldShow: "margin per plan", valueOfUnblocking: "settles Legacy Unlimited", valueTone: "amber" },
  { id: "payback-per-channel", what: "True payback per channel", where: "Acquire · Unit economics", currentlyShows: "revenue ratio only", currentlyTone: "amber", wouldShow: "payback in months", valueOfUnblocking: "settles Ghana paid social", valueTone: "amber" },
  { id: "margin-per-order", what: "Margin per order", where: "Price · Discounting", currentlyShows: "discount depth only", currentlyTone: "amber", wouldShow: "what each discount costs", valueOfUnblocking: "₦31M discount decision", valueTone: "rose" },
  { id: "margin-goal", what: "Contribution margin goal", where: "Goals", currentlyShows: "no baseline · unsettable", currentlyTone: "amber", wouldShow: "a settable goal", valueOfUnblocking: "one of five company goals", valueTone: "rose" },
  { id: "recovered-margin", what: "Recovered margin", where: "Value ledger", currentlyShows: "recovered revenue", currentlyTone: "amber", wouldShow: "recovered margin", valueOfUnblocking: "board reporting", valueTone: "amber" },
  { id: "margin-per-market", what: "Margin per market", where: "Price · Markets", currentlyShows: "Unavailable ×4", currentlyTone: "neutral", wouldShow: "margin by currency", valueOfUnblocking: "Ghana repricing", valueTone: "amber" },
];

export const PRICE_MARGIN_CARDS: ActionCard[] = [
  {
    id: "shown",
    eyebrow: "Shown",
    tone: "teal",
    title: "Every cost that is connected",
    body: "Delivery cost per order for Nigeria and Kenya. Payment processing at 1.9%, labelled as an estimate. Both are used freely and both are marked with where they came from.",
    footnote: "partial, and honest about it",
  },
  {
    id: "refused",
    eyebrow: "Refused",
    tone: "rose",
    title: "A benchmark cost of goods",
    body: "Flolyt knows the category average for prepared food delivery. Applying it would produce a margin figure for every plan, every channel and every market — all of them fiction.",
    footnote: "the estimate is never offered",
  },
  {
    id: "offered",
    eyebrow: "Offered",
    tone: "amber",
    title: "A partial answer where one exists",
    body: "Legacy Unlimited is decidable on delivery cost alone. Where a subset of costs already settles a question, the stage says so rather than waiting for the complete picture.",
    footnote: "one plan, decidable today",
  },
];

// ---- Discounting (PR06) ---------------------------------------------------

export const PRICE_DISCOUNTING_KPIS: Kpi[] = [
  { eyebrow: "Discounted orders · 12mo", value: "1.41M", note: "24% of all orders" },
  { eyebrow: "Discount given", value: "₦412M", tone: "amber", note: "at face value" },
  { eyebrow: "Buyers who never pay full price", value: "94,000", tone: "rose", note: "₦31M a year" },
  { eyebrow: "Incremental?", value: "Unavailable", tone: "amber", note: "needs a holdout that was never run" },
];

export type DiscountGroupRow = {
  id: string;
  group: string;
  customers: string;
  discountedOrders: string;
  discountedTone: "teal" | "amber" | "rose";
  fullPriceOrders: string;
  fullPriceTone: "teal" | "amber" | "rose";
  verdict: string;
  verdictTone: ChipTone;
  atStake: string;
  atStakeTone: "rose" | "amber" | "neutral";
};

export const PRICE_DISCOUNT_GROUP_ROWS: DiscountGroupRow[] = [
  { id: "discount-only", group: "Discount-only", customers: "94,000", discountedOrders: "100%", discountedTone: "rose", fullPriceOrders: "0", fullPriceTone: "rose", verdict: "buying the discount", verdictTone: "rose", atStake: "₦31M", atStakeTone: "rose" },
  { id: "mostly-discounted", group: "Mostly discounted", customers: "218,000", discountedOrders: "74%", discountedTone: "amber", fullPriceOrders: "26%", fullPriceTone: "amber", verdict: "habituated", verdictTone: "amber", atStake: "₦12M", atStakeTone: "amber" },
  { id: "occasional", group: "Occasional", customers: "612,000", discountedOrders: "18%", discountedTone: "teal", fullPriceOrders: "82%", fullPriceTone: "teal", verdict: "healthy", verdictTone: "teal", atStake: "—", atStakeTone: "neutral" },
  { id: "never-discounted", group: "Never discounted", customers: "2.14M", discountedOrders: "0", discountedTone: "teal", fullPriceOrders: "100%", fullPriceTone: "teal", verdict: "healthy", verdictTone: "teal", atStake: "—", atStakeTone: "neutral" },
  { id: "unnecessary-discount", group: "Received a discount they did not need", customers: "41,000", discountedOrders: "first order", discountedTone: "amber", fullPriceOrders: "would have paid", fullPriceTone: "rose", verdict: "given away", verdictTone: "rose", atStake: "₦9M", atStakeTone: "amber" },
];

export type PriceMemoryCard = { id: string; eyebrow: string; tone: "ultra" | "amber" | "rose"; title: string; body: string; footnote: string };

export const PRICE_DISCOUNT_MEMORY_CARDS: PriceMemoryCard[] = [
  {
    id: "first-order-discount-does-not-repeat",
    eyebrow: "Validated · cited 4 times",
    tone: "ultra",
    title: "Discounting the first order buys volume that does not repeat",
    body: "From the November 2024 campaign: +41% first orders, −14 points on 90-day repeat, measured against a 10% holdout. Cited most recently to argue against a discount in the Retain reactivation.",
    footnote: "nine months old, still holding",
  },
  {
    id: "tunde-over-applied",
    eyebrow: "Open disagreement",
    tone: "amber",
    title: "Tunde believes it is being over-applied",
    body: "Recorded as dissent in room 8f2c: “we are leaving volume on the table.” It has not been retested since 2024 and the market has changed. The dissent stays attached rather than being resolved by seniority.",
    footnote: "named, dated, unresolved",
  },
  {
    id: "never-measured-cost",
    eyebrow: "Never measured",
    tone: "rose",
    title: "What a discount actually costs",
    body: "Face value is ₦412M. The real cost is margin foregone, which is unavailable. Every discount decision in this company is currently made on a number that overstates or understates it, and nobody knows which.",
    footnote: "blocked on COGS",
  },
];

// ---- Cohorts (PR07, stage-specific layout) -------------------------------

export type PriceCohortRow = {
  id: string;
  cohort: string;
  customers: string;
  revenuePerCustomer: string;
  revenueTone: "teal" | "rose";
  discountedShare: string;
  discountedTone: "teal" | "rose";
  onPaidPlan: string;
  onPaidPlanTone: "teal" | "rose";
  vsFeb: string;
  vsFebTone: "teal" | "rose" | "neutral";
};

export const PRICE_COHORT_ROWS: PriceCohortRow[] = [
  { id: "january", cohort: "January", customers: "61,200", revenuePerCustomer: "₦4,310", revenueTone: "teal", discountedShare: "19.1%", discountedTone: "teal", onPaidPlan: "31.4%", onPaidPlanTone: "teal", vsFeb: "+3.1%", vsFebTone: "teal" },
  { id: "february", cohort: "February", customers: "64,900", revenuePerCustomer: "₦4,180", revenueTone: "teal", discountedShare: "19.8%", discountedTone: "teal", onPaidPlan: "30.9%", onPaidPlanTone: "teal", vsFeb: "baseline", vsFebTone: "neutral" },
  { id: "march", cohort: "March", customers: "82,100", revenuePerCustomer: "₦3,020", revenueTone: "rose", discountedShare: "28.4%", discountedTone: "rose", onPaidPlan: "22.1%", onPaidPlanTone: "rose", vsFeb: "−27.8%", vsFebTone: "rose" },
  { id: "april", cohort: "April", customers: "78,300", revenuePerCustomer: "₦2,960", revenueTone: "rose", discountedShare: "29.1%", discountedTone: "rose", onPaidPlan: "21.4%", onPaidPlanTone: "rose", vsFeb: "−29.2%", vsFebTone: "rose" },
  { id: "may", cohort: "May", customers: "77,600", revenuePerCustomer: "₦3,010", revenueTone: "rose", discountedShare: "28.8%", discountedTone: "rose", onPaidPlan: "21.9%", onPaidPlanTone: "rose", vsFeb: "−28.0%", vsFebTone: "rose" },
  { id: "june", cohort: "June", customers: "76,100", revenuePerCustomer: "Unavailable", revenueTone: "rose", discountedShare: "29.4%", discountedTone: "rose", onPaidPlan: "21.1%", onPaidPlanTone: "rose", vsFeb: "—", vsFebTone: "neutral" },
];

export const PRICE_COHORT_CAUSE_CARDS: InsightCard[] = [
  {
    id: "fewer-orders-not-smaller",
    agentTag: "PX",
    meta: "−28% revenue per customer",
    title: "Fewer orders, not smaller ones",
    body: "Basket size is flat at ₦2,140. The entire fall is order frequency — the same second-order collapse Retain reports, arriving here as a revenue figure.",
    footnote: "not a pricing problem",
    tone: "rose",
  },
  {
    id: "discount-response",
    meta: "+9 points discounted share",
    title: "This one is",
    body: "Marketing responded to falling volume by discounting harder from mid-March. It recovered some orders and grew the discount-only group by 31,000 customers.",
    footnote: "a response, not a cause",
    tone: "amber",
  },
  {
    id: "expensive-conversion-drop",
    agentTag: "PX",
    meta: "−9 points on paid plans",
    title: "The expensive one",
    body: "Cohorts acquired after March convert to Lagos Plus at 22% against 31%. A customer who never subscribes is worth a quarter of one who does, permanently.",
    footnote: "compounds every quarter",
    tone: "rose",
  },
];

// ---- Markets (PR08, stage-specific layout) --------------------------------

export type PriceMarketRow = {
  id: string;
  market: string;
  customers: string;
  basket: string;
  inNairaToday: string;
  inNairaTone: "ink" | "amber" | "rose";
  vsNigeria: string;
  vsNigeriaTone: "ink" | "teal" | "rose";
  lastRepriced: string;
  lastRepricedTone: "teal" | "rose";
};

export const PRICE_MARKET_ROWS: PriceMarketRow[] = [
  { id: "nigeria", market: "Nigeria", customers: "2.91M", basket: "₦2,140", inNairaToday: "₦2,140", inNairaTone: "ink", vsNigeria: "baseline", vsNigeriaTone: "ink", lastRepriced: "Mar 2026", lastRepricedTone: "teal" },
  { id: "kenya", market: "Kenya", customers: "610,000", basket: "KES 194", inNairaToday: "₦2,130", inNairaTone: "ink", vsNigeria: "−0.5%", vsNigeriaTone: "teal", lastRepriced: "Feb 2026", lastRepricedTone: "teal" },
  { id: "ghana", market: "Ghana", customers: "410,000", basket: "GHS 41", inNairaToday: "₦2,610", inNairaTone: "rose", vsNigeria: "+22.0%", vsNigeriaTone: "rose", lastRepriced: "Aug 2024", lastRepricedTone: "rose" },
  { id: "uk", market: "United Kingdom", customers: "269,000", basket: "£4.10", inNairaToday: "₦8,610", inNairaTone: "ink", vsNigeria: "+302%", vsNigeriaTone: "ink", lastRepriced: "Jan 2026", lastRepricedTone: "teal" },
];

export const PRICE_MARKET_INSIGHT = {
  title: "The UK is 302% more expensive and that is correct. Ghana is 22% more expensive and that is drift.",
  body: "The UK is a different market with different costs and a price set deliberately in January. Ghana has not been repriced since August 2024 — the cedi moved, nobody re-ran the list, and Ghanaian customers now pay a premium nobody chose. This is the only row on the screen where the comparison to Nigeria means anything.",
};

export const PRICE_MARKET_FX_DRIFT_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Aug 2024 · price set · GHS 41", value: "₦2,140 equivalent · matched Nigeria", percent: 82, tone: "teal" },
  { label: "Aug 2025 · no repricing", value: "₦2,380 equivalent · +11%", percent: 91, tone: "amber" },
  { label: "Aug 2026 · no repricing", value: "₦2,610 equivalent · +22%", percent: 100, tone: "rose" },
  { label: "If repriced to match Nigeria today", value: "GHS 33.6", percent: 82, tone: "ultra" },
];

export const PRICE_MARKET_CLOSING = {
  title: "This connects to two other stages and nobody has drawn the line",
  body: "Acquire reports Ghana paid social converting at 4.1% and blames the creative, which promises free delivery. Activate reports Ghana as worst-in-class on every measure. Both are true. Neither team looked at the price, which has quietly risen 22% against every other market since 2024.",
};

// ---- What changed (PR09) ---------------------------------------------------

export const PRICE_CHANGE_ROWS: ChangeRow[] = [
  { id: "delivery-fee-checkout", date: "4 Mar", team: "Engineering", teamColor: "#4E7080", title: "Delivery fee moved to checkout", effect: "Effective price +₦350 on 61% of orders", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "student-plan-launch", date: "14 Feb", team: "Finance", teamColor: "#5D6BB8", title: "Student plan launched · verification “to follow”", effect: "11,400 accounts · 6,200 downgraded from Lagos Plus", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "discount-depth-raised", date: "16 Mar", team: "Marketing", teamColor: "#79883A", title: "Discount depth raised 15% → 20%", effect: "Discount-only group +31,000 customers", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "nigeria-price-raised", date: "2 Mar", team: "Finance", teamColor: "#5D6BB8", title: "Nigeria list price raised 4%", effect: "No measurable effect on volume", effectTone: "teal", badge: "no effect", badgeTone: "neutral" },
  { id: "loyalty-tiers-renamed", date: "19 Apr", team: "Marketing", teamColor: "#79883A", title: "Loyalty tiers renamed", effect: "Not instrumented", effectTone: "amber", badge: "not instrumented", badgeTone: "amber" },
  { id: "ghana-price-set", date: "Aug 2024", team: "Finance", teamColor: "#5D6BB8", title: "Ghana price set · never revisited", effect: "Drifted +22% against Nigeria since", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
];

// ---- Agents (PR10) --------------------------------------------------------

export const PRICE_AGENT_CARDS: AgentCard[] = [
  {
    id: "price-margin",
    initials: "PX",
    status: "Lead agent · reading since 4 Feb",
    name: "Price & Margin",
    body: "Watches price, discount depth, plan mix and FX drift. It cannot watch margin, which is the thing it is named after — and it says so on every run rather than substituting revenue silently.",
    footnote: "3 rooms · 1 closed",
    tone: "ultra",
  },
  {
    id: "what-still-works",
    initials: "",
    status: "What it can still do",
    name: "Four of its five conditions work",
    body: "Discount depth, plan downgrades, FX drift and effective-price changes are all computable from connected sources. Only the margin floor is blocked.",
    footnote: "4 of 5 thresholds live",
    tone: "teal",
  },
  {
    id: "what-nobody-watches",
    initials: "",
    status: "What nobody watches",
    name: "Price changes made outside Finance",
    body: "The 4 March fee changed the effective price of 61% of orders and no threshold caught it, because it arrived as a release rather than a price. That rule now exists and is the last row below.",
    footnote: "added 2 August",
    tone: "rose",
  },
];

export const PRICE_THRESHOLD_ROWS: ThresholdRow[] = [
  { id: "discount-depth-rises", condition: "Discount depth rises", threshold: "more than 2 pts", currently: "+5 pts", currentlyTone: "rose", status: "already-open", owner: { name: "Ravi", initials: "RM", color: "#5D6BB8" } },
  { id: "customers-downgrade", condition: "Customers downgrade plans", threshold: "more than 1,000 / month", currently: "6,200 to Student", currentlyTone: "rose", status: "not-opened", noOwner: true },
  { id: "fx-drift", condition: "FX drift against the base market", threshold: "more than 10%", currently: "Ghana +22%", currentlyTone: "rose", status: "not-opened", noOwner: true },
  { id: "margin-below-floor", condition: "Contribution margin below a floor", threshold: "15%", currently: "Unavailable", currentlyTone: "neutral", status: "blocked", owner: { name: "Ravi", initials: "RM", color: "#5D6BB8" } },
  { id: "effective-price-outside-review", condition: "Effective price changes outside a price review", threshold: "any", currently: "1 · the 4 Mar fee", currentlyTone: "rose", status: "opens-automatically", statusLabel: "would open now", owner: { name: "Ravi", initials: "RM", color: "#5D6BB8" } },
];

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

// ---- History (PR11) -------------------------------------------------------

export const PRICE_GOAL_ROWS: GoalRow[] = [
  { id: "contribution-margin", goal: "Contribution margin", owner: { name: "Ravi", initials: "RM", color: "#5D6BB8" }, target: "Unavailable", today: "Unavailable", todayTone: "neutral", paceLabel: "no baseline", paceTone: "amber", part: "blocked at the source", partTone: "rose" },
  { id: "net-revenue", goal: "Net revenue", owner: { name: "Ada", initials: "AD", color: "#2E8B7F" }, target: "₦4.90B", today: "₦4.71B proj", todayTone: "amber", paceLabel: "94% of pace", paceTone: "amber", part: "₦46M identified here", partTone: "amber" },
];

export const PRICE_TRIED_ROWS: TriedRow[] = [
  { id: "nigeria-price-4pct", what: "Nigeria list price +4%", when: "2 Mar", result: "no volume effect", resultTone: "teal", measuredHow: "before/after · 8 weeks", learningKept: "validated" },
  { id: "student-plan-launch", what: "Student plan launch", when: "14 Feb", result: "6,200 downgraded from full price", resultTone: "rose", measuredHow: "no holdout", learningKept: "room needed" },
  { id: "discount-15-20", what: "Discount 15% → 20%", when: "16 Mar", result: "+9% orders, +31k discount-only", resultTone: "amber", measuredHow: "no holdout", learningKept: "contested" },
  { id: "first-order-discount-2024", what: "First-order discount · 2024", when: "Nov 2024", result: "+41% volume, −14 pts repeat", resultTone: "rose", measuredHow: "holdout · 10%", learningKept: "validated" },
  { id: "legacy-unlimited-reprice", what: "Legacy Unlimited reprice", when: "never", whenTone: "amber", result: "untried since 2022", resultTone: "amber", measuredHow: "—", learningKept: "blocked in 2024" },
];

// ---- Compare periods (PR12) --------------------------------------------

export const PRICE_COMPARE_ROWS: CompareRow[] = [
  { id: "revenue-per-active-customer", metric: "Revenue per active customer", before: "₦4,180", after: "₦3,020", change: "−27.8%", changeTone: "rose", whatMovedIt: "Order frequency, not basket size" },
  { id: "basket-size", metric: "Basket size", before: "₦2,140", after: "₦2,140", change: "0.0%", changeTone: "neutral", whatMovedIt: "Unchanged · rules out a pricing cause" },
  { id: "effective-price-per-order", metric: "Effective price per order", before: "₦2,140", after: "₦2,490", change: "+16.4%", changeTone: "rose", whatMovedIt: "The ₦350 delivery fee on 61% of orders" },
  { id: "discounted-share-of-orders", metric: "Discounted share of orders", before: "19.8%", after: "28.4%", change: "+8.6 pts", changeTone: "rose", whatMovedIt: "Discount depth raised on 16 March" },
  { id: "conversion-to-a-paid-plan", metric: "Conversion to a paid plan", before: "30.9%", after: "21.9%", change: "−9.0 pts", changeTone: "rose", whatMovedIt: "Student plan and weaker cohorts" },
  { id: "contribution-margin", metric: "Contribution margin", before: "Unavailable", after: "Unavailable", change: "—", changeTone: "neutral", whatMovedIt: "No COGS source, before or after" },
];

// ---- Connect a COGS source (PR13, stage-specific modal) -----------------

export type CogsSourceOption = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeTone: "teal" | "rose";
  selected?: boolean;
  disabled?: boolean;
};

export type ConnectCogsPreset = {
  needTitle: string;
  needBody: string;
  optionsEyebrow: string;
  options: CogsSourceOption[];
  warningTitle: string;
  warningBody: string;
};

export const PRICE_CONNECT_COGS_PRESET: ConnectCogsPreset = {
  needTitle: "Cost per item, or cost per order",
  needBody: "Monthly is enough to start · per-order is better · neither has to be exact",
  optionsEyebrow: "How you could send it",
  options: [
    { id: "monthly-csv", title: "A monthly CSV", subtitle: "cost per SKU per month · one upload, or a scheduled drop", badge: "unblocks 4 of 6", badgeTone: "teal", selected: true },
    { id: "accounting-system", title: "Your accounting system", subtitle: "QuickBooks, Xero, Sage · read-only", badge: "unblocks 5 of 6", badgeTone: "teal" },
    { id: "unit-cost-field", title: "Add unit_cost to the orders feed", subtitle: "your engineers already send this table", badge: "unblocks 6 of 6", badgeTone: "teal" },
    { id: "flat-rate", title: "A single flat rate you type in", subtitle: "one number, applied to everything", badge: "not offered", badgeTone: "rose", disabled: true },
  ],
  warningTitle: "The last option is deliberately not available",
  warningBody:
    "One flat cost across six plans, four markets and thousands of items would produce a margin figure that is wrong in a different direction for every row — and it would look exactly as authoritative as a real one.",
};
