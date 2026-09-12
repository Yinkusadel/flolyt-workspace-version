import { Link, Navigate, useParams } from "react-router-dom";

import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { Chip } from "@/components/ui/chip";
import { KpiCards, type Kpi } from "@/components/ui/kpi-cards";
import { getPlaybookRun } from "@/pages/playbooks/data";

/** PB03 — /playbooks/:id/runs/:runId. One run's own record: what happened in order, how it was
 * measured against the holdout, and who was left out and why. Only the win-back playbook's run 9
 * carries the full narrative (see data.ts) — the export drew one run in this much detail, not
 * every run of every playbook. */
export default function PlaybookRunRoute() {
  const { id, runId } = useParams();
  const match = getPlaybookRun(id, runId);

  usePageBreadcrumb(
    match
      ? [
          { label: "Playbooks", to: "/playbooks" },
          { label: match.playbook.name, to: `/playbooks/${match.playbook.id}` },
          { label: `Run ${match.run.runNumber}` },
        ]
      : [{ label: "Playbooks", to: "/playbooks" }]
  );

  if (!match) return <Navigate to={`/playbooks/${id ?? ""}`} replace />;
  const { run } = match;
  const detail = run.detail;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold text-ink">Run {run.runNumber}</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            {match.playbook.name} · {run.when}
            {detail ? ` · triggered by ${detail.triggeredBy.name}` : ""} · released by {run.releasedBy.name}
          </p>
        </div>
        <Chip tone={run.result === "significant" ? "teal" : "neutral"} className="shrink-0">
          {run.result === "significant" ? "Significant" : "Not significant"}
        </Chip>
      </div>

      <KpiCards
        items={
          [
            { eyebrow: "Cohort", value: run.cohort.toLocaleString(), tone: "ink", note: detail ? `${detail.heldBack} held back` : undefined },
            { eyebrow: "Preserved", value: run.preserved ?? "—", tone: run.preserved ? "teal" : "ink", note: "vs the holdout" },
            detail
              ? { eyebrow: "Lift", value: detail.liftLabel, tone: "teal", note: detail.liftNote }
              : { eyebrow: "Result", value: run.result === "significant" ? "Significant" : "Not significant", tone: "ink" },
            detail
              ? { eyebrow: "Excluded", value: String(detail.excludedTotal), tone: "amber", note: detail.excludedNote }
              : { eyebrow: "Released by", value: run.releasedBy.name, tone: "ink" },
          ] as Kpi[]
        }
      />

      {detail && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-card border border-line bg-paper p-5">
            <p className="text-[16px] font-semibold text-ink">What happened, in order</p>
            <div className="mt-4">
              {detail.timeline.map((step, i) => (
                <div key={`${step.time}-${step.title}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="mt-1.5 size-2.25 shrink-0 rounded-full bg-teal" />
                    {i < detail.timeline.length - 1 && <span className="w-px flex-1 bg-line" />}
                  </div>
                  <div className="min-w-0 pb-5 last:pb-0">
                    <p className="text-[12px] text-ink-4">{step.time}</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-ink">{step.title}</p>
                    <p className="mt-0.5 text-[12px] text-ink-3">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-card border border-line bg-paper p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[15px] font-semibold text-ink">How it was measured</p>
                <Chip tone="teal">Measured</Chip>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-ink-2">{detail.measuredBody}</p>
              <p className="mt-3 text-[11px] text-ink-4">{detail.measuredStats}</p>
            </div>

            <div className="rounded-card border border-amber-border bg-amber-bg p-5">
              <p className="text-[15px] font-semibold text-amber">Who was left out, and why</p>
              <div className="mt-3 space-y-2">
                {detail.excludedBreakdown.map((row) => (
                  <p key={row.reason} className="text-[12px] text-amber">
                    <span className="font-semibold">{row.count}</span> <span className="text-amber/90">{row.reason}</span>
                  </p>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-amber/80">Exclusions are counted, never quietly dropped.</p>
            </div>
          </div>
        </div>
      )}

      {detail && (
        <div className="rounded-card border border-line bg-paper p-5">
          <p className="text-[16px] font-semibold text-ink">What this run added to memory</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{detail.addedToMemoryBody}</p>
          <Link to="/business-memory" className="mt-3 inline-block text-[12px] font-medium text-ultra hover:underline">
            Filed to Business Memory →
          </Link>
        </div>
      )}
    </div>
  );
}
