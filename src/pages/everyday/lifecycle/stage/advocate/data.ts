/**
 * Mock content for the Advocate stage — screens AV01-AV13 in
 * flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/. Numbers and copy
 * are transcribed directly from those SVGs (each one's footer states its
 * id, e.g. "AV06 · Advocate · cohorts").
 */

import type { Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import type { OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import type { ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";
import type { AssignOwnerPreset } from "@/pages/everyday/lifecycle/stage/modals/assign-an-owner-modal";

// ---- Shared across Definition/Overview/Agents (AV01/AV02/AV09) -----------

export const ADVOCATE_ASSIGN_OWNER_PRESET: AssignOwnerPreset = {
  description: "Five rooms open the moment somebody's name is on this",
  unownedTitle: "Unowned since 12 January · 214 days",
  statsLine: "14 agent findings · 0 rooms · 5 breached thresholds · ₦278M of untested spend",
  candidatesEyebrow: "Who should own it",
  candidates: [
    { id: "ifeoma-nwosu", initials: "IN", color: "#79883A", name: "Ifeoma Nwosu", reason: "Owns Retain · referral is a retention behaviour · 14 rooms already" },
    { id: "tunde-bakare", initials: "TB", color: "#B4568F", name: "Tunde Bakare", reason: "Owns Acquire and Expand · referral is 31% of acquisition", selected: true },
    { id: "kunle-ade", initials: "KO", color: "#2E8B7F", name: "Kunle Ade", reason: "Owns Renew · Kenya refers at 19.8% and he owns Kenya" },
  ],
  consequencesEyebrow: "What happens the moment you assign",
  consequences: [
    { label: "Five breached thresholds route somewhere", value: "and open five rooms tonight", tone: "amber" },
    { label: "14 held findings are delivered", value: "in tomorrow's 06:00 digest", tone: "teal" },
    { label: "The Legacy Unlimited conflict surfaces", value: "to Tunde and Ravi together, not separately", tone: "amber" },
    { label: "A reward holdout becomes proposable", value: "₦278M · six weeks to an answer", tone: "teal" },
    { label: "Their load", value: "Tunde already owns 2 stages and 11 rooms", tone: "amber" },
  ],
  closingTitle: "Assigning this is the cheapest action available in the workspace today",
  closingBody:
    "No engineering, no budget, no customer contact. One name against one stage, and the highest-return channel in the company stops being nobody's job. It has been available since 12 January.",
  confirmLabel: "Assign Tunde",
};

// ---- Definition (AV01) is now the shared DefinitionRoute template — see
// stage/definition/definition-route.tsx. GET .../definition has no field for the "what this stage
// is worth, conservatively" breakdown below, so it isn't reproducible from live data; dropped.

// ---- Overview (AV02) -------------------------------------------------------

export const ADVOCATE_OVERVIEW_LEAD = {
  title: "This stage has no owner and has not had one for seven months",
  body: "It produced 31% of last year's new customers at the lowest CAC and the highest repeat rate in the company. Rooms opened here have nobody's name on them and escalate to Ada by default.",
};

// KPI row and leak table are both wired to the shared GET /lifecycle/stages/{stageKey} — see
// overview-tab.tsx's buildStageKpis and its `departures[]`-driven table.

export const ADVOCATE_OVERVIEW_INSIGHT = {
  title: "The fourth row is a direct conflict with a decision Price is trying to make",
  body: "Legacy Unlimited holders refer at 4.1× the base rate and 611 of them are top-decile referrers. Price wants to reprice them because they cost ₦410 a delivery against ₦93 of revenue. Both stages are right. Neither can settle it alone and neither has raised it, because one of them has no owner.",
};

export const ADVOCATE_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Rewards paid to referrals that would have come anyway",
  carriedIn: [
    { label: "Stage", value: "Advocate" },
    { label: "Entered", value: "last 12 months" },
    { label: "Referred more than once", value: "true" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "41,000 customers · ₦41M at stake",
  countedNote: "Counted 6 minutes ago · never tested against a holdout",
  participants: [
    { initials: "AD", kind: "human", color: "#2E8B7F" },
    { initials: "RF", kind: "agent" },
  ],
  participantsNote: "Referral leads · no stage owner, escalated to Ada by default",
};

export const ADVOCATE_SHARE_EXPORT_PRESET: ShareOrExportPreset = {
  viewLabel: "Advocate · overview · Nigeria",
  snapshotLabel: "Advocate · overview · Nigeria · as of 13 Aug 08:12",
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
    "The referral-link-share figure travels as \"unavailable\" rather than being dropped from the file — an export where the gaps quietly vanish is how an unavailable becomes a zero in someone else's deck.",
};

// ---- Referrers (AV03, route path "referrers") is now wired to
// GET /lifecycle/advocate/referrers — see referrers-tab.tsx. That endpoint bands advocates by
// referral count only (referrers/lapsed/lapsedShare), with no per-group customers/repeat-rate/
// verdict field and no per-group drilldown, so those and the "who stopped" insight cards aren't
// reproducible from live data. one-referrer-group-route.tsx below keeps its own unrelated mock —
// see [[flag_unreachable_routes]], now unreachable.

export const ADVOCATE_REFERRERS_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Referrers stopped referring since March",
  carriedIn: [
    { label: "Stage", value: "Advocate" },
    { label: "Stopped since", value: "week of 4 March" },
    { label: "Still an active customer", value: "true" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "18,000 referrers · ₦18M of CAC lost",
  countedNote: "Counted 6 minutes ago · fell 71% in seven days, has not recovered",
  participants: [
    { initials: "AD", kind: "human", color: "#2E8B7F" },
    { initials: "RF", kind: "agent" },
  ],
  participantsNote: "Referral leads · no stage owner, escalated to Ada by default",
};

// ---- Referral quality (AV04, route path "quality") is now wired to
// GET /lifecycle/advocate/referral-quality — see quality-tab.tsx. That endpoint compares referred
// customers only against "everybody else who bought" (never a named channel, never claims a free
// acquisition), with no features-used field and no per-channel table, so the old mock's
// channel-comparison table, KPIs and "why referred customers behave better" narrative rows aren't
// reproducible from live data.

export const ADVOCATE_QUALITY_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Referral outperforms paid social on every measure and gets no budget conversation",
  carriedIn: [
    { label: "Stage", value: "Advocate" },
    { label: "Compared against", value: "Paid social · Ghana" },
    { label: "Ratio", value: "11.4× vs 0.19×" },
    { label: "Markets", value: "Nigeria, Ghana" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "278,000 referred customers · 11.4× value-to-CAC",
  countedNote: "Counted 6 minutes ago · 2.4× smaller than paid social and outperforms it",
  participants: [
    { initials: "AD", kind: "human", color: "#2E8B7F" },
    { initials: "RF", kind: "agent" },
  ],
  participantsNote: "Referral leads · no stage owner, escalated to Ada by default",
};

// ---- Rewards (AV05) --------------------------------------------------------

export const ADVOCATE_REWARDS_KPIS: Kpi[] = [
  { eyebrow: "Reward per referral", value: "₦1,000", tone: "amber", note: "raised from ₦500 in April" },
  { eyebrow: "Paid in 12 months", value: "₦278M", tone: "amber", note: "to 124,000 referrers" },
  { eyebrow: "Incremental?", value: "Unavailable", tone: "rose", note: "no holdout has ever been run" },
  { eyebrow: "Margin cost", value: "Unavailable", tone: "amber", note: "no COGS source" },
];

export const ADVOCATE_REWARDS_WARNING = {
  title: "₦278M a year has been paid out with no test of whether it changes anything",
  body: "The reward has run since 2022 and been raised twice. It has never had a holdout. Nobody can say whether referrals would happen without it, at half of it, or at twice the volume with double.",
};

export type AdvocateRewardChangeRow = {
  id: string;
  what: string;
  before: string;
  after: string;
  change: string;
  changeTone: "teal" | "rose" | "neutral";
  reading: string;
};

export const ADVOCATE_REWARD_CHANGE_ROWS: AdvocateRewardChangeRow[] = [
  { id: "referrals-per-month", what: "Referrals per month", before: "21,400", after: "26,100", change: "+22.0%", changeTone: "teal", reading: "Volume rose" },
  { id: "reward-paid-per-month", what: "Reward paid per month", before: "₦10.7M", after: "₦26.1M", change: "+144%", changeTone: "rose", reading: "Cost rose faster" },
  { id: "cost-per-referral", what: "Cost per referral", before: "₦500", after: "₦1,000", change: "+100%", changeTone: "rose", reading: "By definition" },
  { id: "referred-repeat-rate", what: "Referred customer repeat rate", before: "41.4%", after: "41.1%", change: "−0.3 pts", changeTone: "neutral", reading: "Quality unchanged" },
  { id: "referrers-more-than-once", what: "Referrers who referred more than once", before: "38.1%", after: "38.4%", change: "+0.3 pts", changeTone: "neutral", reading: "Behaviour unchanged" },
  { id: "any-incremental", what: "Was any of it incremental?", before: "—", after: "Unavailable", change: "—", changeTone: "neutral", reading: "No holdout · no answer" },
];

export const ADVOCATE_REWARDS_TRADE_INSIGHT = {
  title: "Doubling the reward bought 22% more referrals and cost 144% more",
  body: "On the face of it that is a bad trade. It might still be a good one if those 4,700 extra monthly referrals would not otherwise exist — but with no holdout, the 21,400 who were already referring at ₦500 are now being paid ₦1,000 for the same behaviour. That alone is roughly ₦128M a year, and it is not on anybody's list.",
};

export const ADVOCATE_REWARDS_HOLDOUT_INSIGHT = {
  title: "A holdout here costs nothing and would settle it in six weeks",
  body: "Hold 10% of referrers at ₦500. It requires no product change, no engineering and no customer contact. It has not been proposed because proposing it is somebody's job and nobody has this stage.",
};

export const ADVOCATE_REWARDS_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "A reward change runs without a holdout",
  carriedIn: [
    { label: "Stage", value: "Advocate" },
    { label: "Reward", value: "₦500 → ₦1,000 · 18 April" },
    { label: "Holdout run", value: "false" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "₦278M paid in 12 months · never tested",
  countedNote: "Counted 6 minutes ago · a 10% holdout would settle it in six weeks",
  participants: [
    { initials: "AD", kind: "human", color: "#2E8B7F" },
    { initials: "RF", kind: "agent" },
  ],
  participantsNote: "Referral leads · no stage owner, escalated to Ada by default",
};

// ---- Cohorts (AV06) is wired to the shared GET /lifecycle/stages/{stageKey}/cohorts — see
// acquire/data.ts's Cohorts note and cohorts-tab.tsx. The "Open a war room" header button this
// tab used to show is dropped along with it, same reason as the Markets tab's — it was seeded
// with a hardcoded finding (ADVOCATE_COHORTS_OPEN_ROOM_PRESET) tied to the old fabricated mock,
// not a generic affordance.

// ---- Markets (AV07) is wired to the shared GET /lifecycle/stages/{stageKey}/markets — see
// acquire/data.ts's Markets note and markets-tab.tsx. The "Open a war room" header button this
// tab used to show is dropped along with it — it was seeded with a hardcoded Kenya-specific
// finding (ADVOCATE_MARKETS_OPEN_ROOM_PRESET), not a generic affordance, and that finding has no
// grounding once the underlying table is real per-market population/atStake/conversion instead.

// ---- What changed (AV08) ---------------------------------------------------
// Wired live (see stage/changes/changes-tab.tsx, GET /lifecycle/stages/{stageKey}/change-registry)
// — no mock export here anymore.

// ---- Agents (AV09) is wired to the shared GET /lifecycle/stages/{stageKey}/agents — see
// acquire/data.ts's Agents note and agents-tab.tsx.

export const ADVOCATE_THRESHOLD_PRESET: ThresholdPreset = {
  condition: { label: "When", value: "A reward change runs without a holdout", note: "any change to the referral reward amount goes live with no measurement plan" },
  byMoreThan: { label: "By more than", value: "any", note: "there is no tolerance — a reward change either has a holdout or it does not" },
  sustainedFor: { label: "Sustained for", value: "0 days", note: "opens the moment the change ships" },
  segmentedBy: { label: "Segmented by", value: "market, reward amount", note: "so a single market's change is findable, not averaged away" },
  routesTo: { name: "The Advocate stage owner", note: "currently nobody — falls back to Ada" },
  simulation: {
    title: "Against the last twelve months, this would have fired once",
    body: "On 18 April, when the reward was raised from ₦500 to ₦1,000 with no holdout — 117 days ago and still unrouted. It is why ₦278M has never been tested.",
  },
};

// ---- History (AV10) is wired to the shared GET /lifecycle/stages/{stageKey}/history — see
// acquire/data.ts's History note and history-tab.tsx.

// ---- Compare periods (AV11) is wired to the shared GET /lifecycle/stages/{stageKey}/compare —
// see acquire/data.ts's Compare note and compare-route.tsx.

// ---- One referrer group (AV13, /lifecycle/advocate/referrers/:id) ---------

export type AdvocateTradeRow = {
  id: string;
  label: string;
  priceReading: string;
  advocateReading: string;
  whoRight: string;
  whoRightTone: "amber" | "teal" | "rose";
};

export type AdvocateReferrerGroupDetail = {
  title: string;
  subtitle: string;
  kpis: Kpi[];
  warningTitle: string;
  warningBody: string;
  tradeEyebrow: string;
  tradeRows: AdvocateTradeRow[];
  closingTitle: string;
  closingBody: string;
};

export const ADVOCATE_REFERRER_GROUP_DETAILS: Record<string, AdvocateReferrerGroupDetail> = {
  "legacy-unlimited-holders": {
    title: "Legacy Unlimited holders",
    subtitle: "3,100 customers · 9.2 referrals each · the group Price wants to reprice",
    kpis: [
      { eyebrow: "Customers", value: "3,100", note: "0.07% of the base" },
      { eyebrow: "Referrals each", value: "9.2", tone: "teal", note: "4.1× the base rate" },
      { eyebrow: "Customers referred", value: "28,500", tone: "teal", note: "10.3% of all referrals" },
      { eyebrow: "Their own repeat rate", value: "81.1%", tone: "teal", note: "highest of any group" },
    ],
    warningTitle: "Price wants to reprice these customers. Advocate cannot afford to lose them.",
    warningBody:
      "They cost ₦410 a delivery against ₦93 of revenue — roughly ₦162M a year net. They also produce 28,500 customers a year at zero CAC, worth roughly ₦285M in avoided acquisition cost.",
    tradeEyebrow: "The trade, as far as either stage can currently see it",
    tradeRows: [
      { id: "the-cost", label: "The cost", priceReading: "₦410 delivery vs ₦93 revenue per order", advocateReading: "Not counted here", whoRight: "Price", whoRightTone: "amber" },
      { id: "annual-net-cost", label: "Annual net cost", priceReading: "≈₦162M", advocateReading: "Not counted here", whoRight: "Price", whoRightTone: "amber" },
      { id: "the-value", label: "The value", priceReading: "Not counted there", advocateReading: "28,500 referred customers a year", whoRight: "Advocate", whoRightTone: "teal" },
      { id: "avoided-cac", label: "Avoided acquisition cost", priceReading: "Not counted there", advocateReading: "≈₦285M at blended CAC", whoRight: "Advocate", whoRightTone: "teal" },
      { id: "contribution-margin", label: "Contribution margin", priceReading: "Unavailable", advocateReading: "Unavailable", whoRight: "neither", whoRightTone: "rose" },
      { id: "referrals-survive-repricing", label: "Whether referrals survive repricing", priceReading: "Unavailable", advocateReading: "Unavailable", whoRight: "neither", whoRightTone: "rose" },
    ],
    closingTitle: "Two stages, two correct readings, opposite conclusions, and no room",
    closingBody:
      "Ravi has been blocked on this since 2024 because margin is unavailable. The referral value has never entered the conversation because Advocate has no owner to bring it. The only honest next step is a holdout — reprice 300 of them and measure what happens to referrals — and it needs both stages in one room.",
  },
};

export const ADVOCATE_REFERRER_GROUP_OPEN_ROOM_PRESET: OpenRoomPreset = {
  condition: "Price wants to reprice Legacy Unlimited holders · Advocate cannot afford to lose them",
  carriedIn: [
    { label: "Stage", value: "Advocate + Price" },
    { label: "Group", value: "Legacy Unlimited holders" },
    { label: "Blocked since", value: "2024" },
    { label: "Markets", value: "Nigeria" },
    { label: "Excludes", value: "test accounts, merged duplicates" },
  ],
  countedSummary: "3,100 customers · ≈₦162M cost vs ≈₦285M avoided CAC",
  countedNote: "Counted 6 minutes ago · contribution margin unavailable to either stage",
  participants: [
    { initials: "RM", kind: "human", color: "#5D6BB8" },
    { initials: "AD", kind: "human", color: "#2E8B7F" },
  ],
  participantsNote: "Ravi owns Price · no Advocate owner, escalated to Ada by default",
};
