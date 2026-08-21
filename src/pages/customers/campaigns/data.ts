import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import type { AgentRef, PersonRef } from "@/pages/everyday/rooms/types";
import { ADA, AMARA, IFEOMA, INVOLUNTARY_CHURN, RAVI, REPEAT_DECAY, TUNDE } from "@/pages/everyday/rooms/data";

/**
 * Customers · Campaigns — sourced from
 * flolyt-figma-designs/Customers Screens/flolyt-campaigns/flolyt-campaigns/
 * (18 frames, CP01-CP18). Content transcribed from the export's own `cp.py`
 * generator source, same approach as Segments/Customer health. See
 * docs/build-tracker.md.
 */

export type CpTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const CP_TONE_CLASS: Record<CpTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const CP_CHIP_TONE: Record<CpTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const CP_KPI_TONE: Record<CpTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

export const CP_BAR_TONE: Record<CpTone, "teal" | "amber" | "rose" | "ink" | "ultra"> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior mock flag. */
export type CampaignsState = "nothing" | "first" | "full";
export const CAMPAIGNS_STATE: CampaignsState = "full";

export const CP_TABS = ["Running", "Audiences", "Waiting", "Suppressed", "Sent", "History"] as const;
export type CpTab = (typeof CP_TABS)[number];

/** Not in rooms/data.ts — this section is the first to need it. */
export const PRODUCT_REASON: AgentRef = { initials: "PR", name: "Product Reason" };

export type ApprovedBy = { kind: "person"; person: PersonRef } | { kind: "text"; label: string; tone: CpTone };

// ───────────────────────── CP01 · NOTHING HAS BEEN SENT ─────────────────────────

export const CP01_PROPOSAL_ROWS: {
  proposal: string;
  fromAgent: AgentRef;
  room: string;
  roomTone: CpTone;
  missing: string;
  approver: string;
  approverTone: CpTone;
}[] = [
  { proposal: "Reactivation · lapsed after the fee", fromAgent: REPEAT_DECAY, room: "8f2c", roomTone: "muted", missing: "A holdout design and an approver", approver: "Ifeoma", approverTone: "muted" },
  { proposal: "Retry cards at 09:00 local", fromAgent: INVOLUNTARY_CHURN, room: "8a1f", roomTone: "muted", missing: "Nothing · it is ready", approver: "Ravi", approverTone: "muted" },
  { proposal: "Prompt one feature at day three", fromAgent: PRODUCT_REASON, room: "none", roomTone: "risk", missing: "A room, which needs an owner for Adopt", approver: "nobody", approverTone: "risk" },
];

// ───────────────────────── CP02 · THE FIRST CAMPAIGN ─────────────────────────

export const CP02_STATS: { eyebrow: string; value: string; note: string; tone: CpTone }[] = [
  { eyebrow: "Reached", value: "19,260", note: "of 21,400 eligible", tone: "ok" },
  { eyebrow: "Held back", value: "2,140", note: "10% · a measurement cost", tone: "warn" },
  { eyebrow: "Approved by", value: "Ravi Mehta", note: "re-auth at 09:12", tone: "ai" },
  { eyebrow: "Written before it ran", value: "1 line", note: "what would say it failed", tone: "ok" },
];

export const CP02_KV_ROWS: { label: string; value: string; tone?: CpTone }[] = [
  { label: "Approval is a person re-authenticating", value: "not a role, not a rule, not a queue · every time", tone: "ai" },
  { label: "It covers this send", value: "not this campaign type, not this room, not this quarter", tone: "ok" },
  { label: "A failure condition is written first", value: "recovery below 40% in 72 hours · before, not after", tone: "ok" },
  { label: "A holdout is the default, not an option", value: "removing it takes a typed reason and it is marked forever", tone: "warn" },
  { label: "The audience is smaller than the segment", value: "21,400 eligible from a 24,000 segment · caps applied", tone: "warn" },
];

// ───────────────────────── CP03 · RUNNING NOW ─────────────────────────

export const CP03_STATS: { eyebrow: string; value: string; note: string; tone: CpTone }[] = [
  { eyebrow: "Running", value: "6", note: "across 4 rooms", tone: "num" },
  { eyebrow: "Under a holdout", value: "5 of 6", note: "one cannot have one", tone: "warn" },
  { eyebrow: "Waiting on a person", value: "1", note: "19 hours · ≈₦1.7M", tone: "risk" },
  { eyebrow: "Suppressed this week", value: "6,400", note: "by the frequency cap", tone: "warn" },
];

export type CampaignRow = {
  campaign: string;
  /** Only set on the one row with a built `:id` detail page (`reactivation-1`). */
  id?: string;
  room: string;
  audience: string;
  audienceTone: CpTone;
  held: string;
  heldTone: CpTone;
  day: string;
  state: string;
  stateTone: CpTone;
  approvedBy: ApprovedBy;
  /** Set on exactly the row CP15's own base page shows the modal opened against — same rowAction pattern Segments/Leakage map used. */
  rowAction?: "stop";
};

export const CP03_ROWS: CampaignRow[] = [
  { campaign: "Reactivation · wave one", id: "reactivation-1", room: "Second order never happened", audience: "90,000", audienceTone: "num", held: "10,000", heldTone: "ok", day: "12", state: "contaminated", stateTone: "risk", approvedBy: { kind: "person", person: IFEOMA }, rowAction: "stop" },
  { campaign: "Reactivation · wave two", room: "Second order never happened", audience: "46,000", audienceTone: "num", held: "5,000", heldTone: "ok", day: "3", state: "running", stateTone: "ai", approvedBy: { kind: "person", person: IFEOMA } },
  { campaign: "Reactivation · wave three", room: "Second order never happened", audience: "52,000", audienceTone: "warn", held: "—", heldTone: "muted", day: "—", state: "held", stateTone: "warn", approvedBy: { kind: "text", label: "nobody yet", tone: "risk" } },
  { campaign: "Retry cards at 09:00 · Kenya", room: "Cards failing on renewal night", audience: "4,410", audienceTone: "num", held: "490", heldTone: "ok", day: "9", state: "closing today", stateTone: "ok", approvedBy: { kind: "person", person: RAVI } },
  { campaign: "Basket prompt · rerun", room: "Basket size after checkout", audience: "15,860", audienceTone: "num", held: "1,586", heldTone: "ok", day: "1", state: "running", stateTone: "ai", approvedBy: { kind: "person", person: TUNDE } },
  { campaign: "Lagos refund and apology", room: "Lagos delivery failures", audience: "3,100", audienceTone: "num", held: "—", heldTone: "risk", day: "closed", state: "no holdout", stateTone: "warn", approvedBy: { kind: "person", person: AMARA } },
];

// ───────────────────────── CP04 · ONE CAMPAIGN (reactivation-1) ─────────────────────────

export const CP04_STEPS_ROWS: { step: string; people: string; peopleTone: CpTone; what: string; setBy: string }[] = [
  { step: "Segment · Lapsed after the fee change", people: "148,000", peopleTone: "num", what: "Matched the written definition", setBy: "Ifeoma" },
  { step: "Reachable", people: "100,000", peopleTone: "ok", what: "48,000 have no channel or no consent", setBy: "data and consent" },
  { step: "Minus permanent exclusions", people: "97,600", peopleTone: "num", what: "Complaints, refunds owed, triple-held", setBy: "product · not overridable" },
  { step: "Minus the frequency cap", people: "94,900", peopleTone: "num", what: "2,700 heard from us in the last 7 days", setBy: "Ada · 1 in 7 days" },
  { step: "Eligible", people: "94,900", peopleTone: "ok", what: "This is the number the room shows", setBy: "—" },
  { step: "Minus the holdout", people: "90,000", peopleTone: "ok", what: "10,000 held · 10.5%, rounded to a clean number", setBy: "Ifeoma" },
  { step: "Sent", people: "90,000", peopleTone: "ok", what: "Push, then email at 48 hours if unopened", setBy: "—" },
];

export const CP04_KV_ROWS: { label: string; value: string; tone?: CpTone }[] = [
  { label: "What happened", value: "a resend was built outside the play and ignored the hold list", tone: "risk" },
  { label: "Who it reached", value: "1,204 of the 10,000 held · 12.0%", tone: "risk" },
  { label: "What was withdrawn", value: "the ₦9.1M provisional figure · not adjusted, withdrawn", tone: "risk" },
  { label: "Who decides what happens next", value: "Ifeoma · three options, none of them free", tone: "warn" },
  { label: "The fix", value: "hold lists enforced at send, not at build · assigned to Sam", tone: "ok" },
];

// ───────────────────────── CP05 · AUDIENCES ─────────────────────────

export const CP05_STATS_NOTE =
  "Anyone reading a room that says 148,000 and a report that says 90,000 will assume something failed. Nothing failed: unreachability, consent, complaints, caps and holdouts each took their share, in that order. The shrinkage column exists so the question is answered before it is asked, and the largest reduction is named because it is usually the one worth arguing with.";

export const CP05_ROWS: {
  campaign: string;
  segment: string;
  eligible: string;
  sent: string;
  shrinkage: string;
  shrinkageTone: CpTone;
  largestReduction: string;
}[] = [
  { campaign: "Reactivation · wave one", segment: "148,000", eligible: "94,900", sent: "90,000", shrinkage: "−39%", shrinkageTone: "warn", largestReduction: "48,000 unreachable" },
  { campaign: "Reactivation · wave two", segment: "81,000", eligible: "51,000", sent: "46,000", shrinkage: "−43%", shrinkageTone: "warn", largestReduction: "24,000 already in wave one" },
  { campaign: "Retry cards · Kenya", segment: "5,600", eligible: "4,900", sent: "4,410", shrinkage: "−21%", shrinkageTone: "muted", largestReduction: "700 no stored card" },
  { campaign: "Basket prompt · rerun", segment: "24,000", eligible: "15,860", sent: "14,274", shrinkage: "−41%", shrinkageTone: "warn", largestReduction: "8,140 permanently excluded" },
  { campaign: "Lagos refund", segment: "3,100", eligible: "3,100", sent: "3,100", shrinkage: "0%", shrinkageTone: "ok", largestReduction: "none · nobody was excluded" },
];

export const CP05_KV_ROWS: { label: string; value: string; tone?: CpTone }[] = [
  { label: "Lagos refund", value: "3,100 people, 3,100 sends · every exclusion returned zero" },
  { label: "Why", value: "everyone owed a refund is normally excluded · here they are the audience", tone: "ai" },
  { label: "What that cost", value: "the holdout · there is no group to compare against", tone: "warn" },
  { label: "Whether it was right", value: "yes · and it means the ₦9M can never be attributed", tone: "ok" },
];

// ───────────────────────── CP06 · WAITING ON A PERSON ─────────────────────────

export const CP06_STATS: { eyebrow: string; value: string; note: string; tone: CpTone }[] = [
  { eyebrow: "Waiting", value: "1", note: "wave three · 52,000", tone: "warn" },
  { eyebrow: "Waiting for", value: "19 hours", note: "≈₦1.7M of decay", tone: "risk" },
  { eyebrow: "Who can approve it", value: "1", note: "Ada Obi", tone: "muted" },
  { eyebrow: "Ways around it", value: "0", note: "and that is deliberate", tone: "ok" },
];

export const CP06_CONDITION_ROWS: { condition: string; wave3: string; within: boolean; why: string; whyTone: CpTone }[] = [
  { condition: "Reactivation campaigns", wave3: "Reactivation", within: true, why: "—", whyTone: "muted" },
  { condition: "No offer or discount attached", wave3: "No offer", within: true, why: "—", whyTone: "muted" },
  { condition: "Under 50,000 people", wave3: "52,000", within: false, why: "2,000 over", whyTone: "risk" },
  { condition: "Nigeria only", wave3: "Nigeria", within: true, why: "—", whyTone: "muted" },
  { condition: "Valid 90 days · 11 of 20 executions used", wave3: "Day 44 · execution 12", within: true, why: "—", whyTone: "muted" },
];

export const CP06_KV_ROWS: { label: string; value: string; tone?: CpTone }[] = [
  { label: "Approve this one send", value: "one re-auth · covers 52,000 people once", tone: "ok" },
  { label: "Raise her standing authority", value: "to 60,000 · a new grant, dated, with its own expiry", tone: "ok" },
  { label: "Decline it", value: "with a reason · the reason goes back to Ifeoma and the room", tone: "ok" },
  { label: "Delegate the decision to an agent", value: "not offered · there is no permission level for it", tone: "risk" },
  { label: "Let it expire quietly", value: "not offered · it waits, visibly, until somebody answers", tone: "risk" },
];

// ───────────────────────── CP07 · SUPPRESSED ─────────────────────────

export const CP07_PEOPLE_BAR_ROWS: { label: string; count: number; tone: CpTone }[] = [
  { label: "Received something", count: 154784, tone: "ok" },
  { label: "Frequency cap · heard from us in 7 days", count: 6400, tone: "warn" },
  { label: "Permanent exclusions", count: 8140, tone: "warn" },
  { label: "Precedence · a payment message won", count: 9200, tone: "muted" },
  { label: "Held for measurement", count: 17076, tone: "ai" },
];

export const CP07_RULE_ROWS: {
  rule: string;
  people: string;
  peopleTone: CpTone;
  whoSetIt: string;
  overridable: string;
  overridableTone: CpTone;
  told: string;
  toldTone: CpTone;
}[] = [
  { rule: "One message in seven days", people: "6,400", peopleTone: "warn", whoSetIt: "Ada · February", overridable: "by Ada", overridableTone: "warn", told: "in this report", toldTone: "ok" },
  { rule: "Payment beats marketing", people: "9,200", peopleTone: "muted", whoSetIt: "Ada · February", overridable: "by Ada", overridableTone: "warn", told: "in this report", toldTone: "ok" },
  { rule: "Open complaint", people: "1,840", peopleTone: "warn", whoSetIt: "product", overridable: "no", overridableTone: "risk", told: "yes", toldTone: "ok" },
  { rule: "Owed a refund", people: "410", peopleTone: "muted", whoSetIt: "product", overridable: "no", overridableTone: "risk", told: "yes", toldTone: "ok" },
  { rule: "Opted out", people: "6,100", peopleTone: "warn", whoSetIt: "the customer", overridable: "never", overridableTone: "risk", told: "count only", toldTone: "muted" },
  { rule: "Already in two holdouts", people: "2,900", peopleTone: "muted", whoSetIt: "product", overridable: "no", overridableTone: "risk", told: "yes", toldTone: "ok" },
];

// ───────────────────────── CP08 · SENT ─────────────────────────

export const CP08_ROWS: {
  campaign: string;
  sent: string;
  people: string;
  peopleTone: CpTone;
  channel: string;
  held: string;
  heldTone: CpTone;
  result: string;
  resultTone: CpTone;
  approvedBy: string;
}[] = [
  { campaign: "Retry cards at 09:00 · NG", sent: "24 Mar", people: "19,260", peopleTone: "num", channel: "silent · retry only", held: "2,140", heldTone: "ok", result: "₦62M · causal", resultTone: "ok", approvedBy: "Ravi" },
  { campaign: "Discount withdrawal notice", sent: "19 Mar", people: "45,100", peopleTone: "num", channel: "email", held: "1,900", heldTone: "ok", result: "₦31M · causal", resultTone: "ok", approvedBy: "Ravi" },
  { campaign: "Lagos refund and apology", sent: "7 Mar", people: "3,100", peopleTone: "num", channel: "email and SMS", held: "—", heldTone: "risk", result: "₦9M · unattributable", resultTone: "muted", approvedBy: "Amara" },
  { campaign: "Onboarding email rewrite", sent: "19 Feb", people: "212,000", peopleTone: "warn", channel: "email", held: "—", heldTone: "risk", result: "₦188M · association", resultTone: "warn", approvedBy: "Zainab" },
  { campaign: "Basket prompt at checkout", sent: "5 Feb", people: "24,000", peopleTone: "num", channel: "in-product", held: "—", heldTone: "risk", result: "₦72M · association", resultTone: "warn", approvedBy: "Tunde" },
  { campaign: "Weekend push cadence change", sent: "17 Mar", people: "310,000", peopleTone: "risk", channel: "push", held: "—", heldTone: "risk", result: "₦12M · unattributable", resultTone: "muted", approvedBy: "Ifeoma" },
];

export const CP08_KV_ROWS: { label: string; value: string; tone?: CpTone }[] = [
  { label: "The audience resolution", value: "segment, eligible, suppressed, held, sent · every step" },
  { label: "The copy that went out", value: "and who wrote it · agents draft, people send", tone: "ai" },
  { label: "The approval", value: "who, when, and the re-auth · never a role name", tone: "ok" },
  { label: "The failure condition", value: "written before it ran, checked at close", tone: "ok" },
  { label: "Anything received in return", value: "replies route to Replies · they are not campaign metrics", tone: "muted" },
];

// ───────────────────────── HISTORY (no dedicated frame · grounded in CP17's "campaign log") ─────────────────────────

export const CP_HISTORY_ROWS: { when: string; action: string; campaign: string; who: string; detail: string; detailTone: CpTone }[] = [
  { when: "24 Mar", action: "Sent", campaign: "Retry cards at 09:00 · NG", who: "Ravi Mehta", detail: "19,260 reached · re-auth at 09:12", detailTone: "ok" },
  { when: "19 Mar", action: "Sent", campaign: "Discount withdrawal notice", who: "Ravi Mehta", detail: "45,100 reached · causal result", detailTone: "ok" },
  { when: "14 Aug", action: "Result withdrawn", campaign: "Reactivation · wave one", who: "Ifeoma Nwosu", detail: "₦9.1M provisional figure withdrawn, not adjusted", detailTone: "risk" },
  { when: "15 Aug, 04:00", action: "Incident detected", campaign: "Reactivation · wave one", who: "the overlap check", detail: "1,204 held customers reached by a direct resend", detailTone: "risk" },
  { when: "6 Jul", action: "Standing authority granted", campaign: "Reactivation campaigns", who: "Ada Obi", detail: "under 50,000 · Nigeria only · 90 days, 20 executions", detailTone: "ai" },
  { when: "7 Mar", action: "Sent", campaign: "Lagos refund and apology", who: "Amara Okeke", detail: "3,100 reached · no holdout, unattributable by choice", detailTone: "warn" },
];

// ───────────────────────── CP09 · BUILD · 1 · WHO IT REACHES ─────────────────────────

export const CP09_SEGMENT_ROWS: {
  segment: string;
  included: string;
  eligible: string;
  eligibleTone: CpTone;
  inUseElsewhere: string;
  inUseElsewhereTone: CpTone;
  picked: boolean;
}[] = [
  { segment: "Lapsed after the fee change", included: "100,000", eligible: "42,300", eligibleTone: "warn", inUseElsewhere: "waves one and two", inUseElsewhereTone: "warn", picked: true },
  { segment: "Single-feature at day 30", included: "127,000", eligible: "119,400", eligibleTone: "ok", inUseElsewhere: "nothing", inUseElsewhereTone: "muted", picked: false },
  { segment: "Referred by a customer", included: "118,900", eligible: "116,100", eligibleTone: "ok", inUseElsewhere: "nothing", inUseElsewhereTone: "muted", picked: false },
  { segment: "Ghana starter plan", included: "88,000", eligible: "0", eligibleTone: "risk", inUseElsewhere: "nothing · fee ships 14 Sep", inUseElsewhereTone: "risk", picked: false },
];

// ───────────────────────── CP10 · BUILD · 2 · WHAT IT SAYS ─────────────────────────

export const CP10_DRAFT = {
  eyebrow: "DRAFTED BY REPEAT & DECAY · EDITED BY YOU",
  headline: "The delivery fee is back in the basket price",
  body: "You told us the fee at checkout was the problem. It now shows in the basket total from the start, so the price you see is the price you pay. Nothing else has changed.",
  meta: "push · 34 words · no offer, no discount",
};

export const CP10_CLAIM_WARNING = {
  eyebrow: "WHAT THIS COPY CLAIMS",
  body: "It says the fee has moved back. That has not happened — it is scenario S-114 and nobody has approved it. This campaign cannot be sent while the copy describes a change that has not shipped.",
};

export const CP10_CHECK_ROWS: {
  check: string;
  result: string;
  resultTone: CpTone;
  found: string;
  blocking: string;
  blockingTone: CpTone;
}[] = [
  { check: "Does it claim something that has shipped?", result: "failed", resultTone: "risk", found: "The fee has not moved back · S-114 is a scenario", blocking: "yes", blockingTone: "risk" },
  { check: "Does it contain an offer or discount?", result: "passed", resultTone: "ok", found: "None · which keeps it inside standing authority", blocking: "no", blockingTone: "muted" },
  { check: "Does it name a person or an account?", result: "passed", resultTone: "ok", found: "No · campaigns address a cohort", blocking: "no", blockingTone: "muted" },
  { check: "Is it in the customer's language?", result: "passed", resultTone: "ok", found: "English · all four markets", blocking: "no", blockingTone: "muted" },
  { check: "Does it promise a time or a resolution?", result: "passed", resultTone: "ok", found: "No dates promised", blocking: "no", blockingTone: "muted" },
];

export const CP10_KV_ROWS: { label: string; value: string; tone?: CpTone }[] = [
  { label: "Draft it", value: "yes · from the room, the findings and the segment definition", tone: "ok" },
  { label: "Edit it after you have", value: "no · once a person touches copy, the agent stops writing it", tone: "ok" },
  { label: "Translate it", value: "not offered · four markets read English and nobody has verified the rest", tone: "warn" },
  { label: "Claim anything about the product", value: "checked, blocking · this is the only check that stops a send", tone: "risk" },
  { label: "Send it", value: "never · under any permission, on any plan", tone: "risk" },
];

// ───────────────────────── CP11 · BUILD · 3 · GUARDRAILS ─────────────────────────

export const CP11_APPLIED_ROWS: { guardrail: string; effect: string; effectTone: CpTone; whoSetIt: string }[] = [
  { guardrail: "One message in seven days", effect: "−51,000", effectTone: "warn", whoSetIt: "Ada · February" },
  { guardrail: "Payment messages take precedence", effect: "−1,900", effectTone: "muted", whoSetIt: "Ada · February" },
  { guardrail: "Permanent exclusions", effect: "−6,700", effectTone: "warn", whoSetIt: "product" },
  { guardrail: "No sends between 21:00 and 07:00 local", effect: "timing only", effectTone: "muted", whoSetIt: "Ada · January" },
  { guardrail: "Ghana excluded until 14 September", effect: "−0 here", effectTone: "muted", whoSetIt: "product · release calendar" },
];

export const CP11_KV_ROWS: { label: string; value: string; tone?: CpTone }[] = [
  { label: "Holdout", value: "10% · 4,230 people · required unless you type a reason to remove it", tone: "ok" },
  { label: "What would say it failed", value: "reactivation below 6% in 14 days · required before sending", tone: "ok" },
  { label: "When it stops", value: "14 days · a campaign with no end date is not offered", tone: "ok" },
  { label: "Channel", value: "push, then email at 48 hours if unopened" },
  { label: "Who approves", value: "Ifeoma · or Ada, if this is over her standing authority", tone: "warn" },
];

// ───────────────────────── CP12 · BUILD · 4 · REVIEW ─────────────────────────

export const CP12_COMMITMENT_ROWS: { commitment: string; value: string; changeable: string; changeableTone: CpTone }[] = [
  { commitment: "Audience", value: "38,070 people · resolved at send, not now", changeable: "no", changeableTone: "risk" },
  { commitment: "Holdout", value: "4,230 people · 10%", changeable: "no", changeableTone: "risk" },
  { commitment: "What would say it failed", value: "Reactivation below 6% in 14 days", changeable: "no · that is the point", changeableTone: "risk" },
  { commitment: "End date", value: "14 days · 1 September", changeable: "extendable, with a new approval", changeableTone: "warn" },
  { commitment: "Copy", value: "34 words, no offer, corrected on 18 August", changeable: "no", changeableTone: "risk" },
  { commitment: "Approver", value: "Ada Obi · re-auth required", changeable: "no", changeableTone: "risk" },
];

// ───────────────────────── CP13 · APPROVE A CAMPAIGN (modal) ─────────────────────────

export const CP13_BASE_ROWS: { campaign: string; audience: string; held: string; waiting: string; waitingTone: CpTone; who: string }[] = [
  { campaign: "Reactivation · wave three", audience: "52,000", held: "—", waiting: "19 hours", waitingTone: "risk", who: "Ada Obi" },
  { campaign: "Reactivation · wave four", audience: "38,070", held: "4,230", waiting: "2 minutes", waitingTone: "muted", who: "Ada Obi" },
];

export const CP13_APPROVE_PRESET = {
  subject: "Reactivation · wave four",
  subjectDetail: "38,070 people · 4,230 held · built by Ifeoma Nwosu",
  items: [
    { label: "This send only", value: "not the campaign type, not the room, not the quarter", tone: "ok" as CpTone },
    { label: "38,070 real people", value: "resolved at send · the number may fall, never rise", tone: "warn" as CpTone },
    { label: "A holdout of 4,230", value: "who get nothing, so the rest can be measured", tone: "warn" as CpTone },
    { label: "A failure condition", value: "below 6% in 14 days · locked once sent", tone: "ok" as CpTone },
  ],
  warningTitle: "This is the third message to this group in fourteen days",
  warningBody: "51,000 of them are inside the cap and will not receive it. The people who do have heard from us twice already.",
  approver: ADA,
  approverNote: "every approval, every time · no bulk, no remembering",
  closingNote:
    "Two campaigns are waiting and each takes its own re-authentication. The answer to a long queue is a standing authority with a scope and an expiry, not a button that approves things in bulk — because a bulk approval is one decision wearing the clothes of several.",
};

// ───────────────────────── CP14 · RAISE A STANDING AUTHORITY (modal) ─────────────────────────

export const CP14_BASE_ROWS: { campaign: string; audience: string; waiting: string; waitingTone: CpTone; why: string }[] = [
  { campaign: "Reactivation · wave three", audience: "52,000", waiting: "19 hours", waitingTone: "risk", why: "2,000 over the standing authority" },
  { campaign: "Reactivation · wave four", audience: "38,070", waiting: "2 minutes", waitingTone: "muted", why: "Overlaps two running waves" },
];

export const CP14_STANDING_PRESET = {
  subject: "Ada's standing authority · reactivation",
  subjectDetail: "Granted 6 July · day 44 of 90 · 11 of 20 executions used",
  ceilingLabel: "Under 60,000 people",
  ceilingWas: "was 50,000",
  unchanged: [
    { label: "Reactivation only", value: "not price, not onboarding, not support" },
    { label: "No offer or discount", value: "the condition that keeps this safe to delegate" },
    { label: "Nigeria only", value: "Kenya, Ghana and the UK still need a person" },
    { label: "Expires 4 October", value: "unchanged · raising a ceiling does not extend a grant" },
    { label: "9 executions left", value: "unchanged · the count is not reset by this" },
  ],
  closingNote:
    "It is one person's judgement, written down with a scope, a ceiling, a count and an expiry, so that nine more sends can happen without her reading each one. Every part of it can be quoted back at her in October, which is what makes it different from having simply given somebody the ability to send.",
};

// ───────────────────────── CP15 · STOP A CAMPAIGN (modal) ─────────────────────────

export const CP15_BASE_ROWS: { campaign: string; audience: string; held: string; day: string; state: string; stateTone: CpTone }[] = [
  { campaign: "Reactivation · wave one", audience: "90,000", held: "10,000", day: "12", state: "contaminated", stateTone: "risk" },
  { campaign: "Basket prompt · rerun", audience: "15,860", held: "1,586", day: "1", state: "running", stateTone: "ai" },
];

export const CP15_STOP_PRESET = {
  subject: "Reactivation · wave one",
  subjectDetail: "Day 12 of 14 · 90,000 sent · holdout contaminated on 14 August",
  reasons: [
    { label: "The failure condition breached", sub: "not this one · reactivation is at 11.2%, above the 6% line", on: false, blocked: true },
    { label: "The measurement is broken", sub: "the holdout was contaminated · the result cannot be read", on: true, blocked: false },
    { label: "Somebody complained about it", sub: "goes to Replies and to the room · not a reason to stop", on: false, blocked: true },
    { label: "It is not working well enough", sub: "not offered mid-flight · that is what the condition was for", on: false, blocked: true },
  ],
  consequenceTitle: "Stopping does not un-send anything",
  consequenceBody:
    "90,000 people have already received it. What stops is the remaining email follow-up to 14,000 unopened, and the campaign closes as unattributable.",
  closingNote:
    "Stopping a campaign because it feels weak, on day twelve of fourteen, is how a result becomes whatever the person watching it wanted. The failure condition was written on day zero precisely so that this decision was already made by somebody who did not yet know the answer.",
};

// ───────────────────────── CP16 · WHEN A SEND GOES WRONG (incident 1) ─────────────────────────

export const CP16_STATS: { eyebrow: string; value: string; note: string; tone: CpTone }[] = [
  { eyebrow: "Should not have received it", value: "1,204", note: "12.0% of the held group", tone: "risk" },
  { eyebrow: "Noticed by", value: "the overlap check", note: "at 04:00 on 15 August", tone: "ok" },
  { eyebrow: "Time to detection", value: "14 hours", note: "not 151 days", tone: "ok" },
  { eyebrow: "Result withdrawn", value: "₦9.1M", note: "not adjusted, withdrawn", tone: "risk" },
];

export const CP16_GUARDRAIL_ROWS: { guardrail: string; applied: string; appliedTone: CpTone; why: string; fix: string }[] = [
  { guardrail: "Frequency cap", applied: "no", appliedTone: "risk", why: "Runs at play send · this was a direct send", fix: "Enforce at send, not at build" },
  { guardrail: "Holdout exclusion", applied: "no", appliedTone: "risk", why: "The hold list lives on the play", fix: "Enforce at send, not at build" },
  { guardrail: "Permanent exclusions", applied: "yes", appliedTone: "ok", why: "Enforced in the delivery layer", fix: "—" },
  { guardrail: "Quiet hours", applied: "yes", appliedTone: "ok", why: "Enforced in the delivery layer", fix: "—" },
  { guardrail: "Opt-out suppression", applied: "yes", appliedTone: "ok", why: "Enforced in the delivery layer", fix: "—" },
];

// ───────────────────────── CP17 · SETTINGS ─────────────────────────

export const CP17_RULE_ROWS: { rule: string; currently: string; whoSetIt: string; canChange: boolean; state: string; stateTone: CpTone }[] = [
  { rule: "Every send needs a person and a re-auth", currently: "6 sends", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "A holdout unless a reason is typed", currently: "5 of 6", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "A failure condition before sending", currently: "6 sends", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Every send has an end date", currently: "6 sends", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Audience resolution is shown in full", currently: "5 steps", whoSetIt: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Frequency cap", currently: "1 in 7 days", whoSetIt: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Quiet hours", currently: "21:00 – 07:00", whoSetIt: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Message precedence", currently: "payment first", whoSetIt: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Bulk approval", currently: "—", whoSetIt: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Agents sending anything", currently: "—", whoSetIt: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Sending to one named customer", currently: "—", whoSetIt: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const CP17_KV_ROWS: { label: string; value: string; tone?: CpTone }[] = [
  { label: "Frequency cap", value: "6,400 suppressions this week · raising it lifts every response rate", tone: "warn" },
  { label: "Quiet hours", value: "shifts timing, not volume · affects open rates in Kenya most" },
  { label: "Precedence", value: "9,200 people got a payment message instead · that is a choice", tone: "ai" },
  { label: "Every change is logged", value: "with who, when and what it was before, in the campaign log", tone: "ok" },
  { label: "Comparisons across a change", value: "marked on the chart · a rate shift needs a visible cause", tone: "ok" },
];

// ───────────────────────── Agents referenced (CP01) ─────────────────────────

export const CP_AGENT_RD = REPEAT_DECAY;
export const CP_AGENT_IC = INVOLUNTARY_CHURN;
