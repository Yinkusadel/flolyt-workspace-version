import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { PRICE_DEFINITION } from "@/pages/everyday/lifecycle/stage/price/data";

const NEEDS_TONE_CLASS: Record<"teal" | "amber" | "rose", string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };

/**
 * PR01 — Price's Definition screen. Not the shared DefinitionRoute template:
 * where Activate's AC01 follows the insight → candidates → verdict-table →
 * mistake-banner shape, Price's PR01 replaces the verdict table with a
 * checklist of what the stage needs vs. has, confirmed by reading PR01
 * directly rather than assuming AC01's shape carries over.
 */
const PriceDefinitionRoute = () => {
  const data = PRICE_DEFINITION;

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Lifecycle", to: "/lifecycle" }, { label: "Price", to: "/lifecycle/price" }, { label: "Definition" }]}
        title={data.title}
        subtitle={data.subtitle}
        action={
          <Button type="button" size="sm">
            Preview the change
          </Button>
        }
      />

      <Callout tone="ultra" title={data.insightTitle}>
        {data.insightBody}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>{data.candidatesEyebrow}</p>
        <div className="space-y-2.5">
          {data.candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={cn(
                "flex flex-col gap-1 rounded-card border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                candidate.selected ? "border-2 border-ultra-border bg-ultra-bg" : "border-line bg-paper"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 size-3.5 shrink-0 rounded-full border",
                    candidate.selected ? "border-ultra bg-ultra" : "border-line bg-paper"
                  )}
                  aria-hidden
                />
                <div>
                  <p className="text-[12.5px] font-semibold text-ink">{candidate.label}</p>
                  <p className="mt-0.5 text-[10px] text-ink-4">{candidate.description}</p>
                </div>
              </div>
              <span className={cn("shrink-0 font-mono text-[10px] sm:pl-6", candidate.selected ? "text-ultra" : "text-ink-4")}>
                {candidate.field}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-1">
        <p className={cn(EYEBROW_CLASS, "pb-2")}>{data.needsEyebrow}</p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {data.needsRows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11.5px] text-ink-2">{row.label}</span>
              <span className={cn("font-mono text-[11px]", NEEDS_TONE_CLASS[row.tone])}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <Callout tone="rose" title={data.closingTitle}>
        {data.closingBody}
      </Callout>
    </div>
  );
};

export default PriceDefinitionRoute;
