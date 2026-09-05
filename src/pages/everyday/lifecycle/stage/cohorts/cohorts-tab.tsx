import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { InfoTooltip } from "@/pages/everyday/lifecycle/stage-rail";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { formatCompactMoney, formatCount, formatMonthYear, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetStageCohorts } from "@/features/lifecycle/use-get-stage-cohorts";
import type { StageCohortRowDto } from "@/services/api/lifecycle/get-stage-cohorts";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type CohortRow = StageCohortRowDto & { id: string };

function buildColumns(measurementAgeDays: number[]): Column<CohortRow>[] {
  return [
    { key: "cohort", header: "Cohort", render: (row) => <span className="font-semibold text-ink-2">{formatMonthYear(row.periodStartUtc)}</span> },
    {
      key: "entered",
      header: "Entered",
      align: "right",
      render: (row) =>
        row.entered.value !== null ? (
          <span className="font-mono text-ink">{formatCount(row.entered.value)}</span>
        ) : (
          <InfoTooltip missingSource={row.entered.missingSource} wouldUnlock={row.entered.wouldUnlock} />
        ),
    },
    ...measurementAgeDays.map(
      (ageDays): Column<CohortRow> => ({
        key: `age-${ageDays}`,
        header: `${ageDays} day`,
        align: "right",
        render: (row) => {
          const age = row.ages.find((a) => a.ageDays === ageDays);
          if (!age || age.stillInStageShare.value === null) {
            return <InfoTooltip missingSource={age?.stillInStageShare.missingSource} wouldUnlock={age?.stillInStageShare.wouldUnlock} />;
          }
          return <span className="font-mono text-ink">{formatPercent(age.stillInStageShare.value)}</span>;
        },
      })
    ),
    {
      key: "value",
      header: "Value to date",
      align: "right",
      render: (row) =>
        row.values.value !== null ? (
          <div className="space-y-0.5">
            {row.values.value.map((v) => (
              <div key={v.currency} className="font-mono text-ink">
                {formatCompactMoney(v.amount, v.currency)}
                {v.perCustomer !== null && <span className="text-ink-4"> · {formatCompactMoney(v.perCustomer, v.currency)}/customer</span>}
              </div>
            ))}
          </div>
        ) : (
          <InfoTooltip missingSource={row.values.missingSource} wouldUnlock={row.values.wouldUnlock} />
        ),
    },
  ];
}

function CohortsSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

/** The shared Cohorts tab template (e.g. A06) — entry cohorts, age-aligned, measured at the stage's own standard ages. */
export function CohortsTab() {
  const { stage } = useStageContext();
  const { data, isLoading, isError, refetch } = useGetStageCohorts(stage.slug);
  const cohortsData = data?.data;
  const cohorts = cohortsData?.cohorts;
  const rows: CohortRow[] = (cohorts?.value ?? []).map((row) => ({ ...row, id: row.periodStartUtc }));

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Every arrival cohort, measured at the same ages
        </p>

        {isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">Couldn't load this stage's cohorts.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <CohortsSkeleton />
        ) : cohorts && cohorts.value === null ? (
          <Callout tone="amber" title="This stage has no cohort matrix yet">
            {cohorts.missingSource ? `Missing: ${cohorts.missingSource}.` : "Nothing here yet."}
            {cohorts.wouldUnlock ? ` Would unlock: ${cohorts.wouldUnlock}.` : ""}
          </Callout>
        ) : (
          <DataTable
            columns={buildColumns(cohortsData?.measurementAgeDays ?? [])}
            rows={rows}
            emptyTitle="No cohorts measured yet"
            emptyBody="Monthly arrival cohorts will appear here once this stage has been counted."
          />
        )}
      </section>

      {cohortsData && cohortsData.undatedCustomers !== null && cohortsData.undatedCustomers > 0 && (
        <p className="text-[10.5px] text-ink-4">
          {formatCount(cohortsData.undatedCustomers)} customers excluded from this matrix — their entry was never dated.
        </p>
      )}

      {cohortsData?.valueCaveat && (
        <Callout tone="neutral" title="How the value figures are built">
          {cohortsData.valueCaveat}
        </Callout>
      )}

      {cohortsData?.caveat && (
        <Callout tone="amber" title="A caveat on this cohort matrix">
          {cohortsData.caveat}
        </Callout>
      )}

      {cohortsData?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
}
