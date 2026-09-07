import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { formatCompactMoney, formatShortDate, round } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetStageHistory } from "@/features/lifecycle/use-get-stage-history";
import type { StageAttemptDto } from "@/services/api/lifecycle/get-stage-history";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

// validated | observation | constraint | superseded | rejected | room-open — the real 6-value
// vocabulary from GET .../history's spec. The old mock's ~20 freeform "learning kept" labels
// ("suggested twice", "never cross-sold", ...) don't exist on the wire; only these 6 do.
const LEARNING_LABEL: Record<string, string> = {
  validated: "validated",
  observation: "observation",
  constraint: "constraint",
  superseded: "superseded",
  rejected: "rejected",
  "room-open": "room open",
};
const LEARNING_TONE: Record<string, ChipTone> = {
  validated: "teal",
  observation: "neutral",
  constraint: "amber",
  superseded: "neutral",
  rejected: "rose",
  "room-open": "amber",
};

type AttemptRow = StageAttemptDto & { id: string };

function measuredHowText(attempt: StageAttemptDto): string {
  const { howMeasured } = attempt;
  const parts: string[] = [howMeasured.primaryMeasure];
  parts.push(
    howMeasured.holdoutPercent !== null
      ? `${round(howMeasured.holdoutPercent, 1)}% holdout`
      : `no holdout — ${howMeasured.noHoldoutBecause ?? "not stated"}`
  );
  if (howMeasured.liftPoints !== null) parts.push(`${howMeasured.liftPoints >= 0 ? "+" : ""}${round(howMeasured.liftPoints, 1)} pts lift`);
  parts.push(`${howMeasured.measuredOverDays}d`);
  return parts.join(" · ");
}

function resultCell(attempt: StageAttemptDto): { text: string; tone: "teal" | "rose" | "amber" | "neutral" } {
  if (attempt.closedAtUtc === null) return { text: "Still open", tone: "amber" };
  if (attempt.delta !== null) {
    return { text: formatCompactMoney(attempt.delta, attempt.currency), tone: attempt.delta >= 0 ? "teal" : "rose" };
  }
  if (attempt.outcomeNote) return { text: attempt.outcomeNote, tone: "neutral" };
  if (attempt.outcomeKind) return { text: attempt.outcomeKind, tone: "neutral" };
  return { text: "No recorded outcome", tone: "neutral" };
}

const RESULT_TONE_CLASS: Record<"teal" | "rose" | "amber" | "neutral", string> = {
  teal: "text-teal",
  rose: "text-rose",
  amber: "text-amber",
  neutral: "text-ink-4",
};

const COLUMNS: Column<AttemptRow>[] = [
  { key: "what", header: "What", render: (row) => <span className="font-semibold text-ink-2">{row.title}</span> },
  {
    key: "when",
    header: "When",
    align: "right",
    render: (row) => (
      <span className="font-mono text-[10.5px] text-ink-4">
        {row.closedAtUtc ? `closed ${formatShortDate(row.closedAtUtc)}` : `opened ${formatShortDate(row.openedAtUtc)}`}
      </span>
    ),
  },
  {
    key: "result",
    header: "Result",
    align: "right",
    render: (row) => {
      const result = resultCell(row);
      return <span className={RESULT_TONE_CLASS[result.tone]}>{result.text}</span>;
    },
  },
  { key: "measuredHow", header: "Measured how", align: "right", render: (row) => <span className="font-mono text-ink-4">{measuredHowText(row)}</span> },
  {
    key: "learningState",
    header: "Learning kept",
    align: "right",
    render: (row) => <Chip tone={LEARNING_TONE[row.learningState] ?? "neutral"}>{LEARNING_LABEL[row.learningState] ?? row.learningState}</Chip>,
  },
];

function HistorySkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-16 rounded-chip" />
        </div>
      ))}
    </div>
  );
}

/** The shared History tab template (e.g. A14) — everything already tried on this stage. */
export function HistoryTab() {
  const { stage } = useStageContext();
  const { data, isLoading, isError, refetch } = useGetStageHistory(stage.slug);
  const history = data?.data;
  const rows: AttemptRow[] = (history?.attempts ?? []).map((attempt) => ({ ...attempt, id: attempt.roomId }));

  return (
    <div className="space-y-8">
      {/* ❌ Backend does NOT provide: "Goals that depend on this stage" — GET .../history's
          `goalDependencies` is permanently null ("nothing models goals yet" per the spec's own
          text), not a wiring gap that will resolve later. Dropped entirely rather than shown
          against a fabricated row. */}

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">What has already been tried here</p>

        {isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">Couldn't load this stage's history.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <HistorySkeleton />
        ) : (
          <DataTable
            columns={COLUMNS}
            rows={rows}
            emptyTitle="Nothing tried here yet"
            emptyBody="Rooms opened on this stage, and what came of them, will appear here once one has been opened."
          />
        )}
      </section>

      {history?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
}
