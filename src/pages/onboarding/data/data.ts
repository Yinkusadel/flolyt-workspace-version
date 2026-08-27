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
    description: "Activation, dormancy, feature usage — the spine of every churn answer.",
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

export function groupByCategory(datasources: DatasourceDto[]): Map<string, DatasourceDto[]> {
  const grouped = new Map<string, DatasourceDto[]>();
  for (const ds of datasources) {
    const list = grouped.get(ds.category) ?? [];
    list.push(ds);
    grouped.set(ds.category, list);
  }
  return grouped;
}
