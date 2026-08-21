import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";

/**
 * Knowledge · Community — sourced from
 * flolyt-figma-designs/Knowledge Screens/flolyt-community/flolyt-community/
 * (14 frames, CM01-CM14). Content transcribed from the export's own `cm.py`
 * generator source (plus shared `know.py` chrome), same "read the .py, don't
 * parse the SVG" approach as every prior Knowledge section. Third section of
 * the Knowledge group, after [[flolyt_playbooks_rebuild]]. See
 * docs/build-tracker.md.
 */

export type CmTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const CM_TONE_CLASS: Record<CmTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const CM_CHIP_TONE: Record<CmTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const CM_KPI_TONE: Record<CmTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export type CommunityState = "not-connected" | "first" | "full";
export const COMMUNITY_STATE: CommunityState = "full";

export const CM_TABS = ["Methods", "Constraints", "Questions", "What leaves", "Yours"] as const;
export type CmTab = (typeof CM_TABS)[number];

// ───────────────────────── CM01 · NOT CONNECTED ────────────────────────────

export const CM01_TRAVEL_ROWS: { kind: string; example: string; travels: string; travelsTone: CmTone; why: string; whyTone: CmTone }[] = [
  { kind: "A method", example: "Retry failed cards at 09:00 local, hold back 10%", travels: "yes", travelsTone: "ok", why: "it is a way of doing something", whyTone: "muted" },
  { kind: "A constraint", example: "Push frequency cannot be held back per customer", travels: "yes", travelsTone: "ok", why: "it is a fact about a system", whyTone: "muted" },
  { kind: "A question", example: "How do you measure referral revenue?", travels: "yes", travelsTone: "ok", why: "it is a request for help", whyTone: "muted" },
  { kind: "A result", example: "That method recovered ₦62M here", travels: "never", travelsTone: "risk", why: "it is your business", whyTone: "risk" },
  { kind: "A rate", example: "Our repeat rate is 27.2%", travels: "never", travelsTone: "risk", why: "it becomes a benchmark", whyTone: "risk" },
  { kind: "A cohort or a customer", example: "Anything about a person", travels: "never", travelsTone: "risk", why: "it is not yours to share", whyTone: "risk" },
];

export const CM01_NOTE =
  "Once a result travels, somebody computes an average, and an average across companies is an industry benchmark — the thing Benchmarks refuses on every screen because nobody can re-derive it and it sits in the same column as a figure measured against a real holdout. Methods can be adopted and tested here. Numbers cannot be borrowed.";

// ───────────────────────── CM02 · THE FIRST THING SHARED ───────────────────

export const CM02_QUOTE = {
  text: "Push frequency cannot be held back per customer, so cadence changes cannot be measured.",
  source: "Shared by Ada Obi · 18 August · a constraint, not a result · nothing about customers left with it",
};

export const CM02_STATS: { eyebrow: string; value: string; note: string; tone: CmTone }[] = [
  { eyebrow: "What left", value: "34 words", note: "and nothing else", tone: "ok" },
  { eyebrow: "What was stripped", value: "3 things", note: "market, numbers, the room", tone: "ok" },
  { eyebrow: "Companies who have hit this", value: "27 of 88", note: "before it was shared", tone: "warn" },
  { eyebrow: "Adopted since", value: "6", note: "as a precondition in their own playbooks", tone: "ok" },
];

export const CM02_REMOVED_ROWS: { inWorkspace: string; whatLeft: string; whatLeftTone: CmTone; why: string }[] = [
  { inWorkspace: "Unsubscribes fell 41% after the change", whatLeft: "removed", whatLeftTone: "risk", why: "A result · it is yours, and it was confounded anyway" },
  { inWorkspace: "Room: Weekend push fatigue · Ifeoma Nwosu", whatLeft: "removed", whatLeftTone: "risk", why: "A person and a room · neither is public" },
  { inWorkspace: "310,000 customers on the push list", whatLeft: "removed", whatLeftTone: "risk", why: "A number about your customers" },
  { inWorkspace: "Push frequency is a global setting, not per-customer", whatLeft: "kept", whatLeftTone: "ok", why: "A fact about how a system works · the useful half" },
];

export const CM02_NOTE =
  "The cadence room claimed ₦0, could not be measured, and produced a constraint that twenty-seven other companies have run into without writing down. What travels well between companies is almost never the win — it is the shape of the wall you hit, which is the same wall in most of them.";

// ───────────────────────── CM03 · COMMUNITY (Methods tab) ──────────────────

export const CM03_STATS: { eyebrow: string; value: string; note: string; tone: CmTone }[] = [
  { eyebrow: "Companies connected", value: "88", note: "none of them named to you", tone: "num" },
  { eyebrow: "Methods shared", value: "214", note: "with no results attached", tone: "ok" },
  { eyebrow: "You have adopted", value: "6", note: "and shared 1", tone: "warn" },
  { eyebrow: "Adopted here that worked", value: "2 of 6", note: "measured on your own customers", tone: "warn" },
];

export type MethodRow = {
  id?: string;
  method: string;
  adoptedBy: string;
  adoptedByTone: CmTone;
  stillInUse: string;
  stillInUseTone: CmTone;
  needs: string;
  you: string;
  youTone: CmTone;
  /** Only "Ask support what people wrote in about first" has a wired action — opens the Adopt modal (CM11). */
  rowAction?: "adopt";
  /** Only "Tell lapsed customers what changed" links out — to the one built :id reference row (CM04). */
  detailHref?: string;
};

export const METHOD_ROWS: MethodRow[] = [
  { method: "Retry failed cards in local morning", adoptedBy: "61", adoptedByTone: "ok", stillInUse: "58", stillInUseTone: "ok", needs: "Card volume history, a timezone", you: "we wrote this", youTone: "ai" },
  { method: "Tell lapsed customers what changed, no offer", adoptedBy: "44", adoptedByTone: "ok", stillInUse: "41", stillInUseTone: "ok", needs: "A dated cause to point at", you: "adopted", youTone: "ok", detailHref: "/community/lapsed-what-changed" },
  { method: "Hold 10% of every send, always", adoptedBy: "38", adoptedByTone: "ok", stillInUse: "36", stillInUseTone: "ok", needs: "Somebody willing to leave money out", you: "adopted", youTone: "ok" },
  { method: "Same-day refund before an apology", adoptedBy: "31", adoptedByTone: "num", stillInUse: "29", stillInUseTone: "num", needs: "Nothing · it is a policy", you: "we do this", youTone: "muted" },
  { method: "Write the failure condition before sending", adoptedBy: "27", adoptedByTone: "num", stillInUse: "27", stillInUseTone: "ok", needs: "Nothing · it is a habit", you: "adopted", youTone: "ok" },
  { method: "Ask support what people wrote in about first", adoptedBy: "22", adoptedByTone: "num", stillInUse: "19", stillInUseTone: "num", needs: "A support queue somebody reads", you: "not adopted", youTone: "warn", rowAction: "adopt" },
  { method: "Prompt a second feature in week one", adoptedBy: "18", adoptedByTone: "num", stillInUse: "9", stillInUseTone: "warn", needs: "An owner for the onboarding stage", you: "not adopted", youTone: "warn" },
];

export const CM03_NOTES = {
  supportRow:
    "Twenty-two companies check what customers wrote in about before designing anything. Lagos Foods had 3,968 people describing the fee change in plain language from 11 March and connected it on 2 August. The method is free, needs nothing anybody has to build, and is sitting here unadopted.",
  dropoff:
    "The still-in-use column is the only quality signal in this section, and it is a weak one — it says a method survived contact with somebody's real customers, not that it works. There is no rating, no success rate and no average result, because those would all be numbers travelling between companies wearing a different hat.",
};

// ───────────────────────── CM04 · ONE SHARED METHOD ─────────────────────────

export const CM04_QUOTE = {
  text: "Tell lapsed customers the specific thing they complained about has been fixed. Do not attach an offer.",
  source: "Shared by a company you cannot see · adopted by 44 · in use by 41 · no results attached",
};

export const CM04_FIELD_ROWS: { field: string; says: string; present: string; presentTone: CmTone }[] = [
  { field: "The method", says: "Six steps, from cohort to close", present: "yes", presentTone: "ok" },
  { field: "What it needs", says: "A dated cause, a baseline, a reachable cohort over 5,000", present: "yes", presentTone: "ok" },
  { field: "What it does not work for", says: "General lapsed customers with no specific cause", present: "yes", presentTone: "ok" },
  { field: "How to measure it", says: "Hold back 10%, read at 18 days", present: "yes", presentTone: "ok" },
  { field: "What it recovered for them", says: "—", present: "never shared", presentTone: "risk" },
  { field: "Which company", says: "—", present: "never shared", presentTone: "risk" },
  { field: "Their market or size", says: "—", present: "never shared", presentTone: "risk" },
];

export const CM04_NOTE =
  "Forty-four companies adopted it and forty-one still use it, which is the only evidence available and is not a result. What you can do is run it here, against your own holdout, on your own customers, and find out — which is what Lagos Foods did in August at 18.2% against 6.2% held. That figure belongs to this workspace and is not going back.";

export const CM04_ADOPTED_KV: { label: string; value: string; tone?: CmTone }[] = [
  { label: "Adopted", value: "2 August · as a fork with zero runs, not with their record" },
  { label: "Run", value: "three waves · wave one contaminated on 14 August", tone: "warn" },
  { label: "Result here", value: "18.2% against 6.2% held · yours, and staying here", tone: "ok" },
  { label: "Shared back", value: "nothing · the result does not travel and neither does the number", tone: "ok" },
  { label: "What could be shared back", value: "the hold-list constraint the resend taught you", tone: "warn" },
];

// ───────────────────────── CM05 · CONSTRAINTS ──────────────────────────────

export type ConstraintRow = {
  constraint: string;
  companies: string;
  companiesTone: CmTone;
  blocks: string;
  haveYouHit: string;
  haveYouHitTone: CmTone;
  anyoneSolved: string;
  anyoneSolvedTone: CmTone;
};

export const CONSTRAINT_ROWS: ConstraintRow[] = [
  { constraint: "Guest orders cannot be joined to a customer", companies: "61", companiesTone: "risk", blocks: "Any cohort measurement on those orders", haveYouHit: "yes · 42,000", haveYouHitTone: "risk", anyoneSolved: "4 · one field", anyoneSolvedTone: "warn" },
  { constraint: "Push frequency is global, not per-customer", companies: "27", companiesTone: "warn", blocks: "Measuring any cadence change", haveYouHit: "yes", haveYouHitTone: "risk", anyoneSolved: "2 · rebuilt it", anyoneSolvedTone: "warn" },
  { constraint: "Referral revenue is never instrumented by default", companies: "52", companiesTone: "risk", blocks: "Knowing what advocacy is worth", haveYouHit: "yes", haveYouHitTone: "risk", anyoneSolved: "7", anyoneSolvedTone: "warn" },
  { constraint: "COGS lives in a system nobody connects", companies: "48", companiesTone: "risk", blocks: "Every margin figure", haveYouHit: "yes · since 12 Jan", haveYouHitTone: "risk", anyoneSolved: "11", anyoneSolvedTone: "ok" },
  { constraint: "A new market has no baseline for 90 days", companies: "44", companiesTone: "warn", blocks: "Any experiment in a new market", haveYouHit: "yes · Ghana", haveYouHitTone: "warn", anyoneSolved: "0 · nobody can", anyoneSolvedTone: "muted" },
  { constraint: "Hold lists are not enforced at send", companies: "9", companiesTone: "warn", blocks: "Any holdout, silently", haveYouHit: "yes · 14 Aug", haveYouHitTone: "risk", anyoneSolved: "6", anyoneSolvedTone: "ok" },
];

export const CM05_NOTES = {
  sixForSix:
    "Six for six. These are not exotic problems — they are the same handful of gaps in almost every company that sells to consumers, and the last one was learned here three days ago by an incident. Eleven companies have connected a COGS source and this one has been asking since 28 July.",
  oneUnsolved:
    "A new market has no baseline for ninety days because ninety days have to pass. Forty-four companies have hit it and none of them found a way around it, which is worth knowing before somebody spends a fortnight trying. Community is most useful when it tells you that something is genuinely impossible rather than that you are doing it wrong.",
};

// ───────────────────────── CM06 · QUESTIONS ─────────────────────────────────

export type QuestionRow = {
  question: string;
  askedBy: string;
  askedByTone: CmTone;
  answers: string;
  answersTone: CmTone;
  age: string;
  yours: string;
  yoursTone: CmTone;
  useful: string;
  usefulTone: CmTone;
};

export const QUESTION_ROWS: QuestionRow[] = [
  { question: "How do you measure referral revenue without attribution?", askedBy: "a company", askedByTone: "muted", answers: "14", answersTone: "ok", age: "3 mo", yours: "you asked this", yoursTone: "ai", useful: "11 marked useful", usefulTone: "ok" },
  { question: "What do you do when a holdout gets contaminated?", askedBy: "you", askedByTone: "ai", answers: "6", answersTone: "num", age: "3 days", yours: "yours", yoursTone: "ai", useful: "4 marked useful", usefulTone: "num" },
  { question: "How long before a new market can be experimented in?", askedBy: "a company", askedByTone: "muted", answers: "22", answersTone: "ok", age: "8 mo", yours: "", yoursTone: "muted", useful: "19 marked useful", usefulTone: "ok" },
  { question: "Does anybody successfully forecast churn by cohort?", askedBy: "a company", askedByTone: "muted", answers: "3", answersTone: "warn", age: "2 mo", yours: "", yoursTone: "muted", useful: "1 marked useful", usefulTone: "warn" },
  { question: "How do you get engineering to prioritise a data gap?", askedBy: "a company", askedByTone: "muted", answers: "31", answersTone: "ok", age: "5 mo", yours: "", yoursTone: "muted", useful: "28 marked useful", usefulTone: "ok" },
];

export const CM06_NOTES = {
  mostAnswered:
    "Thirty-one companies have answered how to get engineering to prioritise a data gap, and twenty-eight of those answers were marked useful. Every workspace in this community has a version of Sam Iyer with forty-one obligations and fourteen overdue. The hardest problem in revenue work is apparently not measurement — it is queueing.",
  yourQuestion:
    "Ifeoma asked it the morning after the resend, before deciding what to do about wave one. Four of the six answers say the same thing — restart rather than exclude — and two describe how they enforce hold lists at send. None of them contains a number, and all six were more useful than they would have been with one.",
};

// ───────────────────────── CM07 · WHAT LEAVES ───────────────────────────────

export const CM07_LEFT_ROWS: { what: string; when: string; approvedBy: string; stripped: string; visibleAs: string }[] = [
  { what: "Push frequency is global, not per-customer", when: "18 Aug", approvedBy: "Ada", stripped: "The 41% result, the room, the 310,000", visibleAs: "a constraint, unattributed" },
  { what: "How do you handle a contaminated holdout?", when: "15 Aug", approvedBy: "Ada", stripped: "The 1,204, the campaign, the ₦9.1M", visibleAs: "a question, unattributed" },
];

export const CM07_PEOPLE_BAR: { label: string; value: number; tone: CmTone }[] = [
  { label: "Stayed in this workspace", value: 1247, tone: "ok" },
  { label: "Shared · methods and constraints", value: 1, tone: "warn" },
  { label: "Shared · questions", value: 1, tone: "warn" },
];

export const CM07_NEVER_KV: { label: string; value: string; tone: CmTone }[] = [
  { label: "Any figure about your business", value: "recovered, at risk, rates, counts, currency amounts", tone: "risk" },
  { label: "Anything about a customer", value: "cohorts, segments, IDs, replies, orders", tone: "risk" },
  { label: "Your people's names", value: "the constraint left unattributed and stays that way", tone: "risk" },
  { label: "Your market or your size", value: "both are inferable from a benchmark and neither travels", tone: "risk" },
  { label: "Anything at all, automatically", value: "every share is a person approving specific words", tone: "ok" },
];

export const CM07_NOTE =
  "There is no automatic contribution, no anonymised telemetry and no opt-out-by-default sharing. Ada read both of these and approved the exact words. The community is 214 methods deep because 88 companies each did this a handful of times, which is slow and is the only version of it anybody should trust.";

// ───────────────────────── CM08 · WHAT THIS IS NOT ──────────────────────────

export const CM08_CARDS: { k: string; b: string; t: string; f: string; acc: "muted" | "risk" | "ai" }[] = [
  { k: "What people ask for", b: "How do we compare?", acc: "muted", t: "Eighty-eight companies, all using the same product, all measuring the same lifecycle. The average repeat rate would be one query away and would be on a slide by Friday.", f: "asked 6 times by this workspace" },
  { k: "Why it is not built", b: "Nobody could re-derive it", acc: "risk", t: "A community average would sit in the same column as a figure measured against a real holdout, with no way for anyone reading it in six months to tell which was which.", f: "the same argument as Benchmarks" },
  { k: "What is offered instead", b: "Methods and walls", acc: "ai", t: "How other companies do things, and what stopped them. Both can be tested on your own customers, which is the only way anything becomes true here.", f: "214 methods · 6 constraints" },
];

export const CM08_FEATURE_ROWS: { feature: string; askedFor: string; askedForTone: CmTone; why: string; whereAnswered: string }[] = [
  { feature: "Industry average repeat rate", askedFor: "6 times", askedForTone: "warn", why: "It is a benchmark with a friendlier name", whereAnswered: "Benchmarks · your own past" },
  { feature: "A percentile for your workspace", askedFor: "4 times", askedForTone: "warn", why: "Needs a peer set nobody can define", whereAnswered: "Benchmarks · market against market" },
  { feature: "“Companies like you also did X”", askedFor: "3 times", askedForTone: "warn", why: "Requires knowing your size and market", whereAnswered: "Community · methods, unfiltered" },
  { feature: "A success rate on each shared method", askedFor: "9 times", askedForTone: "risk", why: "It is 88 results averaged into one number", whereAnswered: "your own holdout" },
  { feature: "Naming the companies", askedFor: "2 times", askedForTone: "muted", why: "Nobody would share a constraint again", whereAnswered: "—" },
];

export const CM08_NOTES = {
  fourthRow:
    "A success rate on a shared method looks like product quality rather than a benchmark. It is eighty-eight companies' results, measured differently, in different markets, averaged — and it would immediately become the reason to adopt something, replacing the only honest reason, which is running it here against a holdout and finding out.",
  lastRefusal:
    "If companies were named, nobody would publish a constraint, because a constraint is an admission that something in your business does not work. Twenty-seven companies said their push frequency is a global setting. Not one of them would have if their name were attached.",
};

// ───────────────────────── CM09/CM10 · SHARE ────────────────────────────────

export const CM09_CANDIDATE_ROWS: { from: string; kind: string; kindTone: CmTone; canShare: string; canShareTone: CmTone; whatGoes: string }[] = [
  { from: "Hold lists are not enforced at send", kind: "constraint", kindTone: "ok", canShare: "yes", canShareTone: "ok", whatGoes: "the 1,204, the campaign, the date" },
  { from: "Retry failed cards at 09:00 local", kind: "method", kindTone: "ok", canShare: "already shared", canShareTone: "muted", whatGoes: "—" },
  { from: "Fee transparency beats discounting", kind: "learning", kindTone: "warn", canShare: "as a method only", canShareTone: "warn", whatGoes: "both measurements and every figure" },
  { from: "Reactivation recovered 18.2% against 6.2%", kind: "result", kindTone: "risk", canShare: "never", canShareTone: "risk", whatGoes: "all of it · there is nothing left" },
  { from: "The lapsed cohort of 100,000", kind: "cohort", kindTone: "risk", canShare: "never", canShareTone: "risk", whatGoes: "all of it" },
];

export const CM09_NOTES = {
  thirdRow:
    "“Telling lapsed customers what changed works better than offering them a discount” can travel. The two measurements behind it cannot, and without them it is somebody's opinion arriving in another company's workspace — which is exactly the right weight for it there, because they have to test it on their own customers anyway.",
  fourthRow:
    "Somebody will want to share the 18.2%, because it is the most impressive thing this workspace has produced. The row is listed with “never” beside it and “all of it · there is nothing left” in the last column, which is a clearer answer than the option simply not existing.",
};

export const CM10_IN_WORKSPACE =
  "A resend built outside the play on 14 August reached 1,204 of the 10,000 customers held back from reactivation wave one, withdrawing a ₦9.1M provisional figure.";

export const CM10_WOULD_LEAVE =
  "Hold lists are enforced on the play rather than at send, so anything sent another way silently reaches held customers and the experiment cannot be read.";

export const CM10_STRIPPED_ROWS: { removed: string; why: string; reinstatable: string; reinstatableTone: CmTone }[] = [
  { removed: "1,204 and 10,000", why: "Counts about your customers", reinstatable: "no", reinstatableTone: "risk" },
  { removed: "₦9.1M", why: "A figure about your business", reinstatable: "no", reinstatableTone: "risk" },
  { removed: "14 August", why: "A date is a timeline somebody could join up", reinstatable: "no", reinstatableTone: "risk" },
  { removed: "Reactivation wave one", why: "Your campaign, your room", reinstatable: "no", reinstatableTone: "risk" },
  { removed: "Ifeoma Nwosu, Sam Iyer", why: "Your people", reinstatable: "no", reinstatableTone: "risk" },
  { removed: "Lagos Foods", why: "You · everything is unattributed", reinstatable: "optional · off", reinstatableTone: "warn" },
];

export const CM10_NOTE =
  "Six of eighty-eight companies attribute their contributions. The rest publish unattributed, and the constraint list is the reason — twenty-seven companies admitting their push frequency is a global setting is only possible because none of them is named. The toggle is offered because some companies want the credit, and it is off by default.";

// ───────────────────────── CM11 · ADOPT A METHOD (modal) ───────────────────

export const CM11_PRESET = {
  subject: "Ask support what people wrote in about first",
  subjectDetail: "Adopted by 22 · in use by 19 · no results attached",
  doesRows: [
    { label: "It becomes a playbook with zero runs", sub: "your record starts empty · theirs does not travel", tone: "ok" as CmTone },
    { label: "Its preconditions come with it", sub: "a support queue somebody reads · you have one", tone: "ok" as CmTone },
    { label: "It carries no result and no rating", sub: "nothing from the community is evidence here", tone: "warn" as CmTone },
    { label: "It will need two runs before it is a playbook", sub: "the same rule as anything else written here", tone: "warn" as CmTone },
  ],
  warningTitle: "You have 12,800 support messages and 31% of them describe one thing",
  warningBody:
    "This method would have surfaced the fee change in March. That is not a reason to believe it works — it is a reason to run it and find out on your own customers.",
  closingNote:
    "Twenty-two companies use this and not one of their outcomes comes with it. What arrives is the shape of the thing and the conditions it needs, and everything after that is measured here, on these customers, against a holdout of yours.",
};

// ───────────────────────── CM12 · REPORT BACK (modal) ───────────────────────

export const CM12_PRESET = {
  subject: "Prompt a second feature in week one",
  subjectDetail: "You adopted it in April · it has never run · nine of 18 have dropped it",
  options: [
    { label: "A precondition it does not state", sub: "it needs a stage owner · yours has had none for 214 days", on: true, blocked: false },
    { label: "That you stopped using it", sub: "a count only · it moves 18 to 17", on: false, blocked: false },
    { label: "That it did not work here", sub: "not offered · that is a result about your customers", on: false, blocked: true },
    { label: "How much it recovered or lost", sub: "not offered · under any setting", on: false, blocked: true },
  ],
  warningTitle: "A missing precondition is the most valuable thing you can send back",
  warningBody:
    "Nine companies dropped this method and none of them said why. “It needs somebody who owns the stage” explains all nine and costs you nothing to say.",
  closingNote:
    "“It did not work for us” is a result about your customers wearing a review's clothing, and thirty of those would become a success rate. A missing precondition is a fact about the method itself, travels safely, and is more useful to the next company than a star rating would be.",
};

// ───────────────────────── Yours tab ─────────────────────────────────────────
// Not a numbered CM frame on its own — assembled from CM12's own table (the
// three rows it shows: two in the modal's base table, one as the modal's
// fixed subject). Note a fidelity gap, transcribed rather than reconciled per
// the "SVG wins" rule: CM03's Methods table marks "Prompt a second feature in
// week one" as ("You" column) "not adopted", while CM12's own modal text says
// "You adopted it in April". Both are kept exactly as their own screen states
// them.

export type YourMethodRow = {
  id: string;
  method: string;
  adopted: string;
  runs: string;
  runsTone: CmTone;
  result: string;
  resultTone: CmTone;
  reportedBack: string;
  reportedBackTone: CmTone;
  /** Only "Prompt a second feature in week one" has a wired action — opens the Report back modal (CM12). */
  rowAction?: "report";
};

export const YOUR_METHOD_ROWS: YourMethodRow[] = [
  { id: "lapsed-what-changed", method: "Tell lapsed customers what changed", adopted: "2 Aug", runs: "3", runsTone: "num", result: "18.2% · yours", resultTone: "ok", reportedBack: "nothing", reportedBackTone: "muted" },
  { id: "hold-10-percent", method: "Hold 10% of every send, always", adopted: "Mar", runs: "5", runsTone: "num", result: "4 clean, 1 broken", resultTone: "warn", reportedBack: "nothing", reportedBackTone: "muted" },
  { id: "second-feature-week-one", method: "Prompt a second feature in week one", adopted: "Apr", runs: "0", runsTone: "muted", result: "—", resultTone: "muted", reportedBack: "nothing", reportedBackTone: "muted", rowAction: "report" },
];

// ───────────────────────── CM13 · SETTINGS ───────────────────────────────────

export const CM13_RULE_ROWS: { rule: string; currently: string; currentlyTone: CmTone; who: string; canChange: boolean; state: string; stateTone: "on" | "off" }[] = [
  { rule: "Nothing leaves without a person approving the words", currently: "2 shares", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Figures about your business never leave", currently: "—", currentlyTone: "muted", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Anything about a customer never leaves", currently: "—", currentlyTone: "muted", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Adopted methods arrive with no record", currently: "6 adopted", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Connected to the community", currently: "on", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "on" },
  { rule: "Who may share", currently: "Ada only", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "on" },
  { rule: "Attribute our contributions", currently: "off", currentlyTone: "neutral", who: "Ada", canChange: true, state: "off", stateTone: "off" },
  { rule: "Industry averages or percentiles", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "off" },
  { rule: "Success rates on shared methods", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "off" },
  { rule: "Automatic or anonymised contribution", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "off" },
];

export const CM13_NOTE =
  "Adopted methods become your playbooks the moment you take them, with your own record attached, so disconnecting costs you the library and none of your own work. That is deliberate: a community you cannot leave without losing something is a community that has taken hostages.";

export const CM13_CONNECTS_ROWS: { label: string; value: string; tone: CmTone }[] = [
  { label: "Business memory", value: "nothing crosses automatically · adopted methods arrive as playbooks", tone: "ai" },
  { label: "Playbooks", value: "an adopted method is a playbook with zero runs", tone: "ok" },
  { label: "Benchmarks", value: "refuses external figures · this section is how that stays true", tone: "risk" },
  { label: "Experiments", value: "the only place a shared method becomes evidence here", tone: "ok" },
  { label: "Data", value: "the constraint list is where most companies' gaps turn out to match", tone: "ai" },
];
