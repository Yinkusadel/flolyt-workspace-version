import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DEPARTMENT_COLORS, EYEBROW_CLASS, type Stage } from "@/pages/everyday/lifecycle/data";

export type StageRailProps = {
  stages: Stage[];
  /** Live advocacy-loop callout body, when GET /lifecycle/map returned a matching one. Omit to hide the banner rather than show stale copy. */
  advocacyNote?: string;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

export function StageRail({ stages, advocacyNote, isLoading, isError, onRetry }: StageRailProps) {
  return (
    <section aria-labelledby="stage-rail-eyebrow">
      <p id="stage-rail-eyebrow" className={EYEBROW_CLASS}>
        Revenue at each stage, and what is leaking out of it
      </p>

      {isError ? (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load the lifecycle map.</p>
          {onRetry && (
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Retry
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-3 flex snap-x gap-1.5 overflow-x-auto pb-2">
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="w-32 shrink-0 snap-start rounded-card border border-line bg-paper-2 p-3">
                  <Skeleton className="size-2 rounded-full" />
                  <Skeleton className="mt-1.5 h-3.5 w-16" />
                  <Skeleton className="mt-1.5 h-2.5 w-20" />
                  <div className="my-2.5 border-t border-dashed border-line" />
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="mt-1 h-2 w-10" />
                </div>
              ))
            : stages.map((stage) => (
                <Link
                  key={stage.slug}
                  to={`/lifecycle/${stage.slug}`}
                  className={cn(
                    "w-32 shrink-0 snap-start rounded-card border border-line p-3 transition-colors hover:border-ink-4",
                    stage.name === "Churn" ? "bg-rose-bg/60" : "bg-paper-2"
                  )}
                >
                  <span
                    className="inline-block size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: stage.department ? DEPARTMENT_COLORS[stage.department] : "var(--color-ink-4)" }}
                    aria-hidden
                  />
                  <p className="mt-1.5 text-[13px] font-semibold text-ink">{stage.name}</p>
                  {/* ❌ Backend does NOT provide: metric */}
                  {/* <p className="mt-0.5 truncate font-mono text-[9.5px] text-ink-4">{stage.metric}</p> */}
                  <div className="my-2.5 border-t border-dashed border-line" />
                  {stage.amount === "Unavailable" ? (
                    <span
                      title={stage.amountCaveat}
                      className="inline-block cursor-help font-mono text-[13px] leading-none text-ink-4 underline decoration-dotted decoration-ink-4/50 underline-offset-4"
                    >
                      —
                    </span>
                  ) : (
                    <p className={cn("text-[15px] font-semibold", stage.amountLabel === "referred" ? "text-teal" : "text-rose")}>
                      {stage.amount}
                    </p>
                  )}
                  {/* ❌ amountLabel caption removed 2026-08-31 — it was hardcoded in data.ts, not
                      backend-derived, and always reads "at stake" now anyway (see the Advocate
                      fix in feedback_no_hardcoded_fallback / flolyt_lifecycle_endpoints memory). */}
                </Link>
              ))}
        </div>
      )}

      {!isError &&
        (isLoading ? (
          <Skeleton className="mt-3 h-11 w-full" />
        ) : (
          advocacyNote && (
            <div className="mt-3 flex items-start gap-2 rounded-panel border border-teal-border bg-teal-bg px-3.5 py-2.5">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-teal" aria-hidden />
              <p className="text-[11px] text-teal">{advocacyNote}</p>
            </div>
          )
        ))}
    </section>
  );
}
