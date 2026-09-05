import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { InfoTooltip } from "@/pages/everyday/lifecycle/stage-rail";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount, formatShortDate } from "@/pages/everyday/lifecycle/format-measured-value";
import { AssignAnOwnerModal } from "@/pages/everyday/lifecycle/stage/modals/assign-an-owner-modal";
import { ADVOCATE_ASSIGN_OWNER_PRESET } from "@/pages/everyday/lifecycle/stage/advocate/data";
import { CHURN_ASSIGN_OWNER_PRESET } from "@/pages/everyday/lifecycle/stage/churn/data";
import { useGetStageDefinition } from "@/features/lifecycle/use-get-stage-definition";
import type { StageDefinitionCandidateDto } from "@/services/api/lifecycle/get-stage-definition";

const OWNER_ASSIGN_PRESET = {
  advocate: ADVOCATE_ASSIGN_OWNER_PRESET,
  churn: CHURN_ASSIGN_OWNER_PRESET,
} as const;

function DefinitionSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

/**
 * Screen AC01 and the equivalent per-stage screen (e.g. PR01, AD01) — own header, never shows
 * the tab bar. Reached via the Overview tab's "How this stage is defined" header link.
 *
 * One shared component for all 10 stages, not a per-stage template — GET .../definition returns
 * the identical shape everywhere (candidates/current/history), and every one of the 9 previously
 * bespoke per-stage screens turned out to be a verdict-comparison table this endpoint has no field
 * for at all (a different table shape each time: Adopt's feature-count breakdown, Retain's
 * reachability windows, Price's needs-vs-has checklist, etc.) — same "9 bespoke + endpoint matches
 * none of them" shape already found for Markets and Cohorts.
 */
const DefinitionRoute = () => {
  const { stage } = useStageContext();
  const { data, isLoading, isError, refetch } = useGetStageDefinition(stage.slug);
  const definition = data?.data;
  const [assignOwnerOpen, setAssignOwnerOpen] = useState(false);
  const ownerPreset = OWNER_ASSIGN_PRESET[stage.slug as keyof typeof OWNER_ASSIGN_PRESET];

  const selectedCandidate: StageDefinitionCandidateDto | undefined = definition?.candidates.find(
    (candidate) => candidate.eventKey === definition.current?.entryEventKey
  );

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Lifecycle", to: "/lifecycle" }, { label: stage.name, to: `/lifecycle/${stage.slug}` }, { label: "Definition" }]}
        title={`${definition?.stageName ?? stage.name} definition`}
        subtitle={
          definition?.current
            ? `Version ${definition.current.version} · last changed ${formatShortDate(definition.current.effectiveFromUtc)} by ${definition.current.createdBy}`
            : definition
              ? "Not yet defined for this workspace"
              : undefined
        }
        action={
          ownerPreset ? (
            <Button type="button" size="sm" onClick={() => setAssignOwnerOpen(true)}>
              Assign an owner
            </Button>
          ) : (
            <Button type="button" size="sm">
              Preview the change
            </Button>
          )
        }
      />

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load this stage's definition.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <DefinitionSkeleton />
      ) : (
        <>
          {definition?.fallbackInUse && definition.fallbackNote && (
            <Callout tone="amber" title="No definition set — a fallback rule is standing in">
              {definition.fallbackNote}
            </Callout>
          )}

          {!definition?.isDefined && !definition?.fallbackInUse && (
            <div className="rounded-card border border-dashed border-line bg-paper p-4">
              <p className="text-[12.5px] font-semibold text-ink">No definition set yet</p>
              <p className="mt-1 text-[11px] text-ink-3">
                Choose one of the candidate entry events below, then preview and save it, to give this stage a real definition.
              </p>
            </div>
          )}

          <section className="space-y-3">
            <p className={EYEBROW_CLASS}>Candidate entry events</p>
            {definition && definition.candidates.length === 0 ? (
              <div className="rounded-card border border-dashed border-line bg-paper p-4">
                <p className="text-[12.5px] font-semibold text-ink">No candidates found</p>
                <p className="mt-1 text-[11px] text-ink-3">
                  Flolyt hasn't identified any events on this workspace's connected sources that could define this stage yet.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {(definition?.candidates ?? []).map((candidate) => {
                  const isSelected = candidate.eventKey === selectedCandidate?.eventKey;
                  return (
                    <div
                      key={candidate.eventKey}
                      className={cn(
                        "flex flex-col gap-1 rounded-card border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                        isSelected ? "border-2 border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "mt-0.5 size-3.5 shrink-0 rounded-full border",
                            isSelected ? "border-ultra bg-ultra" : "border-line bg-paper"
                          )}
                          aria-hidden
                        />
                        <div>
                          <p className="text-[12.5px] font-semibold text-ink">{candidate.description ?? candidate.eventKey}</p>
                          {candidate.description && <p className="mt-0.5 font-mono text-[10px] text-ink-4">{candidate.eventKey}</p>}
                        </div>
                      </div>
                      <span className={cn("flex shrink-0 items-center gap-1.5 font-mono text-[10px] sm:pl-6", isSelected ? "text-ultra" : "text-ink-4")}>
                        {candidate.population.value !== null ? (
                          formatCount(candidate.population.value)
                        ) : (
                          <>
                            <span>~{formatCount(candidate.estimatedRows)} rows</span>
                            <InfoTooltip missingSource={candidate.population.missingSource} wouldUnlock={candidate.population.wouldUnlock} />
                          </>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ❌ Backend does NOT provide: the per-stage verdict-comparison table every one of the 9
              bespoke screens had (reach/predictive/verdict columns, or a stage-specific breakdown
              like Adopt's feature-count table or Price's needs-vs-has checklist) — GET
              .../definition only ever returns the candidate list above plus version history, never
              a comparison of how each candidate performs. Same for the narrative insight/"mistake"
              callouts every bespoke screen opened and closed with — pure copy with no backing
              field, dropped rather than shown as if it came from this workspace's own data. */}

          {(definition?.history.length ?? 0) > 1 && (
            <section className="space-y-3">
              <p className={EYEBROW_CLASS}>Version history</p>
              <div className="divide-y divide-line rounded-card border border-line bg-paper">
                {definition!.history.map((entry) => (
                  <div key={entry.version} className="flex items-center justify-between gap-4 px-4 py-2.5">
                    <span className="text-[11.5px] text-ink-2">
                      Version {entry.version} · {formatShortDate(entry.createdAtUtc)} · {entry.createdBy}
                    </span>
                    {entry.isCurrent && <Chip tone="ultra">Current</Chip>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {ownerPreset && <AssignAnOwnerModal preset={ownerPreset} open={assignOwnerOpen} onOpenChange={setAssignOwnerOpen} />}
    </div>
  );
};

export default DefinitionRoute;
