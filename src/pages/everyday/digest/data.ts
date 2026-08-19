import type { AgentRef, PersonRef } from "@/pages/everyday/rooms/types";
import {
  ACQUISITION_QUALITY,
  ADA,
  INVOLUNTARY_CHURN,
  KUNLE,
  RAVI,
  REPEAT_DECAY,
} from "@/pages/everyday/rooms/data";
import type {
  ArchiveRow,
  BlockageRow,
  ChannelRow,
  DigestCard,
  KvRow,
  NotInDigestRow,
  NotificationRuleRow,
  PastDigestSectionRow,
  QuietHoursRow,
  TeamMemberLoad,
  WeeklyDeltaRow,
  WhatGetsInRow,
} from "@/pages/everyday/digest/types";

export { ADA, RAVI, KUNLE, REPEAT_DECAY, ACQUISITION_QUALITY, INVOLUNTARY_CHURN };

export const GRACE: PersonRef = { initials: "GM", name: "Grace Mwangi", department: "Customer Success" };
export const PETER: PersonRef = { initials: "PK", name: "Peter Kariuki", department: "Customer Success" };
export const JOY: PersonRef = { initials: "JN", name: "Joy Nduta", department: "Customer Success" };
export const DAVID: PersonRef = { initials: "DO", name: "David Otieno", department: "Customer Success" };

/** D01 — Your first digest. Day one, wired but unreachable given WORKSPACE_AGE_DAYS below — matches every prior rebuild's "first run" state. */
export const WORKSPACE_AGE_DAYS = 41;

export const FIRST_DIGEST_CARDS: DigestCard[] = [
  {
    eyebrow: "HOW THIS WORKS",
    eyebrowTone: "ultra",
    title: "This arrives at 06:00, in your local time, every weekday",
    body: "Three sections at most: what needs you, what resolved overnight, and what opened. If none of those happened, it says so in one line rather than padding.",
    footnote: "about ninety seconds to read",
    footnoteTone: "ultra",
  },
  {
    eyebrow: "NEW",
    eyebrowTone: "amber",
    agent: REPEAT_DECAY,
    title: "Two rooms opened while your sources were still reading",
    body: "Repeat & Decay found a dated break in second orders. Acquisition Quality found a Ghana campaign converting at 4%. Neither has an owner yet.",
    footnote: "₦443M · both unowned",
    footnoteTone: "amber",
  },
  {
    eyebrow: "NOTHING NEEDS YOU YET",
    eyebrowTone: "neutral",
    title: "Nothing needs you yet",
    body: "No plays have been proposed, because no agent proposes an action in the first twelve hours of reading a source. Tomorrow's digest will be shorter or longer depending on what actually happened — it is not padded to a fixed length.",
    muted: true,
  },
];

export const FIRST_DIGEST_ARRIVES: KvRow[] = [
  { label: "Email", value: "06:00 Lagos", tone: "teal" },
  { label: "Slack", value: "not connected", tone: "neutral" },
  { label: "Mobile push", value: "above ₦50M", tone: "teal" },
  { label: "Weekly roll-up", value: "off", tone: "neutral" },
];

export const FIRST_DIGEST_WHAT_GETS_IN: KvRow[] = [
  { label: "Needing your approval", value: "always", tone: "amber" },
  { label: "Rooms above", value: "₦25M at risk" },
  { label: "Rooms you own", value: "always" },
  { label: "Everything else", value: "log only", tone: "neutral" },
];

/** D02 — Today's digest. The default state at /digest. */
export const TODAY_DIGEST_CARDS: DigestCard[] = [
  {
    eyebrow: "NEEDS YOU",
    eyebrowTone: "amber",
    title: "The reactivation sequence is still unapproved",
    body: "It has waited 19 hours. Roughly 4,100 customers pass the 90-day mark each day and stop responding to it at all.",
    footnote: "₦412M at stake · ₦2.1M a day",
    footnoteTone: "amber",
  },
  {
    eyebrow: "RESOLVED",
    eyebrowTone: "teal",
    title: "Card retries moved to 09:00 and recovered ₦18M overnight",
    body: "Ravi approved the window at 22:40. 8,900 of 12,400 retried cards cleared, against 3,100 in the held-back group.",
    footnote: "Room closed at 05:12 · measured",
    footnoteTone: "teal",
  },
  {
    eyebrow: "NEW",
    eyebrowTone: "ultra",
    agent: ACQUISITION_QUALITY,
    title: "Acquisition Quality opened a room about Ghana signups",
    body: "Signups from the Accra campaign convert at 4%, against 19% everywhere else. It has not been assigned to anyone yet.",
    footnote: "₦31M · no owner",
    footnoteTone: "ultra",
  },
  {
    eyebrow: "NOT IN THIS DIGEST",
    eyebrowTone: "neutral",
    title: "Not in this digest",
    body: "Six agent runs finished with nothing to report, four campaigns sent on schedule, and the Kenya cohort held flat. All of it is in the log — a digest that lists everything is a log.",
    muted: true,
  },
];

export const TODAY_DIGEST_ARRIVES: KvRow[] = [
  { label: "Email", value: "06:00 Lagos", tone: "teal" },
  { label: "Slack · #revenue", value: "06:00 Lagos", tone: "teal" },
  { label: "Mobile push", value: "above ₦50M", tone: "teal" },
  { label: "Microsoft Teams", value: "not connected", tone: "neutral" },
  { label: "Weekly roll-up", value: "Monday 07:00", tone: "teal" },
];

export const TODAY_DIGEST_WHAT_GETS_IN: KvRow[] = [
  { label: "Needing your approval", value: "always", tone: "amber" },
  { label: "Rooms above", value: "₦25M at risk" },
  { label: "Rooms you own", value: "always" },
  { label: "Overdue obligations", value: "always", tone: "amber" },
  { label: "Everything else", value: "log only", tone: "neutral" },
];

/** D03 — A quiet day. Wired but unreachable with QUIET_DAY_ACTIVE below false by default. */
export const QUIET_DAY_ACTIVE = false;

export const QUIET_DAY_STILL_RUNNING: KvRow[] = [
  { label: "Rooms open", value: "11 · all owned", tone: "teal" },
  { label: "Plays running", value: "2", tone: "neutral" },
  { label: "Agents working", value: "6", tone: "ultra" },
  { label: "Waiting on you", value: "0", tone: "teal" },
  { label: "Waiting on anyone", value: "3 · not yours", tone: "neutral" },
];

export const QUIET_DAY_STATS: KvRow[] = [
  { label: "This month", value: "9 of 31" },
  { label: "Last month", value: "11 of 30" },
  { label: "Longest run", value: "3 days", tone: "neutral" },
];

/** D04 — Digest archive. */
export const ARCHIVE_ROWS: ArchiveRow[] = [
  { date: "Thu 14 Aug", headline: "Nothing needed you", neededYou: 0, actedWithin: "—", atStake: "—", outcome: "quiet day", outcomeTone: "neutral" },
  { date: "Wed 13 Aug", headline: "Reactivation sequence still unapproved", neededYou: 1, neededYouTone: "amber", actedWithin: "4 hrs", actedWithinTone: "teal", atStake: "₦412M", atStakeTone: "rose", outcome: "approved", outcomeTone: "teal" },
  { date: "Tue 12 Aug", headline: "Card retry window approved at 22:40", neededYou: 2, actedWithin: "4 hrs", actedWithinTone: "teal", atStake: "₦88M", outcome: "₦18M recovered", outcomeTone: "teal" },
  { date: "Mon 11 Aug", headline: "Ghana signup conversion fell to 4%", neededYou: 1, actedWithin: "not acted on", actedWithinTone: "rose", atStake: "₦31M", outcome: "still unowned", outcomeTone: "amber" },
  { date: "Fri 8 Aug", headline: "Fee fix shipped to all four markets", neededYou: 0, actedWithin: "—", atStake: "—", outcome: "measuring", outcomeTone: "ultra" },
  { date: "Thu 7 Aug", headline: "Nothing needed you", neededYou: 0, actedWithin: "—", atStake: "—", outcome: "quiet day", outcomeTone: "neutral" },
];

export const ARCHIVE_CARDS: DigestCard[] = [
  {
    eyebrow: "THE PATTERN",
    eyebrowTone: "amber",
    title: "Three digests in a row named the Ghana room",
    body: 'It appeared under "New" on the 10th, 11th and 12th and has never had an owner. Something you scroll past three times is a process failure, not a reading failure.',
    footnote: "still ₦31M · still nobody",
    footnoteTone: "amber",
  },
  {
    eyebrow: "RESPONSE TIME",
    eyebrowTone: "teal",
    title: "Median 4.1 hours, when you act at all",
    body: "Across 31 digests: 22 needed a decision and 19 got one the same day. The three that did not are all above ₦25M.",
    footnote: "three outstanding",
    footnoteTone: "teal",
  },
  {
    eyebrow: "QUIET DAYS",
    eyebrowTone: "neutral",
    title: "9 of 31 needed nothing",
    body: 'A digest that never says "nothing needed you" is a digest nobody trusts. These days are kept in the count deliberately and are searchable like any other.',
    footnote: "29% quiet",
  },
];

/** D05 — One past digest. Only "2026-08-11" is a built reference date, same "one reference row" pattern as every prior rebuild's :id drilldowns. */
export const ONE_DIGEST_DATE = "2026-08-11";
export const ONE_DIGEST_LABEL = "Monday 11 August";

export const ONE_DIGEST_ROWS: PastDigestSectionRow[] = [
  { section: "Needs you", item: "Approve the Kenya retry window", atStake: "KES 4.1M", atStakeTone: "amber", youDid: "approved", youDidTone: "teal", when: "09:14", whenTone: "teal", outcome: "KES 2.9M recovered", outcomeTone: "teal" },
  { section: "Resolved", item: "Lagos delivery room closed", atStake: "₦9M", youDid: "read it", youDidTone: "neutral", when: "06:41", whenTone: "neutral", outcome: "no action needed", outcomeTone: "teal" },
  { section: "New", item: "Ghana signups convert at 4%", atStake: "₦31M", atStakeTone: "rose", youDid: "nothing", youDidTone: "rose", when: "—", whenTone: "rose", outcome: "still unowned", outcomeTone: "rose" },
  { section: "Not in this digest", item: "Four campaigns sent on schedule", atStake: "—", youDid: "—", when: "—", outcome: "log only", outcomeTone: "neutral" },
  { section: "Not in this digest", item: "Nine agent runs with nothing to report", atStake: "—", youDid: "—", when: "—", outcome: "log only", outcomeTone: "neutral" },
];

export const ONE_DIGEST_CHANGED_AFTER: KvRow[] = [
  { label: "Nothing automatically", value: "a digest is a report, not a control" },
  { label: "It appeared in the daily list", value: "ranked third, from the 11th onward", tone: "teal" },
  { label: "It escalated to Ada", value: "on the 17th, after seven days unowned", tone: "amber" },
  { label: "It is now in the archive pattern view", value: "as three consecutive appearances", tone: "teal" },
];

/** D06 — Weekly roll-up. */
export const WEEKLY_KPIS = [
  { eyebrow: "ROOMS OPENED", value: "6", note: "four by agents" },
  { eyebrow: "ROOMS CLOSED", value: "3", tone: "teal" as const, note: "₦102M recovered" },
  { eyebrow: "DECISIONS MADE", value: "11", tone: "amber" as const, note: "2 still waiting" },
  { eyebrow: "GOALS MOVED", value: "+1.1 pts", tone: "teal" as const, note: "repeat rate" },
];

export const WEEKLY_NARRATIVE =
  "The delivery-fee cause was confirmed in a second market and the fix shipped on Friday, six weeks after the first signal. Card retries closed with ₦62M recovered against a holdout. One room opened on Monday still has no owner, and the repeat-rate goal remains 7.2 points behind with 50 days left. Nothing was rejected this week, which is itself worth noticing.";

export const WEEKLY_DELTA_ROWS: WeeklyDeltaRow[] = [
  { thing: "90-day repeat rate", start: "28.1%", end: "29.2%", change: "+1.1 pts", changeTone: "teal", comment: "One-tap reorder" },
  { thing: "Revenue at risk, open", start: "₦628M", end: "₦566M", change: "−₦62M", changeTone: "teal", comment: "Dunning room closed" },
  { thing: "Rooms with no owner", start: "0", end: "1", change: "+1", changeTone: "amber", comment: "Ghana signups, since Monday" },
  { thing: "Plays waiting on a person", start: "2", end: "4", change: "+2", changeTone: "amber", comment: "The queue is growing" },
  { thing: "Sources healthy", start: "5 of 5", end: "4 of 5", change: "−1", changeTone: "rose", comment: "APNs certificate expired" },
  { thing: "Overdue obligations", start: "11", end: "14", change: "+3", changeTone: "rose", comment: "All three with Engineering" },
];

/** D07 — Team digest, reached at /digest?team=ea-cs. */
export const TEAM_DIGEST_CARDS: DigestCard[] = [
  {
    eyebrow: "NEEDS SOMEONE",
    eyebrowTone: "rose",
    title: "Three items still have nobody on them",
    body: "Mombasa delivery, the Kenya renewal re-forecast and Nakuru card failures. All three have been unassigned four days or more.",
    footnote: "₦36M · assign in one click",
    footnoteTone: "rose",
  },
  {
    eyebrow: "TWO PEOPLE ARE CARRYING IT",
    eyebrowTone: "amber",
    title: "Grace and Peter hold 11 of your 17 items",
    body: "Joy has two and David has one. Nothing is on fire — the distribution is simply wrong, and has been for three weeks.",
    footnote: "reassign three items",
    footnoteTone: "amber",
  },
  {
    eyebrow: "RESOLVED",
    eyebrowTone: "teal",
    title: "Kunle's Kenya rollback room closed overnight",
    body: "KES 8.1M recovered against a holdout. The first Kenya room to close with a measured number rather than an estimate.",
    footnote: "closed 04:40",
    footnoteTone: "teal",
  },
  {
    eyebrow: "NOT IN THE TEAM DIGEST",
    eyebrowTone: "neutral",
    title: "What is not in the team digest",
    body: "Anything about the other 117 teams, and anything already handled by one of your nine. A team digest that repeats the company digest is just a longer company digest.",
    muted: true,
  },
];

export const TEAM_LOAD: TeamMemberLoad[] = [
  { person: GRACE, items: 6, tone: "rose" },
  { person: PETER, items: 5, tone: "rose" },
  { person: JOY, items: 2, tone: "neutral" },
  { person: DAVID, items: 1, tone: "teal" },
];

export const TEAM_DIGEST_ARRIVES: KvRow[] = [
  { label: "Slack · #ea-cs", value: "06:00 Nairobi", tone: "teal" },
  { label: "Email · you only", value: "06:00 Nairobi", tone: "teal" },
  { label: "Your nine", value: "their own digests", tone: "neutral" },
  { label: "Ada", value: "not subscribed", tone: "neutral" },
];

/** D08 — Exec digest, reached at /digest?scope=org. */
export const EXEC_KPIS = [
  { eyebrow: "TEAMS BEHIND PACE", value: "14 of 118", tone: "amber" as const, note: "up from 11 last week" },
  { eyebrow: "REVENUE AT RISK, OPEN", value: "₦1.31B", tone: "rose" as const, note: "across four markets" },
  { eyebrow: "DECISIONS WAITING ON YOU", value: "14", tone: "rose" as const, note: "₦1.4B behind them" },
  { eyebrow: "RECOVERED THIS WEEK", value: "₦102M", tone: "teal" as const, note: "measured, not projected" },
];

export const BLOCKAGE_ROWS: BlockageRow[] = [
  { what: "14 plays over 100,000 recipients waiting on you", where: "All markets", behind: "₦1.4B", behindTone: "rose", stuckFor: "19 hrs median", stuckForTone: "rose", needs: "your approval, or standing authority", needsAda: true },
  { what: "Engineering holds 41 obligations, 14 overdue", where: "Nigeria", behind: "₦188M", behindTone: "rose", stuckFor: "21 days median", stuckForTone: "rose", needs: "a priority call above the teams", needsAda: true },
  { what: "Advocate and Churn have no owner", where: "All markets", behind: "₦155M", behindTone: "rose", stuckFor: "214 days", stuckForTone: "rose", needs: "two names against two stages", needsAda: true },
  { what: "Second orders vs repeat rate, unresolved", where: "All markets", behind: "₦88M CAC", behindTone: "rose", stuckFor: "6 weeks", stuckForTone: "rose", needs: "you to pick one", needsAda: true },
  { what: "19 agent-opened rooms never assigned", where: "All markets", behind: "₦96M", behindTone: "amber", stuckFor: "4–41 days", stuckForTone: "amber", needs: "team leads, not you", needsAda: false },
  { what: "Ghana ships the fee release on 14 September", where: "Ghana", behind: "preventable", behindTone: "teal", stuckFor: "31 days out", stuckForTone: "amber", needs: "someone to open a room", needsAda: false },
];

/** D15 — Digest, degraded. Wired but unreachable with DIGEST_DEGRADED below false by default. */
export const DIGEST_DEGRADED = false;

export const DEGRADED_SOURCES: KvRow[] = [
  { label: "Orders", value: "last read 04:12", tone: "rose" },
  { label: "Payments", value: "healthy", tone: "teal" },
  { label: "Support", value: "healthy", tone: "teal" },
  { label: "Delivery", value: "healthy", tone: "teal" },
  { label: "Cost of goods", value: "not connected", tone: "neutral" },
];

export const DEGRADED_AFFECTED: KvRow[] = [
  { label: "Agents paused", value: "3", tone: "rose" },
  { label: "Rooms with stale figures", value: "8", tone: "amber" },
  { label: "Goals unmeasurable today", value: "2", tone: "amber" },
  { label: "Plays blocked", value: "0", tone: "teal" },
];

/** D09 — What gets in, /settings/digest. */
export const WHAT_GETS_IN_ROWS: WhatGetsInRow[] = [
  { when: "A play in a room you own needs approval", threshold: "always", yesterday: "1", yesterdayTone: "amber", canChange: "no", state: "on" },
  { when: "An obligation you owe is overdue", threshold: "always", yesterday: "1", yesterdayTone: "rose", canChange: "no", state: "on" },
  { when: "A room in your stage has no owner", threshold: "always", yesterday: "1", yesterdayTone: "amber", canChange: "no", state: "on" },
  { when: "A guardrail stopped a send", threshold: "always", yesterday: "0", canChange: "no", state: "on" },
  { when: "A room opens above", threshold: "₦25,000,000", yesterday: "1", canChange: "yes", state: "on" },
  { when: "A room you own closes", threshold: "always", yesterday: "1", yesterdayTone: "teal", canChange: "yes", state: "on" },
  { when: "An agent finishes a run", threshold: "never", yesterday: "6 · log only", canChange: "no", state: "off by design" },
  { when: "A campaign sends on schedule", threshold: "never", yesterday: "4 · log only", canChange: "no", state: "off by design" },
];

export const WHAT_GETS_IN_THRESHOLD: KvRow[] = [
  { label: "Your threshold", value: "₦25M · the workspace default" },
  { label: "Rooms you own below it", value: "eleven · ₦96M combined · in the daily list, not the digest", tone: "amber" },
  { label: "If you lowered it to ₦5M", value: "yesterday's digest would have had seven items instead of three" },
  { label: "If you raised it to ₦100M", value: "one item · the reactivation approval" },
  { label: "Flolyt's suggestion", value: "leave it · your median response time rises above five items", tone: "teal" },
];

/** D10 — Channels, /settings/digest/channels. */
export const CHANNEL_ROWS: ChannelRow[] = [
  { channel: "Email", sends: "06:00 local, weekdays", contains: "the full digest", state: "on", health: "healthy", healthTone: "teal", lastDelivered: "today 06:00" },
  { channel: "Slack · #revenue", sends: "06:00 local, weekdays", contains: "headline plus links", state: "on", health: "healthy", healthTone: "teal", lastDelivered: "today 06:00" },
  { channel: "Slack · direct message", sends: "only when something needs you", contains: "one line and a link", state: "on", health: "healthy", healthTone: "teal", lastDelivered: "today 06:00" },
  { channel: "Mobile push", sends: "immediately, above ₦50M", contains: "headline only", state: "on", health: "certificate expired", healthTone: "rose", lastDelivered: "11 Aug", lastDeliveredTone: "rose" },
  { channel: "Microsoft Teams", sends: "—", contains: "—", state: "not connected" },
  { channel: "Weekly roll-up", sends: "Monday 07:00 local", contains: "the week, not the day", state: "on", health: "healthy", healthTone: "teal", lastDelivered: "Mon 07:00" },
];

/** D11 — Quiet hours and timezones, /settings/digest/quiet-hours. */
export const QUIET_HOURS_ROWS: QuietHoursRow[] = [
  { market: "Nigeria", quietHours: "21:00 – 07:00", builtAt: "06:00 WAT", builtAtTone: "teal", timezone: "UTC+1", affects: "2.91M customers · 71 staff", exempt: "guardrail stops" },
  { market: "Kenya", quietHours: "21:00 – 07:00", builtAt: "06:00 EAT", builtAtTone: "teal", timezone: "UTC+3", affects: "610k customers · 24 staff", exempt: "guardrail stops" },
  { market: "Ghana", quietHours: "21:00 – 07:00", builtAt: "06:00 GMT", builtAtTone: "teal", timezone: "UTC+0", affects: "410k customers · 3 staff", exempt: "guardrail stops" },
  { market: "United Kingdom", quietHours: "21:00 – 07:00", builtAt: "06:00 BST", builtAtTone: "teal", timezone: "UTC+1", affects: "269k customers · 11 staff", exempt: "guardrail stops" },
];

/** D12 — Notification rules, /settings/notifications (a sibling settings route, not nested under /settings/digest — see its own footer). */
export const NOTIFICATION_RULES: NotificationRuleRow[] = [
  { id: "approval", when: "A play needs your approval", whoItReaches: "The named owner only", channel: "push + email", urgency: "immediate", urgencyTone: "amber", firedThisWeek: 14, state: "on", stateTone: "teal" },
  { id: "room-above-threshold", when: "A room opens above ₦25M", whoItReaches: "Stage owner and Ada", channel: "digest", urgency: "06:00", firedThisWeek: 6, state: "on", stateTone: "teal" },
  { id: "no-owner", when: "A room opens with no owner", whoItReaches: "Team lead for that stage", channel: "push", urgency: "immediate", urgencyTone: "amber", firedThisWeek: 2, state: "on", stateTone: "teal" },
  { id: "guardrail", when: "A guardrail stops a send", whoItReaches: "Everyone in the room", channel: "push", urgency: "ignores quiet hours", urgencyTone: "rose", firedThisWeek: 4, state: "on", stateTone: "teal" },
  { id: "obligation-overdue", when: "An obligation passes its date", whoItReaches: "Owner, then the chain owner", channel: "inbox + digest", urgency: "06:00", urgencyTone: "amber", firedThisWeek: 3, firedTone: "rose", state: "added 2 Aug", stateTone: "ultra" },
  { id: "source-down", when: "A source stops reporting", whoItReaches: "Data owner", channel: "email", urgency: "within 1 hr", urgencyTone: "amber", firedThisWeek: 1, state: "on", stateTone: "teal" },
  { id: "agent-run", when: "An agent finishes a run", whoItReaches: "Nobody", channel: "log only", urgency: "—", firedThisWeek: 412, state: "off by design", stateTone: "neutral" },
  { id: "campaign-sent", when: "A campaign sends on schedule", whoItReaches: "Nobody", channel: "log only", urgency: "—", firedThisWeek: 28, state: "off by design", stateTone: "neutral" },
];

/** D13 — the "room opens above ₦25M" rule is the one the export shows opened in the edit modal. */
export const EDITABLE_RULE_ID = "room-above-threshold";

/** D14 — Not in this digest, /digest/excluded. */
export const NOT_IN_DIGEST_KPIS = [
  { eyebrow: "HAPPENED OVERNIGHT", value: "437 things", note: "across 11 rooms" },
  { eyebrow: "IN YOUR DIGEST", value: "3", tone: "teal" as const, note: "0.7% of them" },
  { eyebrow: "IN THE LOG ONLY", value: "434", note: "searchable, never sent" },
  { eyebrow: "SUPPRESSED BY A THRESHOLD", value: "11", tone: "amber" as const, note: "below ₦25M" },
];

export const NOT_IN_DIGEST_ROWS: NotInDigestRow[] = [
  { what: "Agent runs that finished cleanly", count: "412", why: "an agent narrating its work is not news", where: "room logs", canChange: "no" },
  { what: "Campaigns that sent on schedule", count: "4", why: "doing what it was told is not news", where: "play history", canChange: "no" },
  { what: "Tool calls", count: "undisclosed", why: "counted in the runs above", where: "room logs", canChange: "no" },
  { what: "Rooms that opened below ₦25M", count: "11", countTone: "amber", why: "your threshold", whyTone: "amber", where: "daily list, ranked", whereTone: "teal", canChange: "yes" },
  { what: "Cohorts that held flat", count: "6", why: "no change is not an event", where: "lifecycle stages", canChange: "no" },
  { what: "Comments in rooms you do not own", count: "31", why: "you were not mentioned", where: "those rooms", canChange: "yes" },
];

export type { AgentRef, PersonRef };
