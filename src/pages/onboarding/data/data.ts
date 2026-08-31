import type { DatasourceDto } from "@/services/api/datasources/get-datasources";

/** Matches flolyt-figma-designs/onboarding/05-connect-first-source.svg's "Popular" chip. */
export const POPULAR_DATASOURCE_NAMES = new Set(["Snowflake", "PostgreSQL", "Stripe", "Shopify"]);

/** simpleicons.org slug — same derivation the old dashboard's ConnectSources used. */
export function datasourceSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export type UnlockCategory = {
  key: string;
  title: string;
  description: string;
  /** Datasource `category` values that count as unlocking this. */
  matchesCategories: string[];
};

/** The aside's four rows on 05-connect-first-source.svg — "WHAT ONE SOURCE UNLOCKS". */
export const UNLOCK_CATEGORIES: UnlockCategory[] = [
  {
    key: "product-events",
    title: "Product events",
    description: "Activation, dormancy, feature usage: the spine of every churn answer.",
    matchesCategories: ["Analytics"],
  },
  {
    key: "payments",
    title: "Payments",
    description:
      "Turns “seats are dormant” into “€38,400 is at risk”. Without it, leakage reads unavailable.",
    matchesCategories: ["Payments"],
  },
  {
    key: "support",
    title: "Support",
    description: "Lets renewal risk see the open ticket that is actually driving it.",
    matchesCategories: ["Support"],
  },
  {
    key: "crm",
    title: "CRM",
    description: "Adds the human context: who owns the account and what was last promised.",
    matchesCategories: ["CRM"],
  },
];

/** The one category the "what you can ask now" rail treats as unlocking the payment-gated questions. */
export const PAYMENT_CATEGORY = "Payments";

export type MappingQuestion = {
  key: string;
  question: string;
  /** true if this question needs a Payments-category source; false if any other connected source answers it. */
  needsPayment: boolean;
};

/** The aside's five rows on 06-source-connected.svg — "WHAT YOU CAN ASK NOW". */
export const MAPPING_QUESTIONS: MappingQuestion[] = [
  { key: "repeat-purchase", question: "Why did repeat purchase change?", needsPayment: false },
  { key: "dormant-customers", question: "Which customers are going dormant?", needsPayment: false },
  { key: "revenue-leaking", question: "Where is revenue leaking?", needsPayment: false },
  { key: "leak-worth", question: "How much is that leak worth?", needsPayment: true },
  { key: "channel-payback", question: "Which channel has the best payback?", needsPayment: true },
];

export function groupByCategory(datasources: DatasourceDto[]): Map<string, DatasourceDto[]> {
  const grouped = new Map<string, DatasourceDto[]>();
  for (const ds of datasources) {
    const list = grouped.get(ds.category) ?? [];
    list.push(ds);
    grouped.set(ds.category, list);
  }
  return grouped;
}
