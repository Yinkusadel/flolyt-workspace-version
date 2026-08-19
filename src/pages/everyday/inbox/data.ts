import {
  ACQUISITION_QUALITY,
  ADA,
  AMARA,
  INVOLUNTARY_CHURN,
  RAVI,
  REPEAT_DECAY,
  SAM,
  SUPPORT_SIGNAL,
  TUNDE,
  ZAINAB,
} from "@/pages/everyday/rooms/data";
import type {
  AuthorityStat,
  BulkActionRow,
  Customer,
  DecisionCard,
  DelegationCard,
  DelegationRow,
  FallbackOption,
  GroupSummaryCard,
  GroupedRow,
  InboxItemDetail,
  KvRow,
  MentionRow,
  ReplyDetail,
  ReplyReasonCard,
  ReplyRow,
  RoutingRuleRow,
  RoutingStat,
  SettingsRuleRow,
  SnoozedRow,
  StandingActivityRow,
  StandingGrantRow,
  SystemsInfoCard,
  SystemsRow,
  ThresholdRow,
  UnroutableRow,
  WorkingAgentRow,
} from "@/pages/everyday/inbox/types";

export { ADA, RAVI, TUNDE, AMARA, ZAINAB, SAM };

/**
 * Mock content for /inbox, sourced from
 * flolyt-figma-designs/Everyday Screens/flolyt-inbox/ (I00-I16). See
 * docs/build-tracker.md for the per-screen route map.
 */

/** I01/I02/I03 — whether the inbox has anything pending. Wired but unreachable
 * with the default below false, same "reachable via a mock flag" pattern as
 * every prior rebuild's empty/first-run state. */
export const INBOX_EMPTY = false;

/** I01 — "working right now, and not bothering you" table. */
export const WORKING_AGENTS: WorkingAgentRow[] = [
  {
    agent: REPEAT_DECAY,
    room: "Second order never happened",
    doing: "Measuring wave two against the holdout",
    since: "06:12",
    willReach: "only if a play needs approval",
  },
  {
    agent: INVOLUNTARY_CHURN,
    room: "Cards failing on renewal night",
    doing: "Watching the 09:00 retry window",
    since: "00:00",
    willReach: "only if a play needs approval",
  },
  {
    agent: SUPPORT_SIGNAL,
    room: "Lagos delivery failures",
    doing: "Reclassifying contact drivers",
    since: "Yesterday",
    willReach: "no · log only",
  },
  {
    agent: ACQUISITION_QUALITY,
    room: "Ghana signups convert at 4%",
    doing: "Comparing Accra against four markets",
    since: "03:40",
    willReach: "no · the room has no owner",
    willReachTone: "amber",
  },
];

/** I02 — "needs a decision from you" cards. */
export const DECISION_CARDS: DecisionCard[] = [
  {
    agent: REPEAT_DECAY,
    waitingLabel: "Waiting 19 hours",
    title: "Reactivate 100,000 in three waves",
    body: "Second order never happened · proposed 07:41. Nothing sends until you approve, and about 4,100 customers age out of the window each day.",
    footnote: "₦412M · review in the room",
    footnoteTone: "amber",
    roomId: "second-order-never-happened",
    itemId: "i-8f2c",
  },
  {
    agent: INVOLUNTARY_CHURN,
    waitingLabel: "Waiting 4 hours",
    title: "Retry cards at payday +1",
    body: "Cards failing on renewal night · proposed 04:12. Ravi is the named owner; this is in your inbox because he named you as cover while he is away.",
    footnote: "₦88M · review in the room",
    footnoteTone: "amber",
    roomId: "cards-failing-on-renewal-night",
    itemId: "i-9d41",
  },
];

/** I02 — "someone mentioned you" table. */
export const MENTIONS: MentionRow[] = [
  {
    person: AMARA,
    quote: "“@Ifeoma can we hold wave one until the fee fix ships Thursday?”",
    room: "Second order never happened",
    when: "07:31",
  },
  {
    person: RAVI,
    quote: "“@Ifeoma real exposure is closer to ₦386M once we net off refunds.”",
    room: "Second order never happened",
    when: "07:47",
  },
];

export const SYSTEMS_CALLOUT = {
  title: "Delivery mesh — APNs certificate expired",
  body: "612 push messages are queued and none were dropped. They send when the certificate is replaced. Nothing else is affected: email and Slack are unchanged, and no campaign has been paused. Owned by Sam Iyer since 11 August.",
};

export const NEVER_APPEAR_CALLOUT = {
  title: "What will never appear here",
  body: "An agent narrating its own tool calls is not a notification. 412 runs finished cleanly overnight and none of them reached this screen. Only outcomes and asks arrive — which is the only reason the amber badge still means something.",
};

/** Sidebar badge — pending count, amber only where a person must act. */
export const INBOX_PENDING_COUNT = DECISION_CARDS.length;

/** I03 — grouped triage table, /inbox?group=cost. */
export const GROUPED_ROWS: GroupedRow[] = [
  {
    decision: "Reactivate 100,000 in three waves",
    room: "Second order never happened",
    costPerDay: "₦2.1M",
    costPerDayTone: "rose",
    waiting: "19 hrs",
    waitingTone: "rose",
    effort: "read the evidence · 4 min",
    group: "decide-today",
    groupLabel: "decide today",
    groupTone: "rose",
  },
  {
    decision: "Retry cards at payday +1",
    room: "Cards failing on renewal night",
    costPerDay: "₦880k",
    costPerDayTone: "rose",
    waiting: "4 hrs",
    waitingTone: "amber",
    effort: "one number to check · 1 min",
    group: "decide-today",
    groupLabel: "decide today",
    groupTone: "rose",
  },
  {
    decision: "Stop the 20% code",
    room: "Discount-only buyers",
    costPerDay: "₦460k",
    costPerDayTone: "amber",
    waiting: "2 days",
    waitingTone: "rose",
    effort: "Tunde disagrees · 10 min",
    group: "decide-today",
    groupLabel: "decide today",
    groupTone: "rose",
  },
  {
    decision: "Name an owner for Mombasa",
    room: "Mombasa delivery windows",
    costPerDay: "₦190k",
    costPerDayTone: "amber",
    waiting: "4 days",
    waitingTone: "rose",
    effort: "pick a person · 30 sec",
    group: "clear-in-a-minute",
    groupLabel: "clear in a minute",
    groupTone: "teal",
  },
  {
    decision: "Approve the Kenya holdout size",
    room: "Kenya fee rollback",
    costPerDay: "₦0",
    waiting: "1 day",
    effort: "statistical · 2 min",
    group: "clear-in-a-minute",
    groupLabel: "clear in a minute",
    groupTone: "teal",
  },
  {
    decision: "Confirm the Accra room is a duplicate",
    room: "Accra delivery windows",
    costPerDay: "₦0",
    waiting: "6 days",
    waitingTone: "amber",
    effort: "compare two rooms · 3 min",
    group: "clear-in-a-minute",
    groupLabel: "clear in a minute",
    groupTone: "teal",
  },
  {
    decision: "Re-date the renewal re-forecast",
    room: "The delivery-fee chain",
    costPerDay: "—",
    waiting: "4 days overdue",
    waitingTone: "rose",
    effort: "pick a date · 30 sec",
    group: "overdue",
    groupLabel: "overdue · pinned",
    groupTone: "rose",
  },
];

export const GROUP_CARDS: GroupSummaryCard[] = [
  {
    key: "decide-today",
    label: "DECIDE TODAY · 3",
    title: "₦3.4M a day between them",
    body: "Each needs real thought and each is expensive to defer. These are the only items that should survive a bad morning.",
    footnote: "≈15 minutes total",
    tone: "rose",
  },
  {
    key: "clear-in-a-minute",
    label: "CLEAR IN A MINUTE · 3",
    title: "Costing almost nothing, blocking real work",
    body: "Picking a person, confirming a number, marking a duplicate. Not bulk approval — three separate decisions that each happen to be trivial.",
    footnote: "≈6 minutes total",
    tone: "teal",
  },
  {
    key: "overdue",
    label: "OVERDUE · 1",
    title: "Pinned, regardless of value",
    body: "Worth ₦0 a day and sitting above items worth ₦2.1M, because a broken commitment is a different kind of thing from an open opportunity.",
    footnote: "the escalation rule",
    tone: "amber",
  },
];

export const GROUPED_CLOSING_CALLOUT = {
  title: "Grouping is not bulk approval, and the difference is the whole point",
  body: "Eleven cards in arrival order is four screens of scrolling and no sense of what can be cleared before standup. Eleven grouped by cost-of-waiting is a twenty-minute morning. Every decision is still made individually, under your identity, in the room where the evidence is.",
};

export const GROUP_FILTER_TABS = [
  { key: "urgency", label: "By urgency" },
  { key: "room", label: "By room" },
  { key: "cost", label: "By what it costs to wait" },
  { key: "who", label: "By who asked" },
] as const;

/** I04 — one inbox item detail, /inbox/:id. Only "i-8f2c" is built, same
 * "one reference row" pattern as every prior rebuild's :id drilldowns. */
export const INBOX_ITEM_DETAILS: Record<string, InboxItemDetail> = {
  "i-8f2c": {
    id: "i-8f2c",
    title: "Reactivate 100,000 in three waves",
    subtitle: "Waiting 19 hours · ₦412M · the decision is made in the room",
    roomId: "second-order-never-happened",
    facts: [
      { label: "Proposed by", value: "Repeat & Decay · 07:41 · run 8f2c-11", tone: "ultra" },
      { label: "Audience", value: "100,000 reachable · 48,000 excluded and listed" },
      { label: "Offer", value: "none in wave one · decided by you at 08:02" },
      { label: "Cost of waiting", value: "₦2.1M a day · about 4,100 customers age out", tone: "rose" },
      { label: "Guardrails applied", value: "frequency cap, quiet hours, opt-out · four things already stopped", tone: "teal" },
      { label: "Recorded dissent", value: "Tunde Bakare · “we are leaving volume on the table”", tone: "amber" },
      { label: "What would say it failed", value: "wave one below 12% · written on day one" },
    ],
    actionCards: [
      {
        label: "THE PRIMARY ACTION",
        title: "Review in the room",
        body: "Takes you to the plays board with the evidence tab open. Approval, re-auth and everything else happens there, next to the thing you are approving.",
        footnote: "always the default",
        tone: "teal",
      },
      {
        label: "AVAILABLE HERE",
        title: "Snooze, or ask a question",
        body: "You can hold it with a typed reason and a return date, or post a question into the room thread without leaving this screen.",
        footnote: "both are logged",
        tone: "neutral",
      },
      {
        label: "NOT AVAILABLE HERE",
        title: "Approve",
        body: "There is no approve button in the inbox. Approving next to a summary rather than next to the evidence is how a queue becomes a habit, and habits are what re-auth exists to interrupt.",
        footnote: "deliberately absent",
        tone: "rose",
      },
    ],
  },
};

export const INBOX_ITEM_BANNER = {
  title: "This is a summary. The decision is made in the room.",
  body: "Everything below is enough to know whether it needs your attention now. It is not enough to approve on, and Flolyt will not let you.",
};

/** I05 — replies table, /inbox/replies. */
export const REPLY_ROWS: ReplyRow[] = [
  {
    id: "r-7a02",
    customer: { name: "Chidi O.", location: "Lagos" },
    repliedTo: "Reactivation wave one",
    quote: "“I stopped because delivery got expensive, not the food”",
    reason: "Confirms the cause",
    reasonTone: "ultra",
    waiting: "11 min",
    sla: "—",
  },
  {
    id: "r-4b19",
    customer: { name: "Amina B.", location: "Kano" },
    repliedTo: "Reactivation wave one",
    quote: "“Cancel everything and delete my data”",
    reason: "Erasure request",
    reasonTone: "rose",
    waiting: "31 min",
    waitingTone: "amber",
    sla: "30 days",
    slaTone: "rose",
  },
  {
    id: "r-c930",
    customer: { name: "Kwame A.", location: "Accra" },
    repliedTo: "Ghana signup nudge",
    quote: "“The app never sent my code”",
    reason: "Possible defect",
    reasonTone: "amber",
    waiting: "1 hr",
    sla: "—",
  },
  {
    id: "r-e214",
    customer: { name: "Grace M.", location: "Nairobi" },
    repliedTo: "Card retry notice",
    quote: "“Card works fine, you charged at midnight”",
    reason: "Confirms the cause",
    reasonTone: "ultra",
    waiting: "2 hrs",
    sla: "—",
  },
  {
    id: "r-f188",
    customer: { name: "Tobi A.", location: "Ibadan" },
    repliedTo: "Reactivation wave one",
    quote: "“Who gave you my number”",
    reason: "Consent question",
    reasonTone: "rose",
    waiting: "3 hrs",
    waitingTone: "amber",
    sla: "72 hrs",
    slaTone: "rose",
  },
];

export const REPLY_REASON_CARDS: ReplyReasonCard[] = [
  {
    label: "AUTO-ANSWERED",
    title: "1,904 replies, none of them routed",
    body: "Delivery times, order status, password resets. Answered from the same data the room reads, and written to the log rather than notified.",
    footnote: "97% of all replies",
    tone: "neutral",
  },
  {
    label: "ROUTED TO A HUMAN",
    title: "Five, for three different reasons",
    body: "Two are legal — an erasure request and a consent question, both with a clock. Two confirm a causal finding in an open room. One may be a defect nobody has filed.",
    footnote: "each one names its reason",
    tone: "amber",
  },
  {
    label: "Fed back into a room",
    agent: REPEAT_DECAY,
    title: "Two replies changed a decision doc",
    body: "Chidi and Grace both described in words the mechanism the agents inferred from order data. Their sentences are cited in the evidence tab, attributed and dated.",
    footnote: "customer voice as evidence",
    tone: "ultra",
  },
];

export const REPLIES_TABS = [
  { key: "needs-human", label: "Needs a human", count: 5 },
  { key: "handled", label: "Handled", count: 128 },
  { key: "auto-answered", label: "Auto-answered", count: 1904 },
] as const;

export const REPLIES_CLOSING_CALLOUT = {
  title: "A reply is not a ticket",
  body: "Nothing here becomes a support queue. Each reply either answers itself, changes something in a room, or raises an obligation with a name and a clock on it — and the two with legal clocks are marked before anybody reads them.",
};

/** I06 — one reply detail, /inbox/replies/:id. Only "r-4b19" is built. */
export const REPLY_DETAILS: Record<string, ReplyDetail> = {
  "r-4b19": {
    id: "r-4b19",
    customer: { name: "Amina B.", location: "Kano" },
    subtitle: "Erasure request · classified in one second · 30-day clock started 09:14",
    timeline: [
      {
        when: "09:14",
        what: "Amina replied: “Cancel everything and delete my data”",
        byLabel: "customer",
        state: "received",
        stateTone: "teal",
      },
      {
        when: "09:14",
        what: "Classified as an erasure request",
        byAgent: SUPPORT_SIGNAL,
        state: "automatic",
        stateTone: "ultra",
      },
      {
        when: "09:14",
        what: "Excluded from every audience, every room, permanently",
        byLabel: "system",
        state: "automatic · irreversible",
        stateTone: "rose",
      },
      {
        when: "09:14",
        what: "Routed to Support with a 30-day legal clock",
        byLabel: "routing rule",
        state: "automatic",
        stateTone: "ultra",
      },
      {
        when: "09:15",
        what: "Removed from wave two of the reactivation",
        byLabel: "system",
        state: "automatic",
        stateTone: "teal",
      },
      {
        when: "—",
        what: "Erasure executed",
        byPerson: AMARA,
        state: "needs a person",
        stateTone: "amber",
      },
    ],
    willNotRows: [
      { label: "Reply to it automatically", caveat: "an erasure request is not an FAQ", tone: "rose" },
      { label: "Count it as churn", caveat: "she is excluded from the base, not moved to Churn" },
      { label: "Use her words as evidence", caveat: "an erasure request is not consent to be quoted", tone: "rose" },
      { label: "Let the clock run silently", caveat: "day 25 escalates to Ada, day 28 pages", tone: "amber" },
    ],
  },
};

export const REPLY_DETAIL_BANNER = {
  title: "This is an erasure request and a 30-day clock started at 09:14",
  body: "It was classified before anyone read it. Amina has already been excluded from every audience in every room, permanently, and that happened automatically.",
};

export const REPLY_DETAIL_CALLOUT = {
  title: "Everything protective happened in one second. The thing that requires judgement did not.",
  body: "Exclusion is automatic and irreversible because getting it wrong means messaging someone who asked you to stop. Executing an erasure is a person's job because it is irreversible in the other direction — and Flolyt will not do irreversible things to a customer's record on its own.",
};

/** I07 — routing rules, /inbox/routing. */
export const ROUTING_RULES: RoutingRuleRow[] = [
  { when: "A room opens in Retain", goesTo: "Marketing", goesToTeam: "Marketing", because: "stage owner", fallback: "Ada", firedThisWeek: 6, state: "on", stateTone: "teal" },
  { when: "A reply mentions consent or erasure", goesTo: "Support", goesToTeam: "Support", because: "legal obligation", becauseTone: "rose", fallback: "Ada", firedThisWeek: 2, state: "on", stateTone: "teal" },
  { when: "A payment retry fails twice", goesTo: "Finance", goesToTeam: "Finance", because: "stage owner", fallback: "Ravi", firedThisWeek: 11, state: "on", stateTone: "teal" },
  { when: "A release moves a stage metric", goesTo: "Engineering", goesToTeam: "Engineering", because: "release owner", fallback: "Zainab", firedThisWeek: 2, state: "on", stateTone: "teal" },
  { when: "An obligation passes its date", goesTo: "owner, then chain owner", because: "added 2 Aug", becauseTone: "ultra", fallback: "Ada", firedThisWeek: 3, firedTone: "amber", state: "on", stateTone: "teal" },
  { when: "A room opens in Advocate", goesTo: "Unroutable", goesToTone: "amber", because: "no stage owner", becauseTone: "amber", fallback: "Ada", fallbackTone: "amber", firedThisWeek: 2, firedTone: "amber", state: "falling back", stateTone: "amber" },
  { when: "A condition spans two stages", goesTo: "Unroutable", goesToTone: "rose", because: "neither owner claims it", becauseTone: "rose", fallback: "nobody", fallbackTone: "rose", firedThisWeek: 12, firedTone: "rose", state: "no destination", stateTone: "rose" },
];

export const ROUTING_STATS: RoutingStat[] = [
  { eyebrow: "ROUTED AUTOMATICALLY", value: "38 of 41", note: "no human touched them" },
  { eyebrow: "FELL BACK TO ADA", value: "3", tone: "amber", note: "two stages have no owner" },
  { eyebrow: "REROUTED BY A PERSON", value: "2", note: "both Support → Product" },
  { eyebrow: "NEVER ROUTED AT ALL", value: "12", tone: "rose", note: "cross-stage conditions" },
];

export const ROUTING_CLOSING_CALLOUT = {
  title: "The last rule is the one that has fired twelve times and reached nobody",
  body: "A condition whose cause is in one stage and whose symptom is in another has no natural destination — the guest-share problem sits between Acquire and Activate, the FX drift between Price and every market. Twelve breaches across eight stages, all with the same shape. This needs a fallback rule, not better routing.",
};

/** I08 — unroutable conditions, /inbox/routing/unroutable. */
export const UNROUTABLE_ROWS: UnroutableRow[] = [
  { condition: "Guest share rises", causeTeam: "Sales", symptomTeam: "Product", fired: "4", since: "Mar", atStake: "₦74M", atStakeTone: "rose", why: "neither owner claims it" },
  { condition: "A release ships where this failed before", causeTeam: "Engineering", symptomLabel: "a market", symptomTone: "amber", fired: "2", since: "Jun", atStake: "GHS 2.4M", atStakeTone: "rose", why: "markets have no owner" },
  { condition: "A shipped feature emits no events", causeTeam: "Product", symptomTeam: "Engineering", fired: "1", since: "Apr", atStake: "Unavailable", why: "instrumentation sits between them" },
  { condition: "A fix is not rolled out to every market", causeTeam: "Finance", symptomLabel: "a market", symptomTone: "amber", fired: "1", since: "Apr", atStake: "GHS 890k", atStakeTone: "rose", why: "markets have no owner" },
  { condition: "An account renews unowned", causeLabel: "nobody", symptomTeam: "Sales", fired: "119", since: "ongoing", atStake: "₦18M", atStakeTone: "rose", why: "circular · needs an owner to route" },
];

export const UNROUTABLE_LAST_ROW_CALLOUT = {
  title: "The last row cannot be fixed by routing it better",
  body: "An account renewing unowned cannot open a room, because a room needs an owner and the reason the condition fired is that there is no owner. Every other row on this table needs a destination. This one needs a fallback — and until there is one, 119 accounts worth ₦18M renew with nobody looking.",
};

export const FALLBACK_OPTIONS: FallbackOption[] = [
  {
    label: "OPTION ONE",
    title: "Route up, not sideways",
    body: "A condition spanning two stages goes to whoever owns both — usually a market lead or Ada. It creates load on one person and it beats twelve silent breaches.",
    footnote: "recommended",
    tone: "teal",
  },
  {
    label: "OPTION TWO",
    title: "Open the room unowned, loudly",
    body: "Create the room with no owner and pin it to the daily list of both stage owners until one accepts. Solves the circular case and risks a game of chicken.",
    footnote: "solves the account case",
    tone: "amber",
  },
  {
    label: "NOT AN OPTION",
    title: "Pick an owner automatically",
    body: "Assigning a ₦74M problem to somebody who did not agree to it produces a name in a field and no accountability. It would clear this table and change nothing.",
    footnote: "explicitly rejected",
    tone: "rose",
  },
];

/** I09 — snoozed, /inbox/snoozed. */
export const SNOOZED_ROWS: SnoozedRow[] = [
  { item: "Decide growth vs finance", because: "“Ravi is on leave until the 18th”", snoozedWhen: "today", returns: "Mon 18 Aug", returnsTone: "amber", costOfWaiting: "₦0/day · held", times: 1, whoKnows: "Tunde, Ravi" },
  { item: "Retry cards at payday +1", because: "“Waiting for the payday calendar”", snoozedWhen: "4 hrs ago", returns: "Tomorrow 09:00", returnsTone: "amber", costOfWaiting: "₦880k/day", costOfWaitingTone: "amber", times: 1, whoKnows: "Ravi" },
  { item: "Name an owner for the Ghana room", because: "“Tunde is on leave until the 18th”", snoozedWhen: "2 days ago", returns: "Mon 18 Aug", returnsTone: "rose", costOfWaiting: "₦31M held", costOfWaitingTone: "rose", times: 2, timesTone: "rose", whoKnows: "Ada", whoKnowsTone: "amber" },
  { item: "Reclassify support drivers", because: "“Not this quarter”", snoozedWhen: "11 days ago", returns: "1 Oct", costOfWaiting: "—", times: 1, whoKnows: "Amara" },
  { item: "Weekend push review", because: "“Superseded by the fatigue room”", snoozedWhen: "3 wks ago", returns: "never · dismissed", costOfWaiting: "—", times: 1, whoKnows: "nobody" },
];

export const SNOOZE_RULES: KvRow[] = [
  { label: "A snooze always has a typed reason", value: "not selected from a list" },
  { label: "A snooze always has a return date", value: "“indefinitely” is not offered" },
  { label: "Everyone waiting on it is told", value: "who snoozed it, until when, and why" },
  { label: "Snoozing twice escalates", value: "to the next person up, automatically", tone: "amber" },
  { label: "Above ₦25M cannot be snoozed past 7 days", value: "it returns and says why", tone: "amber" },
  { label: "Dismissal is a snooze with no return date", value: "still logged, still visible to your lead" },
];

export const SNOOZED_CALLOUT = {
  title: "One has been snoozed twice and Ada was told the second time",
  body: "Snoozing the same ₦31M item twice escalates automatically. Both individual snoozes were reasonable — Tunde really was away. The pattern is not, and the only way it becomes visible is if somebody outside the loop is told on the second one.",
};

/** I10 — delegate while away, /inbox/delegation. */
export const DELEGATION_ROWS: DelegationRow[] = [
  { what: "Approvals in your 14 rooms", from: "Agents", atRisk: "₦142M", atRiskTone: "rose", wouldWait: "up to 7 days", wouldWaitTone: "rose", cover: TUNDE, why: "your team, knows the cohorts" },
  { what: "Mentions naming you", from: "People", atRisk: "—", wouldWait: "up to 7 days", wouldWaitTone: "amber", cover: TUNDE, why: "same" },
  { what: "Handoffs you owe", from: "Three chains", atRisk: "₦31M", atRiskTone: "amber", wouldWait: "2 go overdue", wouldWaitTone: "rose", cover: AMARA, why: "already on both chains" },
  { what: "Plays over 100,000 recipients", from: "Agents", atRisk: "₦412M", atRiskTone: "rose", wouldWait: "blocked", wouldWaitTone: "rose", coverLabel: "Ada only", coverTone: "amber", why: "above your authority anyway" },
  { what: "Your goal reviews", from: "Weekly", atRisk: "—", wouldWait: "skipped", coverLabel: "Nobody", coverTone: "neutral", why: "nothing breaks if these slip" },
];

export const DELEGATION_CARDS: DelegationCard[] = [
  {
    label: "CAN",
    title: "Decide, in your name",
    body: "Approve, reject, edit and comment in your fourteen rooms. Every action is logged as “Tunde, covering for Ifeoma” — never as you, and never as the system.",
    footnote: "full decision rights",
    tone: "teal",
  },
  {
    label: "CANNOT",
    title: "Exceed your own authority",
    body: "A cover inherits your permissions exactly. Plays over 100,000 still route to Ada, because they would have routed to Ada anyway.",
    footnote: "no privilege escalation",
    tone: "amber",
  },
  {
    label: "YOU STILL SEE IT",
    title: "One digest on return",
    body: "Every decision Tunde made in your name, why, and what changed while you were out. It is the first thing in your inbox on the 22nd.",
    footnote: "nothing decided invisibly",
    tone: "ultra",
  },
];

export const DELEGATION_BANNER = {
  title: "You are away from 15 to 22 August. Nine things would wait for you.",
  body: "₦186M sits behind them. Name a cover and they route there instead — with your name still on the record.",
};

export const DELEGATION_CLOSING_CALLOUT = {
  title: "Cover is the difference between a leave calendar and ₦31M sitting for two weeks",
  body: "The Ghana room was snoozed twice because its owner was away and nobody could act for him. Nothing in the product was broken — there was simply no way to say who acts instead. That is the entire gap this screen closes.",
};

/** I11 — approval authority thresholds, /settings/authority. */
export const THRESHOLD_ROWS: ThresholdRow[] = [
  { play: "Message customers", reach: "under 5,000", approvedBy: "Room owner", ifAway: "their cover", medianWait: "11 min", medianWaitTone: "teal" },
  { play: "Message customers", reach: "5,000 – 100,000", approvedBy: "Team lead", ifAway: "their cover", medianWait: "3.1 hrs", medianWaitTone: "teal" },
  { play: "Message customers", reach: "over 100,000", approvedBy: "Ada Obi", ifAway: "Ravi Mehta", medianWait: "19 hrs", medianWaitTone: "rose" },
  { play: "Offer a discount", reach: "any", cost: "any margin", costTone: "amber", approvedBy: "Ravi Mehta", ifAway: "Ada Obi", medianWait: "4 hrs", medianWaitTone: "amber" },
  { play: "Change a price", reach: "any", cost: "any", costTone: "amber", approvedBy: "Ravi + Ada", approvedByTone: "amber", ifAway: "nobody · it waits", ifAwayTone: "rose", medianWait: "2 days", medianWaitTone: "rose" },
  { play: "Contact a customer who opted out", reach: "any", cost: "legal", costTone: "rose", approvedBy: "Never · blocked", approvedByTone: "rose", ifAway: "—", medianWait: "—" },
  { play: "Export customer data", reach: "any", cost: "legal", costTone: "rose", approvedBy: "Ada + an admin", approvedByTone: "amber", ifAway: "nobody · it waits", ifAwayTone: "rose", medianWait: "6 hrs", medianWaitTone: "amber" },
];

export const AUTHORITY_STATS: AuthorityStat[] = [
  { eyebrow: "WAITING ON ADA", value: "14 plays", tone: "rose", note: "₦1.4B behind them" },
  { eyebrow: "WAITING ON RAVI", value: "9 plays", tone: "amber", note: "median 4 hrs" },
  { eyebrow: "WAITING ON A TEAM LEAD", value: "31 plays", note: "median 3.1 hrs" },
  { eyebrow: "CLEARED WITHOUT ESCALATION", value: "78%", tone: "teal", note: "of 312 this quarter" },
];

export const AUTHORITY_CLOSING_CALLOUT = {
  title: "Two people are the bottleneck for 23 plays and ₦1.4B",
  body: "That is not a discipline problem. Every play over 100,000 recipients routes to one person in a workspace that serves 4.2M customers, so the threshold is doing exactly what it was set to do. The answer is a different mechanism, not faster approving.",
};

/** I12 — standing authority, /settings/authority/standing. */
export const STANDING_GRANTS: StandingGrantRow[] = [
  { classOfPlay: "Reactivation, no offer", limits: "under 50,000 per wave", market: "NG only", expires: "31 Aug", expiresTone: "amber", used: "11 of 20", state: "active", stateTone: "teal" },
  { classOfPlay: "Card retry window change", limits: "no customer contact", market: "all", expires: "31 Aug", expiresTone: "amber", used: "4 of 10", state: "active", stateTone: "teal" },
  { classOfPlay: "Support outreach after failed delivery", limits: "under 5,000", market: "all", expires: "30 Sep", used: "2 of 20", state: "active", stateTone: "teal" },
  { classOfPlay: "Discount under 10%", limits: "—", market: "—", expires: "—", used: "—", state: "declined by Ravi", stateTone: "rose" },
  { classOfPlay: "Anything touching opted-out customers", limits: "—", market: "—", expires: "—", used: "—", state: "cannot be granted", stateTone: "rose" },
];

export const STANDING_ACTIVITY: StandingActivityRow[] = [
  { play: "Reactivation wave two", room: "Second order never happened", reach: "48,000", ranAt: "Mon 08:00", under: ADA, reviewed: "ok", reviewedTone: "teal" },
  { play: "Retry window · Kenya", room: "Cards failing on renewal night", reach: "12,400", ranAt: "Tue 09:00", under: ADA, reviewed: "ok", reviewedTone: "teal" },
  { play: "Failed-delivery outreach", room: "Lagos delivery failures", reach: "1,200", ranAt: "Wed 10:00", under: ADA, reviewed: "ok", reviewedTone: "teal" },
  { play: "Reactivation wave three", room: "Second order never happened", reach: "52,000", reachTone: "rose", ranAt: "held", ranAtTone: "amber", underLabel: "—", reviewed: "over the limit · sent to Ada", reviewedTone: "amber" },
];

export const STANDING_INTRO_CALLOUT = {
  title: "A standing authority is a person, not a setting",
  body: "Ada is not turning approval off. She is saying in advance which class of play she would approve, under what limits, until when — and every execution runs under her name, appears in her log, and can be revoked by her in one click. The identity behind the action never becomes the system's.",
};

export const STANDING_CLOSING_CALLOUT = {
  title: "The fourth row is the whole design",
  body: "Wave three was 52,000 against a 50,000 limit, so it did not run — it went to Ada as a normal approval with the limit quoted. Every boundary is checked at execution, not at grant. A standing authority that silently stretches to fit is an abdication.",
};

export const STANDING_RULES: KvRow[] = [
  { label: "Always time-boxed and budgeted", value: "90 days maximum, 20 executions · no “until revoked”", tone: "amber" },
  { label: "Always one named grantor", value: "never a role, never a team, never the workspace", tone: "amber" },
  { label: "Revocable in one click", value: "in force immediately · anything in flight is held, not cancelled", tone: "teal" },
  { label: "Never grantable", value: "opt-out contact, price changes, data export, anything legal", tone: "rose" },
];

/** I13 — systems, /inbox/systems. */
export const SYSTEMS_ROWS: SystemsRow[] = [
  { what: "APNs certificate expired", since: "11 Aug", sinceTone: "rose", effect: "no push delivered", effectTone: "rose", queued: "612 messages", owner: SAM, state: "open · 4 days", stateTone: "rose", blocks: "no", blocksTone: "teal" },
  { what: "Orders feed slow", since: "today 04:12", sinceTone: "amber", effect: "figures 4 hrs stale", effectTone: "amber", owner: SAM, state: "open · 5 hrs", stateTone: "amber", blocks: "3 agents", blocksTone: "rose" },
  { what: "COGS source not connected", since: "12 Jan", sinceTone: "rose", effect: "margin unavailable", effectTone: "amber", owner: RAVI, state: "open · 214 days", stateTone: "rose", blocks: "6 figures", blocksTone: "rose" },
  { what: "Ghana delivery feed missing", since: "never", sinceTone: "rose", effect: "silent failures uncountable", effectTone: "amber", ownerLabel: "No owner", ownerTone: "amber", state: "never requested", stateTone: "rose", blocks: "1 market", blocksTone: "amber" },
  { what: "Teams connector not set up", since: "—", effect: "one channel unavailable", ownerLabel: "optional", ownerTone: "neutral", state: "not connected", stateTone: "neutral", blocks: "no", blocksTone: "teal" },
];

export const SYSTEMS_INFO_CARDS: SystemsInfoCard[] = [
  {
    label: "NEVER REQUESTED",
    title: "The Ghana delivery feed",
    body: "This is not overdue. Nobody has ever asked for it. Ghana's silent failures are uncountable as a result, which is why its churn is the only unexplained figure in that stage.",
    footnote: "our omission, not Engineering's",
    tone: "rose",
  },
  {
    label: "OPTIONAL",
    title: "The Teams connector",
    body: "Listed because it is a thing that could be connected and is not. It blocks nothing and it is not marked amber. Not every unconfigured thing is a problem.",
    footnote: "no action needed",
    tone: "neutral",
  },
  {
    label: "THE OLDEST ONE",
    title: "COGS, open 214 days",
    body: "Requested in January, requested again on 28 July, still outstanding. It blocks margin in Price, payback in Acquire, category expansion in Expand and one company goal.",
    footnote: "one CSV would start it",
    tone: "rose",
  },
];

export const SYSTEMS_CLOSING_CALLOUT = {
  title: "Systems items are queued, never dropped, and they say what they block",
  body: "612 push messages are held and will send when the certificate is replaced. Nothing was lost. The important column is the last one — a broken channel that blocks nothing is a nuisance, and a missing source that blocks six figures across four stages is a priority, and they should not look the same.",
};

/** I14 — no bulk approve, the selection-mode state of /inbox. */
export const BULK_ACTION_ROWS: BulkActionRow[] = [
  { action: "Mark as read", available: "yes", availableTone: "teal", why: "changes nothing for a customer", loggedAs: "one entry" },
  { action: "Snooze", available: "yes", availableTone: "teal", why: "one typed reason covers all six", loggedAs: "six entries, one reason" },
  { action: "Assign an owner", available: "yes", availableTone: "teal", why: "naming a person is reversible", loggedAs: "six entries" },
  { action: "Reply to a mention", available: "no", availableTone: "amber", why: "six different questions" },
  { action: "Reject a play", available: "no", availableTone: "amber", why: "each rejection carries a reason that gets cited", whyTone: "amber" },
  { action: "Approve a play", available: "never", availableTone: "rose", why: "each one reaches real customers under your name", whyTone: "rose" },
];

export const BULK_DIAGNOSTIC_ROWS: KvRow[] = [
  { label: "You have 11 pending", value: "median across the workspace is 3", tone: "amber" },
  { label: "Six of them are under 5,000 recipients", value: "those could sit under a standing authority", tone: "teal" },
  { label: "Two are above your authority anyway", value: "they are waiting on Ada, not on you" },
  { label: "Median time to decide", value: "3.1 hrs · yours is 19", tone: "amber" },
  { label: "What would actually help", value: "a standing authority for reactivation under 50,000", tone: "teal" },
];

export const BULK_BANNER = {
  title: "You have selected 6 items. There is no approve button.",
  body: "Selection exists for snoozing, assigning and marking read. Approval runs under your identity against specific customers, and there is no version of that which happens six at a time.",
};

export const BULK_CLOSING_CALLOUT = {
  title: "This is the most-requested feature in the product and it will not be built",
  body: "Six approvals in one click is nine seconds saved and a habit formed. Within a quarter, approving stops being a decision and becomes a gesture — and re-auth, guardrails and recorded dissent all exist to interrupt exactly that. If the queue is the problem, the answer is standing authority, which removes the queue without removing the person.",
};

/** I15 — inbox settings, /settings/inbox. */
export const SETTINGS_RULE_ROWS: SettingsRuleRow[] = [
  { when: "A play in a room you own needs approval", threshold: "always", thisWeek: "14", thisWeekTone: "amber", canChange: "no", state: "on", stateTone: "teal" },
  { when: "You are named as cover and they are away", threshold: "always", thisWeek: "2", thisWeekTone: "amber", canChange: "no", state: "on", stateTone: "teal" },
  { when: "Someone @-mentions you", threshold: "always", thisWeek: "6", canChange: "no", state: "on", stateTone: "teal" },
  { when: "A guardrail stops a send in your room", threshold: "always", thisWeek: "4", thisWeekTone: "amber", canChange: "no", state: "on", stateTone: "teal" },
  { when: "A reply needs a human and it is your room", threshold: "always", thisWeek: "5", canChange: "no", state: "on", stateTone: "teal" },
  { when: "A source you own fails", threshold: "always", thisWeek: "1", thisWeekTone: "amber", canChange: "yes", state: "on", stateTone: "teal" },
  { when: "A room you watch has activity", threshold: "off", thisWeek: "—", canChange: "yes", state: "off", stateTone: "neutral" },
  { when: "An agent finishes a run", threshold: "never", thisWeek: "412 · log only", canChange: "no", state: "off by design", stateTone: "neutral" },
];

export const SETTINGS_COMPARED_ROWS: KvRow[] = [
  { label: "Your pending", value: "11 · workspace median is 3", tone: "amber" },
  { label: "Your median time to decide", value: "19 hrs · workspace median is 3.1", tone: "rose" },
  { label: "Items you snoozed this month", value: "5 · one twice", tone: "amber" },
  { label: "Items that escalated past you", value: "1 · the Ghana room, to Ada", tone: "rose" },
  { label: "What your lead sees", value: "all of the above" },
];

export const SETTINGS_CALLOUT_1 = {
  title: "Five cannot be turned off and one cannot be turned on",
  body: "You can mute source failures and watched-room activity. You cannot mute an approval you own, a cover you accepted, a mention, a guardrail firing or a reply that needs a human — because those are the five things this screen exists for, and an inbox you can empty by muting is not an inbox.",
};

export const SETTINGS_CALLOUT_2 = {
  title: "Your lead can see these numbers and that is deliberate",
  body: "Not to police response times — a slow decision on a ₦412M play is often the right one. It is so that when eleven things are pending and one has escalated, somebody notices that you are overloaded before you have to say so.",
};

export type { Customer };
