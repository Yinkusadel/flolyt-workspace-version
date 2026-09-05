import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoTooltip } from "@/pages/everyday/lifecycle/stage-rail";

export type KpiTone = "ink" | "teal" | "amber" | "rose";

export type Kpi = {
  eyebrow: string;
  value?: string;
  tone?: KpiTone;
  note?: string;
  /** When set, the whole card links out (e.g. Support's "Revenue behind silent failures" card opening its own drilldown). */
  href?: string;
  /** When set, the card shows an info icon in place of `value` — the measured-value-unavailable state (see stage-rail's InfoTooltip). */
  unavailable?: { missingSource?: string; wouldUnlock?: string };
};

const VALUE_TONE_CLASSES: Record<KpiTone, string> = {
  ink: "text-ink-2",
  teal: "text-teal",
  amber: "text-amber",
  rose: "text-rose",
};

const CARD_CLASS = "rounded-card border border-line bg-paper p-4";

function KpiCardBody({ item }: { item: Kpi }) {
  return (
    <>
      <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{item.eyebrow}</p>
      <div className="mt-2.5">
        {item.unavailable ? (
          <InfoTooltip missingSource={item.unavailable.missingSource} wouldUnlock={item.unavailable.wouldUnlock} />
        ) : (
          <p className={cn("text-[19px] font-semibold", VALUE_TONE_CLASSES[item.tone ?? "ink"])}>{item.value}</p>
        )}
      </div>
      {item.note && <p className="mt-1 text-[10px] text-ink-4">{item.note}</p>}
    </>
  );
}

/** The four-card metric row every stage tab opens with (ACQUIRED/AT STAKE/CAC-style cards). */
export function KpiCards({
  items,
  isLoading,
  isError,
  onRetry,
}: {
  items: Kpi[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}) {
  if (isError) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
        <p className="text-[12px] text-rose">Couldn't load this stage's numbers.</p>
        {onRetry && (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={CARD_CLASS}>
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="mt-2.5 h-4.5 w-16" />
            <Skeleton className="mt-1.5 h-2.5 w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) =>
        item.href ? (
          <Link key={item.eyebrow} to={item.href} className={cn(CARD_CLASS, "block transition-colors hover:border-ink-4")}>
            <KpiCardBody item={item} />
          </Link>
        ) : (
          <div key={item.eyebrow} className={CARD_CLASS}>
            <KpiCardBody item={item} />
          </div>
        )
      )}
    </div>
  );
}
