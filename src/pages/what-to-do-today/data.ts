/**
 * Mock content for /what-to-do-today, rebuilt from
 * flolyt-figma-designs/Everyday Screens/flolyt-today/ (T00-T16). Route of
 * record is /what-to-do-today (the sidebar's existing href) — the export's
 * own footers say /today/*, translated 1:1 onto /what-to-do-today/* the same
 * way the lifecycle rebuild changed "#/stage/:id" to "/lifecycle/:stage".
 * See docs/build-tracker.md section 2 for the per-screen route map.
 */
import type { Department } from "@/pages/lifecycle/data";
import type { AgentRef, PersonRef, Tone } from "@/pages/rooms/types";

/** How many days into using Flolyt this workspace is — drives T01/T02/T03's branch (see index.tsx). */
export const WORKSPACE_AGE_DAYS = 41;

export type TodayItem = {
  id: string;
  rank: number;
  title: string;
  department: Department;
  whyHere: string;
  atStake: string;
  atStakeTone?: Tone;
  effort: number;
  impact: number;
  stateLabel: string;
  stateTone: Tone;
};

/** T03's "Mine · 4" list — also T05's "ranked / above the line" table and T04's worked example. */
export const TODAY_ITEMS: TodayItem[] = [
  {
    id: "r-8f2c",
    rank: 1,
    title: "Approve the reactivation sequence",
    department: "Marketing",
    whyHere: "Waiting 19 hours · ₦2.1M a day of decay",
    atStake: "₦412M",
    atStakeTone: "rose",
    effort: 1,
    impact: 5,
    stateLabel: "needs you",
    stateTone: "amber",
  },
  {
    id: "growth-finance-conflict",
    rank: 2,
    title: "Decide the growth vs finance conflict",
    department: "Marketing",
    whyHere: "Two agents disagree · nothing moves until you pick",
    atStake: "₦88M",
    atStakeTone: "rose",
    effort: 2,
    impact: 4,
    stateLabel: "needs you",
    stateTone: "amber",
  },
  {
    id: "ghana-signup-room",
    rank: 3,
    title: "Name an owner for the Ghana signup room",
    department: "Marketing",
    whyHere: "Opened 4 days ago, nobody has it",
    atStake: "₦31M",
    atStakeTone: "amber",
    effort: 1,
    impact: 2,
    stateLabel: "no owner",
    stateTone: "amber",
  },
  {
    id: "renewal-re-forecast",
    rank: 4,
    title: "Re-date the renewal re-forecast you owe",
    department: "Customer Success",
    whyHere: "4 days overdue · pinned regardless of value",
    atStake: "₦88M",
    atStakeTone: "rose",
    effort: 1,
    impact: 2,
    stateLabel: "overdue",
    stateTone: "rose",
  },
];

export const TODAY_TAB_COUNTS = { mine: 4, myTeam: 17, blockingGoal: 5, everything: 340 };

export const BELOW_LINE_SUMMARY: { label: string; value: string; tone?: Tone }[] = [
  { label: "Two items waiting on data", value: "₦18M combined · would rank the moment the COGS feed connects" },
  { label: "Three items under ₦5M", value: "₦7.4M combined · still open, still owned by you" },
  { label: "Four items closed since Monday", value: "₦96M recovered · in the value ledger", tone: "teal" },
  { label: "336 items on other people's lists", value: "visible under Everything · not yours today" },
];

export type BelowLineRow = {
  item: string;
  reason: string;
  atStake: string;
  atStakeTone?: Tone;
  wouldRankWhen: string;
  wouldRankWhenTone?: Tone;
};

/** T05's "below the line" detail table. */
export const BELOW_THE_LINE: BelowLineRow[] = [
  {
    item: "Reprice the Ghana starter plan",
    reason: "No margin baseline — the ranking needs a denominator",
    atStake: "Unavailable",
    wouldRankWhen: "the COGS feed connects",
    wouldRankWhenTone: "amber",
  },
  {
    item: "Re-segment the dormant Kenya base",
    reason: "Confidence 2 of 5 · one reading, no comparison group",
    atStake: "₦12M",
    wouldRankWhen: "a second reading lands",
    wouldRankWhenTone: "amber",
  },
  {
    item: "Reclassify support contact drivers",
    reason: "Under ₦5M and already assigned",
    atStake: "₦4M",
    wouldRankWhen: "—",
  },
  {
    item: "Rename the loyalty tiers · evaluate",
    reason: "Not instrumented · the release shipped without an event",
    atStake: "Unavailable",
    wouldRankWhen: "loyalty.tier_shown maps",
    wouldRankWhenTone: "amber",
  },
  {
    item: "Chase 340 lapsed referrers",
    reason: "Under ₦5M",
    atStake: "₦1.9M",
    wouldRankWhen: "—",
  },
  {
    item: "Test account-after-checkout",
    reason: "Nobody has proposed it · it is not an open item",
    atStake: "₦74M",
    atStakeTone: "amber",
    wouldRankWhen: "someone proposes it",
    wouldRankWhenTone: "rose",
  },
];

export type FirstListRow = {
  rank: number;
  title: string;
  department: Department;
  why: string;
  atStake: string;
  atStakeTone?: Tone;
  effort: number;
  impact: number;
};

/** T02's "your first three" — a distinct onboarding dataset, not a slice of TODAY_ITEMS. */
export const FIRST_LIST_ITEMS: FirstListRow[] = [
  {
    rank: 1,
    title: "Name an owner for the Ghana signup room",
    department: "Marketing",
    why: "Opened by an agent 4 days ago, nobody has it",
    atStake: "₦31M",
    atStakeTone: "amber",
    effort: 1,
    impact: 2,
  },
  {
    rank: 2,
    title: "Approve the Kenya retry window",
    department: "Finance",
    why: "Same change that recovered ₦62M in Nigeria",
    atStake: "KES 4.1M",
    atStakeTone: "amber",
    effort: 1,
    impact: 4,
  },
  {
    rank: 3,
    title: "Confirm the Accra room is a duplicate",
    department: "Support",
    why: "91% overlap with a room opened six days earlier",
    atStake: "—",
    effort: 1,
    impact: 1,
  },
];

export type NotYourListRow = { item: string; atStake: string; atStakeTone?: Tone; owner: PersonRef; why: string };

export const NOT_YOUR_LIST: NotYourListRow[] = [
  {
    item: "Ship the delivery fee into the basket subtotal",
    atStake: "₦412M",
    atStakeTone: "rose",
    owner: { initials: "ZY", name: "Zainab Yusuf", department: "Product" },
    why: "she owns Activate",
  },
  {
    item: "Retry failed cards at 09:00 local",
    atStake: "₦88M",
    atStakeTone: "amber",
    owner: { initials: "RM", name: "Ravi Mehta", department: "Customer Success" },
    why: "he owns Renew",
  },
  {
    item: "Stop the 20% code for full-price buyers",
    atStake: "₦46M",
    atStakeTone: "amber",
    owner: { initials: "TB", name: "Tunde Bakare", department: "Marketing" },
    why: "he owns the discount",
  },
];

export type WorkingRow = {
  agent: AgentRef;
  inWhat: string;
  doing: string;
  since: string;
  willReach: string;
  willReachTone?: Tone;
};

/** T01's "working right now, and not asking you for anything" table. */
export const WORKING_NOW: WorkingRow[] = [
  {
    agent: { initials: "RD", name: "Repeat & Decay" },
    inWhat: "Second order never happened",
    doing: "Measuring wave two against the holdout",
    since: "06:12",
    willReach: "only if a play needs approval",
  },
  {
    agent: { initials: "IC", name: "Involuntary Churn" },
    inWhat: "Cards failing on renewal night",
    doing: "Watching the 09:00 retry window",
    since: "00:00",
    willReach: "only if a play needs approval",
  },
  {
    agent: { initials: "SS", name: "Support Signal" },
    inWhat: "Lagos delivery failures",
    doing: "Reclassifying contact drivers",
    since: "Yesterday",
    willReach: "no · log only",
  },
  {
    agent: { initials: "EX", name: "Expansion" },
    inWhat: "Pay as you go past break-even",
    doing: "Sizing the prompt audience",
    since: "04:40",
    willReach: "yes, probably today",
    willReachTone: "amber",
  },
];

export type RankingInput = {
  input: string;
  whatItIs: string;
  whereFrom: string;
  canChange: string;
  canChangeTone: Tone;
};

/** T04's "THE FORMULA" reference table. */
export const RANKING_INPUTS: RankingInput[] = [
  { input: "Revenue at stake", whatItIs: "What is lost over 90 days if nothing is done", whereFrom: "the room's own figure", canChange: "no", canChangeTone: "rose" },
  { input: "Confidence", whatItIs: "How strong the evidence behind it is · 1 to 5", whereFrom: "the agent's reading", canChange: "no", canChangeTone: "rose" },
  { input: "Effort", whatItIs: "How much work the decision or action takes · 1 to 5", whereFrom: "estimated · editable", canChange: "yes", canChangeTone: "teal" },
  { input: "Goal weight", whatItIs: "×2 if it blocks a Q1 goal you own", whereFrom: "your goals", canChange: "by setting goals", canChangeTone: "amber" },
  { input: "Overdue", whatItIs: "Pinned into the list, ranked normally inside it", whereFrom: "handoff dates", canChange: "no", canChangeTone: "rose" },
  { input: "Age", whatItIs: "Displayed · never scored", whereFrom: "—", canChange: "deliberately not", canChangeTone: "rose" },
];

export type ScoredRow = { item: string; atStake: string; confidence: number; effort: number; goal: string; score: string; rank: string };

/** T04's "TODAY'S FOUR, WITH THE ARITHMETIC SHOWN" worked example — includes one below-the-line row for contrast. */
export const RANKING_WORKED_EXAMPLE: ScoredRow[] = [
  { item: "Approve the reactivation sequence", atStake: "₦412M", confidence: 5, effort: 1, goal: "×2", score: "4,120", rank: "1" },
  { item: "Decide the growth vs finance conflict", atStake: "₦88M", confidence: 4, effort: 2, goal: "×2", score: "352", rank: "2" },
  { item: "Name an owner for the Ghana room", atStake: "₦31M", confidence: 4, effort: 1, goal: "×1", score: "124", rank: "3" },
  { item: "Re-date the renewal re-forecast", atStake: "₦88M", confidence: 5, effort: 1, goal: "×1", score: "pinned", rank: "4" },
  { item: "Reclassify support contact drivers", atStake: "₦4M", confidence: 3, effort: 3, goal: "×1", score: "4", rank: "below" },
];

export type ItemDetailStat = { label: string; value: string; tone?: Tone; caption: string };
export type ItemDetailReasonCard = { eyebrow: string; heading: string; body: string; footnote: string; tone: "ultra" | "amber" | "teal" };
export type ItemDetailFact = { label: string; value: string; tone?: Tone };

export type ItemDetail = {
  title: string;
  subtitle: string;
  stats: ItemDetailStat[];
  reasonCards: ItemDetailReasonCard[];
  facts: ItemDetailFact[];
  closing: { title: string; body: string };
};

/**
 * T06 — only the #1 ranked item ("r-8f2c") has a fully-built detail page,
 * same "one reference row" pattern as Price's plans/:id and Adopt's
 * features/:id. Other item ids fall back to ItemDetailRoute's not-found state.
 */
export const ITEM_DETAILS: Record<string, ItemDetail> = {
  "r-8f2c": {
    title: "Approve the reactivation sequence",
    subtitle: "Ranked first · Marketing · ₦412M at stake · waiting 19 hours",
    stats: [
      { label: "AT STAKE", value: "₦412M", tone: "rose", caption: "over 90 days" },
      { label: "EFFORT", value: "1 / 5", caption: "one approval, two minutes" },
      { label: "IMPACT", value: "5 / 5", tone: "teal", caption: "highest open" },
      { label: "WAITING", value: "19 hours", tone: "amber", caption: "≈₦1.7M already gone" },
    ],
    reasonCards: [
      {
        eyebrow: "The evidence",
        heading: "A dated change, not a trend",
        body: "Second orders fell 11 points the week the fee moved to checkout. The UK and Ghana, where it did not ship, held flat across the same fourteen days.",
        footnote: "high confidence · n=1.24M",
        tone: "ultra",
      },
      {
        eyebrow: "The cost of waiting",
        heading: "₦2.1M a day, and not linear",
        body: "About 4,100 customers pass the 90-day mark each day, and their response rate falls from 16.1% to 4.2% the moment they do. Nineteen hours is roughly 3,300 people already past saving.",
        footnote: "compounding, not fixed",
        tone: "amber",
      },
      {
        eyebrow: "What it takes from you",
        heading: "One approval",
        body: "The audience is built, the exclusions are applied, the holdout is set and the guardrails have already stopped four things. Approving runs it under your identity, with re-auth.",
        footnote: "two minutes",
        tone: "teal",
      },
    ],
    facts: [
      { label: "Audience", value: "100,000 reachable · 48,000 excluded and listed" },
      { label: "Holdout", value: "10% · 10,000 not contacted", tone: "teal" },
      { label: "Offer", value: "none in wave one · decided by you at 08:02" },
      { label: "Collision", value: "41,300 overlapped four other rooms · already excluded", tone: "amber" },
      { label: "Guardrails", value: "quiet hours, frequency cap, opt-out · all applied", tone: "teal" },
      { label: "What would say it failed", value: "wave one below 12% · written on day one" },
      { label: "Recorded dissent", value: "Tunde Bakare · checked automatically at close", tone: "amber" },
    ],
    closing: {
      title: "An item you can act on, or argue with",
      body: "A row and a number tell you what to do. This tells you why it is first, what it costs to wait, what has already been decided on your behalf, and who disagreed. If you think the ranking is wrong, this is the screen that gives you something specific to be wrong about.",
    },
  },
};

export type TeamMemberRow = {
  person?: PersonRef;
  unassigned?: boolean;
  items: number;
  itemsTone?: Tone;
  atStake: string;
  atStakeTone?: Tone;
  oldest: string;
  oldestTone?: Tone;
  approvalsWaiting: number;
  approvalsWaitingTone?: Tone;
  roomsWatched?: number;
  roomsWatchedTone?: Tone;
  badge: string;
  badgeTone: Tone;
};

/** T10's "who is carrying what" roster. */
export const TEAM_ROSTER: TeamMemberRow[] = [
  {
    person: { initials: "GM", name: "Grace Mwangi", department: "Customer Success" },
    items: 6,
    atStake: "₦88M",
    atStakeTone: "amber",
    oldest: "9 days",
    oldestTone: "rose",
    approvalsWaiting: 4,
    approvalsWaitingTone: "amber",
    roomsWatched: 22,
    roomsWatchedTone: "rose",
    badge: "overloaded",
    badgeTone: "rose",
  },
  {
    person: { initials: "PK", name: "Peter Kariuki", department: "Customer Success" },
    items: 5,
    atStake: "₦61M",
    atStakeTone: "amber",
    oldest: "6 days",
    oldestTone: "amber",
    approvalsWaiting: 3,
    approvalsWaitingTone: "amber",
    roomsWatched: 18,
    roomsWatchedTone: "amber",
    badge: "overloaded",
    badgeTone: "rose",
  },
  {
    person: { initials: "JN", name: "Joy Nduta", department: "Customer Success" },
    items: 2,
    atStake: "₦24M",
    oldest: "2 days",
    approvalsWaiting: 1,
    roomsWatched: 7,
    roomsWatchedTone: "teal",
    badge: "fine",
    badgeTone: "teal",
  },
  {
    person: { initials: "DO", name: "David Otieno", department: "Customer Success" },
    items: 1,
    atStake: "₦9M",
    oldest: "1 day",
    approvalsWaiting: 0,
    roomsWatched: 4,
    roomsWatchedTone: "teal",
    badge: "has room",
    badgeTone: "teal",
  },
  {
    unassigned: true,
    items: 3,
    itemsTone: "rose",
    atStake: "₦36M",
    atStakeTone: "rose",
    oldest: "4 days",
    oldestTone: "rose",
    approvalsWaiting: 0,
    badge: "unassigned",
    badgeTone: "rose",
  },
];

export type TeamUnownedRow = { title: string; atStake: string; atStakeTone?: Tone; opened: string; openedTone?: Tone; suggestedOwner: PersonRef; why: string };

/** T10's "the three with nobody on them" table. */
export const TEAM_UNOWNED: TeamUnownedRow[] = [
  {
    title: "Name an owner for the Mombasa delivery room",
    atStake: "₦19M",
    atStakeTone: "amber",
    opened: "4 days",
    openedTone: "rose",
    suggestedOwner: { initials: "DO", name: "David Otieno", department: "Customer Success" },
    why: "lowest load, owns the Coast region",
  },
  {
    title: "Re-forecast the Kenya renewal book",
    atStake: "₦12M",
    atStakeTone: "amber",
    opened: "4 days",
    openedTone: "rose",
    suggestedOwner: { initials: "JN", name: "Joy Nduta", department: "Customer Success" },
    why: "built the July forecast",
  },
  {
    title: "Chase the Nakuru card failures",
    atStake: "₦5M",
    opened: "2 days",
    openedTone: "amber",
    suggestedOwner: { initials: "DO", name: "David Otieno", department: "Customer Success" },
    why: "lowest load",
  },
];

export type StuckRow = { what: string; where: string; behind: string; behindTone?: Tone; stuckFor: string; stuckForTone?: Tone; needs: string; needsYou: boolean };

/** T11's "what is stuck, rather than what is happening" table. */
export const ORG_STUCK: StuckRow[] = [
  { what: "14 plays over 100,000 recipients waiting on you", where: "All markets", behind: "₦1.4B", behindTone: "rose", stuckFor: "19 hrs median", stuckForTone: "rose", needs: "your approval, or a standing authority", needsYou: true },
  { what: "Engineering holds 41 obligations, 14 overdue", where: "Nigeria", behind: "₦188M", behindTone: "rose", stuckFor: "21 days median", stuckForTone: "rose", needs: "a priority call above the teams", needsYou: true },
  { what: "Second orders vs repeat rate, unresolved", where: "All markets", behind: "₦88M CAC", behindTone: "rose", stuckFor: "6 weeks", stuckForTone: "rose", needs: "you to pick one", needsYou: true },
  { what: "Ghana ships the fee release on 14 September", where: "Ghana", behind: "preventable", behindTone: "amber", stuckFor: "31 days out", stuckForTone: "amber", needs: "someone to open a room", needsYou: false },
  { what: "Advocate and Churn have no owner", where: "All markets", behind: "₦155M", behindTone: "rose", stuckFor: "214 days", stuckForTone: "rose", needs: "two names against two stages", needsYou: true },
  { what: "19 agent-opened rooms never assigned", where: "All markets", behind: "₦96M", behindTone: "amber", stuckFor: "4–41 days", stuckForTone: "amber", needs: "team leads, not you", needsYou: false },
];

export type SavedView = { slug: string; label: string; note: string; active?: boolean };

export const SAVED_VIEWS_TODAY: SavedView[] = [
  { slug: "before-standup", label: "Before standup", note: "under 2 min each", active: true },
  { slug: "above-25m", label: "Above ₦25M", note: "6 items" },
  { slug: "blocking-a-goal", label: "Blocking a goal", note: "5 items" },
  { slug: "overdue-anywhere", label: "Overdue anywhere", note: "3 items" },
  { slug: "unowned-in-my-stages", label: "Unowned in my stages", note: "2 items" },
];

export type QuickWinRow = { rank: number; title: string; atStake: string; atStakeTone?: Tone; effort: number; time: string; unblocks: string };

/** T12's "before standup · three items, six minutes total" filtered table. */
export const BEFORE_STANDUP: QuickWinRow[] = [
  { rank: 1, title: "Name an owner for the Ghana signup room", atStake: "₦31M", atStakeTone: "amber", effort: 1, time: "30 sec", unblocks: "Five breached thresholds start routing" },
  { rank: 2, title: "Re-date the renewal re-forecast you owe", atStake: "₦88M", atStakeTone: "rose", effort: 1, time: "30 sec", unblocks: "Finance stops forecasting on a wrong number" },
  { rank: 3, title: "Confirm the Accra room is a duplicate", atStake: "—", effort: 1, time: "3 min", unblocks: "Two teams stop working the same cohort" },
];

export const FILTER_URL_RULES: { label: string; note: string; tone?: Tone }[] = [
  { label: "This view", note: "/what-to-do-today?effort=1&owner=none · a link you can paste" },
  { label: "Saved views are personal", note: "unless you share one with your team" },
  { label: "Your lead can see your saved views", note: 'not to police them · to notice that you built "overdue anywhere"', tone: "amber" },
  { label: "Filters never hide the count", note: "the tab still says four · a filter shows a subset and says so" },
];

export type BlockedRow = {
  item: string;
  atStake: string;
  atStakeTone?: Tone;
  blockedOn: string;
  ownedByLabel: string;
  ownedByAgent?: AgentRef;
  requested: string;
  requestedTone?: Tone;
  badge: string;
  badgeTone: Tone;
};

/** T13's "what is blocked, and by exactly what" table. */
export const WAITING_ON_DATA_ROWS: BlockedRow[] = [
  { item: "Reprice the Ghana starter plan", atStake: "Unavailable", blockedOn: "Cost of goods per order", ownedByLabel: "Engineering", requested: "28 Jul", requestedTone: "rose", badge: "41 days overdue", badgeTone: "rose" },
  { item: "Evaluate the loyalty tier rename", atStake: "Unavailable", blockedOn: "loyalty.tier_shown event", ownedByLabel: "Engineering", requested: "2 Aug", requestedTone: "rose", badge: "34 days overdue", badgeTone: "rose" },
  { item: "Measure basket composition change", atStake: "Unavailable", blockedOn: "order_lines in the orders feed", ownedByLabel: "Engineering", requested: "28 Jul", requestedTone: "rose", badge: "41 days overdue", badgeTone: "rose" },
  { item: "Re-segment the dormant Kenya base", atStake: "₦12M", atStakeTone: "amber", blockedOn: "A second reading · needs 3 more weeks", ownedByLabel: "Repeat & Decay", ownedByAgent: { initials: "RD", name: "Repeat & Decay" }, requested: "—", badge: "time, not a source", badgeTone: "amber" },
  { item: "Measure Ghana silent failures", atStake: "₦18M", atStakeTone: "amber", blockedOn: "A delivery feed for Ghana", ownedByLabel: "Engineering", requested: "never asked", requestedTone: "amber", badge: "nobody requested it", badgeTone: "rose" },
  { item: "Value the Legacy Unlimited trade", atStake: "₦62M", atStakeTone: "amber", blockedOn: "Cost of goods · same as row one", ownedByLabel: "Engineering", requested: "28 Jul", requestedTone: "rose", badge: "same blocker", badgeTone: "rose" },
];

export type DoneRow = { action: string; at: string; took: string; value: string; valueTone?: Tone; whatNext: string; badge: string; badgeTone: Tone };

/** T14's "what you did, and what it set in motion" activity log. */
export const DONE_TODAY_ROWS: DoneRow[] = [
  { action: "Approved the reactivation sequence", at: "08:14", took: "4 min", value: "₦412M", valueTone: "rose", whatNext: "Wave one sends Friday 08:00 · 10% held back", badge: "running", badgeTone: "ultra" },
  { action: "Decided the growth vs finance conflict", at: "08:02", took: "11 min", value: "₦88M", valueTone: "rose", whatNext: "Tunde's dissent recorded · checked at close", badge: "decided", badgeTone: "teal" },
  { action: "Named Tunde owner of the Ghana room", at: "07:51", took: "1 min", value: "₦31M", valueTone: "amber", whatNext: "Five breached thresholds began routing to him", badge: "done", badgeTone: "teal" },
  { action: "Re-dated the renewal re-forecast", at: "07:48", took: "1 min", value: "₦88M", valueTone: "rose", whatNext: "Kunle re-committed to 20 Aug · Finance told", badge: "done", badgeTone: "teal" },
];

export const DONE_NOT_COUNTED: { label: string; note: string; tone?: Tone }[] = [
  { label: "Value moved, not value recovered", note: "₦531M entered rooms and plays · recovery is measured at close", tone: "amber" },
  { label: "Nothing is credited to you yet", note: "the value ledger records it against the room, at close, with a holdout" },
  { label: "Snoozed items are not done", note: "one is snoozed until the 18th and appears under Snoozed" },
  { label: "Your list being empty is normal", note: "about two days a week · it is not a scoreboard", tone: "teal" },
];

export type SnoozedRow = {
  item: string;
  because: string;
  snoozedAgo: string;
  returns: string;
  returnsTone?: Tone;
  cost: string;
  costTone?: Tone;
  times: number;
  timesTone?: Tone;
};

/** T09's "snoozed by you" table. */
export const SNOOZED_ROWS: SnoozedRow[] = [
  { item: "Decide the growth vs finance conflict", because: '"Ravi is on leave until the 18th"', snoozedAgo: "today", returns: "Mon 18 Aug", returnsTone: "amber", cost: "₦0/day · held", times: 1 },
  { item: "Retry cards at payday +1", because: '"Waiting for the payday calendar"', snoozedAgo: "4 hrs ago", returns: "Tomorrow 09:00", returnsTone: "amber", cost: "₦2.1M/day", costTone: "amber", times: 1 },
  { item: "Name an owner for the Ghana room", because: '"Tunde is on leave until the 18th"', snoozedAgo: "2 days ago", returns: "Mon 18 Aug", returnsTone: "rose", cost: "₦31M held", costTone: "rose", times: 2, timesTone: "rose" },
  { item: "Reclassify support contact drivers", because: '"Not this quarter"', snoozedAgo: "11 days ago", returns: "1 Oct", cost: "—", times: 1 },
  { item: "Weekend push frequency review", because: '"Superseded by the fatigue room"', snoozedAgo: "3 wks ago", returns: "never · dismissed", cost: "—", times: 1 },
];

export const SNOOZE_RULES: { label: string; note: string; tone?: Tone }[] = [
  { label: "A snooze always has a reason", note: "typed, not selected from a list" },
  { label: "A snooze always has a return date", note: '"indefinitely" is not offered' },
  { label: "Snoozing twice is shown as snoozing twice", note: "the original date is kept and the count is visible", tone: "amber" },
  { label: "Anything above ₦25M cannot be snoozed past 7 days", note: "it returns and says why", tone: "amber" },
  { label: "Everyone waiting on it is told", note: "who snoozed it, until when, and the reason" },
  { label: "Dismissal is a snooze with no return date", note: "still logged, still here, still visible to your lead" },
];

export type SettingsRule = {
  when: string;
  threshold: string;
  editableThreshold?: boolean;
  currently: string;
  currentlyTone?: Tone;
  canChange: string;
  canChangeTone: Tone;
  state: string;
  stateTone: Tone;
};

/** T15's "appears on your list when" rules table. */
export const TODAY_APPEARANCE_RULES: SettingsRule[] = [
  { when: "A play in a room you own needs approval", threshold: "always", currently: "1 item", currentlyTone: "amber", canChange: "no", canChangeTone: "rose", state: "on", stateTone: "teal" },
  { when: "An agent raises a conflict you own", threshold: "always", currently: "1 item", currentlyTone: "amber", canChange: "no", canChangeTone: "rose", state: "on", stateTone: "teal" },
  { when: "An obligation you owe goes overdue", threshold: "always · pinned", currently: "1 item", currentlyTone: "rose", canChange: "no", canChangeTone: "rose", state: "on", stateTone: "teal" },
  { when: "A room in your stage has no owner", threshold: "always", currently: "1 item", currentlyTone: "amber", canChange: "no", canChangeTone: "rose", state: "on", stateTone: "teal" },
  { when: "An open item is worth more than", threshold: "₦5,000,000", editableThreshold: true, currently: "4 items", canChange: "yes", canChangeTone: "teal", state: "on", stateTone: "teal" },
  { when: "You were @-mentioned", threshold: "always", currently: "0", canChange: "yes", canChangeTone: "teal", state: "off", stateTone: "neutral" },
  { when: "An agent finishes a run", threshold: "never", currently: "—", canChange: "no", canChangeTone: "rose", state: "off by design", stateTone: "neutral" },
  { when: "A campaign sends on schedule", threshold: "never", currently: "—", canChange: "no", canChangeTone: "rose", state: "off by design", stateTone: "neutral" },
];

export const ORDERING_RULES: { label: string; note: string; tone?: Tone }[] = [
  { label: "Ranked by", note: "revenue at stake × confidence ÷ effort · goal-blocking doubled" },
  { label: "Effort estimates", note: "yours to correct · the agent's guess is the default", tone: "teal" },
  { label: "Age", note: "shown, never scored", tone: "amber" },
  { label: "Overdue", note: "pinned into the list, ranked normally inside it", tone: "amber" },
  { label: "Default scope", note: "Mine · you can change it to your team" },
  { label: "Where it is delivered", note: "here, and the top of your 06:00 digest" },
];

/** T07's candidate list for the Ghana signup room (id "ghana-signup-room"). */
export type OwnerCandidate = { person: PersonRef; reason: string; roomCount: number; recommended?: boolean };

export const GHANA_ROOM_OWNER_CANDIDATES: OwnerCandidate[] = [
  { person: { initials: "TB", name: "Tunde Bakare", department: "Marketing" }, reason: "Owns Acquire · ran the Accra campaign", roomCount: 11, recommended: true },
  { person: { initials: "ZY", name: "Zainab Yusuf", department: "Product" }, reason: "Owns Activate · the signup flow is hers", roomCount: 8 },
  { person: { initials: "KO", name: "Kunle Ade", department: "Customer Success" }, reason: "Owns the region · Ghana reports to him", roomCount: 6 },
];
