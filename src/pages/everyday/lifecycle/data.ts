/**
 * Mock content for screens 15-26 (lifecycle map + stage detail pages) in
 * flolyt-kit-122 — see flolyt-kit-122/15-lifecycle-map.svg through
 * 26-stage-release-impact.svg and docs/build-tracker.md.
 *
 * Department dots are a fixed categorical palette baked into the kit
 * (Marketing/Product/Finance/Sales/Support/Customer Success/Engineering),
 * distinct from the 4-slot rotating team-1..4 tokens used for avatar presence.
 */

export type Department =
  | "Marketing"
  | "Product"
  | "Finance"
  | "Sales"
  | "Support"
  | "Customer Success"
  | "Engineering";

export const DEPARTMENT_COLORS: Record<Department, string> = {
  Marketing: "#79883A",
  Product: "#7A5AA8",
  Finance: "#5D6BB8",
  Sales: "#B4568F",
  Support: "#C56A2E",
  "Customer Success": "#2E8B7F",
  Engineering: "#4E7080",
};

/** For validating a live `owningTeam`/`team` string against the known department palette before casting it to `Department`. */
export const KNOWN_DEPARTMENTS = new Set(Object.keys(DEPARTMENT_COLORS));

export type Stage = {
  name: string;
  /** Path segment under /lifecycle/ for this stage's detail page. */
  slug: string;
  department: Department | null;
  /** GET /lifecycle/map's headline.value (added 2026-09-04), compact-formatted — e.g. "3", "95.7%". Undefined for the 4 gated stages, which render the InfoTooltip in its place — see `metricLabel`. */
  metricValue?: string;
  /** headline.label — a small caption under `metricValue`, e.g. "plans in use", "buy again". Always present when live (all 10 stages carry a label, computed or not), so the gated state still names the concept rather than showing a bare, unlabeled icon. */
  metricLabel?: string;
  /** Why `metricValue` is unavailable — headline.missingSource, when the API named one. */
  metricCaveat?: string;
  /** What connecting the missing source would unlock — headline.wouldUnlock. */
  metricWouldUnlock?: string;
  amount: string;
  amountLabel: "at stake" | "referred";
  /** Why `amount` is "Unavailable" — GET /lifecycle/map's atStake.missingSource, when the API named one. */
  amountCaveat?: string;
  /** What connecting the missing source would unlock — GET /lifecycle/map's atStake.wouldUnlock. */
  amountWouldUnlock?: string;
  /** False renders the A01-style "not defined yet" empty state instead of tabs/content. */
  isDefined: boolean;
};

export const STAGES: Stage[] = [
  { name: "Acquire", slug: "acquire", department: "Marketing", metricValue: "894k / yr", amount: "₦74M", amountLabel: "at stake", isDefined: true },
  { name: "Activate", slug: "activate", department: "Product", metricValue: "41% reach value", amount: "₦188M", amountLabel: "at stake", isDefined: true },
  { name: "Price", slug: "price", department: "Finance", metricValue: "6 plans", amount: "₦46M", amountLabel: "at stake", isDefined: true },
  { name: "Adopt", slug: "adopt", department: "Product", metricValue: "2.1 features avg", amount: "₦112M", amountLabel: "at stake", isDefined: true },
  { name: "Retain", slug: "retain", department: "Marketing", metricValue: "27% repeat", amount: "₦412M", amountLabel: "at stake", isDefined: true },
  { name: "Expand", slug: "expand", department: "Sales", metricValue: "1.4× ARPU", amount: "₦61M", amountLabel: "at stake", isDefined: true },
  { name: "Support", slug: "support", department: "Support", metricValue: "12.8k tickets", amount: "₦9M", amountLabel: "at stake", isDefined: true },
  { name: "Renew", slug: "renew", department: "Customer Success", metricValue: "88.4% projected", amount: "₦88M", amountLabel: "at stake", isDefined: true },
  { name: "Advocate", slug: "advocate", department: "Marketing", metricValue: "124k referrers", amount: "₦0 CAC", amountLabel: "at stake", isDefined: true },
  { name: "Churn", slug: "churn", department: "Customer Success", metricValue: "3.1%/mo", amount: "₦124M", amountLabel: "at stake", isDefined: true },
];

export const ADVOCACY_LOOP_NOTE =
  "Advocacy feeds acquisition — 124,000 referrers brought 31% of last quarter's new customers at a CAC of ₦0";

export type RootCauseRow = {
  stage: string;
  department: Department | null;
  detail: string;
};

export type Trend = "steady" | "worsening" | "improving";

export type OwnershipRow = {
  stage: string;
  department: Department;
  owner: { name: string; initials: string };
  leadAgent: { name: string; initials: string };
  openRooms: number;
  reviewCadence: string;
  trend: Trend;
};

export const OWNERSHIP_ROWS: OwnershipRow[] = [
  {
    stage: "Acquire",
    department: "Marketing",
    owner: { name: "Tunde Bakare", initials: "TB" },
    leadAgent: { name: "Acquisition Quality", initials: "AQ" },
    openRooms: 0,
    reviewCadence: "weekly",
    trend: "steady",
  },
  {
    stage: "Activate",
    department: "Product",
    owner: { name: "Zainab Yusuf", initials: "ZY" },
    leadAgent: { name: "Activation", initials: "AC" },
    openRooms: 1,
    reviewCadence: "daily",
    trend: "worsening",
  },
  {
    stage: "Price",
    department: "Finance",
    owner: { name: "Ravi Menon", initials: "RM" },
    leadAgent: { name: "Pricing", initials: "PR" },
    openRooms: 0,
    reviewCadence: "monthly",
    trend: "steady",
  },
  {
    stage: "Adopt",
    department: "Product",
    owner: { name: "Zainab Yusuf", initials: "ZY" },
    leadAgent: { name: "Adoption", initials: "AD" },
    openRooms: 0,
    reviewCadence: "weekly",
    trend: "steady",
  },
  {
    stage: "Retain",
    department: "Marketing",
    owner: { name: "Ifeoma Nwosu", initials: "IN" },
    leadAgent: { name: "Repeat & Decay", initials: "RD" },
    openRooms: 1,
    reviewCadence: "daily",
    trend: "worsening",
  },
  {
    stage: "Expand",
    department: "Sales",
    owner: { name: "Chidi Eze", initials: "CE" },
    leadAgent: { name: "Expansion", initials: "EX" },
    openRooms: 0,
    reviewCadence: "weekly",
    trend: "improving",
  },
  {
    stage: "Support",
    department: "Support",
    owner: { name: "Amara Obi", initials: "AO" },
    leadAgent: { name: "Support Signal", initials: "SS" },
    openRooms: 1,
    reviewCadence: "daily",
    trend: "worsening",
  },
  {
    stage: "Renew",
    department: "Customer Success",
    owner: { name: "Ngozi Bello", initials: "NB" },
    leadAgent: { name: "Involuntary Churn", initials: "IC" },
    openRooms: 1,
    reviewCadence: "daily",
    trend: "worsening",
  },
  {
    stage: "Advocate",
    department: "Marketing",
    owner: { name: "Tunde Bakare", initials: "TB" },
    leadAgent: { name: "Advocacy", initials: "AV" },
    openRooms: 0,
    reviewCadence: "monthly",
    trend: "improving",
  },
];

export const EYEBROW_CLASS =
  "font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase";
