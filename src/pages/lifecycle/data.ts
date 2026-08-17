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

export type Stage = {
  name: string;
  /** Path segment under /lifecycle/ for this stage's detail page. */
  slug: string;
  department: Department | null;
  metric: string;
  amount: string;
  amountLabel: "at stake" | "referred";
  /** False renders the A01-style "not defined yet" empty state instead of tabs/content. */
  isDefined: boolean;
  /** Shown under the stage name in the tab-bar header, e.g. "894,000 acquired in twelve months · ₦74M at stake · owned by Marketing". */
  headline: string;
};

export const STAGES: Stage[] = [
  {
    name: "Acquire",
    slug: "acquire",
    department: "Marketing",
    metric: "894k / yr",
    amount: "₦74M",
    amountLabel: "at stake",
    isDefined: true,
    headline: "894,000 acquired in twelve months · ₦74M at stake · owned by Marketing",
  },
  { name: "Activate", slug: "activate", department: "Product", metric: "41% reach value", amount: "₦188M", amountLabel: "at stake", isDefined: true, headline: "41% reach value in twelve months · ₦188M at stake · owned by Product" },
  { name: "Price", slug: "price", department: "Finance", metric: "6 plans", amount: "₦46M", amountLabel: "at stake", isDefined: true, headline: "Six plans · ₦46M at stake · owned by Finance" },
  { name: "Adopt", slug: "adopt", department: "Product", metric: "2.1 features avg", amount: "₦112M", amountLabel: "at stake", isDefined: true, headline: "2.1 features adopted on average · ₦112M at stake · owned by Product" },
  { name: "Retain", slug: "retain", department: "Marketing", metric: "1.1M active", amount: "₦412M", amountLabel: "at stake", isDefined: true, headline: "1.1M active in 90 days · ₦412M at stake · owned by Marketing" },
  { name: "Expand", slug: "expand", department: "Sales", metric: "18% eligible", amount: "₦96M", amountLabel: "at stake", isDefined: true, headline: "18% of accounts eligible · ₦96M at stake · owned by Sales" },
  { name: "Support", slug: "support", department: "Support", metric: "42k contacts", amount: "₦31M", amountLabel: "at stake", isDefined: true, headline: "42k contacts in ninety days · ₦31M at stake · owned by Support" },
  { name: "Renew", slug: "renew", department: "Customer Success", metric: "61k renewals", amount: "₦88M", amountLabel: "at stake", isDefined: true, headline: "61k renewals this year · ₦88M at stake · owned by Customer Success" },
  { name: "Advocate", slug: "advocate", department: "Marketing", metric: "124k referrers", amount: "₦124M", amountLabel: "referred", isDefined: true, headline: "124k referrers · ₦124M referred · owned by Marketing" },
  { name: "Churn", slug: "churn", department: null, metric: "602k lost", amount: "₦602M", amountLabel: "at stake", isDefined: true, headline: "602k lost this year · ₦602M at stake · no owning team" },
];

export const ADVOCACY_LOOP_NOTE =
  "Advocacy feeds acquisition — 124,000 referrers brought 31% of last quarter's new customers at a CAC of ₦0";

export type RootCauseRow = {
  stage: string;
  department: Department;
  detail: string;
};

export const ROOT_CAUSE_HEADLINE = "THE 4 MARCH DELIVERY-FEE CHANGE";

export const ROOT_CAUSE_ROWS: RootCauseRow[] = [
  { stage: "Activate", department: "Product", detail: "abandonment at the fee step rose 3.1×" },
  { stage: "Retain", department: "Marketing", detail: "second-order rate fell 11 points" },
  { stage: "Support", department: "Support", detail: "“where is my order” became the top contact driver" },
  { stage: "Renew", department: "Customer Success", detail: "subscription pauses up 22%" },
  { stage: "Advocate", department: "Marketing", detail: "referral rate fell for the first time in two years" },
];

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
