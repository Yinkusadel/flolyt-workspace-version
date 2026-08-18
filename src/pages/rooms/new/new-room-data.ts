import { AMARA, RAVI, REPEAT_DECAY, SAM, TUNDE, ZAINAB } from "@/pages/rooms/data";
import type { AgentRef, PersonRef, Tone } from "@/pages/rooms/types";

/** Static content for the new-room wizard (`/rooms/new`) — R06–R11. */

export type SimilarRoom = {
  title: string;
  population: string;
  overlap: string;
  overlapTone: Tone;
  owner: PersonRef;
  state: string;
  stateTone: Tone;
  action: string;
  actionTone: Tone;
};

export const SIMILAR_ROOMS: SimilarRoom[] = [
  {
    title: "Checkout abandoned at delivery fee",
    population: "308,000",
    overlap: "91,400",
    overlapTone: "rose",
    owner: ZAINAB,
    state: "open",
    stateTone: "amber",
    action: "join instead?",
    actionTone: "ultra",
  },
  {
    title: "Thursday win-back",
    population: "218,000",
    overlap: "31,900",
    overlapTone: "amber",
    owner: { initials: "IN", name: "Ifeoma Nwosu", department: "Marketing" },
    state: "open",
    stateTone: "amber",
    action: "note the overlap",
    actionTone: "amber",
  },
  {
    title: "Weekend push fatigue",
    population: "94,000",
    overlap: "2,100",
    overlapTone: "neutral",
    owner: { initials: "IN", name: "Ifeoma Nwosu", department: "Marketing" },
    state: "recovering",
    stateTone: "ultra",
    action: "unrelated",
    actionTone: "neutral",
  },
];

export type ConditionFilterRow = { field: string; operator: string; value: string };

export const AUDIENCE_FILTERS: ConditionFilterRow[] = [
  { field: "Acquired between", operator: "is", value: "1 Mar and 31 May 2026" },
  { field: "Orders placed", operator: "is exactly", value: "1" },
  { field: "Days since first order", operator: "is more than", value: "90" },
  { field: "Markets", operator: "is any of", value: "Nigeria" },
];

export type DropoutRow = { label: string; customers: string; tone: Tone; why: string; whyTone: Tone };

export const DROPOUT_ROWS: DropoutRow[] = [
  { label: "Match the condition", customers: "148,000", tone: "neutral", why: "", whyTone: "neutral" },
  { label: "No contact details · guest checkout", customers: "−42,000", tone: "rose", why: "cannot be reached by anyone, ever", whyTone: "neutral" },
  { label: "Opted out or erasure requested", customers: "−2,400", tone: "rose", why: "excluded permanently, in every room", whyTone: "neutral" },
  { label: "Already in Thursday's win-back", customers: "−6,000", tone: "amber", why: "would breach the frequency cap", whyTone: "neutral" },
  { label: "Reachable by anything this room does", customers: "100,000", tone: "teal", why: "this is the number the room will carry", whyTone: "teal" },
];

export type SuggestedPerson = { person: PersonRef; team: string; why: string; roomCount: number; added: boolean };

export const SUGGESTED_PEOPLE: SuggestedPerson[] = [
  { person: TUNDE, team: "Sales", why: "Owns Acquire · the cohort came from his channels", roomCount: 11, added: true },
  { person: AMARA, team: "Support", why: "Support saw the first signal on 11 March", roomCount: 6, added: true },
  { person: RAVI, team: "Finance", why: "Any offer or discount needs his approval", roomCount: 9, added: true },
  { person: ZAINAB, team: "Product", why: "Owns the checkout the fee sits in", roomCount: 8, added: false },
  { person: SAM, team: "Engineering", why: "Shipped the 4 March release", roomCount: 3, added: false },
];

export type SuggestedAgent = {
  agent: AgentRef;
  does: string;
  role: string;
  roleTone: Tone;
  reads: string;
  added: boolean;
  locked?: boolean;
};

export const SUGGESTED_AGENTS: SuggestedAgent[] = [
  { agent: REPEAT_DECAY, does: "Owns the reading · repeat rate, cohorts, reactivation response", role: "lead", roleTone: "ultra", reads: "orders", added: true },
  { agent: { initials: "AQ", name: "Acquisition Quality" }, does: "Half this cohort's behaviour was decided in Acquire", role: "supporting", roleTone: "neutral", reads: "orders, ad spend", added: true },
  { agent: { initials: "MO", name: "Orchestrator" }, does: "Arbitrates when two agents disagree · does not pick sides", role: "automatic", roleTone: "neutral", reads: "everything", added: true, locked: true },
  { agent: { initials: "PX", name: "Price & Margin" }, does: "Would price any discount · currently blocked on COGS", role: "optional", roleTone: "neutral", reads: "billing", added: false },
];

export type SettleOption = { label: string; sub: string; offered: boolean };

export const SETTLE_OPTIONS: SettleOption[] = [
  { label: "A measured outcome is in", sub: "A play runs against a holdout and the result is read", offered: true },
  { label: "The cause is disproven", sub: "The evidence stops supporting it and we say so", offered: true },
  { label: "Someone decides no action is worth taking", sub: "A valid close · the reading was real, acting costs more", offered: true },
  { label: "A deadline passes", sub: "Not offered · a date is not an answer", offered: false },
];

export type MeasureRow = { label: string; setting: string; why: string; whyTone: Tone };

export const MEASURE_ROWS: MeasureRow[] = [
  { label: "Holdout", setting: "10% · 10,000 customers not contacted", why: "without it, no honest number at close", whyTone: "amber" },
  { label: "Measured over", setting: "28 days from first wave", why: "shorter than the 90-day window, by design", whyTone: "neutral" },
  { label: "Primary measure", setting: "second orders placed", why: "not opens, not clicks, not sentiment", whyTone: "teal" },
  { label: "Counted against", setting: "the ₦412M at risk", why: "recovered, not incremental revenue", whyTone: "neutral" },
  { label: "If no holdout is possible", setting: "say so and close as unmeasurable", why: "a valid outcome, not a failure", whyTone: "teal" },
];

export type DuplicateCompareRow = { field: string; yours: string; theirs: string; overlap: string; overlapTone: Tone };

export const DUPLICATE_COMPARE: DuplicateCompareRow[] = [
  { field: "Opened", yours: "now", theirs: "11 August · nine days ago", overlap: "—", overlapTone: "neutral" },
  { field: "Owner", yours: "Ifeoma Nwosu · Marketing", theirs: "Zainab Yusuf · Product", overlap: "two teams", overlapTone: "amber" },
  { field: "Population", yours: "148,000", theirs: "308,000", overlap: "91,400 in both", overlapTone: "rose" },
  { field: "At risk", yours: "₦412M", theirs: "₦124M", overlap: "₦188M would be counted twice", overlapTone: "rose" },
  { field: "The cause each is testing", yours: "The fee, seen from Retain", theirs: "The fee, seen from Activate", overlap: "identical", overlapTone: "rose" },
  { field: "What each would do", yours: "Reactivate the people already lost", theirs: "Stop losing the next ones", overlap: "complementary", overlapTone: "teal" },
];

export type ReviewRow = { label: string; value: string; tone?: Tone };

export function buildReviewRows(linked: boolean): ReviewRow[] {
  const rows: ReviewRow[] = [
    { label: "Condition", value: "Second order never happened" },
    { label: "Who is in it", value: "148,000 match · 100,000 reachable · 42,000 have no contact details", tone: "amber" },
    { label: "At risk", value: "₦412M over 90 days", tone: "rose" },
    { label: "Decision owner", value: "Ifeoma Nwosu · Marketing" },
    { label: "People", value: "Tunde Bakare, Amara Okeke, Ravi Mehta" },
    { label: "Agents", value: "Repeat & Decay leads · Acquisition Quality supports · Orchestrator arbitrates", tone: "ultra" },
    { label: "Settled when", value: "a measured outcome, a disproof, or a decision that no action is worth taking" },
    { label: "Would prove us wrong", value: "wave one reactivates below 12%" },
    { label: "Holdout", value: "10% · 10,000 customers · measured over 28 days", tone: "teal" },
  ];
  if (linked) {
    rows.push({ label: "Linked room", value: "Checkout abandoned at delivery fee · 91,400 shared", tone: "amber" });
  }
  rows.push({ label: "Notifies", value: "4 people now · Ada if it goes 7 days with no decision" });
  return rows;
}
