import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DEPARTMENT_COLORS, EYEBROW_CLASS, type RootCauseRow } from "@/pages/everyday/lifecycle/data";

export type RootCauseCallout = { headline: string; body: string };

export type RootCauseSpotlightProps = {
  /** GET /lifecycle/churn/chain's `title` — the auto-picked change's headline, e.g. "The 4 March delivery fee change." */
  title: string;
  rows: RootCauseRow[];
  /** GET /lifecycle/churn/chain's `stagesThatMoved`. */
  stagesThatMoved: number;
  /** GET /lifecycle/churn/chain's `callouts[]`. */
  callouts: RootCauseCallout[];
  isLoading?: boolean;
  isError?: boolean;
  /**
   * The query's real error message — e.g. GET /lifecycle/churn/chain's own refusal text when
   * nothing on the registry has moved more than one stage yet. Shown as-is: that's a genuine
   * backend answer about the current data state, not a broken request, so it isn't replaced with
   * a generic "couldn't load" string that would misread as a technical failure.
   */
  errorMessage?: string;
  onRetry?: () => void;
};

export function RootCauseSpotlight({
  title,
  rows,
  stagesThatMoved,
  callouts,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: RootCauseSpotlightProps) {
  if (isError) {
    return (
      <section aria-labelledby="root-cause-eyebrow">
        <p id="root-cause-eyebrow" className={EYEBROW_CLASS}>
          Where the same root cause shows up
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-card border border-line bg-paper-2 px-4 py-3">
          <p className="text-[12px] text-ink-2">{errorMessage || "Couldn't load the root-cause spotlight."}</p>
          {onRetry && (
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Retry
            </Button>
          )}
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section aria-labelledby="root-cause-eyebrow">
        <p id="root-cause-eyebrow" className={EYEBROW_CLASS}>
          Where the same root cause shows up
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-paper">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-2 shrink-0 rounded-full" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-2.5 flex-1" />
              </div>
            ))}
          </div>
          <Skeleton className="h-32 rounded-card" />
        </div>
      </section>
    );
  }

  // No change reached ≥2 stages right now (GET /lifecycle/churn/chain refuses in that case) —
  // there's nothing to spotlight, so the whole section stays off rather than showing an empty
  // table with fabricated copy.
  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="root-cause-eyebrow">
      <p id="root-cause-eyebrow" className={EYEBROW_CLASS}>
        Where the same root cause shows up · {title}
      </p>

      <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-paper">
          {rows.map((row) => (
            <div key={row.stage} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: row.department ? DEPARTMENT_COLORS[row.department] : "var(--color-ink-4)" }}
                aria-hidden
              />
              <span className="w-20 shrink-0 text-[12px] font-semibold text-ink">{row.stage}</span>
              <span
                className="w-36 shrink-0 font-mono text-[10.5px]"
                style={{ color: row.department ? DEPARTMENT_COLORS[row.department] : "var(--color-ink-4)" }}
              >
                {row.department ?? "Unavailable"}
              </span>
              <span className="text-[12px] text-ink-2">{row.detail}</span>
            </div>
          ))}
        </div>

        <div className="rounded-card border border-amber-border bg-amber-bg p-5">
          <h3 className="text-[13.5px] font-semibold text-ink">
            One change. {stagesThatMoved} {stagesThatMoved === 1 ? "team" : "teams"}.
          </h3>
          {callouts.map((callout) => (
            <p key={callout.headline} className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
              {callout.body}
            </p>
          ))}
          <Link to="/lifecycle/churn/chain" className="mt-3 inline-block text-[11px] font-semibold text-amber hover:underline">
            See the whole chain →
          </Link>
        </div>
      </div>
    </section>
  );
}
