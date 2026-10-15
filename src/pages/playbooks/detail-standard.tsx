import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/chip";
import { PersonAvatar } from "@/components/person-avatar";
import { AUTONOMY_LABEL, AUTONOMY_TONE, type Playbook } from "@/pages/playbooks/data";

function Card({ title, tone = "paper", children }: { title: string; tone?: "paper" | "amber"; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-card border p-5",
        tone === "amber" ? "border-amber-border bg-amber-bg" : "border-line bg-paper"
      )}
    >
      <p className={cn("text-[15px] font-semibold", tone === "amber" ? "text-amber" : "text-ink")}>{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function RunHistoryTable({ playbook }: { playbook: Playbook }) {
  const runs = playbook.runHistory ?? [];
  if (runs.length === 0) return null;

  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[15px] font-semibold text-ink">What happened when it ran</p>
        {playbook.runsSignificantOf != null && (
          <p className="text-[12.5px] font-medium text-teal">
            {playbook.runsSignificantOf} of {playbook.runs} significant
          </p>
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-card border border-line">
        <div className="hidden grid-cols-[48px_84px_1fr_1.4fr_1fr] gap-4 border-b border-line bg-paper-2 px-4 py-2.5 sm:grid">
          <span className="font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Run</span>
          <span className="font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">When</span>
          <span className="text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">
            Cohort
          </span>
          <span className="text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">
            Result
          </span>
          <span className="text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">
            Released by
          </span>
        </div>
        {runs.map((run) => (
          <div
            key={run.runNumber}
            className="grid grid-cols-2 items-center gap-3 border-b border-line px-4 py-3 last:border-0 sm:grid-cols-[48px_84px_1fr_1.4fr_1fr] sm:gap-4"
          >
            <Link to={`/playbooks/${playbook.id}/runs/${run.runNumber}`} className="text-[13px] font-medium text-ultra hover:underline">
              {run.runNumber}
            </Link>
            <p className="text-[13px] text-ink-2">{run.when}</p>
            <p className="text-[13px] text-ink-2 sm:text-right">{run.cohort.toLocaleString()}</p>
            <div className="sm:text-right">
              {run.result === "significant" ? (
                <>
                  <p className="text-[13px] font-semibold text-teal">{run.preserved}</p>
                  <Chip tone="teal" className="mt-1">
                    Significant
                  </Chip>
                </>
              ) : (
                <>
                  <p className="text-[13px] text-ink-4">—</p>
                  <Chip tone="neutral" className="mt-1">
                    Not significant
                  </Chip>
                </>
              )}
            </div>
            <p className="text-[13px] text-ink-2 sm:text-right">{run.releasedBy.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlaybookStandard({ playbook }: { playbook: Playbook }) {
  usePageBreadcrumb([{ label: "Playbooks", to: "/playbooks" }, { label: playbook.name }]);

  const subtitleParts = [
    playbook.version ? `Version ${playbook.version}` : null,
    playbook.promotedFromRoom ? `promoted from ${playbook.promotedFromRoom} on ${playbook.promotedDate}` : null,
    `run ${playbook.runs} time${playbook.runs === 1 ? "" : "s"}`,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold text-ink">{playbook.name}</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">{subtitleParts.join(" · ")}</p>
          {playbook.ownerNote && (
            <div className="mt-2 flex items-center gap-2 text-[12.5px] text-ink-3">
              <PersonAvatar kind="agent" initials={playbook.owner.initials} size="sm" />
              {playbook.ownerNote}
            </div>
          )}
        </div>
        <Chip tone={AUTONOMY_TONE[playbook.status]} className="shrink-0">
          {AUTONOMY_LABEL[playbook.status]}
        </Chip>
      </div>

      {(playbook.whenItRunsBody || playbook.whoReleasesBody) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
          {playbook.whenItRunsBody && (
            <Card title="When it runs">
              <p className="text-[13px] leading-relaxed text-ink-2">{playbook.whenItRunsBody}</p>
              {playbook.whenItRunsCondition && (
                <div className="mt-3 rounded-control border border-line bg-paper-2 p-3">
                  {playbook.whenItRunsCondition.map((line) => (
                    <p key={line} className="font-mono text-[11px] text-ink-2">
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </Card>
          )}

          {playbook.whoReleasesBody && (
            <Card title="Who releases it" tone="amber">
              {playbook.whoReleasesBody.map((line) => (
                <p key={line} className="text-[13px] leading-relaxed text-amber">
                  {line}
                </p>
              ))}
              {playbook.automaticAfter && <p className="mt-3 text-[11.5px] text-amber/80">{playbook.automaticAfter}</p>}
            </Card>
          )}
        </div>
      )}

      {(playbook.steps || playbook.parameters) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
          {playbook.steps && (
            <Card title="What it does">
              <div className="space-y-3">
                {playbook.steps.map((step, i) => (
                  <div key={step.title} className="flex items-start gap-3">
                    <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-paper-2 text-[10px] font-semibold text-ink-3">
                      {i + 1}
                    </span>
                    <p className="text-[13px] text-ink">
                      <span className="font-medium">{step.title}</span>
                      <span className="text-ink-3"> — {step.detail}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {playbook.parameters && (
            <Card title="Parameters">
              <div className="divide-y divide-line">
                {playbook.parameters.map((param) => (
                  <div key={param.label} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <p className="text-[13px] text-ink-3">{param.label}</p>
                    <p className="text-[13px] font-medium text-ink">{param.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      <RunHistoryTable playbook={playbook} />

      {playbook.cameFromBody && (
        <Card title="Where it came from">
          <p className="text-[13px] leading-relaxed text-ink-2">{playbook.cameFromBody}</p>
          {playbook.citedRooms && (
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {playbook.citedRooms.map((room) => (
                <span key={room.label} className="text-[12px] text-ultra">
                  {room.label}
                </span>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
