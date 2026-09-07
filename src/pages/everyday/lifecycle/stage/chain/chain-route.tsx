import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { formatCompactMoney, formatCount, formatShortDate } from "@/pages/everyday/lifecycle/format-measured-value";
import { NO_TEAM_COLOR, TEAM_COLORS, effectLine } from "@/pages/everyday/lifecycle/stage/changes/changes-tab";
import { useGetChurnChain } from "@/features/lifecycle/use-get-churn-chain";
import type { ChurnChainStageDto } from "@/services/api/lifecycle/get-churn-chain";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  if (CALLOUT_TONES.has(tone)) return tone as "amber" | "teal" | "rose" | "ultra" | "neutral";
  const normalized = tone.toLowerCase();
  if (normalized.includes("attention")) return "amber";
  if (normalized.includes("insight")) return "teal";
  return "neutral";
}

type StageRow = ChurnChainStageDto & { id: string };

const COLUMNS: Column<StageRow>[] = [
  {
    key: "stage",
    header: "Stage",
    render: (row) => (
      <span className="flex items-center gap-2 whitespace-nowrap font-semibold text-ink-2">
        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: row.owningTeam ? (TEAM_COLORS[row.owningTeam] ?? NO_TEAM_COLOR) : NO_TEAM_COLOR }} aria-hidden />
        {row.stageName}
      </span>
    ),
  },
  {
    key: "symptom",
    header: "What that stage saw",
    render: (row) => <span className="text-ink-2">{row.symptom ?? <span className="text-ink-4">No symptom</span>}</span>,
  },
  {
    key: "effect",
    header: "Effect",
    align: "right",
    render: (row) => {
      const line = effectLine(row.effect);
      const toneClass = { teal: "text-teal", rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" }[line.tone];
      return <span className={toneClass}>{line.text}</span>;
    },
  },
  {
    key: "valueAtStake",
    header: "Value at stake",
    align: "right",
    render: (row) =>
      row.valueAtStake.length > 0 ? (
        <div className="text-right">
          {row.valueAtStake.map((v) => (
            <div key={v.currency} className="font-mono text-ink">
              {formatCompactMoney(v.amount, v.currency)}
            </div>
          ))}
        </div>
      ) : (
        <span className="font-mono text-ink-4">Unavailable</span>
      ),
  },
  {
    key: "calledIt",
    header: "What they called it",
    align: "right",
    render: (row) => <span className="font-mono text-ink-4">“{row.calledIt.words}”</span>,
  },
  {
    key: "owner",
    header: "Owner",
    align: "right",
    render: (row) => (row.owner ? <span className="text-ink-2">{row.owner}</span> : <Chip tone="amber">No owner</Chip>),
  },
  {
    key: "daysToDetect",
    header: "Days to detect",
    align: "right",
    render: (row) => <span className={row.daysToDetect !== null ? "font-mono text-ink-2" : "text-ink-4"}>{row.daysToDetect !== null ? row.daysToDetect : "Not yet"}</span>,
  },
];

function ChainSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * CH13 — "the whole lifecycle, closed", wired to GET /lifecycle/churn/chain. Called with no
 * `changeId` (it's optional) so the backend auto-picks whichever change reached the most stages —
 * the same call the map page's root-cause spotlight banner already makes. This endpoint always
 * returns all 10 stages, including the ones that saw nothing, so unlike the spotlight banner
 * (which filters to only the stages with a real symptom) this table shows every row as-is.
 */
const ChainRoute = () => {
  const { stage } = useStageContext();
  const { data, isLoading, isError, error, refetch } = useGetChurnChain();
  const chain = data?.data;
  const rows: StageRow[] = (chain?.stages ?? []).map((s) => ({ ...s, id: s.stageKey }));

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Lifecycle", to: "/lifecycle" }, { label: stage.name, to: `/lifecycle/${stage.slug}` }, { label: "Where it all went" }]}
        title={chain?.title ?? "Where it all went"}
        subtitle={
          chain
            ? `${formatShortDate(chain.occurredOnUtc)} · ${chain.kind}${chain.team ? ` · ${chain.team}` : ""} · ${formatCount(chain.stagesThatMoved)} of 10 stages moved · ${formatCount(chain.stagesThatNoticed)} noticed · slowest to detect: ${chain.slowestDetectionDays !== null ? `${chain.slowestDetectionDays}d` : "not yet"}`
            : undefined
        }
      />

      {isError ? (
        // A refusal here (nothing has moved ≥2 stages yet) is a genuine backend answer about the
        // current data state, not a broken request — shown verbatim, same treatment as the map
        // page's root-cause spotlight banner gives this exact endpoint's error message.
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-line bg-paper-2 px-4 py-3">
          <p className="text-[12px] text-ink-2">{error?.message || "Couldn't load the chain."}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <ChainSkeleton />
      ) : (
        <section className="space-y-3">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Every stage's own read of the same change</p>
          <DataTable columns={COLUMNS} rows={rows} />
        </section>
      )}

      {/* ❌ Backend does NOT provide: a lifecycle-wide total value — deliberately, since a customer
          can appear in several stages' departures and summing would triple-count them. Each
          stage's value at stake is shown on its own row, never added together. */}

      {chain?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default ChainRoute;
