import { useSearchParams } from "react-router-dom";

import { BelowLineState } from "@/pages/what-to-do-today/states/below-line-state";
import { EmptyState } from "@/pages/what-to-do-today/states/empty-state";
import { FiltersState } from "@/pages/what-to-do-today/states/filters-state";
import { FirstListState } from "@/pages/what-to-do-today/states/first-list-state";
import { OrgScopeState } from "@/pages/what-to-do-today/states/org-scope-state";
import { RankedListState } from "@/pages/what-to-do-today/states/ranked-list-state";
import { TeamScopeState } from "@/pages/what-to-do-today/states/team-scope-state";
import { TODAY_ITEMS, WORKSPACE_AGE_DAYS } from "@/pages/what-to-do-today/data";

/** T01-T03, T05, T10-T12 — all share the /what-to-do-today route, branching on data shape and query params. */
const WhatToDoToday = () => {
  const [searchParams] = useSearchParams();
  const scope = searchParams.get("scope");
  const showAll = searchParams.get("show") === "all";
  const hasFilter = searchParams.has("effort") || searchParams.has("owner") || searchParams.has("view") || searchParams.has("filter");

  if (scope === "team") return <TeamScopeState />;
  if (scope === "org") return <OrgScopeState />;
  if (hasFilter) return <FiltersState />;
  if (showAll) return <BelowLineState />;

  if (TODAY_ITEMS.length === 0) return <EmptyState />;
  if (WORKSPACE_AGE_DAYS <= 4) return <FirstListState />;
  return <RankedListState />;
};

export default WhatToDoToday;
