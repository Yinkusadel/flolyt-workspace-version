import type { ReactNode } from "react";

import { usePageBreadcrumb, type Crumb } from "@/components/breadcrumb-context";

export type { Crumb };

/**
 * Header for the routes that sit beside (not under) the tab bar — Compare
 * periods, Definition, and every :id drilldown. Confirmed by reading
 * A05/A16/AC01 directly: each has its own breadcrumb depth and an optional
 * top-right action button, but never the tab bar.
 *
 * The breadcrumb trail itself renders in the topbar (see topbar.tsx), not
 * here — `crumbs` is handed up via `usePageBreadcrumb` so it isn't shown
 * twice.
 */
export function StageSubpageHeader({
  crumbs,
  title,
  subtitle,
  action,
}: {
  crumbs: Crumb[];
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  usePageBreadcrumb(crumbs);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-[17px] font-semibold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-[11.5px] text-ink-3">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
