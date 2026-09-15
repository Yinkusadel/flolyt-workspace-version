import type { ChipTone } from "@/components/ui/chip";

/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/agents/svg/01–02. Only the registry (01)
 * and one full detail screen (02, RIA) are in scope — see this section's own note in
 * src/oldpages/README.md precedent: Governance (03), Conflicts (04), the design-control drawer
 * (05) and the add-agent flow (06) are not built, so this stays a flat `/agents` +
 * `/agents/:id`, no tab bar. Maestro is the orchestrator shown in its own banner on the
 * registry — it doesn't get a detail page, since it isn't one of "the thirteen" cards.
 *
 * Every agent below shares the same detail-page shape (its loop, what it reads, what it may do,
 * recent rooms) even though only RIA's content came from the Figma export — the rest is authored
 * here to match its voice and depth, same precedent as [[flolyt_business_memory_redesign]].
 */

export type AgentStatus = "working" | "reading-in" | "paused" | "blocked" | "off";

export const STATUS_META: Record<AgentStatus, { label: string; tone: ChipTone }> = {
  working: { label: "Working", tone: "teal" },
  "reading-in": { label: "Reading in", tone: "ultra" },
  paused: { label: "Paused", tone: "amber" },
  blocked: { label: "Blocked", tone: "rose" },
  off: { label: "Off", tone: "neutral" },
};

export type LoopStage = {
  stage: string;
  cadence: string;
  description: string;
  /** Whether this stage of the loop is actually reached today — the last stage or two can be
   * aspirational (e.g. "hands to Guardian" before a control exists yet). */
  active: boolean;
};

export type ReadSource = { label: string; connected: boolean };

export type Permission = "automatic" | "blocked" | "proposed";

export type MayDo = { action: string; permission: Permission; note?: string };

export type RoomOutcome = { label: string; outcome: string; tone: "neutral" | "teal" | "amber" };

export type Stat = { label: string; value: string; tone?: "ink" | "teal" | "amber" | "rose"; note: string };

export type Agent = {
  id: string;
  initials: string;
  name: string;
  domain: string;
  status: AgentStatus;
  /** Registry-card blurb — "finds revenue leaving and names the cause". */
  blurb: string;
  /** Registry-card second line — a reading-source summary, or an alert if something needs attention. */
  cardNote: string;
  cardNoteTone: "neutral" | "amber";
  subtitle: string;
  description: string;
  stats: [Stat, Stat, Stat, Stat];
  loop: LoopStage[];
  reads: ReadSource[];
  readsNote: string;
  mayDo: MayDo[];
  mayDoNote: string;
  recentRooms: RoomOutcome[];
  whereWrong?: { lines: string[] };
};

export const MAESTRO = {
  initials: "MAE",
  name: "Maestro",
  domain: "orchestration",
  description: "Routes every question, hosts every room, resolves conflicts and escalates to you.",
  stats: {
    routedToday: "212",
    conflictsOpen: "1",
    escalatedToYou: "3",
  },
};

export const AGENTS: Agent[] = [
  {
    id: "ria",
    initials: "RIA",
    name: "RIA",
    domain: "Leakage",
    status: "working",
    blurb: "finds revenue leaving and names the cause",
    cardNote: "reading orders, subscriptions, events",
    cardNoteTone: "neutral",
    subtitle: "Revenue leakage detection",
    description:
      "Finds revenue leaving and names the cause. Opens a room when it can show the cause, not just the symptom.",
    stats: [
      { label: "Rooms opened", value: "14", tone: "ink", note: "last 90 days" },
      { label: "Confirmed real", value: "12 of 14", tone: "teal", note: "86% precision" },
      { label: "Median to cause", value: "4h 20m", tone: "ink", note: "detect to diagnosis" },
      { label: "Disputed by a person", value: "2", tone: "amber", note: "both upheld the dispute" },
    ],
    loop: [
      { stage: "Detect", cadence: "continuous", description: "watches every connected source", active: true },
      { stage: "Diagnose", cadence: "within 48h", description: "confirms the cause before opening a room", active: true },
      { stage: "Fix", cadence: "within a week", description: "proposes, never releases", active: true },
      { stage: "Prevent", cadence: "hands to Guardian", description: "a fix without a control is not finished", active: false },
      { stage: "Monitor", cadence: "ongoing", description: "watches whether the control holds", active: false },
    ],
    reads: [
      { label: "Postgres · orders, subscriptions", connected: true },
      { label: "Postgres · product events", connected: true },
      { label: "Stripe · charges and refunds", connected: true },
      { label: "Warehouse · COGS", connected: false },
    ],
    readsNote: "Without COGS it reports revenue at risk, never margin at risk.",
    mayDo: [
      { action: "Open a room", permission: "automatic" },
      { action: "Ask another agent for evidence", permission: "automatic" },
      { action: "Propose a fix", permission: "automatic" },
      { action: "Send anything to a customer", permission: "blocked" },
      { action: "Change a price or discount", permission: "proposed", note: "needs an approver" },
    ],
    mayDoNote: "Changing any of these is written to the audit log.",
    recentRooms: [
      { label: "2471 · checklist drop-off", outcome: "live · awaiting release", tone: "neutral" },
      { label: "2412 · delivery fee", outcome: "₦312K preserved", tone: "teal" },
      { label: "2465 · discount reapplication", outcome: "₦88.4K preserved", tone: "teal" },
      { label: "2399 · weekend dip", outcome: "disputed · not a leak", tone: "amber" },
    ],
    whereWrong: {
      lines: [
        "Room 2399 read a weekend dip as a leak.",
        "A person disputed it and was right.",
        "The pattern is now in memory, and RIA",
        "cites it before opening a similar room.",
      ],
    },
  },
  {
    id: "sentinel",
    initials: "SEN",
    name: "Sentinel",
    domain: "Data integrity",
    status: "working",
    blurb: "sources, schema, identity, freshness",
    cardNote: "reading 4 sources",
    cardNoteTone: "neutral",
    subtitle: "Data integrity monitoring",
    description:
      "Watches every connected source for a broken pipe, a stale sync or a schema drift. Opens a room when the break is downstream, not just at the source.",
    stats: [
      { label: "Sources watched", value: "4", tone: "ink", note: "all current" },
      { label: "Confirmed real", value: "9 of 10", tone: "teal", note: "90% precision" },
      { label: "Median to cause", value: "2h 10m", tone: "ink", note: "detect to diagnosis" },
      { label: "Disputed by a person", value: "0", tone: "ink", note: "none this quarter" },
    ],
    loop: [
      { stage: "Detect", cadence: "continuous", description: "checks every schema and sync on a fixed cadence", active: true },
      { stage: "Diagnose", cadence: "within 6h", description: "traces a broken field to the pipeline that broke it", active: true },
      { stage: "Fix", cadence: "within a day", description: "proposes a schema patch, never applies one", active: true },
      { stage: "Prevent", cadence: "hands to Guardian", description: "a recurring break becomes a monitored control", active: false },
      { stage: "Monitor", cadence: "ongoing", description: "re-checks the same field on every future sync", active: true },
    ],
    reads: [
      { label: "Postgres · schema catalog", connected: true },
      { label: "Stripe · webhook health", connected: true },
      { label: "Warehouse · sync logs", connected: true },
      { label: "Identity provider · SSO status", connected: true },
    ],
    readsNote: "All four sources current as of this morning's sync.",
    mayDo: [
      { action: "Flag a broken source", permission: "automatic" },
      { action: "Pause a pipeline it doesn't trust", permission: "automatic" },
      { action: "Reconnect a source on its own", permission: "blocked" },
      { action: "Change a schema mapping", permission: "proposed", note: "needs an approver" },
    ],
    mayDoNote: "Changing any of these is written to the audit log.",
    recentRooms: [
      { label: "2458 · Stripe webhook silent", outcome: "₦0 preserved · caught before impact", tone: "teal" },
      { label: "2440 · identity sync drift", outcome: "resolved", tone: "neutral" },
    ],
  },
  {
    id: "loom",
    initials: "LOM",
    name: "Loom",
    domain: "Product",
    status: "working",
    blurb: "adoption, PLG, feature-market fit",
    cardNote: "reading product events",
    cardNoteTone: "neutral",
    subtitle: "Adoption and product-led growth",
    description:
      "Watches feature adoption for the point where a feature stops earning its keep. Opens a room when a drop is structural, not seasonal.",
    stats: [
      { label: "Rooms opened", value: "8", tone: "ink", note: "last 90 days" },
      { label: "Confirmed real", value: "6 of 8", tone: "teal", note: "75% precision" },
      { label: "Median to cause", value: "3d 4h", tone: "ink", note: "detect to diagnosis" },
      { label: "Disputed by a person", value: "1", tone: "amber", note: "dispute upheld" },
    ],
    loop: [
      { stage: "Detect", cadence: "continuous", description: "tracks adoption curves across every feature", active: true },
      { stage: "Diagnose", cadence: "within a week", description: "separates a real drop from a seasonal one", active: true },
      { stage: "Fix", cadence: "within two weeks", description: "proposes an experiment, never ships one", active: true },
      { stage: "Prevent", cadence: "hands to Guardian", description: "a repeat drop becomes a monitored control", active: false },
      { stage: "Monitor", cadence: "ongoing", description: "watches the cohort after a fix ships", active: false },
    ],
    reads: [
      { label: "Product analytics · feature events", connected: true },
      { label: "Postgres · onboarding funnel", connected: true },
    ],
    readsNote: "Reading product events only — no revenue data crosses into Loom's view.",
    mayDo: [
      { action: "Open a room", permission: "automatic" },
      { action: "Tag a cohort for follow-up", permission: "automatic" },
      { action: "Ship a feature flag change", permission: "blocked" },
      { action: "Propose a PLG experiment", permission: "proposed", note: "needs an approver" },
    ],
    mayDoNote: "Changing any of these is written to the audit log.",
    recentRooms: [
      { label: "2402 · checklist step 4 stall", outcome: "resolved", tone: "neutral" },
      { label: "2419 · export feature drop-off", outcome: "disputed · seasonal", tone: "amber" },
    ],
  },
  {
    id: "prism",
    initials: "PRI",
    name: "Prism",
    domain: "Pricing",
    status: "working",
    blurb: "price, discount, monetisation",
    cardNote: "reading orders, Stripe",
    cardNoteTone: "neutral",
    subtitle: "Pricing and discount integrity",
    description:
      "Watches price, discount and monetisation logic for the gap between what's configured and what customers are actually charged.",
    stats: [
      { label: "Rooms opened", value: "11", tone: "ink", note: "last 90 days" },
      { label: "Confirmed real", value: "10 of 11", tone: "teal", note: "91% precision" },
      { label: "Median to cause", value: "5h 40m", tone: "ink", note: "detect to diagnosis" },
      { label: "Disputed by a person", value: "0", tone: "ink", note: "none this quarter" },
    ],
    loop: [
      { stage: "Detect", cadence: "continuous", description: "diffs configured price against charged price", active: true },
      { stage: "Diagnose", cadence: "within 24h", description: "traces the mismatch to the rule that caused it", active: true },
      { stage: "Fix", cadence: "within a week", description: "proposes a correction, never applies one", active: true },
      { stage: "Prevent", cadence: "hands to Guardian", description: "a recurring mismatch becomes a release check", active: false },
      { stage: "Monitor", cadence: "ongoing", description: "watches the rule after a fix ships", active: false },
    ],
    reads: [
      { label: "Postgres · orders", connected: true },
      { label: "Stripe · charges", connected: true },
      { label: "Postgres · discount configuration", connected: true },
    ],
    readsNote: "Reading orders and Stripe directly — no warehouse dependency.",
    mayDo: [
      { action: "Flag a discount anomaly", permission: "automatic" },
      { action: "Open a room", permission: "automatic" },
      { action: "Refund a customer", permission: "blocked" },
      { action: "Change a price or discount", permission: "proposed", note: "needs an approver" },
    ],
    mayDoNote: "Nothing here can lift the seven absolute limits.",
    recentRooms: [
      { label: "2465 · discount reapplication", outcome: "₦88.4K preserved", tone: "teal" },
      { label: "2473 · discount depth", outcome: "live · awaiting release", tone: "neutral" },
    ],
  },
  {
    id: "guardian",
    initials: "GUA",
    name: "Guardian",
    domain: "Controls",
    status: "working",
    blurb: "designs, enforces and monitors prevention",
    cardNote: "1 control decaying",
    cardNoteTone: "amber",
    subtitle: "Prevention and control design",
    description:
      "Turns a closed room into a control that watches for the same pattern again, and tells you when one has stopped working.",
    stats: [
      { label: "Controls active", value: "17", tone: "ink", note: "across 13 agents" },
      { label: "Controls healthy", value: "16 of 17", tone: "teal", note: "94%" },
      { label: "Median to design", value: "1d 6h", tone: "ink", note: "fix shipped to control live" },
      { label: "Controls decaying", value: "1", tone: "amber", note: "effectiveness below 85%" },
    ],
    loop: [
      { stage: "Detect", cadence: "continuous", description: "watches every control's effectiveness score", active: true },
      { stage: "Diagnose", cadence: "within 24h", description: "checks whether a decaying control still matches its signal", active: true },
      { stage: "Fix", cadence: "within a week", description: "proposes a redesigned control, never swaps one in", active: true },
      { stage: "Prevent", cadence: "self", description: "designs the control itself, once a fix ships", active: true },
      { stage: "Monitor", cadence: "ongoing", description: "re-scores every control on a fixed cadence", active: true },
    ],
    reads: [
      { label: "Control registry · effectiveness scores", connected: true },
      { label: "Rooms · closed decisions", connected: true },
      { label: "Audit log · control changes", connected: true },
    ],
    readsNote: "1 of 17 controls is decaying — see Business Memory for detail.",
    mayDo: [
      { action: "Monitor a control", permission: "automatic" },
      { action: "Flag a decaying control", permission: "automatic" },
      { action: "Disable a control workspace-wide", permission: "blocked" },
      { action: "Retire a control", permission: "proposed", note: "needs an approver" },
    ],
    mayDoNote: "Changing any of these is written to the audit log.",
    recentRooms: [
      { label: "2388 · dunning retry decay", outcome: "disputed · not a leak", tone: "amber" },
      { label: "2412 · delivery fee control", outcome: "healthy · cited 4×", tone: "teal" },
    ],
  },
  {
    id: "compass",
    initials: "COM",
    name: "Compass",
    domain: "Customer voice",
    status: "paused",
    blurb: "journey, tickets, sentiment",
    cardNote: "source stale 6h",
    cardNoteTone: "amber",
    subtitle: "Customer journey and sentiment",
    description:
      "Reads tickets, journey events and sentiment for the moment a customer's experience turns. Paused while its ticket export is stale.",
    stats: [
      { label: "Rooms opened", value: "6", tone: "ink", note: "last 90 days" },
      { label: "Confirmed real", value: "5 of 6", tone: "teal", note: "83% precision" },
      { label: "Median to cause", value: "1d 2h", tone: "ink", note: "detect to diagnosis" },
      { label: "Disputed by a person", value: "0", tone: "ink", note: "none this quarter" },
    ],
    loop: [
      { stage: "Detect", cadence: "continuous", description: "watches ticket volume and sentiment score together", active: true },
      { stage: "Diagnose", cadence: "within 48h", description: "ties a sentiment drop to a specific journey step", active: true },
      { stage: "Fix", cadence: "within a week", description: "proposes a journey change, never ships one", active: true },
      { stage: "Prevent", cadence: "hands to Guardian", description: "a recurring drop becomes a monitored control", active: false },
      { stage: "Monitor", cadence: "ongoing", description: "watches sentiment after a fix ships", active: false },
    ],
    reads: [
      { label: "Support · ticket export", connected: false },
      { label: "Product analytics · journey events", connected: true },
    ],
    readsNote: "Ticket export has been stale for 6 hours — sentiment scores may lag behind reality.",
    mayDo: [
      { action: "Flag a sentiment drop", permission: "automatic" },
      { action: "Open a room", permission: "automatic" },
      { action: "Reply to a customer", permission: "blocked" },
      { action: "Launch a survey", permission: "proposed", note: "needs an approver" },
    ],
    mayDoNote: "Paused agents keep reading but stop opening new rooms.",
    recentRooms: [{ label: "2350 · onboarding NPS dip", outcome: "resolved", tone: "neutral" }],
  },
  {
    id: "oracle",
    initials: "ORA",
    name: "Oracle",
    domain: "Prediction",
    status: "reading-in",
    blurb: "digital twin, forecasts, simulations",
    cardNote: "reading needs 90 days of history",
    cardNoteTone: "neutral",
    subtitle: "Forecasting and simulation",
    description:
      "Builds a digital twin of the business to simulate a change before it ships. Still reading in — its first forecast needs 90 days of history to trust.",
    stats: [
      { label: "History read", value: "58 of 90 days", tone: "ink", note: "reading in" },
      { label: "Simulations run", value: "3", tone: "ink", note: "internal only, not yet published" },
      { label: "Confirmed real", value: "—", tone: "ink", note: "no forecast published yet" },
      { label: "Disputed by a person", value: "0", tone: "ink", note: "none yet" },
    ],
    loop: [
      { stage: "Detect", cadence: "continuous", description: "builds the digital twin from every connected source", active: true },
      { stage: "Diagnose", cadence: "within 48h", description: "checks a simulated outcome against what actually happened", active: false },
      { stage: "Fix", cadence: "within a week", description: "proposes the scenario a decision should weigh", active: false },
      { stage: "Prevent", cadence: "hands to Guardian", description: "a repeated miss becomes a monitored assumption", active: false },
      { stage: "Monitor", cadence: "ongoing", description: "re-runs the simulation as new history arrives", active: false },
    ],
    reads: [
      { label: "Digital twin · combined snapshot", connected: true },
      { label: "Postgres · 90 days of order history", connected: false },
    ],
    readsNote: "Reading in — needs 90 days of history before its first forecast is trustworthy.",
    mayDo: [
      { action: "Run a simulation", permission: "automatic" },
      { action: "Publish a forecast to the team", permission: "blocked", note: "until reading in completes" },
      { action: "Act on a forecast", permission: "blocked" },
    ],
    mayDoNote: "Nothing Oracle produces is visible outside this page until reading in completes.",
    recentRooms: [],
  },
  {
    id: "anchor",
    initials: "ANC",
    name: "Anchor",
    domain: "Assurance",
    status: "working",
    blurb: "cash, recovery, independent proof",
    cardNote: "reading Stripe, invoices",
    cardNoteTone: "neutral",
    subtitle: "Cash and recovery assurance",
    description:
      "Independently reconciles cash and recovery against what other agents report, so a fix's impact is proven, not just claimed.",
    stats: [
      { label: "Rooms opened", value: "5", tone: "ink", note: "last 90 days" },
      { label: "Confirmed real", value: "5 of 5", tone: "teal", note: "100% precision" },
      { label: "Median to cause", value: "6h 50m", tone: "ink", note: "detect to diagnosis" },
      { label: "Disputed by a person", value: "0", tone: "ink", note: "none this quarter" },
    ],
    loop: [
      { stage: "Detect", cadence: "continuous", description: "reconciles Stripe payouts against invoices daily", active: true },
      { stage: "Diagnose", cadence: "within 24h", description: "confirms a discrepancy before naming it a leak", active: true },
      { stage: "Fix", cadence: "within a week", description: "proposes a recovery plan, never issues a refund", active: true },
      { stage: "Prevent", cadence: "hands to Guardian", description: "a recurring gap becomes a monitored control", active: false },
      { stage: "Monitor", cadence: "ongoing", description: "watches the recovery plan land", active: false },
    ],
    reads: [
      { label: "Stripe · payouts", connected: true },
      { label: "Invoices · issued and paid", connected: true },
    ],
    readsNote: "Reconciles independently of RIA and Prism, so its numbers count as a second proof.",
    mayDo: [
      { action: "Reconcile a payout", permission: "automatic" },
      { action: "Flag a cash discrepancy", permission: "automatic" },
      { action: "Issue a refund", permission: "blocked" },
      { action: "Propose a recovery plan", permission: "proposed", note: "needs an approver" },
    ],
    mayDoNote: "Changing any of these is written to the audit log.",
    recentRooms: [{ label: "2412 · delivery fee recovery", outcome: "₦312K confirmed", tone: "teal" }],
  },
  {
    id: "ledger",
    initials: "LED",
    name: "Ledger",
    domain: "Finance",
    status: "blocked",
    blurb: "margin, unit economics, capital",
    cardNote: "no warehouse connected",
    cardNoteTone: "amber",
    subtitle: "Margin and unit economics",
    description:
      "Reads cost of goods and capital allocation to price a leak in margin, not just revenue. Blocked until a warehouse is connected.",
    stats: [
      { label: "Rooms opened", value: "0", tone: "ink", note: "blocked" },
      { label: "Confirmed real", value: "—", tone: "ink", note: "not applicable yet" },
      { label: "Median to cause", value: "—", tone: "ink", note: "not applicable yet" },
      { label: "Disputed by a person", value: "0", tone: "ink", note: "none yet" },
    ],
    loop: [
      { stage: "Detect", cadence: "blocked", description: "would watch margin against every connected source", active: false },
      { stage: "Diagnose", cadence: "blocked", description: "would confirm a margin cause before opening a room", active: false },
      { stage: "Fix", cadence: "blocked", description: "would propose a correction, never apply one", active: false },
      { stage: "Prevent", cadence: "hands to Guardian", description: "a recurring gap would become a monitored control", active: false },
      { stage: "Monitor", cadence: "blocked", description: "would watch margin after a fix ships", active: false },
    ],
    reads: [
      { label: "Postgres · orders", connected: true },
      { label: "Stripe · charges", connected: true },
      { label: "Warehouse · COGS", connected: false },
    ],
    readsNote: "No warehouse connected — Ledger can't compute margin until one is.",
    mayDo: [
      { action: "Flag a margin miss", permission: "blocked", note: "until a warehouse is connected" },
      { action: "Open a room", permission: "blocked" },
      { action: "Move capital", permission: "blocked" },
    ],
    mayDoNote: "A blocked agent may not act on its own or be asked to by another agent.",
    recentRooms: [],
  },
  {
    id: "lodestar",
    initials: "LOD",
    name: "Lodestar",
    domain: "Market",
    status: "reading-in",
    blurb: "competitors, category, positioning",
    cardNote: "reading market and competitor feeds",
    cardNoteTone: "neutral",
    subtitle: "Market and competitive positioning",
    description:
      "Reads competitor pricing, category movement and positioning for a shift worth reacting to. Still reading in its first market feeds.",
    stats: [
      { label: "Feeds connected", value: "2 of 3", tone: "ink", note: "reading in" },
      { label: "Rooms opened", value: "1", tone: "ink", note: "last 90 days" },
      { label: "Confirmed real", value: "1 of 1", tone: "teal", note: "early days" },
      { label: "Disputed by a person", value: "0", tone: "ink", note: "none yet" },
    ],
    loop: [
      { stage: "Detect", cadence: "continuous", description: "watches competitor pricing and category signals", active: true },
      { stage: "Diagnose", cadence: "within a week", description: "confirms a shift is structural before naming it", active: true },
      { stage: "Fix", cadence: "within two weeks", description: "proposes a positioning response, never publishes one", active: false },
      { stage: "Prevent", cadence: "hands to Guardian", description: "a recurring shift becomes a monitored watch", active: false },
      { stage: "Monitor", cadence: "ongoing", description: "watches the category after a response ships", active: false },
    ],
    reads: [
      { label: "Market feed · category pricing", connected: true },
      { label: "Competitor pricing feed", connected: true },
      { label: "Analyst reports", connected: false },
    ],
    readsNote: "Reading in its second feed — analyst reports are not yet connected.",
    mayDo: [
      { action: "Flag a competitor move", permission: "automatic" },
      { action: "Open a room", permission: "automatic" },
      { action: "Publish externally", permission: "blocked" },
      { action: "Change positioning copy", permission: "proposed", note: "needs an approver" },
    ],
    mayDoNote: "Changing any of these is written to the audit log.",
    recentRooms: [{ label: "2440 · category price drop", outcome: "live · awaiting release", tone: "neutral" }],
  },
  {
    id: "orbit",
    initials: "ORB",
    name: "Orbit",
    domain: "People",
    status: "off",
    blurb: "talent, org design, capacity",
    cardNote: "reading not enabled",
    cardNoteTone: "neutral",
    subtitle: "Talent and organisational capacity",
    description: "Would read talent, org design and capacity for a team stretched thin. Not enabled for this workspace.",
    stats: [
      { label: "Rooms opened", value: "0", tone: "ink", note: "not enabled" },
      { label: "Confirmed real", value: "—", tone: "ink", note: "not applicable" },
      { label: "Median to cause", value: "—", tone: "ink", note: "not applicable" },
      { label: "Disputed by a person", value: "0", tone: "ink", note: "not applicable" },
    ],
    loop: [
      { stage: "Detect", cadence: "off", description: "would watch capacity against headcount and hiring plan", active: false },
      { stage: "Diagnose", cadence: "off", description: "would confirm a capacity gap before opening a room", active: false },
      { stage: "Fix", cadence: "off", description: "would propose a hiring or reallocation plan", active: false },
      { stage: "Prevent", cadence: "off", description: "would hand a recurring gap to Guardian", active: false },
      { stage: "Monitor", cadence: "off", description: "would watch capacity after a plan ships", active: false },
    ],
    reads: [{ label: "HRIS · headcount and org chart", connected: false }],
    readsNote: "Not enabled — connect an HRIS to turn Orbit on.",
    mayDo: [{ action: "Everything", permission: "blocked", note: "not enabled" }],
    mayDoNote: "An off agent reads nothing and acts on nothing until it's turned on.",
    recentRooms: [],
  },
  {
    id: "horizon",
    initials: "HOR",
    name: "Horizon",
    domain: "Systemic risk",
    status: "working",
    blurb: "weak signals, emergent behaviour",
    cardNote: "reading every agent output",
    cardNoteTone: "neutral",
    subtitle: "Systemic and emergent risk",
    description:
      "Reads every other agent's output looking for a pattern no single one of them would catch alone.",
    stats: [
      { label: "Rooms opened", value: "3", tone: "ink", note: "last 90 days" },
      { label: "Confirmed real", value: "3 of 3", tone: "teal", note: "100% precision" },
      { label: "Median to cause", value: "2d 4h", tone: "ink", note: "detect to diagnosis" },
      { label: "Disputed by a person", value: "0", tone: "ink", note: "none this quarter" },
    ],
    loop: [
      { stage: "Detect", cadence: "continuous", description: "reads every agent's output for a shared weak signal", active: true },
      { stage: "Diagnose", cadence: "within a week", description: "confirms the signal spans more than one agent's domain", active: true },
      { stage: "Fix", cadence: "within two weeks", description: "proposes which agent should own the response", active: true },
      { stage: "Prevent", cadence: "hands to Guardian", description: "a recurring pattern becomes a cross-agent control", active: false },
      { stage: "Monitor", cadence: "ongoing", description: "watches whether the pattern recurs elsewhere", active: false },
    ],
    reads: [{ label: "Every agent's output", connected: true }],
    readsNote: "The only agent that reads other agents rather than a source system.",
    mayDo: [
      { action: "Flag a weak signal", permission: "automatic" },
      { action: "Open a room", permission: "automatic" },
      { action: "Silence another agent", permission: "blocked" },
      { action: "Escalate directly to leadership", permission: "proposed", note: "needs an approver" },
    ],
    mayDoNote: "Nothing here can lift the seven absolute limits.",
    recentRooms: [{ label: "2455 · correlated churn signal", outcome: "resolved", tone: "neutral" }],
  },
  {
    id: "cadence",
    initials: "CAD",
    name: "Cadence",
    domain: "Daily work",
    status: "working",
    blurb: "personalised queues and habits",
    cardNote: "reading your queue",
    cardNoteTone: "neutral",
    subtitle: "Personalised queues and habits",
    description: "Reads your queue and turns the other twelve agents' output into a habit you actually keep up with.",
    stats: [
      { label: "Queues personalised", value: "24", tone: "ink", note: "across the team" },
      { label: "Habits adopted", value: "18 of 24", tone: "teal", note: "75%" },
      { label: "Median to habit", value: "9 days", tone: "ink", note: "suggested to adopted" },
      { label: "Disputed by a person", value: "0", tone: "ink", note: "none this quarter" },
    ],
    loop: [
      { stage: "Detect", cadence: "continuous", description: "watches how each person actually works their queue", active: true },
      { stage: "Diagnose", cadence: "within a week", description: "confirms a habit is being skipped, not just delayed", active: true },
      { stage: "Fix", cadence: "within two weeks", description: "proposes a reordered queue, never reorders it itself", active: true },
      { stage: "Prevent", cadence: "hands to Guardian", description: "a skipped habit becomes a nudge, not a control", active: false },
      { stage: "Monitor", cadence: "ongoing", description: "watches whether the new order sticks", active: false },
    ],
    reads: [{ label: "Your queue", connected: true }, { label: "Calendar", connected: true }],
    readsNote: "Reads only how work is done, not why — the other twelve supply the why.",
    mayDo: [
      { action: "Reorder your queue", permission: "automatic" },
      { action: "Suggest a habit", permission: "automatic" },
      { action: "Change someone else's queue", permission: "blocked" },
      { action: "Auto-complete a task on your behalf", permission: "blocked" },
    ],
    mayDoNote: "Cadence only ever touches your own queue, never anyone else's.",
    recentRooms: [],
  },
];

export function getAgent(id: string | undefined): Agent | undefined {
  return AGENTS.find((agent) => agent.id === id);
}

export function countByStatus(status: AgentStatus): number {
  return AGENTS.filter((agent) => agent.status === status).length;
}
