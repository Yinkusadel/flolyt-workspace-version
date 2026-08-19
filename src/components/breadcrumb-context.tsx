import * as React from "react";

/**
 * Lets a page hand its breadcrumb trail up to the topbar (the app's single
 * breadcrumb location — see topbar.tsx) instead of also rendering it inline.
 * `to` on the last crumb is typically omitted since it's the current page.
 */
export type Crumb = { label: string; to?: string };

type BreadcrumbContextValue = {
  setOverride: (crumbs: Crumb[] | null) => void;
};

export const BreadcrumbContext = React.createContext<BreadcrumbContextValue | null>(null);

/** Call from a page to set the topbar's breadcrumb for as long as it's mounted. */
export function usePageBreadcrumb(crumbs: Crumb[]) {
  const ctx = React.useContext(BreadcrumbContext);
  const key = JSON.stringify(crumbs);

  React.useEffect(() => {
    ctx?.setOverride(crumbs);
    return () => ctx?.setOverride(null);
    // `key` is `crumbs` compared by value, so this only re-fires on real changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, key]);
}
