import type { ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import type { KpiTone } from "@/pages/everyday/lifecycle/stage/kpi-cards";

/**
 * Agents · Marketplace — sourced from
 * flolyt-figma-designs/Agents Screens/flolyt-marketplace/flolyt-marketplace/
 * (14 frames, MK01-MK14). Content transcribed from the export's own `mk.py`
 * generator source, same approach as ai-teammates. See docs/build-tracker.md.
 *
 * MK05 ("What it would read") calls the shared subtabs() with "What arrives"
 * active, same as every other real tab screen (MK03/06/07/10) — "What
 * arrives" genuinely is one of the five TABS, unlike AI Teammates' TM12 (see
 * [[figma_tab_mislabel_check]]). But MK05's own footer route template is
 * "/agents/marketplace/:id/access", scoped to one specific listing
 * (Payment retry timing) rather than generic. Built here as a flat generic
 * tab at /marketplace/what-arrives that uses that listing as its worked
 * example — the content MK05 already has — rather than a true :id-scoped
 * route, so the tab bar stays consistently five real, generically-reachable
 * tabs. MK04 ("One listing") is the genuine per-listing :id page, reached by
 * clicking a listing row, and correctly uses crumb() rather than subtabs()
 * in its own source.
 */

export type MkTone = "ok" | "warn" | "risk" | "ai" | "muted" | "neutral" | "num";

export const MK_TONE_CLASS: Record<MkTone, string> = {
  ok: "text-teal",
  warn: "text-amber",
  risk: "text-rose",
  ai: "text-ultra",
  muted: "text-ink-4",
  neutral: "text-ink-3",
  num: "text-ink",
};

export const MK_CHIP_TONE: Record<MkTone, ChipTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "ultra",
  muted: "neutral",
  neutral: "neutral",
  num: "neutral",
};

export const MK_KPI_TONE: Record<MkTone, KpiTone> = {
  ok: "teal",
  warn: "amber",
  risk: "rose",
  ai: "teal",
  muted: "ink",
  neutral: "ink",
  num: "ink",
};

/** Wired but unreachable with this default — same "not wired, no demo state currently triggers it" situation as every prior rebuild's empty/edge states. */
export type MarketplaceState = "nothing" | "first" | "full";
export const MARKETPLACE_STATE: MarketplaceState = "full";

export const MK_TABS = ["Available", "Installed", "Publishers", "What arrives", "Requested"] as const;
export type MkTab = (typeof MK_TABS)[number];

export const MARKETPLACE_LISTING_TITLES: Record<string, string> = {
  "retry-timing": "Payment retry timing",
};

// ───────────────────────── MK01 · NOTHING INSTALLED ─────────────────────────

export const MK01_ROWS: { what: string; example: string; arrives: string; arrivesTone: MkTone; why: string; whyTone: MkTone }[] = [
  { what: "The agent itself", example: "What it watches, reads and how it states things", arrives: "yes", arrivesTone: "ok", why: "it is a method", whyTone: "muted" },
  { what: "Its preconditions", example: "Needs 90 days of card history", arrives: "yes", arrivesTone: "ok", why: "it is a constraint", whyTone: "muted" },
  { what: "How many companies use it", example: "61 · a count of experience", arrives: "yes", arrivesTone: "warn", why: "a count, not an outcome", whyTone: "warn" },
  { what: "What it found for them", example: "₦62M at another company", arrives: "never", arrivesTone: "risk", why: "that is their business", whyTone: "risk" },
  { what: "A success rate", example: "Works 78% of the time", arrives: "never", arrivesTone: "risk", why: "88 results averaged is a benchmark", whyTone: "risk" },
  { what: "A rating out of five", example: "4.6 stars", arrives: "never", arrivesTone: "risk", why: "it is a success rate with a nicer face", whyTone: "risk" },
];

// ───────────────────────── MK02 · THE FIRST INSTALL ─────────────────────────

export const MK02_STATS: { eyebrow: string; value: string; note: string; tone: MkTone }[] = [
  { eyebrow: "Installed", value: "14 days ago", note: "by Ada, with a re-auth", tone: "muted" },
  { eyebrow: "Findings", value: "1", note: "the contaminated holdout", tone: "ok" },
  { eyebrow: "Record here", value: "1 of 1", note: "and it starts again at zero", tone: "ai" },
  { eyebrow: "What came with it", value: "nothing", note: "no results, no rating", tone: "muted" },
];

export const MK02_ROWS: { known: string; notKnown: string; whyNot: string; whyNotTone: MkTone }[] = [
  { known: "What it watches and how often", notKnown: "Whether it works", whyNot: "no results travel", whyNotTone: "risk" },
  { known: "What data it needs to read", notKnown: "How much it found for anybody else", whyNot: "that is their business", whyNotTone: "risk" },
  { known: "That 34 companies use it", notKnown: "How many of them found anything", whyNot: "a count is not an outcome", whyNotTone: "warn" },
  { known: "Who published it and that they are verified", notKnown: "Whether they are good at this", whyNot: "verified means reviewed, not endorsed", whyNotTone: "warn" },
];

// ───────────────────────── MK03 · AVAILABLE ─────────────────────────

export const MK03_STATS: { eyebrow: string; value: string; note: string; tone: MkTone }[] = [
  { eyebrow: "Available", value: "34", note: "11 Flolyt · 19 partner · 4 requested", tone: "num" },
  { eyebrow: "Installed here", value: "2", note: "of 12 running", tone: "num" },
  { eyebrow: "Would work here today", value: "19", note: "the rest fail a precondition", tone: "warn" },
  { eyebrow: "Ratings or success rates", value: "0", note: "and there never will be", tone: "muted" },
];

export const MK03_ROWS: {
  agent: string;
  id?: string;
  watches: string;
  publisher: string;
  publisherTone: MkTone;
  companies: string;
  companiesTone: MkTone;
  needs: string;
  here: string;
  hereTone: MkTone;
}[] = [
  { agent: "Hold list integrity", watches: "Every send against every hold list", publisher: "partner", publisherTone: "muted", companies: "34", companiesTone: "num", needs: "Send logs · you have them", here: "installed", hereTone: "ok" },
  { agent: "Payment retry timing", id: "retry-timing", watches: "Failed payments by local hour", publisher: "Flolyt", publisherTone: "ai", companies: "61", companiesTone: "ok", needs: "90 days of card volume", here: "would work", hereTone: "ok" },
  { agent: "Schema drift", watches: "Column changes in connected sources", publisher: "Flolyt", publisherTone: "ai", companies: "58", companiesTone: "ok", needs: "Nothing · reads metadata", here: "duplicate", hereTone: "warn" },
  { agent: "Refund velocity", watches: "Refunds by market and reason", publisher: "partner", publisherTone: "muted", companies: "44", companiesTone: "num", needs: "A reason field · yours is 71% empty", here: "would be thin", hereTone: "warn" },
  { agent: "Referral attribution", watches: "Referrer to referred customer", publisher: "partner", publisherTone: "muted", companies: "31", companiesTone: "num", needs: "A referral event · never built here", here: "cannot run", hereTone: "risk" },
  { agent: "Subscription cohorting", watches: "Renewal cohorts by plan and term", publisher: "Flolyt", publisherTone: "ai", companies: "52", companiesTone: "ok", needs: "Plan history · you have it", here: "would work", hereTone: "ok" },
  { agent: "Margin watch", watches: "Margin by product and market", publisher: "partner", publisherTone: "muted", companies: "41", companiesTone: "num", needs: "COGS · missing since 12 January", here: "cannot run", hereTone: "risk" },
];

// ───────────────────────── MK04 · ONE LISTING (retry-timing) ─────────────────────────

export const MK04_HERO = {
  leftLabel: "companies using it",
  leftBig: "61",
  sub: "A count of how many workspaces have it installed. Not a success rate, not a rating, and not a claim that it worked for any of them.",
  rightLabel: "results shown",
  rightBig: "none",
  rightSub: "and none exist to show",
};

export const MK04_ROWS: { field: string; says: string; verified: string }[] = [
  { field: "What it watches", says: "Failed payments, grouped by the customer's local hour", verified: "yes" },
  { field: "What it reads", says: "payments and customers · read-only, timezone and outcome only", verified: "yes" },
  { field: "Preconditions", says: "90 days of card volume · a local timezone on the record", verified: "yes" },
  { field: "Strongest claim it may make", says: "Association · it has no control group", verified: "yes" },
  { field: "What it will not do", says: "The same nine limits as every agent here", verified: "yes" },
  { field: "What it found for anybody", says: "Not published, and never will be", verified: "n/a" },
];

export const MK04_KV: { label: string; value: string; tone?: MkTone }[] = [
  { label: "Preconditions", value: "both met · 18 months of card volume, timezone on every record", tone: "ok" },
  { label: "Overlap", value: "Involuntary Churn already watches failed payments · this is narrower", tone: "warn" },
  { label: "Cost", value: "roughly ₦6 a run · it reads 612k rows", tone: "muted" },
  { label: "Record here", value: "zero · it earns one on your customers or it does not", tone: "ai" },
  { label: "What you would learn in a fortnight", value: "whether local-hour timing matters outside Nigeria and Kenya", tone: "ok" },
];

// ───────────────────────── MK05 · WHAT ARRIVES (worked example: retry-timing) ─────────────────────────

export const MK05_ROWS: { source: string; rows: string; rowsTone: MkTone; fieldsRead: string; fieldsNot: string; access: string; accessTone: MkTone }[] = [
  { source: "payments", rows: "612k", rowsTone: "num", fieldsRead: "outcome, attempted_at, amount", fieldsNot: "card number, token, holder name", access: "read-only", accessTone: "ok" },
  { source: "customers", rows: "4.16M", rowsTone: "num", fieldsRead: "timezone, market, created_at", fieldsNot: "name, email, phone, address", access: "read-only", accessTone: "ok" },
  { source: "orders", rows: "—", rowsTone: "muted", fieldsRead: "none · not requested", fieldsNot: "everything", access: "not granted", accessTone: "muted" },
  { source: "tickets", rows: "—", rowsTone: "muted", fieldsRead: "none · not requested", fieldsNot: "everything", access: "not granted", accessTone: "muted" },
];

// ───────────────────────── MK06 · PUBLISHERS ─────────────────────────

export const MK06_ROWS: { publisher: string; agents: string; agentsTone: MkTone; meaning: string; reviewedBy: string; notMean: string }[] = [
  { publisher: "Flolyt", agents: "11", agentsTone: "ai", meaning: "Built and maintained by the people who built this", reviewedBy: "Flolyt", notMean: "that it suits you" },
  { publisher: "Verified partner", agents: "19", agentsTone: "num", meaning: "Reviewed for what it reads and what it claims", reviewedBy: "Flolyt", notMean: "endorsed, or that it works" },
  { publisher: "Customer, by request", agents: "4", agentsTone: "num", meaning: "Built by another company and reviewed before listing", reviewedBy: "Flolyt", notMean: "that the company is named" },
  { publisher: "Anyone, unreviewed", agents: "0", agentsTone: "muted", meaning: "Not offered · nothing lists without review", reviewedBy: "—", notMean: "—" },
];

export const MK06_CUSTOM_ROWS: { agent: string; publishedBecause: string; requestedBy: string; reviewTook: string; reviewTookTone: MkTone; companyNamed: string }[] = [
  { agent: "Hold list integrity", publishedBecause: "Six companies asked the same question in the community", requestedBy: "a customer", reviewTook: "3 weeks", reviewTookTone: "muted", companyNamed: "no" },
  { agent: "Reseller terms watch", publishedBecause: "A pattern several markets share", requestedBy: "a customer", reviewTook: "5 weeks", reviewTookTone: "muted", companyNamed: "no" },
  { agent: "Weekend cadence", publishedBecause: "Withdrawn · could not be measured anywhere", requestedBy: "a customer", reviewTook: "rejected", reviewTookTone: "risk", companyNamed: "no" },
  { agent: "Seasonal basket", publishedBecause: "Awaiting review · 11 weeks", requestedBy: "a customer", reviewTook: "in review", reviewTookTone: "warn", companyNamed: "no" },
];

// ───────────────────────── MK07 · INSTALLED HERE ─────────────────────────

export const MK07_ROWS: {
  agent: string;
  publisher: string;
  publisherTone: MkTone;
  installed: string;
  findings: string;
  findingsTone: MkTone;
  tested: string;
  testedTone: MkTone;
  cost: string;
  elsewhere: string;
}[] = [
  { agent: "Hold list integrity", publisher: "partner", publisherTone: "muted", installed: "14 days ago", findings: "1", findingsTone: "ok", tested: "n/a", testedTone: "muted", cost: "₦180", elsewhere: "unknown" },
  { agent: "Subscription cohorting", publisher: "Flolyt", publisherTone: "ai", installed: "Feb", findings: "4", findingsTone: "num", tested: "0 of 4", testedTone: "warn", cost: "₦410", elsewhere: "unknown" },
];

export const MK07_KV: { label: string; value: string; tone?: MkTone }[] = [
  { label: "Limits", value: "identical · the nine apply unchanged", tone: "ok" },
  { label: "Data access", value: "narrower · per field, approved at install", tone: "ok" },
  { label: "Pausing", value: "identical · anybody, one click", tone: "ok" },
  { label: "Updates", value: "the publisher may update it · a material change needs re-approval", tone: "warn" },
  { label: "Uninstalling", value: "removes it and keeps its findings, like retiring a built one", tone: "ok" },
  { label: "Its record", value: "starts at zero here and never imports anything", tone: "ai" },
];

// ───────────────────────── MK08 · INSTALL (modal, retry-timing) ─────────────────────────

export const MK08_PRESET = {
  title: "Install Payment retry timing",
  meta: "Published by Flolyt · used by 61 companies · no results shown",
  granting: [
    { label: "Six fields across two sources", sub: "outcome, attempted_at, amount, timezone, market, created_at", tone: "ok" as MkTone },
    { label: "No personal fields", sub: "no name, email, phone, card token or address", tone: "ok" as MkTone },
    { label: "About ₦6 a run", sub: "612k rows · roughly ₦180 a month", tone: "muted" as MkTone },
    { label: "Findings into Kunle's queue", sub: "he owns Renew · he asked for this", tone: "warn" as MkTone },
  ],
  overlapTitle: "Involuntary Churn already watches failed payments",
  overlapBody: "This is narrower and may find things it misses. It may also produce a second opinion on the same events, which the Orchestrator would raise as a disagreement.",
};

// ───────────────────────── MK09 · UNINSTALL (modal, subscription cohorting) ─────────────────────────

export const MK09_PRESET = {
  title: "Uninstall Subscription cohorting",
  meta: "Installed February · 4 findings · none tested · ₦410 so far",
  reason: "Its cohorts split by plan term and ours are the same term everywhere, so all four findings said the same thing.",
  publisherSees: [
    { label: "That one workspace uninstalled it", sub: "the count moves from 52 to 51", tone: "ok" as MkTone },
    { label: "Your reason, if you send it", sub: "optional · it is a missing precondition, not a result", tone: "warn" as MkTone },
    { label: "Your findings", sub: "never · they are about your customers", tone: "risk" as MkTone },
    { label: "Your name", sub: "never · publishers do not learn who installs", tone: "risk" as MkTone },
  ],
};

// ───────────────────────── MK10 · REQUESTED ─────────────────────────

export const MK10_ROWS: { what: string; kind: string; kindTone: MkTone; asked: string; state: string; stateTone: MkTone; happened: string; named: string }[] = [
  { what: "Release Watch", kind: "publish ours", kindTone: "ai", asked: "today", state: "in review", stateTone: "warn", happened: "Built here this morning by Ifeoma", named: "no" },
  { what: "Something that watches referral revenue", kind: "wanted", kindTone: "warn", asked: "Apr", state: "exists · cannot run", stateTone: "risk", happened: "Needs an event never built here", named: "—" },
  { what: "Something that watches reseller terms", kind: "wanted", kindTone: "warn", asked: "Aug", state: "listed", stateTone: "ok", happened: "Another company had already published one", named: "no" },
  { what: "Weekend cadence watch", kind: "publish ours", kindTone: "ai", asked: "Mar", state: "rejected", stateTone: "risk", happened: "It cannot produce a finding anywhere", named: "no" },
];

// ───────────────────────── MK11 · A LISTING THAT CHANGED ─────────────────────────

export const MK11_HERO = {
  leftLabel: "the publisher has changed what it reads",
  leftBig: "1 new field",
  sub: "It now wants the send channel as well as the send log. Installed agents do not update themselves when the ask changes.",
  rightLabel: "state",
  rightBig: "Paused",
  rightSub: "until somebody approves",
};

export const MK11_ROWS: { field: string; before: string; after: string; needsApproval: string; needsApprovalTone: MkTone }[] = [
  { field: "Fields it reads", before: "send_id, customer_id, sent_at", after: "and channel", needsApproval: "yes", needsApprovalTone: "risk" },
  { field: "What it watches", before: "Sends against hold lists", after: "unchanged", needsApproval: "no", needsApprovalTone: "muted" },
  { field: "Claim ceiling", before: "Constraint only", after: "unchanged", needsApproval: "no", needsApprovalTone: "muted" },
  { field: "Cost", before: "₦180 a month", after: "₦190 a month", needsApproval: "no", needsApprovalTone: "muted" },
  { field: "Its record here", before: "1 finding · the contaminated holdout", after: "kept", needsApproval: "—", needsApprovalTone: "muted" },
];

// ───────────────────────── MK12 · WHAT THIS IS NOT ─────────────────────────

export const MK12_ROWS: { feature: string; askedFor: string; askedForTone: MkTone; why: string; insteadAnswer: string }[] = [
  { feature: "Star ratings", askedFor: "7 times", askedForTone: "warn", why: "An average of other companies' outcomes", insteadAnswer: "the install count" },
  { feature: "Success rates", askedFor: "5 times", askedForTone: "warn", why: "The same thing with a decimal point", insteadAnswer: "your own record after a fortnight" },
  { feature: "Testimonials", askedFor: "3 times", askedForTone: "muted", why: "A result with a company's name attached", insteadAnswer: "the community's questions" },
  { feature: "“Agents like this one”", askedFor: "2 times", askedForTone: "muted", why: "Requires knowing your size and market", insteadAnswer: "the precondition check" },
  { feature: "A revenue estimate per agent", askedFor: "4 times", askedForTone: "warn", why: "It would be somebody else's revenue", insteadAnswer: "run it and measure it here" },
  { feature: "Trials with a results guarantee", askedFor: "1 time", askedForTone: "muted", why: "Nobody can guarantee a result on your data", insteadAnswer: "uninstall costs nothing" },
];

// ───────────────────────── MK13 · SETTINGS ─────────────────────────

export const MK13_ROWS: { rule: string; currently: string; currentlyTone: MkTone; who: string; canChange: boolean; state: string; stateTone: MkTone }[] = [
  { rule: "Nothing lists without review", currently: "34", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "No results, ratings or success rates", currently: "—", currentlyTone: "muted", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Data access is granted per field", currently: "6 fields", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "A new field needs a new approval", currently: "1 waiting", currentlyTone: "warn", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Installed agents inherit the nine limits", currently: "2", currentlyTone: "num", who: "product", canChange: false, state: "on", stateTone: "ok" },
  { rule: "Who may install", currently: "Ada", currentlyTone: "neutral", who: "Ada", canChange: true, state: "on", stateTone: "ok" },
  { rule: "Publishers learn who installed", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Findings shared back to a publisher", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Auto-updating an agent's data access", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
  { rule: "Unreviewed agents from anybody", currently: "—", currentlyTone: "muted", who: "—", canChange: false, state: "off by design", stateTone: "neutral" },
];

export const MK13_ELSEWHERE_KV: { label: string; value: string; tone?: MkTone }[] = [
  { label: "Agent Builder", value: "an installed agent behaves like a built one · zero record, same limits", tone: "ok" },
  { label: "Community", value: "the same wall · methods travel, results never do", tone: "ai" },
  { label: "Benchmarks", value: "refuses external figures · a rating here would undo that", tone: "risk" },
  { label: "Governance", value: "holds the data access and the budget for installed agents too", tone: "ok" },
  { label: "Business memory", value: "an installed agent writes constraints, like any other", tone: "ok" },
];
