import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ACQUISITION_QUALITY, ADA, AMARA, IFEOMA, KUNLE, RAVI, REPEAT_DECAY, SAM, TUNDE, ZAINAB } from "@/pages/everyday/rooms/data";
import { PETER } from "@/pages/everyday/digest/data";
import type { Actor, PersonRef } from "@/pages/everyday/rooms/types";

/**
 * Knowledge · Recognition — sourced from
 * flolyt-figma-designs/Knowledge Screens/flolyt-recognition/flolyt-recognition/
 * (14 frames, RC01-RC14). Content transcribed from the export's own `rc.py`
 * generator source (plus shared `know.py` chrome), same "read the .py, don't
 * parse the SVG" approach as every prior Knowledge section. Fourth and final
 * section of the Knowledge group, after [[flolyt_community_rebuild]]. See
 * docs/build-tracker.md.
 */

export type RcTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const RC_TONE_CLASS: Record<RcTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const RC_CHIP_TONE: Record<RcTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const RC_KPI_TONE: Record<RcTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

function human(person: PersonRef): Actor {
  return { kind: "human", person };
}

const AGENT_ACQUISITION_QUALITY: Actor = { kind: "agent", agent: ACQUISITION_QUALITY };

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export type RecognitionState = "nothing" | "first" | "full";
export const RECOGNITION_STATE: RecognitionState = "full";

export const RC_TABS = ["Recognised", "Dissent", "Contributions", "Quiet work", "Yours"] as const;
export type RcTab = (typeof RC_TABS)[number];

// ───────────────────────── RC01 · NOTHING RECOGNISED ───────────────────────

export const RC01_ACT_ROWS: { kind: string; example: string; recognised: string; recognisedTone: RcTone; why: string; whyTone: RcTone }[] = [
  { kind: "Recording dissent", example: "Disagreeing in writing, before the result", recognised: "yes", recognisedTone: "ok", why: "it makes a decision checkable", whyTone: "muted" },
  { kind: "Closing a room at zero", example: "Looking, finding nothing, writing it down", recognised: "yes", recognisedTone: "ok", why: "it stops rediscovery", whyTone: "muted" },
  { kind: "Marking something unmeasurable", example: "Refusing to claim an unverifiable number", recognised: "yes", recognisedTone: "ok", why: "it protects every other number", whyTone: "muted" },
  { kind: "Writing a constraint", example: "The reason something cannot be done", recognised: "yes", recognisedTone: "ok", why: "it is the most cited thing here", whyTone: "muted" },
  { kind: "Recovering money", example: "₦62M from a card retry", recognised: "no", recognisedTone: "risk", why: "the ledger credits the metric", whyTone: "risk" },
  { kind: "Closing the most rooms", example: "A count of anything, by person", recognised: "never", recognisedTone: "risk", why: "it is a leaderboard", whyTone: "risk" },
];

export const RC01_NOTE =
  "Ravi's card retry recovered ₦62M against a real holdout and is the strongest result in the workspace. It is credited to involuntary churn, not to Ravi, and it will not appear here either. If recovery were recognised, everything else on this list would quietly become the work nobody does — starting with marking things unmeasurable.";

// ───────────────────────── RC02 · THE FIRST RECOGNITION ────────────────────

export const RC02_QUOTE = {
  text: "Amara refused to withhold an apology from 310 people in order to measure the other 3,100.",
  source: "Recognised by Ada Obi · 18 August · the act cost the workspace a causal figure and ₦9M stayed unattributable",
};

export const RC02_STATS: { eyebrow: string; value: string; note: string; tone: RcTone }[] = [
  { eyebrow: "What it cost", value: "a measurement", note: "₦9M · unattributable, forever", tone: "warn" },
  { eyebrow: "What it protected", value: "310 people", note: "who were owed a refund", tone: "ok" },
  { eyebrow: "Recognised by", value: "Ada Obi", note: "with a written reason", tone: "ai" },
  { eyebrow: "Points, score or rank", value: "None", note: "there is no such thing here", tone: "muted" },
];

export const RC02_WHY_KV: { label: string; value: string; tone?: RcTone }[] = [
  { label: "It is the clearest possible case", value: "a person chose the customers over the number, on the day", tone: "ok" },
  { label: "It is invisible everywhere else", value: "the ledger shows ₦9M unattributable and no reason why", tone: "warn" },
  { label: "It would score badly", value: "in any system counting attributable recovery, this is a loss", tone: "risk" },
  { label: "It set a precedent", value: "no experiment since has proposed withholding something owed", tone: "ok" },
  { label: "It is not a policy", value: "she decided · a rule would have taken the decision away from her", tone: "ai" },
];

export const RC02_NOTE =
  "₦9M sits in the value ledger as money that moved and can never be attributed, because Amara would not hold 310 people back from an apology they were owed. Every other section in this product would record that as a gap. This is the only screen where it reads as the right call, which is the entire reason the section exists.";

// ───────────────────────── RC03 · RECOGNISED ────────────────────────────────

export const RC03_STATS: { eyebrow: string; value: string; note: string; tone: RcTone }[] = [
  { eyebrow: "Recognised this quarter", value: "34", note: "by 9 people", tone: "num" },
  { eyebrow: "For closing something at zero", value: "15", note: "the largest group", tone: "ok" },
  { eyebrow: "For recording dissent", value: "6", note: "two of which were wrong", tone: "ai" },
  { eyebrow: "For recovering money", value: "0", note: "and there is no way to", tone: "muted" },
];

export type RecognisedRow = {
  id: string;
  what: string;
  who: Actor;
  why: string;
  when: string;
  cost: string;
  costTone: RcTone;
  /** Only "Marked Accra unmeasurable rather than claiming it" has a wired action — opens the Remove modal (RC12). */
  rowAction?: "remove";
};

export const RECOGNISED_ROWS: RecognisedRow[] = [
  { id: "amara-apology", what: "Refused to withhold an apology from 310 people", who: human(AMARA), why: "Chose the customers over the measurement", when: "today", cost: "a causal figure", costTone: "warn" },
  { id: "ravi-uk-latency", what: "Closed UK checkout latency at ₦0", who: human(RAVI), why: "Real, measured, and not worth fixing", when: "22 Aug", cost: "nothing", costTone: "muted" },
  { id: "tunde-dissent", what: "Recorded dissent on the reactivation offer", who: human(TUNDE), why: "Disagreed in writing before the result", when: "2 Aug", cost: "being wrong in public", costTone: "warn" },
  { id: "ifeoma-constraint", what: "Wrote the push-frequency constraint", who: human(IFEOMA), why: "Cited four times · saves three weeks each", when: "17 Mar", cost: "nothing", costTone: "muted" },
  { id: "kunle-accra", what: "Marked Accra unmeasurable rather than claiming it", who: human(KUNLE), why: "GHS 380k left unattributed", when: "9 Jul", cost: "a number he could have kept", costTone: "warn", rowAction: "remove" },
  { id: "zainab-onboarding", what: "Withdrew the ₦188M onboarding figure", who: human(ZAINAB), why: "Its window overlapped the release", when: "today", cost: "₦24M off her own stage", costTone: "risk" },
];

export const RC03_NOTES = {
  zeroPct:
    "Twenty-one of forty-one closed rooms produced no money. A company where nobody is recognised for that is a company where rooms stay open until they produce a figure, and the figures stop meaning anything about a quarter later. This is the count Ada checks first.",
  noOrder:
    "No score, no ranking, no most-recognised person and no total per team. It is a list of acts with names attached, in the order they occurred, and it cannot be sorted into anything else — because the first thing any ordering would do is tell people which acts are worth the most.",
};

// ───────────────────────── RC04 · WHY THERE IS NO LEADERBOARD ──────────────

export const RC04_CARDS: { k: string; b: string; t: string; f: string; acc: "muted" | "risk" | "ai" }[] = [
  { k: "What a leaderboard would show", b: "Ravi, ₦93M", acc: "muted", t: "Recovered money, by person, this quarter. Available today from the value ledger, sortable, and immediately the most-read screen in the product.", f: "asked for three times" },
  { k: "What would happen within a quarter", b: "Nobody closes at zero", acc: "risk", t: "Fifteen rooms closed with nothing this quarter. A ranked recovery column makes each of those a loss, so rooms stay open until they produce a number.", f: "the whole failure mode" },
  { k: "What is here instead", b: "34 acts, no order", acc: "ai", t: "Named people, written reasons, in the order they happened. Impossible to be top of, and impossible to be bottom of either.", f: "and no totals per person" },
];

export const RC04_RANKING_ROWS: { rankedBy: string; winner: string; lesson: string; offered: string; offeredTone: RcTone }[] = [
  { rankedBy: "Money recovered", winner: "Whoever owned the biggest stage", lesson: "Own a big stage · avoid small ones", offered: "no", offeredTone: "risk" },
  { rankedBy: "Rooms closed", winner: "Whoever closes fastest", lesson: "Close early · do not reopen", offered: "no", offeredTone: "risk" },
  { rankedBy: "Learnings written", winner: "Whoever writes most", lesson: "Write many · say little", offered: "no", offeredTone: "risk" },
  { rankedBy: "Citations received", winner: "Whoever wrote earliest", lesson: "Be early · never be superseded", offered: "no", offeredTone: "risk" },
  { rankedBy: "Recognitions received", winner: "Whoever is most visible", lesson: "Be seen · avoid quiet work", offered: "no", offeredTone: "risk" },
  { rankedBy: "Nothing", winner: "Nobody", lesson: "That these acts are worth doing", offered: "this", offeredTone: "ok" },
];

export const RC04_NOTES = {
  fifthRow:
    "Even a count of recognitions per person turns this into a game, and the winning strategy is being noticed rather than being useful. There is no per-person total anywhere in this section — not on a profile, not in a settings screen, not in an export — and the reason is written here rather than assumed.",
  threeAsked:
    "Ada wanted to know who to promote. Ravi wanted to know whether Finance was pulling its weight. Tunde wanted to know why Sales never appears anywhere. The first two are answered by reading thirty-four acts with names on them. The third one is answered, and the answer is uncomfortable.",
};

// ───────────────────────── RC05 · DISSENT ───────────────────────────────────

export const AGENT_ACTOR: Actor = { kind: "agent", agent: REPEAT_DECAY };

export type DissentRow = {
  dissent: string;
  who: Actor;
  when: string;
  turnedOut: string;
  turnedOutTone: RcTone;
  keptBecause: string;
  recognised: string;
  recognisedTone: RcTone;
};

export const DISSENT_ROWS: DissentRow[] = [
  { dissent: "A 20% offer will beat fee transparency", who: human(TUNDE), when: "2 Aug", turnedOut: "wrong", turnedOutTone: "warn", keptBecause: "Being wrong once is information", recognised: "yes", recognisedTone: "ok" },
  { dissent: "The discount learning should not apply to new markets", who: human(KUNLE), when: "Jun", turnedOut: "partly right", turnedOutTone: "ok", keptBecause: "It scoped a learning correctly", recognised: "yes", recognisedTone: "ok" },
  { dissent: "Four weeks is too short to read a signup change", who: human(TUNDE), when: "May", turnedOut: "withdrawn", turnedOutTone: "muted", keptBecause: "He checked and withdrew it himself", recognised: "yes", recognisedTone: "ok" },
  { dissent: "The UK latency is worth fixing", who: human(ZAINAB), when: "22 Aug", turnedOut: "unresolved", turnedOutTone: "warn", keptBecause: "A revisit condition exists because of it", recognised: "yes", recognisedTone: "ok" },
  { dissent: "Wave three should be split into two sends", who: AGENT_ACTOR, when: "today", turnedOut: "refused", turnedOutTone: "muted", keptBecause: "An agent may argue and may not decide", recognised: "no · not a person", recognisedTone: "muted" },
];

export const RC05_NOTES = {
  tundeWrong:
    "He said an offer would beat telling people what changed. Wave one came back at 18.2% with no offer at all. His dissent is checked automatically at close, marked as not borne out, and his original wording is kept — and he is recognised for it, because a workspace where being wrong once is expensive is a workspace where nobody writes their objection down.",
  lastRowAgent:
    "Repeat & Decay argued that wave three should be split into two sends of 26,000 to fit under the standing authority. It was refused, correctly, and the reasoning is kept and will be cited. Recognition is for people making judgements they could be wrong about in front of colleagues, which is not what an agent is doing.",
};

// ───────────────────────── RC06 · CONTRIBUTIONS ─────────────────────────────

export type ContributionRow = {
  written: string;
  who: Actor;
  cited: string;
  citedTone: RcTone;
  saves: string;
  kind: string;
  kindTone: RcTone;
};

export const CONTRIBUTION_ROWS: ContributionRow[] = [
  { written: "Push frequency cannot be held back per customer", who: human(IFEOMA), cited: "4", citedTone: "ok", saves: "Three weeks, each time", kind: "constraint", kindTone: "ok" },
  { written: "Guest orders cannot be joined to a customer", who: AGENT_ACQUISITION_QUALITY, cited: "9", citedTone: "ok", saves: "A wasted cohort design", kind: "constraint", kindTone: "ok" },
  { written: "Discounting the first order buys volume that does not repeat", who: human(TUNDE), cited: "4", citedTone: "ok", saves: "A discount, four times", kind: "validated", kindTone: "ok" },
  { written: "“Discount” has three meanings here", who: human(RAVI), cited: "6", citedTone: "ok", saves: "An argument, six times", kind: "definition", kindTone: "ai" },
  { written: "Hold lists are not enforced at send", who: human(IFEOMA), cited: "1", citedTone: "num", saves: "A contaminated experiment", kind: "constraint", kindTone: "ok" },
  { written: "Ghana has no baseline until 90 days pass", who: human(KUNLE), cited: "3", citedTone: "ok", saves: "A fortnight in a new market", kind: "constraint", kindTone: "ok" },
];

export const RC06_NOTES = {
  mostCited:
    "Ravi wrote down that “discount” means a code, a price change or a credit depending on who is speaking, after a meeting where three people meant three things. Six citations, no evidence behind it, and it is not a finding. The most valuable contribution to a company's memory is often a definition, and no metric anybody would design would ever surface that.",
  notAScore:
    "They sit next to the names because they are the closest thing available to evidence that a line was useful. They are not summed per person, not compared, and not exportable as a column. Ifeoma has two entries here and Tunde one, and that is not a fact about either of them.",
};

// ───────────────────────── RC07 · QUIET WORK ────────────────────────────────

export type QuietWorkRow = {
  what: string;
  who: Actor | null;
  whoLabel?: string;
  howNoticed: string;
  appearsElsewhere: string;
  appearsElsewhereTone: RcTone;
  recognised: string;
  recognisedTone: RcTone;
};

export const QUIET_WORK_ROWS: QuietWorkRow[] = [
  { what: "Answered nine questions in rooms from memory", who: human(PETER), howNoticed: "He is the only person who answered them", appearsElsewhere: "no", appearsElsewhereTone: "risk", recognised: "yes", recognisedTone: "ok" },
  { what: "Closed fifteen rooms at ₦0 this quarter", who: null, whoLabel: "various", howNoticed: "The close-out reasons", appearsElsewhere: "as ₦0", appearsElsewhereTone: "warn", recognised: "yes · each", recognisedTone: "ok" },
  { what: "Read 2,436 unclassified support messages", who: human(AMARA), howNoticed: "The routing log", appearsElsewhere: "no", appearsElsewhereTone: "risk", recognised: "yes", recognisedTone: "ok" },
  { what: "Re-authenticated 41 times without a mistake", who: human(RAVI), howNoticed: "The approval log", appearsElsewhere: "no", appearsElsewhereTone: "risk", recognised: "no · it is the job", recognisedTone: "muted" },
  { what: "Covered Nairobi while Peter works his notice", who: human(KUNLE), howNoticed: "Nowhere · Ada noticed", appearsElsewhere: "no", appearsElsewhereTone: "risk", recognised: "yes", recognisedTone: "ok" },
];

export const RC07_NOTES = {
  fourthRow:
    "Approving forty-one sends carefully is the job, done well. Recognising it would make recognition a participation record and dilute every other row on this screen. The test applied is whether the act cost something — a number, a measurement, an admission, or time nobody was counting — and doing your job correctly, thankfully, does not.",
  peterRow:
    "The same nine questions appear in business memory as knowledge that exists only in one person. Here they appear as work he did for eleven months that no screen in this product ever showed. Both are true. Recognising it does not preserve it, and the handover session on Thursday might.",
};

// ───────────────────────── RC08 · WHO NEVER APPEARS ─────────────────────────

export const RC08_HERO = {
  label: "people with nothing recognised",
  big: "5 of 14",
  sub: "Four of them work in stages with no goals, no rooms and no owner. One is a question worth asking.",
  rightLabel: "teams with nothing",
  rightBig: "Sales",
  rightSub: "one entry, from Tunde",
};

export type AbsentRow = { person: string; team: string; entries: string; entriesTone: RcTone; workLooksLike: string; reading: string; readingTone: RcTone };

export const ABSENT_ROWS: AbsentRow[] = [
  { person: "Sam Iyer", team: "Engineering", entries: "0", entriesTone: "warn", workLooksLike: "41 obligations, 14 overdue", reading: "everything blocks on him, nothing credits him", readingTone: "risk" },
  { person: "Tunde Bakare", team: "Sales", entries: "2", entriesTone: "num", workLooksLike: "Two dissents, one wrong, one withdrawn", reading: "he argues in writing more than anybody", readingTone: "ok" },
  { person: "Four in Acquire and Expand", team: "Sales", entries: "0", entriesTone: "warn", workLooksLike: "No rooms, no learnings, no closes", reading: "their stages produce fewer decisions", readingTone: "warn" },
  { person: "Peter Kariuki", team: "Customer Success", entries: "1", entriesTone: "num", workLooksLike: "Nine answers, none written down", reading: "recognised four days before leaving", readingTone: "risk" },
];

export const RC08_NOTES = {
  sam:
    "Six blocked figures, five blocked playbooks, four overdue instrumentation requests and two constraints that only he can clear. None of that is an act this section can see, because delivering an obligation is doing your job and being unable to deliver forty-one of them is not an act at all. It is the clearest limitation of this design and it is stated here rather than defended.",
  absenceNotEvidence:
    "Four people in Acquire and Expand have nothing recognised, and the honest reading is that their stages generate fewer decisions in a quarter, not that they contributed less. If this list were sorted or exported it would become a performance record within a week, so it is neither, and it exists only so that the gap is visible to whoever is looking at it.",
};

// ───────────────────────── RC09/RC10 · RECOGNISE SOMEBODY ──────────────────

export const RC09_ACT = {
  title: "Zainab withdrew the ₦188M onboarding figure after finding the window overlapped the release",
  detail: "Activate · today · the figure is restated at ₦164M and eleven pack recipients were told",
};

export const RC09_KIND_ROWS: { kind: string; means: string; thisOne: string; thisOneTone: RcTone; count: string }[] = [
  { kind: "Chose accuracy over a number", means: "Gave up a figure they could have kept", thisOne: "selected", thisOneTone: "ai", count: "7" },
  { kind: "Closed something at zero", means: "Looked, found nothing, wrote it down", thisOne: "", thisOneTone: "muted", count: "15" },
  { kind: "Recorded dissent", means: "Disagreed in writing, before the result", thisOne: "", thisOneTone: "muted", count: "6" },
  { kind: "Wrote something others use", means: "A constraint, a learning, a definition", thisOne: "", thisOneTone: "muted", count: "6" },
  { kind: "Did the job well", means: "Not offered · this is not a participation record", thisOne: "never", thisOneTone: "risk", count: "—" },
];

export const RC09_NOTE =
  "The onboarding rewrite is the largest figure in Activate and she is the person who found the flaw in it. Nothing in this product would have caught it, nobody was asking, and the value ledger simply reads ₦24M lower than it did this morning. That is the shape of act this section is for.";

export const RC10_FIELD_ROWS: { field: string; value: string; required: string; why: string }[] = [
  { field: "What they did", value: "Withdrew the ₦188M onboarding figure and restated it", required: "yes", why: "Vague praise is worse than none" },
  { field: "What it cost them", value: "₦24M off Activate's contribution · her own stage", required: "yes", why: "The cost is the reason it is worth recognising" },
  { field: "What it protected", value: "The ledger, and the eleven people holding the old figure", required: "yes", why: "So the act reads as a decision, not a mistake" },
  { field: "Where anybody can check it", value: "The restatement log · today, 11:40", required: "yes", why: "Recognition without evidence is a compliment" },
  { field: "Who is recognising it", value: "You · your name is on it and cannot be removed", required: "yes", why: "Anonymous praise is a rating" },
];

export const RC10_NOTES = {
  noEmptyCost:
    "The field will not accept an empty cost, and “nothing” is a valid answer for exactly two kinds of act — writing something others use, and closing at zero. For everything else, if nothing was given up, the act was probably just work done well, and there is a different word for that.",
  visibleNoTotal:
    "It shows on the recognised list, in the order it happened. It does not appear on a profile, in a report, in an export, or in any count per person or per team. Ada will read it in the Friday digest, and in three months it will be the same single line it is today.",
};

// ───────────────────────── RC11 · YOURS (lens) ──────────────────────────────

export const RC11_LENS = {
  name: "Amara Okeke",
  team: "Support",
  sub: "Support · 7 rooms",
  body: "Showing what has been recognised about your work. There is no total, no rank and no comparison with anybody else, on this screen or any other.",
};

export type YourRecognitionRow = { what: string; recognisedBy: string; when: string; why: string; cost: string; costTone: RcTone };

export const YOUR_RECOGNITION_ROWS: YourRecognitionRow[] = [
  { what: "Refused to withhold an apology from 310 people", recognisedBy: "Ada", when: "today", why: "Chose the customers over the measurement", cost: "a causal figure", costTone: "warn" },
  { what: "Named the fee as the contact driver on 21 March", recognisedBy: "Ada", when: "2 Aug", why: "Correct 131 days before anybody else", cost: "nothing", costTone: "muted" },
  { what: "Moved the Lagos refunds to same day", recognisedBy: "Ravi", when: "21 Mar", why: "Changed the playbook after watching one batch", cost: "nothing", costTone: "muted" },
  { what: "Read 2,436 unclassified messages this month", recognisedBy: "Ada", when: "Aug", why: "Work no screen in this product shows", cost: "time nobody counts", costTone: "warn" },
];

export const RC11_NOTES = {
  namingFee:
    "Amara's team reclassified the contact driver on 21 March, fourteen days after the release. It stayed inside Support until 2 August because there was no destination for a thing one stage sees that belongs to another. She was right, early, and alone, and the routing gap is the reason that was worth ₦1.08B rather than ₦28M.",
  noNumber:
    "No count, no streak, no total, no comparison with the other thirteen people. Four things somebody wrote down about work you did, in the order they happened. If this page had a figure at the top, everything else in this section would eventually be arranged to move it.",
};

// ───────────────────────── RC12 · REMOVE A RECOGNITION (modal) ─────────────

export const RC12_PRESET = {
  subject: "Marked Accra unmeasurable rather than claiming it",
  subjectDetail: "Recognised 9 July by Ada Obi · Kunle Ade · GHS 380k",
  options: [
    { label: "The facts were wrong", sub: "he did claim it, or somebody else did the work", on: true, blocked: false },
    { label: "They asked for it to be removed", sub: "always available, no reason needed", on: false, blocked: false },
    { label: "It was not significant enough", sub: "not offered · that is a judgement about a person", on: false, blocked: true },
    { label: "The outcome turned out badly", sub: "not offered · the act is what was recognised", on: false, blocked: true },
  ],
  warningTitle: "The fourth reason is the one that would make this section useless",
  warningBody:
    "Tunde's dissent was wrong and stays recognised. If recognition could be withdrawn when things turn out badly, nobody would write an objection down again.",
  closingNote:
    "Some people find it uncomfortable to be named, and that is reason enough. The second option needs no typed reason and no approval, and the row disappears from every screen — which is the one deletion this product allows anywhere.",
};

// ───────────────────────── RC13 · SETTINGS ───────────────────────────────────

export const RC13_RULE_ROWS: { rule: string; currently: string; currentlyTone: RcTone; who: string; canChange: boolean; state: string; stateTone: "on" | "off" }[] = [
  { rule: "Recognition names an act, a cost and evidence", currently: "34", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "The person recognising is named", currently: "34", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Anybody may remove their own", currently: "2 removed", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Recognition survives a bad outcome", currently: "1 case", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Who may recognise somebody", currently: "anyone", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "on" },
  { rule: "Shown in the Friday digest", currently: "on", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "on" },
  { rule: "A count or total per person", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "off" },
  { rule: "Ranking, sorting or leaderboards", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "off" },
  { rule: "Export to a performance system", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "off" },
  { rule: "Recognising recovered money", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "off" },
  { rule: "Agents recognising people", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "off" },
];

export const RC13_NOTE =
  "Everything else here survives only as long as this cannot become an input to a review. The moment thirty-four acts can be pulled into a performance tool, closing a room at zero acquires a price, and the fifteen people who did it this quarter start weighing it. There is no API, no export and no integration, on any plan.";

export const RC13_BAD_AT_ROWS: { label: string; value: string; tone: RcTone }[] = [
  { label: "Telling you who to promote", value: "read the acts · there is no shortcut and there should not be", tone: "warn" },
  { label: "Showing effort", value: "Sam has 41 obligations and nothing recognised · stated on its own screen", tone: "risk" },
  { label: "Covering everybody", value: "5 of 14 people have nothing, and absence means nothing", tone: "warn" },
  { label: "Being complete", value: "it holds what somebody noticed · quiet work stays mostly quiet", tone: "muted" },
  { label: "Being motivating", value: "no streaks, no badges, no nudges · it is a record, not a mechanism", tone: "ai" },
];

export { ACQUISITION_QUALITY, ADA, AMARA, IFEOMA, KUNLE, PETER, RAVI, REPEAT_DECAY, SAM, TUNDE, ZAINAB };
