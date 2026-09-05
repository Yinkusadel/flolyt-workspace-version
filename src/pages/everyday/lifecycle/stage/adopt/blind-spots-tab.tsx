import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { RequestInstrumentationModal } from "@/pages/everyday/lifecycle/stage/modals/request-instrumentation-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatShortDate } from "@/pages/everyday/lifecycle/format-measured-value";
import { ADOPT_REQUEST_INSTRUMENTATION_PRESET } from "@/pages/everyday/lifecycle/stage/adopt/data";
import { useGetInstrumentation } from "@/features/lifecycle/use-get-instrumentation";
import type { InstrumentationGapDto } from "@/services/api/lifecycle/get-instrumentation";

// `state`'s only documented value is "no-request" — everything else is an unconfirmed
// request-lifecycle state, matched defensively by keyword.
function stateTone(state: string): ChipTone {
  if (state === "no-request") return "neutral";
  const normalized = state.toLowerCase();
  if (normalized.includes("close") || normalized.includes("delivered") || normalized.includes("resolved")) return "teal";
  if (normalized.includes("withdraw") || normalized.includes("reject")) return "rose";
  return "amber";
}

const STATE_LABEL: Record<string, string> = { "no-request": "Not requested" };

type GapRow = InstrumentationGapDto & { id: string };

const COLUMNS: Column<GapRow>[] = [
  {
    key: "what",
    header: "What",
    render: (row) => (
      <div>
        <p className="font-semibold text-ink-2">{row.name}</p>
        <p className="mt-0.5 text-[10px] text-ink-4">{row.gap}</p>
      </div>
    ),
  },
  {
    key: "wouldUnlock",
    header: "Would unlock",
    render: (row) => <span className="text-ink-2">{row.wouldUnlock ?? <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "owner",
    header: "Who could fix it",
    align: "right",
    render: (row) => (row.ownerName ? <span className="text-ink-2">{row.ownerName}</span> : <Chip tone="amber">No owner</Chip>),
  },
  {
    key: "overdue",
    header: "Overdue",
    align: "right",
    render: (row) =>
      row.daysOverdue !== null && row.daysOverdue > 0 ? (
        <span className="font-mono text-rose">{row.daysOverdue}d overdue</span>
      ) : row.neededByUtc ? (
        <span className="font-mono text-ink-4">needed by {formatShortDate(row.neededByUtc)}</span>
      ) : (
        <span className="text-ink-4">—</span>
      ),
  },
  {
    key: "state",
    header: "State",
    align: "right",
    render: (row) => <Chip tone={stateTone(row.state)}>{STATE_LABEL[row.state] ?? row.state}</Chip>,
  },
];

function BlindSpotsSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-16 rounded-chip" />
        </div>
      ))}
    </div>
  );
}

/**
 * AD06 — Adopt's "Not instrumented" tab, wired to GET /lifecycle/instrumentation — a workspace-
 * wide endpoint (every gap names which of the 10 stages it blocks via `blockedStages`), filtered
 * here to gaps that block this stage specifically.
 */
const AdoptBlindSpotsTab = () => {
  const { stage, headerActionsEl } = useStageContext();
  const [requestOpen, setRequestOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useGetInstrumentation();
  const instrumentation = data?.data;
  // `blockedStages` carries each stage's display name ("Advocate"), confirmed 2026-09-05 live —
  // not its slug. Comparing against `stage.slug` (always lowercase) never matched anything, for
  // any stage; matched case-insensitively against `stage.name` here instead.
  const gaps = (instrumentation?.gaps ?? []).filter((gap) => gap.blockedStages.some((blocked) => blocked.toLowerCase() === stage.name.toLowerCase()));
  const rows: GapRow[] = gaps.map((gap) => ({ ...gap, id: gap.gapKey }));

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setRequestOpen(true)}>
            Request instrumentation
          </Button>,
          headerActionsEl
        )}

      <Callout tone="amber" title="What Flolyt cannot see, listed rather than left out">
        Every row below is a real part of the product with no event behind it. None of them appear as zero anywhere
        in Flolyt — a feature nobody can measure is not a feature nobody uses, and the difference matters more here
        than in any other stage.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Blind spots in this stage · {isLoading ? "…" : rows.length}</p>

        {isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">Couldn't load instrumentation gaps.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <BlindSpotsSkeleton />
        ) : (
          <DataTable columns={COLUMNS} rows={rows} emptyTitle="No blind spots on this stage" emptyBody="Every gap Flolyt knows about for this stage has been instrumented." />
        )}
      </section>

      {/* ❌ Backend does NOT provide: the "what each blind spot costs" narrative cards — no field
          on this endpoint estimates a cost or value figure per gap beyond `wouldUnlock`'s own
          sentence, which is shown in the table above; dropped rather than fabricated. The "Request
          instrumentation" button still opens the existing static preset dialog, not a real
          POST /instrumentation-requests call — that mutation (and PUT .../owner, POST .../close)
          stays unwired, same treatment as every other "open a form" CTA in this project so far.
          `instrumentation.callouts[]` is also NOT shown here — confirmed live 2026-09-05 that it's
          composed over the whole, unfiltered `gaps[]` list ("2 gaps nobody has asked about" when
          neither gap blocked this stage), not scoped to what this stage's own table just filtered
          to. Showing a workspace-wide count under a "blind spots in this stage" heading read as
          the same number disagreeing with itself; there's no way to re-scope pre-composed callout
          text to one stage without fabricating it, so it's dropped on this view specifically. */}

      <RequestInstrumentationModal preset={ADOPT_REQUEST_INSTRUMENTATION_PRESET} open={requestOpen} onOpenChange={setRequestOpen} />
    </div>
  );
};

export default AdoptBlindSpotsTab;
