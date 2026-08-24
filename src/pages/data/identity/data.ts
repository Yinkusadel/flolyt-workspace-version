import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";

/**
 * Data · Identity — sourced from
 * flolyt-figma-designs/Data Screens & Specs/flolyt-identity/flolyt-identity/
 * (16 frames, ID01-ID16). Content transcribed from the export's own `id_.py`
 * generator source, same approach as every prior section. See
 * docs/build-tracker.md.
 */

export type IdTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const ID_TONE_CLASS: Record<IdTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const ID_CHIP_TONE: Record<IdTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const ID_KPI_TONE: Record<IdTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

export const ID_SEGMENT_CLASS: Record<IdTone, string> = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/first states. */
export type IdentityState = "empty" | "first" | "full";
export const IDENTITY_STATE: IdentityState = "full";

export const ID_TABS = ["Who is a customer", "Unjoinable", "Duplicates", "Consent", "Erasure", "Rules"] as const;
export type IdTab = (typeof ID_TABS)[number];

// ───────────────────────── ID01 · NO IDENTITY RULE YET ──────────────────────

export const ID01_QUESTION_ROWS: { question: string; dependsOn: string; ifUnanswered: string; ifUnansweredTone: IdTone }[] = [
  { question: "What makes two records the same person?", dependsOn: "Every count in the product", ifUnanswered: "counts are inflated by an unknown amount", ifUnansweredTone: "risk" },
  { question: "What happens to a transaction with no account?", dependsOn: "Acquire, Retain and every cohort join", ifUnanswered: "orders exist that belong to nobody", ifUnansweredTone: "risk" },
  { question: "Is a re-registration a new customer?", dependsOn: "Acquisition volume and cohort dating", ifUnanswered: "new-customer counts overstate", ifUnansweredTone: "warn" },
  { question: "Do internal and test accounts count?", dependsOn: "Every rate, slightly", ifUnanswered: "small and permanent skew", ifUnansweredTone: "warn" },
];

// ───────────────────────── ID02 · THE FIRST RULE ─────────────────────────────

export const ID02_STATS: { eyebrow: string; value: string; note: string; tone: IdTone }[] = [
  { eyebrow: "Records before", value: "4.22M", note: "as previously counted", tone: "muted" },
  { eyebrow: "Customers after", value: "4.16M", note: "the rule applied", tone: "ok" },
  { eyebrow: "Merged", value: "61,000", note: "duplicates, one identity each", tone: "warn" },
  { eyebrow: "Never joinable", value: "42,000", note: "and the rule cannot fix it", tone: "risk" },
];

export const ID02_KV: { label: string; value: string; tone?: IdTone }[] = [
  { label: "Same person when", value: "verified email matches and market matches" },
  { label: "Not the same person when", value: "only a phone number matches · numbers are reused", tone: "warn" },
  { label: "A transaction with no account", value: "counted, never joined, never in a cohort", tone: "risk" },
  { label: "A re-registration", value: "one customer · the original signup date is kept", tone: "ok" },
  { label: "Internal and test accounts", value: "excluded from every figure, counted separately", tone: "ok" },
];

// ───────────────────────── ID03 · WHO IS A CUSTOMER ──────────────────────────

export const ID03_PEOPLE_SEGMENTS: { label: string; count: number; tone: IdTone }[] = [
  { label: "Reachable · a channel and consent", count: 3679900, tone: "ok" },
  { label: "Identifiable, not reachable", count: 478100, tone: "warn" },
  { label: "Counted, not identifiable", count: 42000, tone: "risk" },
];

export const ID03_TOTAL_ROWS: { total: string; what: string; figure: string; figureTone: IdTone; mayUse: string; mayNot: string; mayNotTone: IdTone }[] = [
  { total: "Counted", what: "Every record after merging", figure: "4,200,000", figureTone: "num", mayUse: "Nothing but counting", mayNot: "any rate, any cohort", mayNotTone: "risk" },
  { total: "Identifiable", what: "Has a customer record that can be joined", figure: "4,158,000", figureTone: "num", mayUse: "Segments, cohorts, every rate", mayNot: "audiences", mayNotTone: "warn" },
  { total: "Measurable", what: "Can be joined to transactions", figure: "4,158,000", figureTone: "num", mayUse: "Every figure in Revenue", mayNot: "—", mayNotTone: "muted" },
  { total: "Reachable", what: "A valid channel plus consent", figure: "3,679,900", figureTone: "ok", mayUse: "Audiences and holdouts", mayNot: "denominators", mayNotTone: "risk" },
];

// ───────────────────────── ID04 · THE RULE ───────────────────────────────────

export const ID04_CLAUSE_ROWS: { clause: string; says: string; effect: string; effectTone: IdTone; changeable: string; changeableTone: IdTone }[] = [
  { clause: "Match key", says: "Verified email plus market", effect: "61,000 merged", effectTone: "warn", changeable: "yes · with preview", changeableTone: "warn" },
  { clause: "Weak keys", says: "Phone alone never merges · numbers are reused", effect: "prevents false merges", effectTone: "ok", changeable: "yes", changeableTone: "warn" },
  { clause: "No-account transactions", says: "Counted, never joined", effect: "42,000 unjoinable", effectTone: "risk", changeable: "needs a field", changeableTone: "risk" },
  { clause: "Re-registration", says: "One customer · earliest signup date kept", effect: "11,400 affected", effectTone: "num", changeable: "yes", changeableTone: "warn" },
  { clause: "Internal accounts", says: "Excluded from every figure", effect: "1,840 excluded", effectTone: "muted", changeable: "yes", changeableTone: "ok" },
  { clause: "Manual merges", says: "Allowed, reversible, attributed", effect: "312 so far", effectTone: "num", changeable: "—", changeableTone: "muted" },
];

// ───────────────────────── ID05 · UNJOINABLE ─────────────────────────────────

export const ID05_UNJOINABLE_ROWS: {
  what: string;
  count: string;
  countTone: IdTone;
  why: string;
  breaks: string;
  fixableBy: string;
  fixableByTone: IdTone;
  asked: string;
  askedTone: IdTone;
}[] = [
  { what: "Transactions with no account", count: "42,000", countTone: "risk", why: "No customer reference on the record", breaks: "Acquire, 3 health signals, cohort joins", fixableBy: "one column", fixableByTone: "warn", asked: "28 Jul", askedTone: "warn" },
  { what: "Support contacts with no match", count: "1,204", countTone: "warn", why: "Written from an address not on file", breaks: "Contact-driver joins for those rows", fixableBy: "nothing · they chose to", fixableByTone: "muted", asked: "—", askedTone: "muted" },
  { what: "Payments with no subscription", count: "880", countTone: "muted", why: "One-off charges outside the plan model", breaks: "Nothing · they are correctly excluded", fixableBy: "—", fixableByTone: "muted", asked: "—", askedTone: "muted" },
  { what: "Referral redemptions with no referrer", count: "0", countTone: "muted", why: "The link was never instrumented", breaks: "The whole Advocate stage", fixableBy: "an event", fixableByTone: "risk", asked: "never", askedTone: "risk" },
];

// ───────────────────────── ID06 · DUPLICATES ─────────────────────────────────

export const ID06_STATS: { eyebrow: string; value: string; note: string; tone: IdTone }[] = [
  { eyebrow: "Merged by the rule", value: "61,000", note: "at v1, 12 December", tone: "num" },
  { eyebrow: "Merged manually", value: "312", note: "each attributed", tone: "num" },
  { eyebrow: "Suspected, unmerged", value: "84,000", note: "weak keys only", tone: "warn" },
  { eyebrow: "Merges reversed", value: "7", note: "all within a week", tone: "muted" },
];

export const ID06_DUPLICATE_ROWS: {
  signal: string;
  pairs: string;
  pairsTone: IdTone;
  whyDeclines: string;
  wouldBeRight: string;
  wouldBeRightTone: IdTone;
  action: string;
  actionTone: IdTone;
  rowAction?: "merge";
}[] = [
  { signal: "Same phone, different email", pairs: "62,000", pairsTone: "warn", whyDeclines: "Numbers are reused and reassigned", wouldBeRight: "sometimes · unknowable in bulk", wouldBeRightTone: "warn", action: "review individually", actionTone: "muted" },
  { signal: "Same name and market", pairs: "18,000", pairsTone: "warn", whyDeclines: "Names are not unique", wouldBeRight: "rarely", wouldBeRightTone: "risk", action: "leave", actionTone: "muted" },
  { signal: "Same device, different account", pairs: "4,100", pairsTone: "num", whyDeclines: "Shared households and shared devices", wouldBeRight: "sometimes", wouldBeRightTone: "warn", action: "leave", actionTone: "muted" },
  { signal: "Same unverified email", pairs: "2,900", pairsTone: "num", whyDeclines: "Unverified addresses can be typos or claims", wouldBeRight: "often", wouldBeRightTone: "ok", action: "review individually", actionTone: "warn", rowAction: "merge" },
];

// ───────────────────────── ID07 · CONSENT ────────────────────────────────────

export const ID07_STATE_ROWS: { state: string; people: string; peopleTone: IdTone; permits: string; setBy: string; enforced: string }[] = [
  { state: "Contact permitted", people: "3,679,900", peopleTone: "ok", permits: "Campaigns, replies, service messages", setBy: "the customer", enforced: "delivery layer" },
  { state: "Service messages only", people: "218,000", peopleTone: "warn", permits: "Payment and delivery notices, not campaigns", setBy: "the customer", enforced: "delivery layer" },
  { state: "Opted out entirely", people: "6,100", peopleTone: "warn", permits: "Nothing · including being in a holdout", setBy: "the customer", enforced: "delivery layer" },
  { state: "Suppressed by policy", people: "254,000", peopleTone: "muted", permits: "Nothing · inactive over 18 months", setBy: "Ada", enforced: "delivery layer" },
  { state: "Consent state unknown", people: "0", peopleTone: "ok", permits: "Nothing · unknown is treated as opted out", setBy: "—", enforced: "delivery layer" },
];

// ───────────────────────── ID08 · ERASURE ────────────────────────────────────

export const ID08_STATS: { eyebrow: string; value: string; note: string; tone: IdTone }[] = [
  { eyebrow: "Requests this year", value: "1,204", note: "all completed", tone: "ok" },
  { eyebrow: "Median completion", value: "under 24h", note: "automated", tone: "ok" },
  { eyebrow: "Figures restated because of one", value: "0", note: "aggregates are not personal", tone: "ok" },
  { eyebrow: "Requests refused", value: "0", note: "and there is no refusal path", tone: "ok" },
];

export const ID08_STEP_ROWS: { step: string; what: string; when: string; whenTone: IdTone; reversible: string; reversibleTone: IdTone }[] = [
  { step: "1", what: "The request is recorded with its source and date", when: "immediately", whenTone: "muted", reversible: "no", reversibleTone: "risk" },
  { step: "2", what: "The identity and all personal fields are removed", when: "within 24h", whenTone: "ok", reversible: "no", reversibleTone: "risk" },
  { step: "3", what: "Their reply threads are removed and theme counts decrement", when: "within 24h", whenTone: "ok", reversible: "no", reversibleTone: "risk" },
  { step: "4", what: "Their transactions remain, unlinked and anonymous", when: "immediately", whenTone: "muted", reversible: "—", reversibleTone: "muted" },
  { step: "5", what: "Cohort and segment counts recompute", when: "next run", whenTone: "ok", reversible: "—", reversibleTone: "muted" },
  { step: "6", what: "Closed rooms and ledger entries keep their figures", when: "unchanged", whenTone: "ok", reversible: "—", reversibleTone: "muted" },
];

// ───────────────────────── ID09 · CHANGE THE RULE (modal) ───────────────────

export const ID09_PREVIEW_ROWS: { label: string; value: string; tone: IdTone }[] = [
  { label: "Records merged", value: "84,000 more", tone: "warn" },
  { label: "Customer count", value: "4.16M → 4.08M", tone: "warn" },
  { label: "Every historical count", value: "restated, both versions kept", tone: "risk" },
  { label: "Cohort sizes", value: "every cohort since December moves", tone: "risk" },
  { label: "False merges expected", value: "unknown · phone numbers are reassigned", tone: "risk" },
];

// ───────────────────────── ID10 · MERGE TWO RECORDS (modal) ─────────────────

export const ID10_MERGE_ROWS: { label: string; sub: string; tone: IdTone }[] = [
  { label: "Transactions combine", sub: "17 orders become one history", tone: "ok" },
  { label: "The earliest signup date is kept", sub: "cohort dating follows the original", tone: "ok" },
  { label: "Consent is the stricter of the two", sub: "never the more permissive", tone: "ok" },
  { label: "Both source records are retained", sub: "which is what makes this reversible", tone: "ok" },
];

// ───────────────────────── ID11 · A FALSE MERGE ──────────────────────────────

export const ID11_TIMELINE_ROWS: { when: string; what: string; effect: string; effectTone: IdTone }[] = [
  { when: "2 Jun", what: "A manual merge on matching phone and market", effect: "two people become one record", effectTone: "risk" },
  { when: "4 Jun", what: "The merged record enters a reactivation audience", effect: "one send, to the wrong person", effectTone: "risk" },
  { when: "11 Jun", what: "A reply arrives saying the order was not theirs", effect: "a person notices", effectTone: "warn" },
  { when: "11 Jun", what: "Merge reversed · both records restored", effect: "consent states restored separately", effectTone: "ok" },
  { when: "11 Jun", what: "The send is recorded as reaching a non-consenting person", effect: "logged, not hidden", effectTone: "ok" },
  { when: "12 Jun", what: "Phone-only matching removed from manual merge suggestions", effect: "the rule that came from it", effectTone: "ok" },
];

// ───────────────────────── ID12 · WHAT DEPENDS ON IDENTITY ──────────────────

export const ID12_DEPENDENCY_ROWS: {
  what: string;
  totalUsed: string;
  ruleChange: string;
  ruleChangeTone: IdTone;
  unjoinable: string;
  unjoinableTone: IdTone;
}[] = [
  { what: "Every segment", totalUsed: "identifiable", ruleChange: "yes · all sizes move", ruleChangeTone: "risk", unjoinable: "42,000 excluded", unjoinableTone: "warn" },
  { what: "Every cohort", totalUsed: "identifiable", ruleChange: "yes · dating and size", ruleChangeTone: "risk", unjoinable: "42,000 excluded", unjoinableTone: "warn" },
  { what: "Every audience", totalUsed: "reachable", ruleChange: "yes", ruleChangeTone: "risk", unjoinable: "42,000 excluded", unjoinableTone: "warn" },
  { what: "Every holdout", totalUsed: "reachable", ruleChange: "yes", ruleChangeTone: "risk", unjoinable: "42,000 excluded", unjoinableTone: "warn" },
  { what: "Repeat and retention rates", totalUsed: "measurable", ruleChange: "yes · denominators move", ruleChangeTone: "risk", unjoinable: "understated", unjoinableTone: "risk" },
  { what: "Acquisition volume", totalUsed: "counted", ruleChange: "yes · merges reduce it", ruleChangeTone: "risk", unjoinable: "overstated", unjoinableTone: "risk" },
  { what: "The value ledger", totalUsed: "—", ruleChange: "no · closed figures stand", ruleChangeTone: "ok", unjoinable: "no", unjoinableTone: "ok" },
];

// ───────────────────────── ID13 · AN ERASURE REQUEST (modal) ────────────────

export const ID13_REMOVED_ROWS: { label: string; sub: string; tone: IdTone }[] = [
  { label: "The identity record", sub: "name, email, phone, address · within 24 hours", tone: "ok" },
  { label: "Two reply threads", sub: "and their contribution to two theme counts", tone: "ok" },
  { label: "Membership of four cohorts", sub: "sizes recompute on the next run", tone: "ok" },
  { label: "Any pending audience membership", sub: "immediately, before the next send", tone: "ok" },
];

// ───────────────────────── ID14 · WHAT THIS CANNOT FIX ──────────────────────

export const ID14_LIMIT_ROWS: { problem: string; canFix: boolean; why: string; wouldFix: string; wouldFixTone: IdTone }[] = [
  { problem: "Two accounts for one person, same email", canFix: true, why: "The match key handles it", wouldFix: "the rule", wouldFixTone: "ai" },
  { problem: "A transaction with no account", canFix: false, why: "There is nothing to match on", wouldFix: "one column on the source", wouldFixTone: "warn" },
  { problem: "Two people sharing an email", canFix: false, why: "They will merge and should not", wouldFix: "nothing · it is rare and invisible", wouldFixTone: "risk" },
  { problem: "A person with two genuinely separate accounts", canFix: false, why: "Business and personal, deliberately apart", wouldFix: "nothing · merging would be wrong", wouldFixTone: "muted" },
  { problem: "A referral with no link to a referrer", canFix: false, why: "The relationship was never recorded", wouldFix: "an event that does not exist", wouldFixTone: "risk" },
  { problem: "A customer who changed email and market", canFix: false, why: "Both keys changed at once", wouldFix: "a manual merge, if noticed", wouldFixTone: "warn" },
];

// ───────────────────────── ID15 · SETTINGS ───────────────────────────────────

export const ID15_RULE_ROWS: { rule: string; currently: string; currentlyTone: IdTone; who: string; canChange: boolean; changeLabel?: string; state: string; stateTone: IdTone }[] = [
  { rule: "Every count carries its identity rule version", currently: "v1", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "A rule change requires a preview and restates history", currently: "0 changes", currentlyTone: "ok", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Consent resolves to the stricter state on merge", currently: "312 merges", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Unknown consent is treated as opted out", currently: "0 unknown", currentlyTone: "ok", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Merges retain both source records", currently: "312", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Erasure completes without approval", currently: "1,204", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "The match key", currently: "email + market", currentlyTone: "neutral", who: "Ada", canChange: true, changeLabel: "yes · with preview", state: "on", stateTone: "ok" },
  { rule: "Inactivity suppression", currently: "18 months", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Automatic merging on weak keys", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Probabilistic identity matching", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Restating the ledger on a rule change", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const ID15_USED_KV: { label: string; value: string; tone: IdTone }[] = [
  { label: "Segments and cohorts", value: "identifiable is the denominator for both", tone: "ai" },
  { label: "Campaigns and experiments", value: "reachable is the denominator, and consent is enforced below", tone: "ok" },
  { label: "Revenue", value: "measurable is the denominator for every rate", tone: "ok" },
  { label: "Schema", value: "the match key is a mapped field with a written meaning", tone: "ok" },
  { label: "Governance", value: "erasure and consent events are logged like everything else", tone: "ok" },
];
