/**
 * Mock content for the Acquire stage — screens A01-A16 in
 * flolyt-figma-designs/flolyt-lifecycle/. Numbers and copy are transcribed
 * directly from those SVGs (each one's footer states its id, e.g.
 * "A06 · Acquire · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { BarTone } from "@/pages/everyday/lifecycle/stage/bar";

// ---- Overview (A02) --------------------------------------------------

export const ACQUIRE_OVERVIEW_KPIS: Kpi[] = [
  { eyebrow: "Acquired · 12 months", value: "894,000", tone: "teal", note: "+31% on last year" },
  { eyebrow: "At stake", value: "₦74M", tone: "rose", note: "in this stage alone" },
  { eyebrow: "Blended CAC", value: "₦1,840", tone: "amber", note: "up from ₦1,410" },
  { eyebrow: "Reach a second order", value: "27.2%", tone: "rose", note: "the number that decides if this is good" },
];

export const ACQUIRE_OVERVIEW_BAR_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Acquired · last year", value: "682,000 · 38.1% reached a second order", percent: 68, tone: "teal" },
  { label: "Acquired · this year", value: "894,000 · 27.2% reached a second order", percent: 89, tone: "rose" },
  { label: "Second orders · last year", value: "260,000", percent: 26, tone: "teal" },
  { label: "Second orders · this year", value: "243,000", percent: 24, tone: "rose" },
];

export type RoomBadge = { label: string; tone: "teal" | "amber" | "rose" | "neutral" | "ultra" };

export type LeakRow = {
  id: string;
  where: string;
  customers: string;
  value: string;
  valueTone: "rose" | "amber" | "ink";
  trend: string;
  trendTone: "rose" | "amber" | "teal" | "neutral";
  /** Present on stages whose leak table has an Owner column (e.g. Acquire). */
  owner?: { name: string; initials: string };
  /** Present on stages whose leak table has a "Cause known?" column instead (e.g. Activate). */
  causeKnown?: { label: string; tone: "ultra" | "amber" };
  room: RoomBadge;
  /** When set, the row's "where" label links out (e.g. Retain's Overview row linking to its segments/:id drilldown). */
  detailHref?: string;
};

export const ACQUIRE_OVERVIEW_LEAK_ROWS: LeakRow[] = [
  {
    id: "signed-up-never-verified",
    where: "Signed up, never verified",
    customers: "412,000",
    value: "₦31M",
    valueTone: "rose",
    trend: "worsening",
    trendTone: "rose",
    owner: { name: "Tunde", initials: "TB" },
    room: { label: "open one", tone: "ultra" },
  },
  {
    id: "verified-never-ordered",
    where: "Verified, never ordered",
    customers: "146,000",
    value: "₦24M",
    valueTone: "rose",
    trend: "flat",
    trendTone: "neutral",
    owner: { name: "Tunde", initials: "TB" },
    room: { label: "open one", tone: "ultra" },
  },
  {
    id: "accra-campaign",
    where: "Accra campaign · converts at 4%",
    customers: "31,200",
    value: "₦19M",
    valueTone: "amber",
    trend: "worsening",
    trendTone: "rose",
    room: { label: "open · unowned", tone: "amber" },
  },
];

// ---- Funnel (A03) ------------------------------------------------------

export type FunnelStep = {
  id: string;
  label: string;
  value: string;
  percent: number;
  tone: "ultra" | "rose";
  delta?: string;
  deltaTone?: "rose" | "amber" | "teal";
  note?: string;
};

export const ACQUIRE_FUNNEL_STEPS: FunnelStep[] = [
  { id: "visited", label: "Visited", value: "8.41M", percent: 100, tone: "ultra" },
  { id: "started-signup", label: "Started a signup", value: "2.14M", percent: 25, tone: "ultra", delta: "−74.5%", deltaTone: "amber", note: "Expected. Most visits are browsing." },
  { id: "created-account", label: "Created an account", value: "1.31M", percent: 16, tone: "ultra", delta: "−38.8%", deltaTone: "amber", note: "412k drop out at the phone-number step" },
  { id: "verified", label: "Verified", value: "1.04M", percent: 12, tone: "rose", delta: "−20.6%", deltaTone: "rose", note: "SMS delivery fails for 118k · a fixable ₦9M" },
  { id: "added-first-item", label: "Added a first item", value: "961,000", percent: 11, tone: "ultra", delta: "−7.6%", deltaTone: "teal" },
  { id: "placed-first-order", label: "Placed a first order", value: "894,000", percent: 10, tone: "ultra", delta: "−7.0%", deltaTone: "amber", note: "67k abandon at the delivery-fee step" },
];

export type FunnelActionCard = {
  id: string;
  tone: "rose" | "neutral";
  agentTag?: string;
  meta: string;
  title: string;
  body: string;
  footnote: string;
  footnoteTone: "rose" | "neutral";
};

export const ACQUIRE_FUNNEL_ACTION_CARDS: FunnelActionCard[] = [
  {
    id: "phone-number-step",
    tone: "rose",
    agentTag: "AQ",
    meta: "₦31M · 412,000 customers",
    title: "The phone-number step",
    body: "412,000 create an account and never verify. 118,000 of those never receive the SMS at all — the delivery rate to MTN Nigeria is 71% against 96% on every other carrier.",
    footnote: "carrier problem, not a design problem",
    footnoteTone: "rose",
  },
  {
    id: "delivery-fee-step",
    tone: "rose",
    agentTag: "AQ",
    meta: "₦24M · 67,000 customers",
    title: "The delivery-fee step",
    body: "The same 4 March change that broke Retain also sits here, at first order. It has been counted in the Retain room and is not double counted in the ₦74M above.",
    footnote: "already in room 8f2c",
    footnoteTone: "rose",
  },
  {
    id: "never-start",
    tone: "neutral",
    meta: "NOT WORTH ACTING ON",
    title: "The 74.5% who never start",
    body: "Eight million visits produce two million signups and that is normal for this category. It is the largest number on the screen and the least interesting one.",
    footnote: "shown, deliberately unranked",
    footnoteTone: "neutral",
  },
];

// ---- Channels (A04) + one-channel drilldown (A05) -----------------------

export type ChannelRow = {
  id: string;
  channel: string;
  acquired: string;
  spend: string;
  spendTone: "teal" | "ink";
  cac: string;
  cacTone: "teal" | "amber" | "rose" | "neutral";
  reach2nd: string;
  reach2ndTone: "teal" | "amber" | "rose" | "ink";
  valuePerCustomer: string;
  valueTone: "teal" | "amber" | "rose" | "ink";
  verdict: string;
  verdictTone: "teal" | "amber" | "rose" | "neutral";
};

export const ACQUIRE_CHANNEL_ROWS: ChannelRow[] = [
  { id: "referral", channel: "Referral", acquired: "278,000", spend: "₦0", spendTone: "teal", cac: "₦0", cacTone: "teal", reach2nd: "41.2%", reach2ndTone: "teal", valuePerCustomer: "₦11,400", valueTone: "teal", verdict: "best", verdictTone: "teal" },
  { id: "organic-search", channel: "Organic search", acquired: "184,000", spend: "₦0", spendTone: "teal", cac: "₦0", cacTone: "teal", reach2nd: "31.1%", reach2ndTone: "teal", valuePerCustomer: "₦8,600", valueTone: "teal", verdict: "good", verdictTone: "teal" },
  { id: "paid-social-nigeria", channel: "Paid social · Nigeria", acquired: "214,000", spend: "₦412M", spendTone: "ink", cac: "₦1,925", cacTone: "amber", reach2nd: "24.8%", reach2ndTone: "amber", valuePerCustomer: "₦6,900", valueTone: "amber", verdict: "marginal", verdictTone: "amber" },
  { id: "paid-social-ghana", channel: "Paid social · Ghana", acquired: "31,200", spend: "₦188M", spendTone: "ink", cac: "₦6,026", cacTone: "rose", reach2nd: "4.1%", reach2ndTone: "rose", valuePerCustomer: "₦1,140", valueTone: "rose", verdict: "loses money", verdictTone: "rose" },
  { id: "partner-fuel-stations", channel: "Partner · fuel stations", acquired: "94,000", spend: "₦61M", spendTone: "ink", cac: "₦649", cacTone: "teal", reach2nd: "29.4%", reach2ndTone: "teal", valuePerCustomer: "₦8,100", valueTone: "teal", verdict: "good", verdictTone: "teal" },
  { id: "paid-search", channel: "Paid search", acquired: "61,000", spend: "₦74M", spendTone: "ink", cac: "₦1,213", cacTone: "teal", reach2nd: "28.1%", reach2ndTone: "teal", valuePerCustomer: "₦7,800", valueTone: "teal", verdict: "good", verdictTone: "teal" },
  { id: "unattributed", channel: "Unattributed", acquired: "31,800", spend: "Unavailable", spendTone: "ink", cac: "Unavailable", cacTone: "neutral", reach2nd: "26.9%", reach2ndTone: "ink", valuePerCustomer: "₦7,400", valueTone: "ink", verdict: "3.6% · acceptable", verdictTone: "neutral" },
];

export const ACQUIRE_CHANNEL_SPEND_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Paid social · Nigeria", value: "₦412M · 214,000 customers", percent: 55, tone: "amber" },
  { label: "Paid social · Ghana", value: "₦188M · 31,200 customers", percent: 25, tone: "rose" },
  { label: "Paid search", value: "₦74M · 61,000", percent: 10, tone: "teal" },
  { label: "Partner · fuel stations", value: "₦61M · 94,000", percent: 8, tone: "teal" },
];

export type ChannelDetail = {
  channel: string;
  headline: string;
  kpis: Kpi[];
  eyebrow: string;
  checkedRows: { id: string; question: string; finding: string; verdict: string; verdictTone: "teal" | "amber" | "rose" | "neutral" }[];
  causeTitle: string;
  causeBody: string;
  actionCards: {
    id: string;
    eyebrow: string;
    tone: "teal" | "amber" | "neutral";
    title: string;
    body: string;
    footnote: string;
  }[];
};

export const ACQUIRE_CHANNEL_DETAILS: Record<string, ChannelDetail> = {
  "paid-social-ghana": {
    channel: "Paid social · Ghana",
    headline: "31,200 acquired · ₦188M spent · 4.1% ever place a second order",
    kpis: [
      { eyebrow: "Acquired", value: "31,200", note: "in five months" },
      { eyebrow: "Spend", value: "₦188M", tone: "rose", note: "GHS 12.4M" },
      { eyebrow: "CAC", value: "₦6,026", tone: "rose", note: "3.3× blended" },
      { eyebrow: "Reach a second order", value: "4.1%", tone: "rose", note: "against 27.2% blended" },
    ],
    eyebrow: "Every other channel converts between 24% and 41%. This one converts at 4%.",
    checkedRows: [
      { id: "real-people", question: "Are they real people?", finding: "Yes. 94% verify a phone number, in line with every other channel.", verdict: "ruled out", verdictTone: "teal" },
      { id: "product-available", question: "Is the product available to them?", finding: "Yes. All 31,200 are in Accra, which is fully served.", verdict: "ruled out", verdictTone: "teal" },
      { id: "different-price", question: "Do they see a different price?", finding: "Yes. GHS pricing is 22% higher than the naira equivalent.", verdict: "contributing", verdictTone: "amber" },
      { id: "creative-promise", question: "What does the creative promise?", finding: "Free delivery. Ghana has never had free delivery.", verdict: "the cause", verdictTone: "rose" },
      { id: "delivery-slower", question: "Is delivery slower there?", finding: "Unavailable — no delivery feed for Ghana.", verdict: "unknown", verdictTone: "neutral" },
    ],
    causeTitle: "The creative promises something the product does not do",
    causeBody:
      "31,200 people signed up for free delivery in a market that has never offered it. They verify, they open the app, they see a delivery fee, and 96% of them never order. The campaign was measured on signups and hit its target every single week for five months.",
    actionCards: [
      {
        id: "stop-it",
        eyebrow: "Stop it",
        tone: "teal",
        title: "Saves ₦37M a month",
        body: "Immediate, reversible, and needs Ravi because it changes committed spend. The 31,200 already acquired stay acquired and stay in every cohort.",
        footnote: "Ravi Mehta · needs approval",
      },
      {
        id: "fix-the-creative",
        eyebrow: "Fix the creative",
        tone: "amber",
        title: "Test against a holdout",
        body: "Run honest pricing creative to half the audience for three weeks. Costs ₦18M to learn whether the channel works at all when it tells the truth.",
        footnote: "Marketing Ghana · no owner yet",
      },
      {
        id: "do-neither",
        eyebrow: "Do neither, knowingly",
        tone: "neutral",
        title: "A defensible answer",
        body: "Ghana is a land-grab market and 31,200 accounts may be worth ₦188M for reasons that are not in the orders feed. If that is the call, it should be a call — recorded here, not a default.",
        footnote: "record the decision",
      },
    ],
  },
};

// ---- Cohorts (A06) ------------------------------------------------------

export type CohortRow = {
  id: string;
  cohort: string;
  acquired: string;
  cac: string;
  day30: string;
  day60: string;
  day90: string;
  valuePerCustomer: string;
  valueTone: "teal" | "rose" | "neutral";
  vsFeb: string;
  vsFebTone: "teal" | "rose" | "neutral";
};

export const ACQUIRE_COHORT_ROWS: CohortRow[] = [
  { id: "january", cohort: "January", acquired: "61,200", cac: "₦1,410", day30: "22.4%", day60: "33.8%", day90: "38.1%", valuePerCustomer: "₦9,400", valueTone: "teal", vsFeb: "+0.7", vsFebTone: "teal" },
  { id: "february", cohort: "February", acquired: "64,900", cac: "₦1,466", day30: "21.9%", day60: "33.1%", day90: "37.4%", valuePerCustomer: "₦9,200", valueTone: "teal", vsFeb: "baseline", vsFebTone: "neutral" },
  { id: "march", cohort: "March", acquired: "82,100", cac: "₦1,904", day30: "14.1%", day60: "22.6%", day90: "27.2%", valuePerCustomer: "₦6,700", valueTone: "rose", vsFeb: "−10.2", vsFebTone: "rose" },
  { id: "april", cohort: "April", acquired: "78,300", cac: "₦2,011", day30: "13.8%", day60: "22.1%", day90: "26.8%", valuePerCustomer: "₦6,600", valueTone: "rose", vsFeb: "−10.6", vsFebTone: "rose" },
  { id: "may", cohort: "May", acquired: "77,600", cac: "₦1,988", day30: "13.9%", day60: "22.4%", day90: "27.1%", valuePerCustomer: "₦6,600", valueTone: "rose", vsFeb: "−10.3", vsFebTone: "rose" },
  { id: "june", cohort: "June", acquired: "76,100", cac: "₦1,940", day30: "14.2%", day60: "22.9%", day90: "Unavailable", valuePerCustomer: "Unavailable", valueTone: "neutral", vsFeb: "—", vsFebTone: "neutral" },
];

export const ACQUIRE_COHORT_BREAK_ROWS: { label: string; value: string; percent: number; tone: BarTone }[] = [
  { label: "Jan–Feb cohorts · before 4 March", value: "37.8% average", percent: 38, tone: "teal" },
  { label: "Mar–May cohorts · after", value: "27.0% average", percent: 27, tone: "rose" },
  { label: "UK and Ghana · fee not shipped until June", value: "37.6%", percent: 38, tone: "teal" },
];

// ---- Unit economics (A07) ------------------------------------------------

export const ACQUIRE_UNIT_ECON_KPIS: Kpi[] = [
  { eyebrow: "Blended CAC", value: "₦1,840", note: "was ₦1,410" },
  { eyebrow: "Revenue per customer · 12mo", value: "₦7,100", tone: "rose", note: "was ₦9,200" },
  { eyebrow: "Payback", value: "Unavailable", tone: "amber", note: "needs contribution margin" },
  { eyebrow: "Ratio", value: "3.9×", note: "on revenue, not margin" },
];

export type UnitEconRow = {
  id: string;
  channel: string;
  cac: string;
  cacTone: "teal" | "amber" | "rose";
  revenuePerCustomer: string;
  ratio: string;
  ratioTone: "teal" | "amber" | "rose";
};

export const ACQUIRE_UNIT_ECON_ROWS: UnitEconRow[] = [
  { id: "referral", channel: "Referral", cac: "₦0", cacTone: "teal", revenuePerCustomer: "₦11,400", ratio: "∞", ratioTone: "teal" },
  { id: "partner-fuel-stations", channel: "Partner · fuel stations", cac: "₦649", cacTone: "teal", revenuePerCustomer: "₦8,100", ratio: "12.5×", ratioTone: "teal" },
  { id: "paid-search", channel: "Paid search", cac: "₦1,213", cacTone: "teal", revenuePerCustomer: "₦7,800", ratio: "6.4×", ratioTone: "teal" },
  { id: "paid-social-nigeria", channel: "Paid social · Nigeria", cac: "₦1,925", cacTone: "amber", revenuePerCustomer: "₦6,900", ratio: "3.6×", ratioTone: "amber" },
  { id: "paid-social-ghana", channel: "Paid social · Ghana", cac: "₦6,026", cacTone: "rose", revenuePerCustomer: "₦1,140", ratio: "0.19×", ratioTone: "rose" },
];

export const ACQUIRE_UNIT_ECON_UNLOCK_ROWS: { label: string; value: string; tone: "teal" | "amber" | "neutral" }[] = [
  { label: "This screen", value: "true payback per channel, and margin-based ratios", tone: "teal" },
  { label: "Price stage", value: "a margin baseline, which currently blocks one company goal", tone: "amber" },
  { label: "Goals", value: "the contribution-margin goal, currently unsettable", tone: "amber" },
  { label: "Value ledger", value: "recovered margin rather than recovered revenue", tone: "neutral" },
  { label: "Estimated effort", value: "one CSV export a month would be enough to start", tone: "teal" },
];

// ---- Markets (A08) --------------------------------------------------------

export type MarketRow = {
  id: string;
  market: string;
  acquired: string;
  spend: string;
  cac: string;
  cacTone: "teal" | "rose";
  reach2nd: string;
  reach2ndTone: "teal" | "rose";
  atStake: string;
  atStakeTone: "rose" | "neutral";
  trend: "worsening" | "flat" | "improving";
};

export const ACQUIRE_MARKET_ROWS: MarketRow[] = [
  { id: "nigeria", market: "Nigeria", acquired: "610,000", spend: "₦486M", cac: "₦1,796", cacTone: "rose", reach2nd: "26.1%", reach2ndTone: "rose", atStake: "₦48M", atStakeTone: "rose", trend: "worsening" },
  { id: "kenya", market: "Kenya", acquired: "121,000", spend: "KES 41M", cac: "KES 339", cacTone: "teal", reach2nd: "34.2%", reach2ndTone: "teal", atStake: "KES 6.1M", atStakeTone: "neutral", trend: "flat" },
  { id: "ghana", market: "Ghana", acquired: "94,000", spend: "GHS 12.4M", cac: "GHS 132", cacTone: "rose", reach2nd: "9.4%", reach2ndTone: "rose", atStake: "GHS 2.1M", atStakeTone: "rose", trend: "worsening" },
  { id: "uk", market: "United Kingdom", acquired: "69,000", spend: "£212k", cac: "£3.07", cacTone: "teal", reach2nd: "41.1%", reach2ndTone: "teal", atStake: "£14k", atStakeTone: "neutral", trend: "improving" },
];

export const ACQUIRE_MARKET_SPOTLIGHTS: { id: string; eyebrow: string; tone: "teal" | "rose"; title: string; body: string; footnote: string }[] = [
  { id: "nigeria", eyebrow: "Nigeria · 68% of acquisition", tone: "rose", title: "Volume up 31%, quality down 11 points", body: "The dominant market and the one carrying the 4 March damage. Everything on the lifecycle map is mostly this.", footnote: "₦48M at stake here" },
  { id: "ghana", eyebrow: "Ghana · 11%", tone: "rose", title: "The worst CAC and the worst conversion", body: "Driven almost entirely by one paid social campaign promising free delivery in a market that has never had it.", footnote: "one channel, five months" },
  { id: "uk", eyebrow: "UK · 8%", tone: "teal", title: "The best of everything, and the smallest", body: "Lowest CAC, highest conversion, improving. It is also 0.4% of company exposure — worth learning from, not worth reallocating toward.", footnote: "small, and stated as small" },
];

// ---- What changed (A09) ---------------------------------------------------

export type ChangeRow = {
  id: string;
  date: string;
  team: string;
  teamColor: string;
  title: string;
  effect: string;
  effectTone: "teal" | "rose" | "amber" | "neutral" | "ultra";
  badge: "causal finding" | "no effect" | "not instrumented" | "measuring";
  badgeTone: "ultra" | "neutral" | "amber";
  /** When set, the row's title links to /lifecycle/:stage/changes/:id (a release-impact drilldown). */
  hasDetail?: boolean;
};

export const ACQUIRE_CHANGE_ROWS: ChangeRow[] = [
  { id: "delivery-fee", date: "4 Mar", team: "Engineering", teamColor: "#4E7080", title: "Delivery fee moved to checkout", effect: "First-order completion −7.0 pts", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "ghana-campaign", date: "11 Mar", team: "Marketing", teamColor: "#79883A", title: "Ghana paid social campaign launched", effect: "31,200 acquired at 4.1% conversion", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "mtn-route", date: "2 Apr", team: "Engineering", teamColor: "#4E7080", title: "MTN Nigeria SMS route changed", effect: "Verification −8.1 pts for MTN numbers only", effectTone: "rose", badge: "causal finding", badgeTone: "ultra" },
  { id: "referral-reward", date: "18 Apr", team: "Marketing", teamColor: "#79883A", title: "Referral reward raised to ₦1,000", effect: "Referral acquisition +22%", effectTone: "teal", badge: "causal finding", badgeTone: "ultra" },
  { id: "signup-form", date: "6 May", team: "Product", teamColor: "#7A5AA8", title: "Signup form reduced to three fields", effect: "No measurable effect", effectTone: "neutral", badge: "no effect", badgeTone: "neutral" },
  { id: "loyalty-tiers", date: "2 Jun", team: "Marketing", teamColor: "#79883A", title: "Loyalty tiers renamed", effect: "Not instrumented", effectTone: "amber", badge: "not instrumented", badgeTone: "amber" },
];

export const ACQUIRE_CHANGE_SOURCE_ROWS: { label: string; value: string; tone: "teal" | "amber" | "ultra" | "neutral" }[] = [
  { label: "From a release feed", value: "if one is connected · yours is, for Engineering only", tone: "teal" },
  { label: "From a campaign", value: "automatically, with its audience and spend", tone: "neutral" },
  { label: "From a room decision", value: "anything a room decided that changed the product or the offer", tone: "neutral" },
  { label: "Detected without being told", value: "a dated step change with no known cause · 2 this quarter", tone: "ultra" },
  { label: "Added by a person", value: "for things Flolyt cannot see · a price change at a partner, for instance", tone: "neutral" },
];

// ---- Agents (A10) ----------------------------------------------------------

export type AgentCard = {
  id: string;
  /** Empty string omits the avatar — some stages' cards are a capability/gap note rather than a named agent. */
  initials: string;
  status: string;
  name: string;
  body: string;
  footnote: string;
  tone: "ultra" | "neutral" | "amber" | "teal" | "rose";
  /** Overrides the footnote text's color — defaults to "ultra" (the color every card used before Retain's third card needed amber). */
  footnoteTone?: "ultra" | "neutral" | "amber" | "teal" | "rose";
};

export const ACQUIRE_AGENT_CARDS: AgentCard[] = [
  {
    id: "acquisition-quality",
    initials: "AQ",
    status: "Lead agent · reading since 12 Jan",
    name: "Acquisition Quality",
    body: "Watches conversion by channel, cohort and market. Opened 9 rooms this quarter, 6 of which closed with money recovered. It reads orders, identity and ad spend.",
    footnote: "9 rooms · 6 closed",
    tone: "ultra",
  },
  {
    id: "price-margin",
    initials: "PX",
    status: "Supporting · reading since 4 Feb",
    name: "Price & Margin",
    body: "Watches CAC against value per customer. It cannot compute payback because no COGS source exists, and it reports that rather than estimating around it.",
    footnote: "1 room · partially blocked",
    tone: "ultra",
  },
  {
    id: "referral",
    initials: "RF",
    status: "Not watching",
    name: "Referral",
    body: "The referral agent belongs to Advocate, which has no owner. Referral is this stage's best channel and nobody is watching the agent that understands it.",
    footnote: "unowned stage upstream",
    tone: "neutral",
  },
];

export type ThresholdRow = {
  id: string;
  condition: string;
  threshold: string;
  currently: string;
  currentlyTone: "teal" | "rose" | "amber" | "neutral";
  status: "already-open" | "not-opened" | "no" | "opens-automatically" | "blocked";
  /** Overrides the default chip text for `status` (e.g. "would open now" instead of "opens automatically") — tone still follows `status`. */
  statusLabel?: string;
  owner?: { name: string; initials: string; color: string };
  noOwner?: boolean;
};

export const ACQUIRE_THRESHOLD_ROWS: ThresholdRow[] = [
  { id: "conversion-falls", condition: "Conversion falls in any channel", threshold: "more than 3 pts, 7 days", currently: "Ghana −20 pts", currentlyTone: "rose", status: "already-open", owner: { name: "Tunde", initials: "TB", color: "#B4568F" } },
  { id: "cac-rises", condition: "CAC rises against value per customer", threshold: "ratio below 3×", currently: "Ghana 0.19×", currentlyTone: "rose", status: "already-open", owner: { name: "Ravi", initials: "RM", color: "#5D6BB8" } },
  { id: "cohort-breaks", condition: "A cohort breaks from the one before it", threshold: "more than 5 pts", currently: "March −10.2", currentlyTone: "rose", status: "already-open", owner: { name: "Ifeoma", initials: "IN", color: "#79883A" } },
  { id: "verification-falls", condition: "Verification rate falls", threshold: "more than 2 pts", currently: "−8.1 for MTN", currentlyTone: "rose", status: "not-opened", noOwner: true },
  { id: "spend-rises", condition: "Spend rises with no volume change", threshold: "more than 15%", currently: "+4%", currentlyTone: "teal", status: "no", owner: { name: "Ravi", initials: "RM", color: "#5D6BB8" } },
];

// ---- History (A14) ----------------------------------------------------------

export type GoalRow = {
  id: string;
  goal: string;
  owner: { name: string; initials: string; color: string };
  target: string;
  today: string;
  todayTone: "teal" | "rose" | "amber" | "neutral";
  paceLabel: string;
  paceTone: "teal" | "rose" | "amber";
  part: string;
  partTone: "amber" | "rose" | "neutral" | "teal";
};

export const ACQUIRE_GOAL_ROWS: GoalRow[] = [
  { id: "second-orders", goal: "Second orders", owner: { name: "Tunde", initials: "TB", color: "#B4568F" }, target: "184,000", today: "ahead", todayTone: "teal", paceLabel: "ahead", paceTone: "teal", part: "volume is doing the work", partTone: "amber" },
  { id: "repeat-rate", goal: "90-day repeat rate", owner: { name: "Ifeoma", initials: "IN", color: "#79883A" }, target: "36.4%", today: "29.2%", todayTone: "rose", paceLabel: "behind", paceTone: "rose", part: "acquisition quality is the drag", partTone: "rose" },
  { id: "contribution-margin", goal: "Contribution margin", owner: { name: "Ravi", initials: "RM", color: "#5D6BB8" }, target: "Unavailable", today: "Unavailable", todayTone: "neutral", paceLabel: "no baseline", paceTone: "amber", part: "blocked on COGS", partTone: "amber" },
];

export type TriedRow = {
  id: string;
  what: string;
  when: string;
  whenTone?: "neutral" | "amber" | "rose";
  result: string;
  resultTone: "teal" | "rose" | "amber" | "neutral";
  measuredHow: string;
  learningKept:
    | "validated"
    | "room open"
    | "superseded"
    | "validated · no effect"
    | "suggested twice"
    | "room needed"
    | "contested"
    | "blocked in 2024"
    | "incomplete"
    | "validated · low lift"
    | "never promoted"
    | "never proposed"
    | "works, aimed late"
    | "the open approval"
    | "works at small scale"
    | "never cross-sold"
    | "net negative"
    | "validated · a wash"
    | "validated · best in lifecycle"
    | "under review"
    | "the obvious next test"
    | "4 hrs waiting"
    | "reverse it"
    | "unresolved"
    | "stop it"
    | "built, unused";
  /** Overrides the learning-kept chip's tone — defaults to the fixed lookup by text (e.g. Renew's "never proposed" is rose here, not the usual amber). */
  learningKeptTone?: "teal" | "amber" | "neutral" | "rose";
};

export const ACQUIRE_TRIED_ROWS: TriedRow[] = [
  { id: "referral-reward", what: "Raised the referral reward to ₦1,000", when: "18 Apr", result: "+22% referral acquisition", resultTone: "teal", measuredHow: "holdout · 20% of referrers", learningKept: "validated" },
  { id: "signup-form", what: "Reduced the signup form to three fields", when: "6 May", result: "no measurable effect", resultTone: "neutral", measuredHow: "A/B · 50/50, 4 weeks", learningKept: "validated" },
  { id: "ghana-campaign", what: "Ghana paid social campaign", when: "11 Mar", result: "31,200 at 4.1% conversion", resultTone: "rose", measuredHow: "no holdout", learningKept: "room open" },
  { id: "discounted-first-order", what: "Discounted first order · 2024", when: "Nov 2024", result: "+41% volume, −14 pts repeat", resultTone: "rose", measuredHow: "holdout · 10%", learningKept: "superseded" },
];

// ---- Compare periods (A16) --------------------------------------------------

export type CompareRow = {
  id: string;
  metric: string;
  before: string;
  after: string;
  change: string;
  /** "amber" added for Churn's CH11 "Reason known" row — a mild negative that isn't rose. */
  changeTone: "teal" | "rose" | "amber" | "neutral";
  whatMovedIt: string;
};

export const ACQUIRE_COMPARE_ROWS: CompareRow[] = [
  { id: "acquired-per-month", metric: "Acquired per month", before: "64,900", after: "78,500", change: "+21.0%", changeTone: "teal", whatMovedIt: "Ghana campaign and paid social Nigeria" },
  { id: "blended-cac", metric: "Blended CAC", before: "₦1,466", after: "₦1,988", change: "+35.6%", changeTone: "rose", whatMovedIt: "Ghana at ₦6,026 pulls the blend up" },
  { id: "reach-second-order", metric: "Reach a second order", before: "37.4%", after: "27.2%", change: "−10.2 pts", changeTone: "rose", whatMovedIt: "The delivery fee, three stages downstream" },
  { id: "value-per-customer", metric: "Value per customer", before: "₦9,200", after: "₦6,600", change: "−28.3%", changeTone: "rose", whatMovedIt: "Fewer second orders, same basket size" },
  { id: "verification-rate", metric: "Verification rate", before: "81.4%", after: "73.3%", change: "−8.1 pts", changeTone: "rose", whatMovedIt: "MTN Nigeria SMS route, 2 April" },
  { id: "contribution-margin", metric: "Contribution margin", before: "Unavailable", after: "Unavailable", change: "—", changeTone: "neutral", whatMovedIt: "No COGS source" },
];

export const ACQUIRE_COMPARE_BUILD_ROWS: { label: string; value: string; tone: "neutral" | "amber" }[] = [
  { label: "Aligned on", value: "days since acquisition, not calendar date", tone: "neutral" },
  { label: "Excluded", value: "UK and Ghana for the fee comparison — it shipped there in June", tone: "amber" },
  { label: "Seasonality adjustment", value: "none applied, and none available", tone: "neutral" },
  { label: "Cohorts younger than 90 days", value: "shown, but not included in any 90-day figure", tone: "neutral" },
];

// ---- Shared modal presets (A11/A12/A13/A15) ---------------------------------

import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { MapAFieldPreset } from "@/pages/everyday/lifecycle/stage/modals/map-a-field-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";

export const ACQUIRE_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "Verification rate falls", note: "identity.verified ÷ identity.created" },
  byMoreThan: { label: "By more than", value: "2 percentage points", note: "against the trailing 28-day average" },
  sustainedFor: { label: "Sustained for", value: "3 days", note: "one bad day is noise and will not open a room" },
  segmentedBy: { label: "Segmented by", value: "carrier, market", note: "so “MTN Nigeria only” is findable, not averaged away" },
  routesTo: {
    name: "The Acquire stage owner · Tunde Bakare",
    note: "This rule previously routed to “verification owner”, which nobody holds",
  },
  simulation: {
    title: "Against the last twelve months, this would have fired twice",
    body: "Once on 2 April, when the MTN route changed — ₦9M, still open and unowned. Once on 14 November last year, which resolved itself in two days. A threshold that would have fired forty times is a threshold that will be ignored.",
  },
};

export const ACQUIRE_MAP_FIELD_PRESET: MapAFieldPreset = {
  needTitle: "Cost of goods, per order",
  needNote: "Unlocks payback here, a margin baseline in Price, and one blocked goal",
  candidates: [
    { id: "order-lines-unit-cost", field: "order_lines.unit_cost", source: "orders feed · 94% · numeric, per line, currency-tagged" },
    { id: "order-total-cost", field: "order.total_cost", source: "orders feed · 41% · populated on 12% of rows" },
    { id: "monthly-cogs", field: "monthly_cogs", source: "finance CSV · monthly total only · not per order" },
  ],
  noneOption: "None of these — I will connect a source instead",
  warningTitle: "Nothing is backfilled without you seeing it first",
  warningBody:
    "Mapping this recomputes payback for every cohort and every channel from 12 January onward. The preview shows the four figures that change and by how much before anything is written.",
};

export const ACQUIRE_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Signed up but never verified",
  carriedIn: [
    { label: "Stage", value: "Acquire" },
    { label: "Entered", value: "last 12 months" },
    { label: "Never verified", value: "true" },
    { label: "Markets", value: "Nigeria only" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "412,000 customers · ₦31M at stake",
  countedNote: "Counted 6 minutes ago · 118,000 of these never received the SMS",
  participants: [
    { initials: "TB", kind: "human", color: "#B4568F" },
    { initials: "ZY", kind: "human", color: "#7A5AA8" },
    { initials: "AQ", kind: "agent" },
    { initials: "MO", kind: "agent" },
  ],
  participantsNote: "Acquisition Quality leads · Tunde owns the stage, so he owns this",
};

export const ACQUIRE_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Acquire · overview · Nigeria",
  snapshotLabel: "Acquire · overview · Nigeria · as of 13 Aug 08:12",
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
    "Payback is unavailable and June's 90-day figure is blank. Both travel with the file rather than being dropped from it — an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};
