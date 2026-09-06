import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { ModelAnUpgradeModal } from "@/pages/everyday/lifecycle/stage/modals/model-an-upgrade-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { EXPAND_MODEL_UPGRADE_PRESET } from "@/pages/everyday/lifecycle/stage/expand/data";
import { useGetExpandUpgradePaths } from "@/features/lifecycle/use-get-expand-upgrade-paths";
import type { UpgradePathMoveDto } from "@/services/api/lifecycle/get-expand-upgrade-paths";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type MoveRow = UpgradePathMoveDto & { id: string };

const COLUMNS: Column<MoveRow>[] = [
  { key: "fromPlan", header: "From plan", render: (row) => <span className="font-semibold text-ink-2">{row.fromPlan}</span> },
  { key: "toPlan", header: "To plan", render: (row) => <span className="font-semibold text-ink-2">{row.toPlan}</span> },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{formatCount(row.customers)}</span> },
  {
    key: "share",
    header: "Share of movers",
    align: "right",
    render: (row) => <span className="text-ink-2">{row.share !== null ? formatPercent(row.share) : <span className="text-ink-4">No share reported</span>}</span>,
  },
];

function PathsSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/** EX03 — Expand's own Upgrade paths tab, wired to GET /lifecycle/expand/upgrade-paths. */
const ExpandUpgradePathsTab = () => {
  const { headerActionsEl } = useStageContext();
  const [modelOpen, setModelOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useGetExpandUpgradePaths();
  const paths = data?.data;
  const rows: MoveRow[] = (paths?.moves ?? []).map((move, index) => ({ ...move, id: `${move.fromPlan}-${move.toPlan}-${index}` }));

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setModelOpen(true)}>
            Model an upgrade offer
          </Button>,
          headerActionsEl
        )}

      <p className={EYEBROW_CLASS}>
        {paths ? `${paths.movers !== null ? formatCount(paths.movers) : "?"} customers moved plans over ${paths.windowDays} days` : "Who moved between plans, and which way, over a year"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Expand's upgrade paths.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <PathsSkeleton />
      ) : (
        <DataTable columns={COLUMNS} rows={rows} emptyTitle="No plan moves measured yet" emptyBody="Customers moving between plans will appear here once at least one move exists." />
      )}

      {/* ❌ Backend does NOT provide: an eligible/upgraded/rate/value-per-upgrade breakdown, a
          "prompted?" flag, a verdict, or a per-path drilldown — this endpoint only counts plan-to-
          plan moves. It also can't distinguish an upgrade from a downgrade without plan pricing on
          every plan (its own callout says so) — no up/down arrow is added client-side. Dropped
          rather than fabricated. */}

      {paths?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      <ModelAnUpgradeModal preset={EXPAND_MODEL_UPGRADE_PRESET} open={modelOpen} onOpenChange={setModelOpen} />
    </div>
  );
};

export default ExpandUpgradePathsTab;
