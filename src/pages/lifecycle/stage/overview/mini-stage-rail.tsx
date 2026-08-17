import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { DEPARTMENT_COLORS, EYEBROW_CLASS, type Stage } from "@/pages/lifecycle/data";

/**
 * AC02's compact stage-by-stage rail on the Overview tab — smaller and
 * without the advocacy-loop note that the lifecycle map's own StageRail
 * (stage-rail.tsx) has. Confirmed present on Activate's Overview and absent
 * from Acquire's (A02) — not assumed shared until seen on more stages.
 */
export function OverviewStageRail({ stages, activeSlug }: { stages: Stage[]; activeSlug: string }) {
  return (
    <section aria-labelledby="overview-stage-rail-eyebrow">
      <p id="overview-stage-rail-eyebrow" className={EYEBROW_CLASS}>
        This stage against the one before it
      </p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {stages.map((stage) => {
          const isActive = stage.slug === activeSlug;
          return (
            <Link
              key={stage.slug}
              to={`/lifecycle/${stage.slug}`}
              className={cn(
                "w-24 shrink-0 rounded-card border p-3 transition-colors",
                isActive ? "border-ultra-border border-2 bg-paper" : "border-line bg-paper-2 hover:border-ink-4"
              )}
            >
              <span
                className="inline-block size-2 shrink-0 rounded-full"
                style={{ backgroundColor: stage.department ? DEPARTMENT_COLORS[stage.department] : "var(--color-ink-4)" }}
                aria-hidden
              />
              <p className={cn("mt-1.5 text-[12px] font-semibold", isActive ? "text-ink" : "text-ink-2")}>{stage.name}</p>
              <p className="mt-0.5 truncate font-mono text-[8.5px] text-ink-4">{stage.metric}</p>
              <div className="my-2.5 border-t border-dashed border-line" />
              <p className={cn("text-[13px] font-semibold", stage.amountLabel === "referred" ? "text-teal" : "text-rose")}>
                {stage.amount}
              </p>
              <p className="font-mono text-[8px] text-ink-4">{stage.amountLabel}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
