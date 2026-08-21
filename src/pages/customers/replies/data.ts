import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ADA, AMARA, IFEOMA, KUNLE, RAVI } from "@/pages/everyday/rooms/data";

/**
 * Customers · Replies — sourced from
 * flolyt-figma-designs/Customers Screens/flolyt-replies/flolyt-replies/
 * (14 frames, RP01-RP14). Content transcribed from the export's own `rp.py`
 * generator source, same approach as Segments/Customer health/Campaigns/
 * Experiments. See docs/build-tracker.md.
 */

export type RpTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const RP_TONE_CLASS: Record<RpTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const RP_CHIP_TONE: Record<RpTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const RP_KPI_TONE: Record<RpTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior mock flag. */
export type RepliesState = "nothing" | "first" | "full";
export const REPLIES_STATE: RepliesState = "full";

export const RP_TABS = ["Needs an answer", "Themes", "Unanswered", "Routing", "Answered"] as const;
export type RpTab = (typeof RP_TABS)[number];

// ───────────────────────── RP01 · NOBODY HAS WRITTEN BACK ─────────────────────────

export const RP01_SOURCE_ROWS: { source: string; whatItIs: string; routesTo: string; whoAnswers: string; whoAnswersTone: RpTone }[] = [
  { source: "A reply to a campaign", whatItIs: "Somebody responding to something we sent", routesTo: "The campaign owner", whoAnswers: "the owner", whoAnswersTone: "muted" },
  { source: "A support ticket", whatItIs: "Somebody writing in unprompted", routesTo: "Support · Amara's queue", whoAnswers: "Support", whoAnswersTone: "muted" },
  { source: "A reply with no campaign", whatItIs: "An old thread, or a forwarded message", routesTo: "Support · triaged", whoAnswers: "Support", whoAnswersTone: "muted" },
  { source: "A reply from a held customer", whatItIs: "Somebody in a holdout, replying to nothing", routesTo: "The experiment owner", whoAnswers: "the owner", whoAnswersTone: "warn" },
];

// ───────────────────────── RP02 · THE FIRST REPLY ─────────────────────────

export const RP02_MESSAGE = {
  meta: "CUSTOMER 4,118,207 · LAGOS · 11 MINUTES AGO",
  body: "I got your message about the retry. That is not my problem. My problem is that the delivery charge appears at the end now, after I have already chosen everything. Three times I have got to the last screen and closed the app. Please put it back where it was.",
};

export const RP02_STATS: { eyebrow: string; value: string; note: string; tone: RpTone }[] = [
  { eyebrow: "Replied to", value: "Retry cards at 09:00", note: "a payment message", tone: "muted" },
  { eyebrow: "What they wrote about", value: "the delivery fee", note: "not the retry", tone: "risk" },
  { eyebrow: "Days before the leakage map found it", value: "131", note: "this arrived 24 March", tone: "risk" },
  { eyebrow: "Who it routes to", value: "Ravi Mehta", note: "who owns the campaign", tone: "muted" },
];

export const RP02_KV_ROWS: { label: string; value: string; tone?: RpTone }[] = [
  { label: "It reached the campaign owner", value: "Ravi · because he sent the thing it replies to" },
  { label: "It was answered in 40 minutes", value: "by a person · the draft was written by Support Signal", tone: "ok" },
  { label: "It was attached to a room", value: "Support · Lagos delivery failures · as evidence", tone: "ok" },
  { label: "It did not become a finding on its own", value: "one customer is an anecdote · 3,968 of them was the finding", tone: "warn" },
  { label: "It was not used to open a room", value: "a room is about a cohort · this is one person", tone: "ai" },
];

// ───────────────────────── RP03 · NEEDS AN ANSWER ─────────────────────────

export const RP03_STATS: { eyebrow: string; value: string; note: string; tone: RpTone }[] = [
  { eyebrow: "Waiting", value: "31", note: "across 4 owners", tone: "warn" },
  { eyebrow: "Oldest", value: "164 days", note: "one person, never answered", tone: "risk" },
  { eyebrow: "Median wait", value: "4 hours", note: "when somebody is watching", tone: "ok" },
  { eyebrow: "Drafted and unsent", value: "18", note: "an agent wrote, nobody sent", tone: "warn" },
];

export type NeedsAnswerRow = {
  from: string;
  /** Only set on the row with a built `:id` conversation page (`4118207`). */
  id?: string;
  about: string;
  waiting: string;
  waitingTone: RpTone;
  routesTo: string;
  draftReady: boolean;
  cohort: string;
  cohortTone: RpTone;
  /** Set on the one row RP09's own modal targets. */
  rowAction?: "send";
};

export const RP03_ROWS: NeedsAnswerRow[] = [
  { from: "Customer 4,118,207", id: "4118207", about: "The delivery fee, again · third message", waiting: "164 days", waitingTone: "risk", routesTo: "Ravi", draftReady: true, cohort: "Lapsed after the fee", cohortTone: "warn", rowAction: "send" },
  { from: "Customer 2,904,551", about: "Card declined twice on renewal night", waiting: "6 hours", waitingTone: "ok", routesTo: "Kunle", draftReady: true, cohort: "Card failed", cohortTone: "muted" },
  { from: "Customer 3,771,092", about: "Wants to know why they got three messages", waiting: "2 days", waitingTone: "warn", routesTo: "Ifeoma", draftReady: false, cohort: "Waves one and two", cohortTone: "risk" },
  { from: "Customer 1,220,884", about: "Held in the reactivation experiment · asks if we left", waiting: "11 hours", waitingTone: "ok", routesTo: "Ifeoma", draftReady: true, cohort: "Held · wave one", cohortTone: "warn" },
  { from: "Customer 4,003,127", about: "Refund not received · order 8 March", waiting: "3 days", waitingTone: "risk", routesTo: "Amara", draftReady: true, cohort: "Lagos refund", cohortTone: "muted" },
];

// ───────────────────────── RP04 · ONE CONVERSATION (4118207) ─────────────────────────

export const RP04_THREAD_ROWS: { when: string; whatTheySaid: string; route: string; whatHappened: string; whatHappenedTone: RpTone }[] = [
  { when: "7 Mar", whatTheySaid: "The fee moved to the end · closed the app three times", route: "Support", whatHappened: "classified as delivery complaint", whatHappenedTone: "warn" },
  { when: "24 Mar", whatTheySaid: "Replied to the retry message · same point, more directly", route: "Ravi", whatHappened: "answered in 40 minutes", whatHappenedTone: "ok" },
  { when: "19 Jun", whatTheySaid: "Asked whether anybody had read the first two", route: "Support", whatHappened: "draft written, never sent", whatHappenedTone: "risk" },
  { when: "Today", whatTheySaid: "Nothing · they have not ordered since 2 March", route: "—", whatHappened: "in the lapsed cohort, 100,000 people", whatHappenedTone: "risk" },
];

export const RP04_KV_ROWS: { label: string; value: string; tone?: RpTone }[] = [
  { label: "Answer them", value: "a draft is ready · a person reads it and sends it", tone: "ok" },
  { label: "Attach the thread to a room", value: "the Retain room · as evidence, not as a finding", tone: "ok" },
  { label: "Open a room about them", value: "not offered · a room is about a cohort", tone: "risk" },
  { label: "Add them to a reactivation campaign", value: "not from here · they are already in the segment", tone: "muted" },
  { label: "Mark it as not needing an answer", value: "possible · with a typed reason that stays on the thread", tone: "warn" },
];

// ───────────────────────── RP05 · THEMES ─────────────────────────

export type ThemeRow = {
  theme: string;
  messages: string;
  messagesTone: RpTone;
  share: string;
  shareTone: RpTone;
  firstSeen: string;
  firstSeenTone: RpTone;
  becameFinding: string;
  becameFindingTone: RpTone;
  claimType: string;
  /** Set on the one row RP10's own modal targets. */
  rowAction?: "evidence";
};

export const RP05_ROWS: ThemeRow[] = [
  { theme: "The delivery fee at checkout", messages: "3,968", messagesTone: "risk", share: "31%", shareTone: "risk", firstSeen: "7 Mar", firstSeenTone: "risk", becameFinding: "21 Mar · Support only", becameFindingTone: "warn", claimType: "causal" },
  { theme: "Delivery late or failed", messages: "2,940", messagesTone: "warn", share: "23%", shareTone: "warn", firstSeen: "always", firstSeenTone: "muted", becameFinding: "yes · Lagos room", becameFindingTone: "ok", claimType: "causal" },
  { theme: "Payment declined", messages: "1,792", messagesTone: "warn", share: "14%", shareTone: "warn", firstSeen: "always", firstSeenTone: "muted", becameFinding: "yes · Renew room", becameFindingTone: "ok", claimType: "causal" },
  { theme: "Too many messages", messages: "896", messagesTone: "num", share: "7%", shareTone: "num", firstSeen: "14 Aug", firstSeenTone: "warn", becameFinding: "no", becameFindingTone: "risk", claimType: "association", rowAction: "evidence" },
  { theme: "Cannot find a feature", messages: "768", messagesTone: "num", share: "6%", shareTone: "num", firstSeen: "always", firstSeenTone: "muted", becameFinding: "no · Adopt has no owner", becameFindingTone: "risk", claimType: "insufficient" },
  { theme: "Everything else", messages: "2,436", messagesTone: "num", share: "19%", shareTone: "muted", firstSeen: "—", firstSeenTone: "muted", becameFinding: "—", becameFindingTone: "muted", claimType: "—" },
];

// ───────────────────────── RP06 · UNANSWERED ─────────────────────────

export const RP06_STATS: { eyebrow: string; value: string; note: string; tone: RpTone }[] = [
  { eyebrow: "Never answered", value: "412", note: "of 12,800 · 3.2%", tone: "warn" },
  { eyebrow: "Oldest", value: "164 days", note: "and still open", tone: "risk" },
  { eyebrow: "With a draft waiting", value: "18", note: "somebody has to press send", tone: "warn" },
  { eyebrow: "Marked as not needing one", value: "94", note: "with a typed reason each", tone: "ok" },
];

export type UnansweredRow = {
  reason: string;
  messages: string;
  messagesTone: RpTone;
  whatItMeans: string;
  fixable: string;
  fixableTone: RpTone;
  whoBy: string;
  /** Set on the one row RP11's own modal targets. */
  rowAction?: "close";
};

export const RP06_ROWS: UnansweredRow[] = [
  { reason: "Routed to a stage with no owner", messages: "168", messagesTone: "risk", whatItMeans: "Adopt and Advocate · nobody in the field", fixable: "one click", fixableTone: "warn", whoBy: "Ada" },
  { reason: "Draft written, never sent", messages: "18", messagesTone: "warn", whatItMeans: "A person has to read and press send", fixable: "yes", fixableTone: "ok", whoBy: "4 owners" },
  { reason: "Arrived during the March surge", messages: "143", messagesTone: "warn", whatItMeans: "12,800 in a fortnight · the queue never recovered", fixable: "no · past", fixableTone: "muted", whoBy: "—" },
  { reason: "No channel to reply on", messages: "62", messagesTone: "muted", whatItMeans: "Wrote from an address that does not accept replies", fixable: "no", fixableTone: "risk", whoBy: "—", rowAction: "close" },
  { reason: "Held customers who wrote in", messages: "21", messagesTone: "warn", whatItMeans: "Nobody was sure whether answering was allowed", fixable: "yes · it is", fixableTone: "ok", whoBy: "product" },
];

// ───────────────────────── RP07 · ROUTING ─────────────────────────

export const RP07_ROWS: { rule: string; whatItCatches: string; thisMonth: string; thisMonthTone: RpTone; goesTo: string; ifNobody: string; ifNobodyTone: RpTone }[] = [
  { rule: "1 · It replies to something we sent", whatItCatches: "Campaign replies", thisMonth: "1,204", thisMonthTone: "num", goesTo: "The campaign owner", ifNobody: "waits", ifNobodyTone: "warn" },
  { rule: "2 · It is about a payment", whatItCatches: "Declines, refunds, charges", thisMonth: "1,792", thisMonthTone: "num", goesTo: "Renew · Kunle", ifNobody: "waits", ifNobodyTone: "warn" },
  { rule: "3 · It matches an open room's theme", whatItCatches: "Fee, delivery, discount", thisMonth: "2,940", thisMonthTone: "num", goesTo: "The room owner", ifNobody: "waits", ifNobodyTone: "warn" },
  { rule: "4 · It matches a stage", whatItCatches: "Features, onboarding, referral", thisMonth: "768", thisMonthTone: "warn", goesTo: "The stage owner", ifNobody: "nothing happens", ifNobodyTone: "risk" },
  { rule: "5 · Anything else", whatItCatches: "Everything unclassified", thisMonth: "2,436", thisMonthTone: "num", goesTo: "Support · Amara", ifNobody: "Amara", ifNobodyTone: "ok" },
];

export const RP07_KV_ROWS: { label: string; value: string; tone?: RpTone }[] = [
  { label: "Fall through to Support", value: "only rule five does · rules one to four wait for their owner", tone: "warn" },
  { label: "Escalate on age", value: "164 days changes nothing about where a reply sits", tone: "risk" },
  { label: "Reassign to whoever is available", value: "an owner who did not agree is not an owner", tone: "ai" },
  { label: "Auto-reply", value: "not offered · every answer here is written and sent by a person", tone: "risk" },
  { label: "Close anything automatically", value: "a reply stays open until a person answers or closes it", tone: "ok" },
];

// ───────────────────────── RP08 · DRAFT AN ANSWER (4118207) ─────────────────────────

export const RP08_DRAFT = {
  meta: "DRAFTED BY SUPPORT SIGNAL · EDIT BEFORE SENDING",
  body: "You wrote to us three times about the delivery charge showing at checkout, and only one of those got an answer. You were right, and it took us five months to work out how right. The charge still appears at checkout today. I cannot tell you it is changing, because that has not been decided.",
};

export const RP08_USED_ROWS: { label: string; value: string }[] = [
  { label: "Their three messages", value: "7 Mar, 24 Mar, 19 Jun" },
  { label: "Their order history", value: "6 orders, last 2 March" },
  { label: "The room", value: "Lagos delivery failures · closed" },
  { label: "What has actually shipped", value: "nothing · the fee is still at checkout" },
];

export const RP08_CHECK_ROWS: { check: string; result: string; resultTone: RpTone; whatItFound: string; blocking: boolean }[] = [
  { check: "Does it promise something not decided?", result: "passed", resultTone: "ok", whatItFound: "It says explicitly that nothing has been decided", blocking: true },
  { check: "Does it claim something has shipped?", result: "passed", resultTone: "ok", whatItFound: "No · the fee is still at checkout and it says so", blocking: true },
  { check: "Does it offer compensation?", result: "passed", resultTone: "ok", whatItFound: "No · that needs Ravi and is not in this draft", blocking: true },
  { check: "Is it addressed to one person?", result: "passed", resultTone: "ok", whatItFound: "Yes · this is the one place that is allowed", blocking: false },
  { check: "Does it acknowledge what went wrong?", result: "passed", resultTone: "warn", whatItFound: "Yes · two of three messages went unanswered", blocking: false },
];

// ───────────────────────── RP09 · SEND AN ANSWER (modal) ─────────────────────────

export const RP09_BASE_ROWS: { from: string; about: string; waiting: string; routesTo: string; draftReady: boolean }[] = [
  { from: "Customer 4,118,207", about: "The delivery fee, again · third message", waiting: "164 days", routesTo: "Ravi", draftReady: true },
  { from: "Customer 2,904,551", about: "Card declined twice on renewal night", waiting: "6 hours", routesTo: "Kunle", draftReady: true },
];

export const RP09_SEND_PRESET = {
  subject: "To customer 4,118,207",
  subjectDetail: "One person · Lagos · waiting 164 days · three messages",
  items: [
    { label: "No holdout, no audience, no approval", sub: "they asked a question · answering it is not a campaign", tone: "ok" as RpTone },
    { label: "Not counted as a campaign send", sub: "it does not enter any experiment or any ledger", tone: "ok" as RpTone },
    { label: "It does count against nothing", sub: "the frequency cap does not apply to a reply", tone: "ok" as RpTone },
    { label: "Your name is on it", sub: "not Flolyt's, not the agent's · yours", tone: "ai" as RpTone },
  ],
  warningTitle: "They are in the reactivation segment and will hear from us again",
  warningBody:
    "Wave four reaches them in nine days with a different message. Sending this does not remove them, and nobody reading the campaign will know this conversation happened.",
  closingNote:
    "An agent wrote every word of this and cannot send one of them. Support Signal drafted it from the thread and the release calendar, and the send is a person pressing a button with their own name attached. This is the narrowest exception in the product — one person, who wrote first — and it is still not an exception to that rule.",
};

// ───────────────────────── RP10 · MAKE IT EVIDENCE (modal) ─────────────────────────

export const RP10_BASE_ROWS: { theme: string; messages: string; share: string; becameFinding: string }[] = [
  { theme: "The delivery fee at checkout", messages: "3,968", share: "31%", becameFinding: "21 Mar · Support only" },
  { theme: "Too many messages", messages: "896", share: "7%", becameFinding: "no" },
];

export const RP10_EVIDENCE_PRESET = {
  subject: "Too many messages · 896 people",
  subjectDetail: "First seen 14 August · grouped by Support Signal · no room yet",
  options: [
    { label: "Evidence attached to an open room", sub: "the Retain room · it is about the waves it names", on: true, blocked: false },
    { label: "A finding, with a claim type", sub: "896 of 136,000 reached · association, and it says so", on: false, blocked: false },
    { label: "A reason to change the frequency cap", sub: "a person decides · this is Ada's setting", on: false, blocked: false },
    { label: "A room of its own", sub: "not from here · a theme is not a cohort until somebody defines one", on: false, blocked: true },
  ],
  warningTitle: "896 people who complained is not 896 people who minded",
  warningBody:
    "They are the ones who wrote. The claim type will say association and the denominator — 136,000 reached — travels with it wherever it goes.",
  closingNote:
    "Replies are the least representative data in the workspace and the earliest. People who write in are unusual by definition, so nothing here ever becomes a causal claim on its own. It is also where the fee change was described eleven days after it shipped, in plain English, by 3,968 people. Both things are true, which is why this becomes evidence attached to a room rather than a finding standing on its own.",
};

// ───────────────────────── RP11 · CLOSE WITHOUT ANSWERING (modal) ─────────────────────────

export const RP11_BASE_ROWS: { reason: string; messages: string; whatItMeans: string; fixable: string }[] = [
  { reason: "Routed to a stage with no owner", messages: "168", whatItMeans: "Adopt and Advocate · nobody in the field", fixable: "one click" },
  { reason: "No channel to reply on", messages: "62", whatItMeans: "Wrote from an address that does not accept replies", fixable: "no" },
];

export const RP11_CLOSE_PRESET = {
  subject: "Customer 3,881,406",
  subjectDetail: "Wrote 4 August from a no-reply forwarding address",
  reasonLabel: "WHY IT IS BEING CLOSED WITHOUT AN ANSWER · TYPED",
  reasonBody:
    "There is no address that accepts a reply. The point they made is real and has been attached to the Retain room as evidence.",
  whatClosingDoes: [
    { label: "It leaves the queue", sub: "one of 412 · the count falls to 411", tone: "ok" as RpTone },
    { label: "It stays readable, with this reason", sub: "permanently · closed is not deleted", tone: "ok" as RpTone },
    { label: "It still counts in the theme", sub: "the 3,968 figure does not change", tone: "ok" as RpTone },
    { label: "It is not marked resolved", sub: "nothing was resolved · it was closed, and they are different", tone: "warn" as RpTone },
  ],
  closingNote:
    "Ninety-four replies have been closed this way and every one has a sentence attached. Closing without answering is a legitimate thing to do and an easy thing to do too often, so it costs a typed reason every time. The reasons are readable together, which is how anybody would notice if they started to say the same thing.",
};

// ───────────────────────── RP12 · WHAT A REPLY MAY BE USED FOR ─────────────────────────

export const RP12_ROWS: { use: string; allowed: string; allowedTone: RpTone; why: string; whereItAppears: string }[] = [
  { use: "Answering the person who wrote it", allowed: "yes", allowedTone: "ok", why: "It is the reason they wrote", whereItAppears: "this section" },
  { use: "Counting it in a theme", allowed: "yes", allowedTone: "ok", why: "A count, never a quote, never a name", whereItAppears: "Themes" },
  { use: "Attaching the thread to a room", allowed: "yes", allowedTone: "ok", why: "As evidence · the room owner sees it", whereItAppears: "Rooms" },
  { use: "Quoting it in a decision doc", allowed: "ID removed", allowedTone: "warn", why: "The words matter, the person does not", whereItAppears: "Rooms" },
  { use: "Building a segment from who replied", allowed: "no", allowedTone: "risk", why: "Replying is not a behaviour we act on", whereItAppears: "—" },
  { use: "Targeting a campaign at people who complained", allowed: "no", allowedTone: "risk", why: "It turns writing in into a reason to be marketed at", whereItAppears: "—" },
  { use: "Training anything on the text", allowed: "no", allowedTone: "risk", why: "Not offered · these are letters to a company", whereItAppears: "—" },
  { use: "Reading it as a health signal", allowed: "counted only", allowedTone: "warn", why: "Support contact is a cohort signal, not a personal flag", whereItAppears: "Customer health" },
];

export const RP12_KV_ROWS: { label: string; value: string; tone?: RpTone }[] = [
  { label: "In a theme count", value: "everything · a theme is a number and a date", tone: "ok" },
  { label: "In a room", value: "the thread stays whole · the room owner needs to read it", tone: "ok" },
  { label: "In a decision doc", value: "the customer ID · the words are kept exactly", tone: "warn" },
  { label: "In an export", value: "the whole thread is never exported · counts only", tone: "ok" },
  { label: "In Customer health", value: "one bit · contacted support, yes or no", tone: "ok" },
  { label: "Retention", value: "as long as the account exists · deleted with it", tone: "muted" },
];

// ───────────────────────── RP13 · SETTINGS ─────────────────────────

export const RP13_RULE_ROWS: { rule: string; currently: string; whoSetIt: string; canChange: boolean; state: string; stateTone: RpTone }[] = [
  { rule: "Every answer is written and sent by a person", currently: "12,388 sent", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Agents may draft and never send", currently: "18 drafted", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Closing without answering needs a reason", currently: "94", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Replies never build a segment", currently: "—", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Held customers may be answered", currently: "21 waiting", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Routing order", currently: "5 rules", whoSetIt: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Unclassified goes to Support", currently: "2,436 a month", whoSetIt: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Auto-reply of any kind", currently: "—", whoSetIt: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Closing a reply on age", currently: "—", whoSetIt: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Unowned replies falling through to Support", currently: "—", whoSetIt: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const RP13_KV_ROWS: { label: string; value: string; tone?: RpTone }[] = [
  { label: "Customer health", value: "support contact is a cohort signal · 11.2% in the lapsed cohort", tone: "ai" },
  { label: "Rooms", value: "threads attach as evidence · never as findings on their own", tone: "ok" },
  { label: "Campaigns", value: "a reply is not a campaign metric and never enters one", tone: "ok" },
  { label: "Leakage map", value: "the fee theme became a Support finding on 21 March", tone: "warn" },
  { label: "Segments", value: "replying is never a definition · that is a hard rule above", tone: "risk" },
];

// ───────────────────────── ANSWERED (no dedicated frame · grounded in RP13's own "12,388 sent" figure) ─────────────────────────

export const RP_ANSWERED_STATS: { eyebrow: string; value: string; note: string; tone: RpTone }[] = [
  { eyebrow: "Answered", value: "12,388", note: "of 12,800 · 96.8%", tone: "ok" },
  { eyebrow: "Median time to an answer", value: "4 hours", note: "when somebody is watching", tone: "ok" },
  { eyebrow: "Fastest on record", value: "40 minutes", note: "the first reply, 24 Mar", tone: "ok" },
  { eyebrow: "Written by an agent, sent by a person", value: "12,388", note: "every one of them", tone: "ai" },
];

export const RP_ANSWERED_ROWS: { from: string; about: string; answeredIn: string; answeredInTone: RpTone; by: string }[] = [
  { from: "Customer 4,118,207", about: "Replied to the retry message, 24 Mar", answeredIn: "40 minutes", answeredInTone: "ok", by: "Ravi Mehta" },
  { from: "Customer 2,214,908", about: "Card declined on renewal, resolved", answeredIn: "1 hour", answeredInTone: "ok", by: "Kunle" },
  { from: "Customer 3,502,671", about: "Asked about a refund timeline", answeredIn: "3 hours", answeredInTone: "ok", by: "Amara Okeke" },
  { from: "Customer 1,882,340", about: "Held customer, asked if the company had left", answeredIn: "6 hours", answeredInTone: "warn", by: "Ifeoma Nwosu" },
  { from: "Customer 4,401,119", about: "Reactivation wave, wanted fewer messages", answeredIn: "9 hours", answeredInTone: "warn", by: "Ifeoma Nwosu" },
];

// ───────────────────────── People referenced ─────────────────────────

export const RP_PEOPLE = { ADA, AMARA, IFEOMA, KUNLE, RAVI };
