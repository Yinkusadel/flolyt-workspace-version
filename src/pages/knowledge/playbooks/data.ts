import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ADA, AMARA, IFEOMA, INVOLUNTARY_CHURN, KUNLE, RAVI } from "@/pages/everyday/rooms/data";
import type { PersonRef } from "@/pages/everyday/rooms/types";

/**
 * Knowledge · Playbooks — sourced from
 * flolyt-figma-designs/Knowledge Screens/flolyt-playbooks/flolyt-playbooks/
 * (16 frames, PB01-PB16). Content transcribed from the export's own `pb.py`
 * generator source (plus shared `know.py` chrome), same "read the .py, don't
 * parse the SVG" approach as every prior section. Second section of the
 * Knowledge group, after [[flolyt_business_memory_rebuild]]. See
 * docs/build-tracker.md.
 */

export type PbTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const PB_TONE_CLASS: Record<PbTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const PB_CHIP_TONE: Record<PbTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const PB_KPI_TONE: Record<PbTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export type PlaybooksState = "empty" | "first" | "full";
export const PLAYBOOKS_STATE: PlaybooksState = "full";

export const PB_TABS = ["Playbooks", "Track record", "Blocked", "Retired", "History"] as const;
export type PbTab = (typeof PB_TABS)[number];

// ───────────────────────── PB01 · NO PLAYBOOKS YET ─────────────────────────

export const PB01_RAN_ONCE_ROWS: {
  play: string;
  ran: string;
  result: string;
  resultTone: PbTone;
  repeatable: string;
  repeatableTone: PbTone;
  needs: string;
}[] = [
  { play: "Retry cards at 09:00 local", ran: "24 Mar", result: "₦62M · causal", resultTone: "ok", repeatable: "yes", repeatableTone: "ok", needs: "a market with card volume" },
  { play: "Discount withdrawal notice", ran: "19 Mar", result: "₦31M · causal", resultTone: "ok", repeatable: "yes", repeatableTone: "ok", needs: "a discount to withdraw" },
  { play: "Lagos refund and apology", ran: "7 Mar", result: "₦9M · unattributable", resultTone: "muted", repeatable: "yes", repeatableTone: "warn", needs: "something to apologise for" },
  { play: "Weekend cadence change", ran: "17 Mar", result: "unmeasurable", resultTone: "muted", repeatable: "no", repeatableTone: "risk", needs: "per-customer frequency · a constraint blocks it" },
  { play: "Onboarding rewrite", ran: "19 Feb", result: "₦188M · association", resultTone: "warn", repeatable: "once", repeatableTone: "warn", needs: "there is only one onboarding" },
];

export const PB01_NOTE =
  "The temptation is to write down what you intend to do and call it a method. Every row here worked or failed exactly once, which tells you very little — the retry could be a genuinely good design or a Nigerian accident. The second run in Kenya is what will decide, and that is the point at which this section starts having anything in it.";

// ───────────────────────── PB02 · THE FIRST PLAYBOOK ───────────────────────

export const PB02_HERO = {
  person: RAVI,
  title: "Retry at 09:00 worked twice, in two countries, and is now a playbook",
  body: "Nigeria recovered 45.5 points against a holdout in March. Kenya recovered 44.3 against its own holdout in August. Two markets, two controls, two answers within a point of each other.",
  highlight: "Ghana is the third market and the playbook refuses to run there, for a reason it states.",
};

export const PB02_STATS: { eyebrow: string; value: string; note: string; tone: PbTone }[] = [
  { eyebrow: "Runs", value: "2", note: "Nigeria and Kenya", tone: "ok" },
  { eyebrow: "Both against a holdout", value: "yes", note: "the reason it is trusted", tone: "ok" },
  { eyebrow: "Spread between them", value: "1.2 pts", note: "44.3 and 45.5", tone: "ok" },
  { eyebrow: "Markets it refuses", value: "1", note: "Ghana · no card baseline", tone: "warn" },
];

export const PB02_ADDS_ROWS: { label: string; value: string; tone: PbTone }[] = [
  { label: "Preconditions, written down", value: "90 days of card volume · a local timezone · a stored card", tone: "ok" },
  { label: "A record of everywhere it ran", value: "including where it did not work, if that happens", tone: "ok" },
  { label: "A refusal", value: "it will not run in a market that fails a precondition", tone: "warn" },
  { label: "A measurement built in", value: "a holdout is part of the playbook, not an option beside it", tone: "ok" },
  { label: "What it does not claim", value: "it fixes the retry, not the reason cards fail at midnight", tone: "warn" },
];

export const PB02_NOTE =
  "Kunle tried to run this in Ghana in July. It did not need a person to stop him — the playbook checked its own precondition, found no card volume baseline, and declined with the reason. A method that carries its conditions is the difference between reuse and cargo cult, and it is why Accra's reactivation ran without a baseline and this did not.";

// ───────────────────────── PB03 · ALL PLAYBOOKS ────────────────────────────

export const PB03_STATS: { eyebrow: string; value: string; note: string; tone: PbTone }[] = [
  { eyebrow: "Playbooks", value: "9", note: "written after a second run", tone: "num" },
  { eyebrow: "With a holdout built in", value: "4", note: "the rest measure weakly", tone: "warn" },
  { eyebrow: "Blocked somewhere right now", value: "3", note: "on a stated precondition", tone: "warn" },
  { eyebrow: "Retired", value: "2", note: "kept, readable, unrunnable", tone: "muted" },
];

export type PlaybookRow = {
  id: string;
  playbook: string;
  runs: string;
  runsTone: PbTone;
  best: string;
  bestTone: PbTone;
  worst: string;
  worstTone: PbTone;
  measurement: string;
  state: string;
  stateTone: PbTone;
  owner: string;
  /** Only the "Retry cards at 09:00 local" row has a wired action — opens the Run modal (PB11). */
  rowAction?: "run";
};

export const PLAYBOOK_ROWS: PlaybookRow[] = [
  { id: "retry-0900", playbook: "Retry cards at 09:00 local", runs: "2", runsTone: "ok", best: "+45.5 pts", bestTone: "ok", worst: "+44.3 pts", worstTone: "ok", measurement: "Holdout · built in", state: "in use", stateTone: "ai", owner: "Ravi", rowAction: "run" },
  { id: "withdraw-discount", playbook: "Withdraw a discount, tell people first", runs: "2", runsTone: "ok", best: "₦31M", bestTone: "ok", worst: "₦4M", worstTone: "num", measurement: "Holdout · built in", state: "in use", stateTone: "ai", owner: "Ravi" },
  { id: "reactivate-three-waves", playbook: "Reactivate in three waves", runs: "3", runsTone: "ok", best: "18.2% recovered", bestTone: "ok", worst: "contaminated", worstTone: "risk", measurement: "Holdout · built in", state: "in use", stateTone: "ai", owner: "Ifeoma" },
  { id: "refund-and-apologise", playbook: "Refund and apologise, same day", runs: "2", runsTone: "ok", best: "₦9M returned", bestTone: "muted", worst: "₦2M returned", worstTone: "muted", measurement: "None · by design", state: "in use", stateTone: "warn", owner: "Amara" },
  { id: "exclude-double-contacted", playbook: "Exclude the double-contacted before sending", runs: "6", runsTone: "ok", best: "cap breach avoided", bestTone: "ok", worst: "—", worstTone: "muted", measurement: "Not applicable", state: "in use", stateTone: "ai", owner: "Ada" },
  { id: "second-feature-day-three", playbook: "Prompt a second feature at day three", runs: "0", runsTone: "muted", best: "—", bestTone: "muted", worst: "—", worstTone: "muted", measurement: "Holdout · built in", state: "never run", stateTone: "warn", owner: "nobody" },
  { id: "reprice-local-margin", playbook: "Reprice a market on local margin", runs: "1", runsTone: "warn", best: "Unavailable", bestTone: "muted", worst: "—", worstTone: "muted", measurement: "Needs COGS", state: "blocked", stateTone: "risk", owner: "Ravi" },
  { id: "change-push-cadence", playbook: "Change push cadence", runs: "1", runsTone: "muted", best: "unmeasurable", bestTone: "muted", worst: "—", worstTone: "muted", measurement: "Impossible · a constraint", state: "retired", stateTone: "muted", owner: "Ifeoma" },
];

export const PB03_NOTES = {
  holdoutSplit:
    "Excluding the double-contacted has nothing to measure. Refunding an apology has nothing that may be withheld. Repricing needs a margin figure that does not exist. Only one of the five without a holdout is a case of somebody not bothering, and the column says which — because a blanket rule that every playbook must be measurable would have deleted Amara's.",
  neverRun:
    "Prompting a second feature at day three was written from the 43-point depth signal, has a holdout designed and preconditions stated, and has been sitting complete since April because Adopt has no owner to sign it. A written method with nobody to run it is a different problem from a bad method, and it is listed as one.",
};

// ───────────────────────── PB04 · ONE PLAYBOOK (retry-0900) ────────────────

export const PB04_HERO = {
  eyebrow: "runs · both against a holdout",
  big: "2",
  sub: "Nigeria +45.5 points, Kenya +44.3. Written by Ravi Mehta after the second one, not the first.",
  rightLabel: "refuses to run in",
  rightBig: "Ghana",
  rightSub: "no card volume baseline",
};

export const PB04_STEPS_ROWS: { step: string; what: string; who: string; whoIsAgent?: boolean; skippable: string; skippableTone: PbTone }[] = [
  { step: "1", what: "Find customers whose card failed on a renewal attempt", who: "Involuntary Churn", whoIsAgent: true, skippable: "no", skippableTone: "risk" },
  { step: "2", what: "Hold back 10% and leave them on the existing retry", who: "the playbook", skippable: "with a typed reason", skippableTone: "warn" },
  { step: "3", what: "Write what would say it failed · below 40% in 72 hours", who: "a person", skippable: "no", skippableTone: "risk" },
  { step: "4", what: "Re-authenticate and approve", who: "a named person", skippable: "no", skippableTone: "risk" },
  { step: "5", what: "Retry at 09:00 in the customer's local timezone", who: "the payment system", skippable: "no", skippableTone: "risk" },
  { step: "6", what: "Close after nine days and credit the difference", who: "a person", skippable: "no", skippableTone: "risk" },
];

export const PB04_PRECONDITION_ROWS: { precondition: string; why: string; nigeria: string; nigeriaTone: PbTone; kenya: string; kenyaTone: PbTone; ghana: string; ghanaTone: PbTone; uk: string; ukTone: PbTone }[] = [
  { precondition: "90 days of card volume history", why: "Otherwise there is no baseline to measure against", nigeria: "met", nigeriaTone: "ok", kenya: "met", kenyaTone: "ok", ghana: "fails", ghanaTone: "risk", uk: "met", ukTone: "ok" },
  { precondition: "A local timezone on the customer record", why: "09:00 means nothing without one", nigeria: "met", nigeriaTone: "ok", kenya: "met", kenyaTone: "ok", ghana: "met", ghanaTone: "ok", uk: "met", ukTone: "ok" },
  { precondition: "A stored card that can be retried", why: "Some markets are transfer-first", nigeria: "met", nigeriaTone: "ok", kenya: "met", kenyaTone: "ok", ghana: "partial", ghanaTone: "warn", uk: "met", ukTone: "ok" },
  { precondition: "A person who can approve a send", why: "Every run needs a re-auth", nigeria: "Ravi", nigeriaTone: "ok", kenya: "Ravi", kenyaTone: "ok", ghana: "nobody", ghanaTone: "risk", uk: "Ravi", ukTone: "ok" },
];

export const PB04_NOTE =
  "No card volume baseline is a fact that October will fix. Nobody who can approve a send in Ghana is a fact that one conversation would fix, and it has been true for eleven days. The playbook lists both, in the same table, because a market that is blocked for two different reasons will otherwise be written off for the harder one.";

// ───────────────────────── PB05 · TRACK RECORD ─────────────────────────────

export const PB05_RUN_ROWS: { playbook: string; market: string; when: string; result: string; resultTone: PbTone; measured: string; notes: string; notesTone: PbTone }[] = [
  { playbook: "Retry cards at 09:00", market: "Nigeria", when: "24 Mar", result: "+45.5 pts · ₦62M", resultTone: "ok", measured: "Holdout · 2,140", notes: "clean", notesTone: "ok" },
  { playbook: "Retry cards at 09:00", market: "Kenya", when: "9 Aug", result: "+44.3 pts · KES 1.0M", resultTone: "ok", measured: "Holdout · 490", notes: "clean", notesTone: "ok" },
  { playbook: "Reactivate in three waves", market: "Nigeria", when: "2 Aug", result: "18.2% · wave one", resultTone: "ok", measured: "Holdout · 10,000", notes: "contaminated 14 Aug", notesTone: "risk" },
  { playbook: "Reactivate in three waves", market: "Nigeria", when: "13 Aug", result: "day 3 of 18", resultTone: "muted", measured: "Holdout · 5,000", notes: "clean", notesTone: "ok" },
  { playbook: "Reactivate in three waves", market: "Nigeria", when: "held", result: "—", resultTone: "muted", measured: "Holdout · planned", notes: "2,000 over the cap", notesTone: "warn" },
  { playbook: "Withdraw a discount", market: "All", when: "19 Mar", result: "₦31M", resultTone: "ok", measured: "Holdout · 1,900", notes: "clean", notesTone: "ok" },
  { playbook: "Refund and apologise", market: "Lagos", when: "7 Mar", result: "₦9M returned", resultTone: "muted", measured: "Nothing withheld", notes: "unattributable by design", notesTone: "warn" },
  { playbook: "Reprice on local margin", market: "Ghana", when: "attempted", result: "Unavailable", resultTone: "muted", measured: "Needs COGS", notes: "refused to run", notesTone: "risk" },
];

export const PB05_NOTE =
  "This is the whole record and it includes the failures, because a playbook page that showed only successful runs would be a marketing document. The contaminated wave is the most instructive row: the playbook was followed exactly and a resend built outside it broke the holdout anyway, which is now a constraint in business memory.";

export const PB05_USED_FOR_ROWS: { label: string; value: string; tone: PbTone }[] = [
  { label: "Deciding whether to reuse something", value: "two clean runs a point apart is a stronger argument than one", tone: "ok" },
  { label: "Deciding where it will not work", value: "the refusals are as useful as the runs", tone: "ok" },
  { label: "Ranking playbooks against each other", value: "not offered · they do different things in different markets", tone: "risk" },
  { label: "Scoring the people who ran them", value: "never · that is not what this record is for", tone: "risk" },
  { label: "Predicting the next result", value: "no · a track record is history, and the section says so", tone: "warn" },
];

// ───────────────────────── PB06 · BLOCKED ──────────────────────────────────

export type BlockedRow = {
  id: string;
  playbook: string;
  blockedIn: string;
  blockedInTone: PbTone;
  precondition: string;
  kind: string;
  kindTone: PbTone;
  who: string;
  whoTone: PbTone;
  since: string;
  sinceTone: PbTone;
  /** Only the "Retry cards at 09:00 / Ghana / 90 days of card volume history" row has a wired action — opens the Adapt modal (PB12). */
  rowAction?: "adapt";
};

export const BLOCKED_ROWS: BlockedRow[] = [
  { id: "retry-0900-ghana-baseline", playbook: "Retry cards at 09:00", blockedIn: "Ghana", blockedInTone: "warn", precondition: "90 days of card volume history", kind: "time", kindTone: "muted", who: "nobody · October", whoTone: "muted", since: "9 Jul", sinceTone: "muted", rowAction: "adapt" },
  { id: "retry-0900-ghana-approver", playbook: "Retry cards at 09:00", blockedIn: "Ghana", blockedInTone: "warn", precondition: "A person who can approve a send", kind: "person", kindTone: "risk", who: "Ada", whoTone: "warn", since: "11 days", sinceTone: "risk" },
  { id: "reprice-margin", playbook: "Reprice on local margin", blockedIn: "everywhere", blockedInTone: "risk", precondition: "A margin figure", kind: "data", kindTone: "risk", who: "Sam · asked 28 Jul", whoTone: "warn", since: "12 Jan", sinceTone: "risk" },
  { id: "second-feature-owner", playbook: "Prompt a second feature at day three", blockedIn: "everywhere", blockedInTone: "risk", precondition: "A person who owns Adopt", kind: "person", kindTone: "risk", who: "Ada", whoTone: "warn", since: "214 days", sinceTone: "risk" },
  { id: "reactivate-wave-three-cap", playbook: "Reactivate in three waves", blockedIn: "wave three", blockedInTone: "warn", precondition: "Under 50,000 · this is 52,000", kind: "guardrail", kindTone: "warn", who: "Ada", whoTone: "warn", since: "19 hours", sinceTone: "warn" },
];

export const PB06_NOTES = {
  personBlockers:
    "Only one row here is waiting on data and one on time. The rest are waiting for somebody to be named or to say yes, which is a different kind of problem and the kind that does not resolve itself. A blocked-playbook list that grouped them all as “not available” would hide the fact that most of this is a conversation.",
  notAnError:
    "Nothing on this screen is red because something broke. Every row is the method working as designed — checking a condition and declining. The alternative is what happened in Accra, where a reactivation ran in a market with no baseline and produced GHS 380k that can never be attributed to anything.",
};

// ───────────────────────── PB07 · RETIRED ───────────────────────────────────

export type RetiredRow = {
  id: string;
  playbook: string;
  ran: string;
  retired: string;
  why: string;
  replacedBy: string;
  replacedByTone: PbTone;
  stillCited: string;
  stillCitedTone: PbTone;
  /** Only "Win back with 20% off at day 60–90" has a wired action — opens the Retire modal (PB13). */
  rowAction?: "retire";
};

export const RETIRED_ROWS: RetiredRow[] = [
  { id: "change-push-cadence", playbook: "Change push cadence", ran: "1", retired: "17 Mar", why: "Cannot be measured · frequency is a global setting", replacedBy: "nothing yet", replacedByTone: "warn", stillCited: "4", stillCitedTone: "ok" },
  { id: "win-back-20-off", playbook: "Win back with 20% off at day 60–90", ran: "3", retired: "9 Sep", why: "Recovers 2.1% against 9.4% for telling people what was fixed", replacedBy: "Fee transparency reactivation", replacedByTone: "ok", stillCited: "3", stillCitedTone: "ok", rowAction: "retire" },
];

export const PB07_NOTE_WORKED =
  "The 20% win-back recovered 2.1% at ₦14,200 a customer across three runs. It was not broken, it was not unprofitable, and it is retired because telling people the specific thing they complained about had been fixed recovers 9.4% with no discount at all. Retiring something that works takes a better measured alternative, and this is the only row in this section that has one.";

export const PB07_WHAT_RETIRING_DOES_ROWS: { label: string; value: string; tone: PbTone }[] = [
  { label: "It stops the playbook being run", value: "the only thing that actually changes", tone: "ok" },
  { label: "It stays readable with its whole record", value: "three runs, ₦14,200 a customer, and why it stopped", tone: "ok" },
  { label: "It keeps being cited", value: "seven citations between the two, all in arguments about method", tone: "ok" },
  { label: "It can be un-retired", value: "by a person, with a reason, and both are kept", tone: "muted" },
  { label: "It does not delete the learnings it produced", value: "those live in business memory under their own state", tone: "ok" },
];

export const PB07_NOTE_CONSTRAINT =
  "Push cadence cannot be held back per customer, so it can never be measured. The request to make frequency per-customer is an open obligation with Engineering, 38 days old. If it lands, this playbook becomes runnable and measurable on the same day, and it is kept whole for that reason rather than deleted.";

// ───────────────────────── PB08/09/10 · WRITE A PLAYBOOK ──────────────────

export const PB08_RUN_ROWS: { run: string; market: string; when: string; result: string; resultTone: PbTone; measured: string; include: string; includeTone: PbTone }[] = [
  { run: "Reactivate in three waves · wave one", market: "Nigeria", when: "2 Aug", result: "18.2%", resultTone: "ok", measured: "Holdout · 10,000, later contaminated", include: "yes · with the note", includeTone: "warn" },
  { run: "Reactivate in three waves · wave two", market: "Nigeria", when: "13 Aug", result: "day 3", resultTone: "muted", measured: "Holdout · 5,000, clean", include: "not yet · unreadable", includeTone: "muted" },
  { run: "Accra reactivation", market: "Ghana", when: "9 Jul", result: "GHS 380k", resultTone: "warn", measured: "None · no baseline existed", include: "yes · as a failure", includeTone: "risk" },
];

export const PB08_NOTE =
  "It ran before Ghana had a baseline, produced GHS 380k nobody can attribute, and is the direct reason this playbook will carry a precondition. A playbook written only from its successes would have no preconditions in it, which is precisely how the next person repeats Accra in the next new market.";

export const PB08_FOR_ROWS: { label: string; value: string; tone?: PbTone }[] = [
  { label: "The situation", value: "a cohort that stopped ordering after a specific, dated change" },
  { label: "Not the situation", value: "general lapsed customers · they need a different thing", tone: "warn" },
  { label: "What it claims", value: "reaching them with what changed recovers more than an offer", tone: "ok" },
  { label: "What it does not claim", value: "that it works without a dated cause to point at", tone: "warn" },
  { label: "Who it belongs to", value: "Ifeoma · she ran both waves and will be asked about it" },
];

export const PB09_PRECONDITION_ROWS: { precondition: string; from: string; pass: string; passTone: PbTone; ifFails: string; required: string; requiredTone: PbTone }[] = [
  { precondition: "A dated cause the cohort can be told about", from: "The whole point of the method", pass: "2 of 4", passTone: "warn", ifFails: "refuse", required: "yes", requiredTone: "risk" },
  { precondition: "A repeat-rate baseline in the market", from: "Accra · ran without one, produced nothing", pass: "3 of 4", passTone: "warn", ifFails: "refuse", required: "yes", requiredTone: "risk" },
  { precondition: "A cohort over 5,000 reachable people", from: "Below that the holdout cannot be read", pass: "4 of 4", passTone: "ok", ifFails: "refuse", required: "yes", requiredTone: "risk" },
  { precondition: "A named person who can approve a send", from: "Every send needs a re-auth", pass: "3 of 4", passTone: "warn", ifFails: "wait", required: "yes", requiredTone: "risk" },
  { precondition: "Nobody in the cohort inside the frequency cap", from: "The cap applies anyway · this is a warning", pass: "—", passTone: "muted", ifFails: "warn and shrink", required: "no", requiredTone: "warn" },
];

export const PB09_NOTES = {
  fromFailure:
    "Nobody sits down and imagines the conditions a method needs. The baseline precondition exists because Accra ran without one and produced GHS 380k of unattributable money; the approver precondition exists because wave three has been waiting nineteen hours. A playbook accumulates its conditions from its own failures, which is why it cannot be written before the second run.",
  ghanaOctober:
    "The baseline arrives when ninety days of history exist. The dated cause arrives on 14 September when the fee ships there — which means this playbook becomes runnable in Ghana at almost exactly the moment the market needs it, and the preconditions will say so on the day.",
};

export const PB10_STEP_ROWS: { step: string; what: string; who: string; skippable: string; skippableTone: PbTone }[] = [
  { step: "1", what: "Build the cohort from the dated change", who: "an agent", skippable: "no", skippableTone: "risk" },
  { step: "2", what: "Exclude anyone inside the cap or permanently excluded", who: "the playbook", skippable: "no", skippableTone: "risk" },
  { step: "3", what: "Hold back 10% and record who they are", who: "the playbook", skippable: "typed reason", skippableTone: "warn" },
  { step: "4", what: "Write what result would say this failed", who: "a person", skippable: "no", skippableTone: "risk" },
  { step: "5", what: "Send in waves, no offer, saying what changed", who: "a named approver", skippable: "no", skippableTone: "risk" },
  { step: "6", what: "Wait 18 days before reading anything", who: "nobody", skippable: "no", skippableTone: "risk" },
  { step: "7", what: "Close, credit against the holdout, write the learning", who: "a person", skippable: "no", skippableTone: "risk" },
];

export const PB10_NOTE =
  "The reactivation holdout needs eighteen days to detect a two-point change. Somebody will look on day four, see a number, and want to act on it. Writing the wait into the playbook as a step with a duration is the only thing that makes it as real as the sending, and the readability screen will refuse to show a difference before it.";

export const PB10_MEASUREMENT_ROWS: { label: string; value: string; tone: PbTone }[] = [
  { label: "Holdout", value: "10% · part of the playbook, removable only with a typed reason", tone: "ok" },
  { label: "Readable after", value: "18 days for a 2-point change · stated before it runs", tone: "ok" },
  { label: "What is credited", value: "the difference against the held group, never the observed total", tone: "ok" },
  { label: "What the playbook will not claim", value: "anything if the holdout is contaminated · wave one is the precedent", tone: "warn" },
  { label: "Where the result goes", value: "the value ledger, and one learning into business memory", tone: "ok" },
];

// ───────────────────────── PB11 · RUN A PLAYBOOK (modal) ──────────────────

export const PB11_PRESET = {
  subject: "Retry cards at 09:00 local · in the UK",
  subjectDetail: "Never run here · 269,000 customers · 4,100 with a stored card",
  preconditionRows: [
    { label: "90 days of card volume history", sub: "18 months · met" },
    { label: "A local timezone on the record", sub: "met" },
    { label: "A stored card that can be retried", sub: "4,100 customers · met" },
    { label: "A person who can approve a send", sub: "Ravi · met" },
  ],
  warningTitle: "All four met, and the UK holdout would be 410 people",
  warningBody:
    "That detects a 12-point change and nothing smaller. Nigeria found 45.5, so it would probably read — but a 6-point improvement here would come back as nothing.",
  closingNote:
    "This produces a play in the Renew room with the steps filled in, the holdout drawn and the failure condition pre-written from the last two runs. Ravi still has to read it and re-authenticate. A playbook removes the work of designing something correctly and removes none of the deciding.",
};

// ───────────────────────── PB12 · ADAPT A PLAYBOOK (modal) ────────────────

export const PB12_PRESET = {
  subject: "Retry cards at 09:00 · adapt for Ghana",
  subjectDetail: "Fails one precondition · 90 days of card volume history",
  changeRows: [
    { label: "The timing · 09:00 to payday +1", sub: "a real local difference · Kunle's argument", selected: true, blocked: false },
    { label: "The market · add Ghana to where it runs", sub: "allowed · the precondition still applies", selected: false, blocked: false },
    { label: "The precondition · drop the baseline requirement", sub: "not offered · this is the reason Accra produced nothing", selected: false, blocked: true },
    { label: "The holdout · run without one this time", sub: "not offered · it is built into this playbook", selected: false, blocked: true },
  ],
  warningTitle: "A variant is a new playbook with one run, not this one with a tweak",
  warningBody:
    "Changing the timing forks it. The new version starts with a record of zero runs and cannot borrow the +45.5 and +44.3 from the original, because those were measured at 09:00.",
  closingNote:
    "Dropping a precondition or removing the holdout keeps the name, the track record and the credibility while removing the things that earned them. If Kunle is right about payday, the way to find out is a fork with an empty record, not an edit to a playbook that has two clean runs behind it.",
};

// ───────────────────────── PB13 · RETIRE A PLAYBOOK (modal) ───────────────

export const PB13_PRESET = {
  subject: "Win back with 20% off at day 60–90",
  subjectDetail: "Three runs · 2.1% recovered at ₦14,200 a customer · it works",
  reasonBody:
    "Telling people the specific thing they complained about has been fixed recovers 9.4% with no discount. Two independent measurements now say so.",
  doesRows: [
    { label: "It cannot be run again", sub: "the only thing that actually changes" },
    { label: "The three runs stay on the record", sub: "₦14,200 a customer, 2.1%, all of it readable" },
    { label: "Its learnings stay in business memory", sub: "under their own state, unaffected by this" },
    { label: "The replacement is named", sub: "Fee transparency reactivation · linked from here" },
  ],
  closingNote:
    "The field will accept “we do not like discounting” and the retirement will carry that sentence forever, which is usually enough to stop somebody typing it. What is being written here instead is 9.4% against 2.1%, from two independent readings, and that is a sentence anybody can check in a year.",
};

// ───────────────────────── PB14 · HISTORY ──────────────────────────────────

export const HISTORY_ROWS: { change: string; playbook: string; when: string; by: PersonRef; effect: string; effectTone: PbTone }[] = [
  { change: "Written", playbook: "Retry cards at 09:00", when: "9 Aug", by: RAVI, effect: "after the second run", effectTone: "ok" },
  { change: "Precondition added", playbook: "Reactivate in three waves", when: "9 Jul", by: KUNLE, effect: "baseline · after Accra", effectTone: "warn" },
  { change: "Precondition added", playbook: "Reactivate in three waves", when: "15 Aug", by: IFEOMA, effect: "hold list enforced at send", effectTone: "risk" },
  { change: "Forked", playbook: "Retry at payday +1 · Kenya", when: "11 Aug", by: KUNLE, effect: "0 runs · own record", effectTone: "muted" },
  { change: "Retired", playbook: "Change push cadence", when: "17 Mar", by: IFEOMA, effect: "a constraint made it unmeasurable", effectTone: "muted" },
  { change: "Step changed", playbook: "Refund and apologise", when: "21 Mar", by: AMARA, effect: "same day, not next day", effectTone: "ok" },
];

export const PB14_NOTE =
  "Accra added a baseline precondition. The 14 August resend added a hold-list precondition. The Lagos refunds moved from next-day to same-day after Amara watched the first batch. Playbooks in this workspace have improved almost entirely by failing, which is worth seeing laid out because it is the argument for keeping the failures on the record.";

export const PB14_WHO_MAY_ROWS: { label: string; value: string; tone: PbTone }[] = [
  { label: "Write a playbook", value: "anyone, after a second run · never before", tone: "ok" },
  { label: "Add a precondition", value: "anyone, with the run that justifies it", tone: "ok" },
  { label: "Remove a precondition", value: "the owner, with a typed reason · it is on the record", tone: "warn" },
  { label: "Change a step", value: "forks it if the change is material · the owner decides which", tone: "warn" },
  { label: "Agents", value: "may propose a playbook from two runs · may not write one", tone: "ai" },
];

// ───────────────────────── PB15 · SETTINGS ─────────────────────────────────

export const PB15_RULE_ROWS: { rule: string; currently: string; currentlyTone: PbTone; who: string; canChange: boolean; state: string; stateTone: "on" | "off" }[] = [
  { rule: "A playbook needs two runs before it is written", currently: "9", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Preconditions are checked and refuse the run", currently: "5 blocks", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "The track record includes failed runs", currently: "8 runs", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Changing the method forks the record", currently: "1 fork", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Running one creates a proposal, never a send", currently: "—", currentlyTone: "muted", who: "product", canChange: false, state: "on", stateTone: "on" },
  { rule: "Who may write one", currently: "anyone", currentlyTone: "muted", who: "Ada", canChange: true, state: "on", stateTone: "on" },
  { rule: "Agents proposing a playbook", currently: "on", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "on" },
  { rule: "Ranking playbooks by result", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "off" },
  { rule: "Running one without its preconditions", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "off" },
  { rule: "Importing a playbook from another company", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "off" },
];

export const PB15_NOTE =
  "A playbook in this section carries a track record measured on these customers, in these markets, against these holdouts. Something arriving from elsewhere has none of that and would sit in the same table looking identical. Community exists so that methods can travel between companies without their numbers pretending to be yours, and nothing crosses from there into here automatically.";

export const PB15_CONNECTS_ROWS: { label: string; value: string; tone: PbTone }[] = [
  { label: "Business memory", value: "preconditions are constraints · the two sections share them", tone: "ai" },
  { label: "Rooms", value: "running a playbook creates a proposal in a room, needing approval", tone: "ok" },
  { label: "Experiments", value: "the holdout in a playbook becomes a registered experiment", tone: "ok" },
  { label: "Campaigns", value: "the send is a campaign, with its audience resolved there", tone: "ok" },
  { label: "Value", value: "the result is credited against the holdout, in the ledger", tone: "ok" },
];

export { ADA, AMARA, IFEOMA, INVOLUNTARY_CHURN, KUNLE, RAVI };
