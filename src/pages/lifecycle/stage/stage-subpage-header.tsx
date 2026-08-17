import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export type Crumb = { label: string; to?: string };

/**
 * Header for the routes that sit beside (not under) the tab bar — Compare
 * periods, Definition, and every :id drilldown. Confirmed by reading
 * A05/A16/AC01 directly: each has its own breadcrumb depth and an optional
 * top-right action button, but never the tab bar.
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
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-1.5 font-mono text-[10.5px] text-ink-4">
          {crumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>›</span>}
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-ink-3">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-ink-3">{crumb.label}</span>
              )}
            </span>
          ))}
        </p>
        <h1 className="mt-2 truncate text-[17px] font-semibold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-[11.5px] text-ink-3">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
